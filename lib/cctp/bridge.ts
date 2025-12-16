/**
 * Circle CCTP Bridge Service
 * 
 * Implements the 4-step CCTP transfer flow:
 * 1. Approve USDC
 * 2. Burn USDC on source chain
 * 3. Fetch attestation from Circle API
 * 4. Mint USDC on destination chain
 */

import { parseUnits, type WalletClient, type PublicClient, type Hash } from 'viem';
import { getCCTPConfig, ATTESTATION_API_URL } from './config';
import { TOKEN_MESSENGER_ABI, MESSAGE_TRANSMITTER_ABI } from './abis';
import { ERC20_ABI } from '../contracts';
import type { BridgeParams, BridgeProgress, BridgeResult } from './types';
import { logger } from '../logger';

/**
 * Execute CCTP bridge transfer (Steps 1-3: Approve, Burn, Get Attestation)
 * User must switch chains manually to complete step 4 (Mint)
 */
export async function executeCCTPBridge({
    walletClient,
    publicClient,
    fromChainId,
    toChainId,
    amount,
    recipientAddress,
    onProgress,
}: {
    walletClient: WalletClient;
    publicClient: PublicClient;
    fromChainId: number;
    toChainId: number;
    amount: string;
    recipientAddress: `0x${string}`;
    onProgress?: (progress: BridgeProgress) => void;
}): Promise<BridgeResult> {
    // Validate chains
    const fromConfig = getCCTPConfig(fromChainId);
    const toConfig = getCCTPConfig(toChainId);

    if (!fromConfig) {
        throw new Error(`CCTP not supported on source chain ${fromChainId}`);
    }

    if (!toConfig) {
        throw new Error(`CCTP not supported on destination chain ${toChainId}`);
    }

    const amountInUnits = parseUnits(amount, 6); // USDC has 6 decimals

    try {
        // Step 1: Approve USDC
        logger.log('[CCTP] Step 1: Approving USDC...');
        onProgress?.({
            step: 'approve',
            message: 'Approving USDC for transfer...',
        });

        const approveHash = await walletClient.writeContract({
            address: fromConfig.usdc,
            abi: ERC20_ABI,
            functionName: 'approve',
            args: [fromConfig.tokenMessenger, amountInUnits],
        });

        logger.log('[CCTP] Approval transaction:', approveHash);
        await publicClient.waitForTransactionReceipt({ hash: approveHash });

        // Step 2: Burn USDC
        logger.log('[CCTP] Step 2: Burning USDC on source chain...');
        onProgress?.({
            step: 'burn',
            message: 'Burning USDC on source chain...',
            txHash: approveHash,
        });

        // Convert recipient address to bytes32 (pad with zeros)
        const mintRecipient = `0x${recipientAddress.slice(2).padStart(64, '0')}` as `0x${string}`;

        const burnHash = await walletClient.writeContract({
            address: fromConfig.tokenMessenger,
            abi: TOKEN_MESSENGER_ABI,
            functionName: 'depositForBurn',
            args: [
                amountInUnits,
                toConfig.domain,
                mintRecipient,
                fromConfig.usdc,
            ],
        });

        logger.log('[CCTP] Burn transaction:', burnHash);
        const burnReceipt = await publicClient.waitForTransactionReceipt({ hash: burnHash });

        // Extract message hash from logs
        const messageHash = extractMessageHashFromLogs(burnReceipt.logs);
        logger.log('[CCTP] Message hash:', messageHash);

        // Step 3: Fetch attestation
        logger.log('[CCTP] Step 3: Fetching attestation from Circle...');
        onProgress?.({
            step: 'attestation',
            message: 'Waiting for Circle attestation (10-20 seconds)...',
            txHash: burnHash,
        });

        const attestation = await fetchAttestation(messageHash);
        logger.log('[CCTP] Attestation received');

        onProgress?.({
            step: 'complete',
            message: 'Ready to mint on destination chain. Please switch networks.',
            txHash: burnHash,
        });

        return {
            burnTxHash: burnHash,
            messageHash,
            attestation,
            toChainId,
            status: 'ready_to_mint',
        };

    } catch (error) {
        logger.error('[CCTP] Bridge error:', error);
        throw error;
    }
}

/**
 * Extract message hash from burn transaction logs
 */
function extractMessageHashFromLogs(logs: any[]): `0x${string}` {
    // Look for MessageSent event
    // The message hash is typically in the first topic after the event signature
    for (const log of logs) {
        if (log.topics && log.topics.length > 1) {
            // Return the second topic which is usually the message hash
            return log.topics[1] as `0x${string}`;
        }
    }
    throw new Error('Message hash not found in transaction logs');
}

/**
 * Fetch attestation from Circle API
 * Polls until attestation is available
 */
async function fetchAttestation(
    messageHash: `0x${string}`,
    maxAttempts: number = 60,
    delayMs: number = 2000
): Promise<string> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
            const response = await fetch(`${ATTESTATION_API_URL}/${messageHash}`);

            if (!response.ok) {
                if (response.status === 404) {
                    // Attestation not ready yet, wait and retry
                    logger.log(`[CCTP] Attestation not ready, attempt ${attempt + 1}/${maxAttempts}`);
                    await new Promise(resolve => setTimeout(resolve, delayMs));
                    continue;
                }
                throw new Error(`Attestation API error: ${response.status}`);
            }

            const data = await response.json();

            if (data.status === 'complete' && data.attestation) {
                return data.attestation;
            }

            // Still pending, wait and retry
            await new Promise(resolve => setTimeout(resolve, delayMs));

        } catch (error) {
            logger.error('[CCTP] Attestation fetch error:', error);
            if (attempt === maxAttempts - 1) {
                throw new Error('Failed to fetch attestation after maximum attempts');
            }
            await new Promise(resolve => setTimeout(resolve, delayMs));
        }
    }

    throw new Error('Attestation timeout - please try again later');
}

/**
 * Complete the bridge by minting on destination chain
 * This should be called after user switches to destination chain
 */
export async function completeCCTPBridge({
    walletClient,
    publicClient,
    chainId,
    message,
    attestation,
    onProgress,
}: {
    walletClient: WalletClient;
    publicClient: PublicClient;
    chainId: number;
    message: `0x${string}`;
    attestation: string;
    onProgress?: (progress: BridgeProgress) => void;
}): Promise<Hash> {
    const config = getCCTPConfig(chainId);

    if (!config) {
        throw new Error(`CCTP not supported on chain ${chainId}`);
    }

    try {
        logger.log('[CCTP] Step 4: Minting USDC on destination chain...');
        onProgress?.({
            step: 'mint',
            message: 'Minting USDC on destination chain...',
        });

        const mintHash = await walletClient.writeContract({
            address: config.messageTransmitter,
            abi: MESSAGE_TRANSMITTER_ABI,
            functionName: 'receiveMessage',
            args: [message as `0x${string}`, attestation as `0x${string}`],
        });

        logger.log('[CCTP] Mint transaction:', mintHash);
        await publicClient.waitForTransactionReceipt({ hash: mintHash });

        onProgress?.({
            step: 'complete',
            message: 'Bridge complete! USDC minted on destination chain.',
            txHash: mintHash,
        });

        return mintHash;

    } catch (error) {
        logger.error('[CCTP] Mint error:', error);
        throw error;
    }
}
