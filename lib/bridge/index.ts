/**
 * Bridge Module
 * 
 * Complete bridge utilities for CCTP operations
 * Includes balance checking, fee estimation, validation,
 * transaction history, and warnings
 */

// Re-export types
export type {
    BridgeTransferParams,
    BridgeProgress,
    BridgeResult,
    BalanceInfo,
    BalanceValidation,
    FeeEstimate,
    TransactionHistory,
    ValidationResult,
    BridgeWarning,
    ChainMetadata,
    BridgeRoute,
} from './types';

// Re-export chain utilities
export {
    CHAIN_METADATA,
    getCCTPChains,
    getChainMetadata,
    validateBridgeRoute,
    getBestRoute,
    getAllChains,
    isChainCCTPSupported,
} from './chains';

// Re-export balance utilities
export {
    checkUSDCBalance,
    checkGasBalance,
    getBalanceInfo,
    validateBalances,
    formatBalance,
    hasSufficientBalance,
} from './balance';

// Re-export transaction utilities
export {
    getBridgeHistory,
    addToHistory,
    updateHistoryStatus,
    getTransactionByHash,
    getPendingTransactions,
    clearHistory,
    exportHistory,
    importHistory,
    getTransactionCount,
    getTransactionsByStatus,
    getRecentTransactions,
    formatTransactionTime,
} from './transactions';

// Re-export validation utilities
export {
    validateBridgeInputs,
    validateAmount,
    validateAddress,
    getErrorMessage,
    getTransferWarnings,
    sanitizeAmount,
    validateWalletConnection,
} from './validation';

// Re-export warning utilities
export {
    getBalanceWarnings,
    getFeeWarnings,
    getTimeWarnings,
    getChainWarnings,
    getAllWarnings,
    getWarningSeverityColor,
    getWarningSeverityIcon,
    getHighestSeverity,
} from './warnings';

// Re-export Bridge-Kit utilities
export { useBridgeKit, useBridgeFeeEstimate } from '../bridge-kit/hooks';
export { getBridgeKit, BRIDGE_FEE_CONFIG, CHAIN_NAME_MAP } from '../bridge-kit/config';
export { createBridgeAdapter, isAdapterReady } from '../bridge-kit/adapters';
export type { BridgeKitChain, BridgeKitConfig, BridgeFeeConfig, BridgeParams } from '../bridge-kit/types';
