/**
 * Bridge Module Types
 */

import { type Chain } from 'viem';

export interface ChainMetadata {
    chainId: number;
    name: string;
    shortName: string;
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
    rpcUrl: string;
    blockExplorer: string;
    cctpSupported: boolean;
    usdc?: `0x${string}`;
    minGasBalance: bigint;
}

export interface BridgeTransferParams {
    fromChainId: number;
    toChainId: number;
    amount: string;
    recipientAddress: `0x${string}`;
}

export interface BridgeProgress {
    step: 'approve' | 'burn' | 'attestation' | 'mint';
    status: 'pending' | 'done' | 'error';
    message: string;
    txHash?: `0x${string}`;
    attestation?: string;
}

export interface BridgeResult {
    success: boolean;
    burnTxHash: `0x${string}`;
    messageHash?: `0x${string}`;
    attestation?: string;
    status: 'pending' | 'ready_to_mint' | 'completed' | 'error';
}

export interface BalanceInfo {
    usdc: bigint;
    gas: bigint;
    formattedUsdc: string;
    formattedGas: string;
}

export interface BalanceValidation {
    hasEnoughUsdc: boolean;
    hasEnoughGas: boolean;
    usdcBalance: bigint;
    gasBalance: bigint;
    requiredUsdc: bigint;
    requiredGas: bigint;
    errors: string[];
    warnings: string[];
}

export interface FeeEstimate {
    cctpFee: string;
    gasFee: string;
    totalFee: string;
    feePercentage: number;
}

export interface TransactionHistory {
    id: string;
    timestamp: number;
    fromChainId: number;
    toChainId: number;
    amount: string;
    burnTxHash: `0x${string}`;
    messageHash?: `0x${string}`;
    mintTxHash?: `0x${string}`;
    recipientAddress: `0x${string}`;
    status: 'pending' | 'ready_to_mint' | 'completed' | 'error';
}

export interface ValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
}

export interface BridgeWarning {
    type: 'balance' | 'fee' | 'time' | 'chain' | 'network' | 'amount';
    severity: 'low' | 'medium' | 'high';
    message: string;
    icon?: string;
}

export interface BridgeRoute {
    from: ChainMetadata;
    to: ChainMetadata;
    supported: boolean;
    estimatedTime: string;
    estimatedFee: FeeEstimate;
    warnings: BridgeWarning[];
}
