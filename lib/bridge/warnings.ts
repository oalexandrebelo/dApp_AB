/**
 * Bridge Warnings Module
 * 
 * Functions for generating user-friendly warnings
 * for bridge operations
 */

import { formatUnits } from 'viem';
import { getChainMetadata } from './chains';
import type { BridgeWarning, BalanceValidation } from './types';

/**
 * Get balance-related warnings
 */
export function getBalanceWarnings(validation: BalanceValidation): BridgeWarning[] {
    const warnings: BridgeWarning[] = [];

    // Low USDC balance warning
    if (validation.hasEnoughUsdc && validation.usdcBalance < validation.requiredUsdc * BigInt(2)) {
        warnings.push({
            type: 'balance',
            severity: 'low',
            message: 'Low USDC balance. Consider keeping some USDC for future transactions.',
            icon: '💰',
        });
    }

    // Low gas balance warning
    if (validation.hasEnoughGas && validation.gasBalance < validation.requiredGas * BigInt(3)) {
        warnings.push({
            type: 'balance',
            severity: 'medium',
            message: 'Low gas balance. You may need more for multiple transactions.',
            icon: '⛽',
        });
    }

    // Insufficient USDC error (as high severity warning)
    if (!validation.hasEnoughUsdc) {
        const formattedBalance = formatUnits(validation.usdcBalance, 6);
        const formattedRequired = formatUnits(validation.requiredUsdc, 6);
        warnings.push({
            type: 'balance',
            severity: 'high',
            message: `Insufficient USDC. You have ${formattedBalance} USDC but need ${formattedRequired} USDC.`,
            icon: '❌',
        });
    }

    // Insufficient gas error (as high severity warning)
    if (!validation.hasEnoughGas) {
        warnings.push({
            type: 'balance',
            severity: 'high',
            message: 'Insufficient gas for transaction. Please add more gas tokens.',
            icon: '❌',
        });
    }

    return warnings;
}

/**
 * Get fee-related warnings
 */
export function getFeeWarnings(amount: string, feePercentage: number): BridgeWarning[] {
    const warnings: BridgeWarning[] = [];
    const amountNum = parseFloat(amount);

    if (isNaN(amountNum)) return warnings;

    const fee = amountNum * (feePercentage / 100);

    // High fee warning (relative to amount)
    if (amountNum < 10 && fee > 0.01) {
        warnings.push({
            type: 'fee',
            severity: 'medium',
            message: `Fee is ${feePercentage}% of transfer amount. Consider bridging larger amounts to reduce relative fees.`,
            icon: '💸',
        });
    }

    // Very small amount warning
    if (amountNum < 5) {
        warnings.push({
            type: 'fee',
            severity: 'low',
            message: 'Small transfer amount. Gas costs may be significant relative to the amount.',
            icon: 'ℹ️',
        });
    }

    return warnings;
}

/**
 * Get time-related warnings
 */
export function getTimeWarnings(fromChainId: number, toChainId: number): BridgeWarning[] {
    const warnings: BridgeWarning[] = [];

    // Ethereum finality warning
    if (fromChainId === 11155111) {
        warnings.push({
            type: 'time',
            severity: 'low',
            message: 'Ethereum transfers take ~15-20 minutes due to finality requirements.',
            icon: '⏱️',
        });
    }

    // L2 finality info
    if (fromChainId !== 11155111 && toChainId !== 11155111) {
        warnings.push({
            type: 'time',
            severity: 'low',
            message: 'L2 to L2 transfers typically complete in ~5-10 minutes.',
            icon: '⚡',
        });
    }

    return warnings;
}

/**
 * Get chain-specific warnings
 */
export function getChainWarnings(fromChainId: number, toChainId: number): BridgeWarning[] {
    const warnings: BridgeWarning[] = [];

    const fromChain = getChainMetadata(fromChainId);
    const toChain = getChainMetadata(toChainId);

    // Arc Testnet warning
    if (fromChainId === 5042002 || toChainId === 5042002) {
        warnings.push({
            type: 'chain',
            severity: 'high',
            message: 'Arc Testnet doesn\'t have official CCTP deployment. Try Ethereum Sepolia, Avalanche Fuji, or Polygon Amoy.',
            icon: '⚠️',
        });
    }

    // Same chain warning
    if (fromChainId === toChainId) {
        warnings.push({
            type: 'chain',
            severity: 'high',
            message: 'Source and destination chains must be different.',
            icon: '❌',
        });
    }

    // CCTP not supported warning
    if (fromChain && !fromChain.cctpSupported) {
        warnings.push({
            type: 'chain',
            severity: 'high',
            message: `${fromChain.name} does not support CCTP bridging.`,
            icon: '❌',
        });
    }

    if (toChain && !toChain.cctpSupported) {
        warnings.push({
            type: 'chain',
            severity: 'high',
            message: `${toChain.name} does not support CCTP bridging.`,
            icon: '❌',
        });
    }

    return warnings;
}

/**
 * Get all warnings for a bridge operation
 */
export function getAllWarnings(params: {
    fromChainId: number;
    toChainId: number;
    amount: string;
    balanceValidation?: BalanceValidation;
    feePercentage?: number;
}): BridgeWarning[] {
    const warnings: BridgeWarning[] = [];

    // Chain warnings
    warnings.push(...getChainWarnings(params.fromChainId, params.toChainId));

    // Time warnings
    warnings.push(...getTimeWarnings(params.fromChainId, params.toChainId));

    // Fee warnings
    if (params.feePercentage !== undefined) {
        warnings.push(...getFeeWarnings(params.amount, params.feePercentage));
    }

    // Balance warnings
    if (params.balanceValidation) {
        warnings.push(...getBalanceWarnings(params.balanceValidation));
    }

    return warnings;
}

/**
 * Get warning severity color
 */
export function getWarningSeverityColor(severity: BridgeWarning['severity']): string {
    switch (severity) {
        case 'high':
            return 'text-red-600 dark:text-red-400';
        case 'medium':
            return 'text-yellow-600 dark:text-yellow-400';
        case 'low':
            return 'text-blue-600 dark:text-blue-400';
        default:
            return 'text-gray-600 dark:text-gray-400';
    }
}

/**
 * Get warning severity icon
 */
export function getWarningSeverityIcon(severity: BridgeWarning['severity']): string {
    switch (severity) {
        case 'high':
            return '❌';
        case 'medium':
            return '⚠️';
        case 'low':
            return 'ℹ️';
        default:
            return '•';
    }
}



/**
 * Get highest severity from warnings
 */
export function getHighestSeverity(warnings: BridgeWarning[]): BridgeWarning['severity'] | null {
    if (warnings.length === 0) return null;

    if (warnings.some(w => w.severity === 'high')) return 'high';
    if (warnings.some(w => w.severity === 'medium')) return 'medium';
    return 'low';
}
