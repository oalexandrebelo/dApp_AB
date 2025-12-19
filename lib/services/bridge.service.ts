/**
 * Bridge Service
 * 
 * Wrapper around Circle Bridge-Kit operations with enhanced features:
 * - Transaction tracking
 * - Status monitoring
 * - Event emission
 * - Error handling
 */

import type { PublicClient, WalletClient, Address, Hash } from 'viem';
import { getBridgeKit, createBridgeAdapter, BRIDGE_FEE_CONFIG, CHAIN_NAME_MAP } from '@/lib/bridge';
import { eventBus } from '@/lib/events/eventBus';
import { logger } from '@/lib/logger';

export interface BridgeParams {
    fromChainId: number;
    toChainId: number;
    amount: string;
    recipientAddress?: Address;
}

export interface BridgeServiceResult {
    success: boolean;
    burnTxHash: Hash;
    messageHash?: Hash;
    status: string;
    tracking: {
        started: number; // timestamp
        updated: number; // timestamp
        estimatedCompletion?: number; // timestamp
    };
}

export class BridgeService {
    private publicClient: PublicClient;
    private walletClient?: WalletClient;

    constructor(publicClient: PublicClient, walletClient?: WalletClient) {
        this.publicClient = publicClient;
        this.walletClient = walletClient;
    }

    /**
     * Execute cross-chain bridge via Circle Bridge-Kit
     */
    async bridge(params: BridgeParams): Promise<BridgeServiceResult> {
        if (!this.walletClient) {
            throw new Error('Wallet client not available');
        }

        try {
            logger.log('[BridgeService] Starting bridge:', params);

            const startTime = Date.now();

            // Emit start event
            eventBus.emit('bridge:started', {
                fromChain: params.fromChainId,
                toChain: params.toChainId,
                amount: params.amount,
            });

            const kit = getBridgeKit();
            const adapter = await createBridgeAdapter(this.walletClient);
            const fromChain = CHAIN_NAME_MAP[params.fromChainId];
            const toChain = CHAIN_NAME_MAP[params.toChainId];

            if (!fromChain || !toChain) {
                throw new Error('Chain not supported by Bridge-Kit');
            }

            // Execute Bridge-Kit cross-chain transfer
            const result: any = await (kit as any).bridge({
                from: { adapter, chain: fromChain },
                to: { adapter, chain: toChain },
                amount: params.amount,
                fee: BRIDGE_FEE_CONFIG,
            });

            const completedTime = Date.now();

            const burnTxHash = result?.burnTxHash || result?.hash || '0x...';
            const messageHash = result?.messageHash || result?.id || '0x...';

            // Emit success event
            eventBus.emit('bridge:completed', {
                hash: burnTxHash,
                messageHash: messageHash,
            });

            logger.log('[BridgeService] Bridge completed:', result);

            return {
                success: true,
                burnTxHash,
                messageHash,
                status: result?.status || 'pending',
                tracking: {
                    started: startTime,
                    updated: completedTime,
                    estimatedCompletion: completedTime + (15 * 60 * 1000), // +15 min for attestation
                },
            };

        } catch (error: any) {
            logger.error('[BridgeService] Bridge error:', error);

            eventBus.emit('bridge:error', { error, params });

            throw error;
        }
    }

    /**
     * Get bridge status (for monitoring)
     */
    async getBridgeStatus(burnTxHash: Hash, messageHash?: Hash): Promise<{
        status: 'pending' | 'attestation' | 'ready_to_mint' | 'complete' | 'failed';
        burnTx: any;
        attestation?: string;
        mintTx?: any;
    }> {
        try {
            // Get burn transaction
            const burnTx = await this.publicClient.getTransactionReceipt({
                hash: burnTxHash,
            });

            if (!burnTx || burnTx.status !== 'success') {
                return {
                    status: 'failed',
                    burnTx: null,
                };
            }

            // Check status via Bridge-Kit if possible, but for now keep manual check logic 
            // since Bridge-Kit might handle this differently.
            if (messageHash) {
                try {
                    const response = await fetch(`https://iris-api-sandbox.circle.com/attestations/${messageHash}`);
                    if (response.ok) {
                        const data = await response.json();
                        if (data.status === 'complete' && data.attestation) {
                            return {
                                status: 'ready_to_mint',
                                burnTx,
                                attestation: data.attestation,
                            };
                        }
                    }
                } catch (error) {
                    logger.log('[BridgeService] Attestation check failed:', error);
                }
            }

            return {
                status: 'pending',
                burnTx,
            };

        } catch (error) {
            logger.error('[BridgeService] Get status error:', error);
            throw error;
        }
    }
}

/**
 * Factory function
 */
export function createBridgeService(
    publicClient: PublicClient,
    walletClient?: WalletClient
): BridgeService {
    return new BridgeService(publicClient, walletClient);
}
