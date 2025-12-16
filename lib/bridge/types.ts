/**
 * Bridge Module Types
 * 
 * TypeScript interfaces for bridge operations, balance checking,
 * fee estimation, transaction history, and validation.
 */

// Bridge Transfer Parameters
export interface BridgeTransferParams {
    fromChainId: number;
    toChainId: number;
    amount: string;
    recipientAddress: `0x${string}`;
}

// Bridge Progress
export interface BridgeProgress {
    step: 'approve' | 'burn' | 'attestation' | 'mint' | 'complete';
    message: string;
    txHash?: `0x${string}`;
    progress?: number; // 0-100
}

// Bridge Result
export interface BridgeResult {
    burnTxHash: `0x${string}`;
    messageHash: `0x${string}`;
    attestation: string;
    toChainId: number;
    status: 'ready_to_mint' | 'complete' | 'failed';
}

// Balance Information
export interface BalanceInfo {
    usdc: bigint;
    gas: bigint;
    formattedUsdc: string;
    formattedGas: string;
}

// Balance Validation
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

// Fee Estimate
export interface FeeEstimate {
    cctpFee: string; // USDC fee
    gasFee: string; // Estimated gas in native token
    totalFee: string; // Total in USDC
    feePercentage: number; // Percentage of amount
}

// Transaction History
export interface TransactionHistory {
    id: string;
    fromChainId: number;
    toChainId: number;
    amount: string;
    burnTxHash: `0x${string}`;
    messageHash?: `0x${string}`;
    mintTxHash?: `0x${string}`;
    status: 'pending' | 'ready_to_mint' | 'complete' | 'failed';
    timestamp: number;
    recipientAddress: `0x${string}`;
}

// Validation Result
export interface ValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
}

// Bridge Warning
export interface BridgeWarning {
    type: 'balance' | 'fee' | 'time' | 'chain' | 'amount';
    severity: 'low' | 'medium' | 'high';
    message: string;
    icon?: string;
}

// Chain Metadata
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
    minGasBalance: bigint; // Minimum gas balance required
}

// Bridge Route
export interface BridgeRoute {
    from: ChainMetadata;
    to: ChainMetadata;
    estimatedTime: string;
    estimatedFee: FeeEstimate;
    supported: boolean;
    warnings: BridgeWarning[];
}
