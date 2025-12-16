/**
 * Bridge Fees Module
 * 
 * Functions for calculating CCTP fees, estimating gas costs,
 * and providing fee breakdowns
 */

import { parseUnits, formatUnits } from 'viem';
import { getChainMetadata } from './chains';
import type { FeeEstimate } from './types';

// CCTP fee is 0.1% (0.001)
const CCTP_FEE_PERCENTAGE = 0.001;

// Estimated gas costs per chain (in native token)
const ESTIMATED_GAS_COSTS: Record<number, string> = {
    11155111: '0.002', // Ethereum Sepolia - ~0.002 ETH
    43113: '0.05', // Avalanche Fuji - ~0.05 AVAX
    11155420: '0.0005', // Optimism Sepolia - ~0.0005 ETH
    421614: '0.0005', // Arbitrum Sepolia - ~0.0005 ETH
    84532: '0.0005', // Base Sepolia - ~0.0005 ETH
    80002: '0.01', // Polygon Amoy - ~0.01 MATIC
    5042002: '0.1', // Arc Testnet - ~0.1 USDC
};

/**
 * Calculate CCTP fee (0.1% of amount)
 */
export function calculateCCTPFee(amount: string): string {
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
        return '0.00';
    }

    const fee = amountNum * CCTP_FEE_PERCENTAGE;
    return fee.toFixed(6);
}

/**
 * Get estimated gas cost for a chain
 */
export function getEstimatedGasCost(chainId: number): string {
    return ESTIMATED_GAS_COSTS[chainId] || '0.001';
}

/**
 * Estimate total bridge fees
 */
export function estimateBridgeFees(
    amount: string,
    fromChainId: number,
    toChainId: number
): FeeEstimate {
    const cctpFee = calculateCCTPFee(amount);

    // Gas fee on source chain (for approve + burn)
    const sourceGasFee = getEstimatedGasCost(fromChainId);

    // Gas fee on destination chain (for mint)
    const destGasFee = getEstimatedGasCost(toChainId);

    // Convert gas fees to USDC equivalent (rough estimate)
    // For simplicity, we'll just show the gas fee in native token
    const gasFee = sourceGasFee; // Primary cost is on source chain

    // Total fee in USDC
    const totalFee = (parseFloat(cctpFee)).toFixed(6);

    return {
        cctpFee,
        gasFee,
        totalFee,
        feePercentage: CCTP_FEE_PERCENTAGE * 100, // 0.1%
    };
}

/**
 * Get estimated bridge time based on chains
 */
export function getEstimatedBridgeTime(fromChainId: number, toChainId: number): string {
    const fromChain = getChainMetadata(fromChainId);
    const toChain = getChainMetadata(toChainId);

    if (!fromChain || !toChain) {
        return '~15-20 minutes';
    }

    // Ethereum has longer finality (~15-20 minutes)
    if (fromChainId === 11155111 || toChainId === 11155111) {
        return '~15-20 minutes';
    }

    // L2s have faster finality (~5-10 minutes)
    return '~5-10 minutes';
}

/**
 * Format bridge time for display
 */
export function formatBridgeTime(fromChainId: number, toChainId: number): string {
    return getEstimatedBridgeTime(fromChainId, toChainId);
}

/**
 * Calculate net amount after fees
 */
export function calculateNetAmount(amount: string): string {
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
        return '0.00';
    }

    const fee = amountNum * CCTP_FEE_PERCENTAGE;
    const netAmount = amountNum - fee;

    return netAmount.toFixed(6);
}



/**
 * Get fee breakdown for display
 */
export function getFeeBreakdown(amount: string, fromChainId: number, toChainId: number): {
    amount: string;
    cctpFee: string;
    gasFee: string;
    netAmount: string;
    estimatedTime: string;
} {
    const fees = estimateBridgeFees(amount, fromChainId, toChainId);
    const netAmount = calculateNetAmount(amount);
    const estimatedTime = getEstimatedBridgeTime(fromChainId, toChainId);

    return {
        amount,
        cctpFee: fees.cctpFee,
        gasFee: fees.gasFee,
        netAmount,
        estimatedTime,
    };
}
