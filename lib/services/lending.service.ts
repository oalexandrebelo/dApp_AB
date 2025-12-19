/**
 * Lending Service
 * 
 * Complete service layer for lending operations with Wagmi v2 compatibility.
 * Uses hook-based approach for better integration with React and Wagmi.
 * 
 * Benefits:
 * - Type-safe
 * - Wagmi v2 compatible
 * - Event-driven
 * - Testable
 * - Reusable business logic
 */

import type { Address } from 'viem';
import { parseUnits, formatUnits } from 'viem';
import { LENDING_POOL_ADDRESS, LENDING_POOL_ABI, ERC20_ABI } from '@/lib/contracts';
import { logger } from '@/lib/logger';
import { eventBus } from '@/lib/events/eventBus';

// ========================================
// TYPES
// ========================================

export interface SupplyParams {
    asset: Address;
    amount: string; // Human-readable (e.g., "100.5")
    decimals: number;
    onBehalfOf?: Address;
    referralCode?: number;
}

export interface BorrowParams {
    asset: Address;
    amount: string;
    decimals: number;
    interestRateMode?: number; // 1 = stable, 2 = variable
    referralCode?: number;
    onBehalfOf?: Address;
}

export interface RepayParams {
    asset: Address;
    amount: string;
    decimals: number;
    onBehalfOf?: Address;
}

export interface WithdrawParams {
    asset: Address;
    amount: string;
    decimals: number;
    to?: Address;
}

export interface UserPosition {
    totalSupplied: number;
    totalBorrowed: number;
    healthFactor: number;
    netWorth: number;
    riskLevel: 'safe' | 'moderate' | 'risky' | 'critical';
    availableBorrow: number;
    utilizationRate: number;
}

// ========================================
// VALIDATION FUNCTIONS
// ========================================

export function validateSupplyAmount(amount: string, balance: string): {
    valid: boolean;
    error?: string;
} {
    const amountNum = parseFloat(amount);
    const balanceNum = parseFloat(balance);

    if (isNaN(amountNum) || amountNum <= 0) {
        return { valid: false, error: 'Invalid amount' };
    }

    if (amountNum > balanceNum) {
        return { valid: false, error: 'Insufficient balance' };
    }

    return { valid: true };
}

export function validateBorrowAmount(
    amount: string,
    availableBorrow: number,
    healthFactor: number
): {
    valid: boolean;
    error?: string;
} {
    const amountNum = parseFloat(amount);

    if (isNaN(amountNum) || amountNum <= 0) {
        return { valid: false, error: 'Invalid amount' };
    }

    if (amountNum > availableBorrow) {
        return { valid: false, error: 'Exceeds borrowing capacity' };
    }

    // Simulate new health factor
    const projectedHealthFactor = healthFactor * 0.8; // Approximate
    if (projectedHealthFactor < 1.1) {
        return {
            valid: false,
            error: 'Would create liquidation risk (HF < 1.1)',
        };
    }

    return { valid: true };
}

export function validateAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// ========================================
// CALCULATION FUNCTIONS
// ========================================

export function calculateHealthFactor(
    totalCollateralUSD: bigint,
    totalDebtUSD: bigint
): bigint {
    if (totalDebtUSD === BigInt(0)) return BigInt(Number.MAX_SAFE_INTEGER);

    // LTV = 80% (8000 basis points)
    const LTV_BASIS_POINTS = BigInt(8000);
    const BASIS_POINTS_DIVISOR = BigInt(10000);
    const WAD = BigInt(10) ** BigInt(18);

    // Calculate: (collateral * 0.8) / debt, scaled by WAD for precision
    const adjustedCollateral = (totalCollateralUSD * LTV_BASIS_POINTS) / BASIS_POINTS_DIVISOR;
    return (adjustedCollateral * WAD) / totalDebtUSD;
}

export function calculateRiskLevel(healthFactor: number): 'safe' | 'moderate' | 'risky' | 'critical' {
    if (healthFactor >= 2) return 'safe';
    if (healthFactor >= 1.5) return 'moderate';
    if (healthFactor >= 1.1) return 'risky';
    return 'critical';
}

export function calculateUtilizationRate(supplied: number, borrowed: number): number {
    if (supplied === 0) return 0;
    return (borrowed / supplied) * 100;
}

// ========================================
// FORMATTING FUNCTIONS
// ========================================

export function formatAmount(amount: string | number, decimals: number = 2): string {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return num.toFixed(decimals);
}

export function parseAmount(amount: string, decimals: number = 6): bigint {
    try {
        return parseUnits(amount, decimals);
    } catch (error) {
        logger.error('[LendingService] Parse amount error:', error);
        return BigInt(0);
    }
}

// ========================================
// CONTRACT CALL BUILDERS
// ========================================

/**
 * Build approve transaction parameters
 */
export function buildApproveParams(asset: Address, amount: string, decimals: number) {
    return {
        address: asset,
        abi: ERC20_ABI,
        functionName: 'approve' as const,
        args: [LENDING_POOL_ADDRESS, parseAmount(amount, decimals)] as const,
    };
}

/**
 * Build supply transaction parameters
 */
export function buildSupplyParams(
    asset: Address,
    amount: string,
    decimals: number,
    userAddress: Address,
    referralCode: number = 0
) {
    return {
        address: LENDING_POOL_ADDRESS,
        abi: LENDING_POOL_ABI,
        functionName: 'supply' as const,
        args: [asset, parseAmount(amount, decimals), userAddress, referralCode] as const,
    };
}

/**
 * Build borrow transaction parameters
 */
export function buildBorrowParams(
    asset: Address,
    amount: string,
    decimals: number,
    userAddress: Address,
    interestRateMode: number = 2,
    referralCode: number = 0
) {
    return {
        address: LENDING_POOL_ADDRESS,
        abi: LENDING_POOL_ABI,
        functionName: 'borrow' as const,
        args: [
            asset,
            parseAmount(amount, decimals),
            BigInt(interestRateMode),
            referralCode,
            userAddress,
        ] as const,
    };
}

/**
 * Build repay transaction parameters
 */
export function buildRepayParams(
    asset: Address,
    amount: string,
    decimals: number,
    userAddress: Address
) {
    return {
        address: LENDING_POOL_ADDRESS,
        abi: LENDING_POOL_ABI,
        functionName: 'repay' as const,
        args: [asset, parseAmount(amount, decimals), userAddress] as const,
    };
}

/**
 * Build withdraw transaction parameters
 */
export function buildWithdrawParams(
    asset: Address,
    amount: string,
    decimals: number,
    to: Address
) {
    return {
        address: LENDING_POOL_ADDRESS,
        abi: LENDING_POOL_ABI,
        functionName: 'withdraw' as const,
        args: [asset, parseAmount(amount, decimals), to] as const,
    };
}

// ========================================
// EVENT HANDLERS
// ========================================

export function emitSupplySuccess(data: {
    hash: string;
    asset: Address;
    amount: string;
    symbol: string;
}) {
    eventBus.emit('supply:success', {
        hash: data.hash,
        receipt: null,
        asset: data.asset,
        amount: data.amount,
    });

    logger.log('[LendingService] Supply successful:', data);
}

export function emitBorrowSuccess(data: {
    hash: string;
    asset: Address;
    amount: string;
    symbol: string;
}) {
    eventBus.emit('borrow:success', {
        hash: data.hash,
        receipt: null,
        asset: data.asset,
        amount: data.amount,
    });

    logger.log('[LendingService] Borrow successful:', data);
}

export function emitRepaySuccess(data: {
    hash: string;
    asset: Address;
    amount: string;
    symbol: string;
}) {
    eventBus.emit('repay:success', {
        hash: data.hash,
        receipt: null,
        asset: data.asset,
        amount: data.amount,
    });

    logger.log('[LendingService] Repay successful:', data);
}

export function emitWithdrawSuccess(data: {
    hash: string;
    asset: Address;
    amount: string;
    symbol: string;
}) {
    eventBus.emit('withdraw:success', {
        hash: data.hash,
        receipt: null,
        asset: data.asset,
        amount: data.amount,
    });

    logger.log('[LendingService] Withdraw successful:', data);
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Check if user needs to approve
 */
export async function needsApproval(
    publicClient: any,
    asset: Address,
    owner: Address,
    amount: string,
    decimals: number
): Promise<boolean> {
    try {
        const allowance = (await publicClient.readContract({
            address: asset,
            abi: ERC20_ABI,
            functionName: 'allowance',
            args: [owner, LENDING_POOL_ADDRESS],
        })) as bigint;

        const amountBigInt = parseAmount(amount, decimals);

        return allowance < amountBigInt;
    } catch (error) {
        logger.error('[LendingService] Check approval error:', error);
        return true; // Assume needs approval on error
    }
}

/**
 * Get user position summary
 */
export async function getUserPositionSummary(
    publicClient: any,
    userAddress: Address
): Promise<UserPosition> {
    try {
        const accountData = (await publicClient.readContract({
            address: LENDING_POOL_ADDRESS,
            abi: LENDING_POOL_ABI,
            functionName: 'getUserAccountData',
            args: [userAddress],
        })) as readonly [bigint, bigint, bigint, bigint, bigint, bigint];

        const [
            totalCollateralUSD,
            totalDebtUSD,
            availableBorrowsUSD,
            currentLiquidationThreshold,
            ltv,
            healthFactor,
        ] = accountData;

        // Convert BigInt values to numbers for display
        // USD values are in 6 decimals, convert to standard USD
        const totalSupplied = parseFloat(formatUnits(totalCollateralUSD, 6));
        const totalBorrowed = parseFloat(formatUnits(totalDebtUSD, 6));
        const availableBorrow = parseFloat(formatUnits(availableBorrowsUSD, 6));

        // Health factor from contract is in WAD (18 decimals), convert to number
        const healthFactorValue = parseFloat(formatUnits(healthFactor, 18));

        return {
            totalSupplied,
            totalBorrowed,
            healthFactor: healthFactorValue,
            netWorth: totalSupplied - totalBorrowed,
            riskLevel: calculateRiskLevel(healthFactorValue),
            availableBorrow,
            utilizationRate: calculateUtilizationRate(totalSupplied, totalBorrowed),
        };
    } catch (error) {
        logger.error('[LendingService] Get position error:', error);
        throw error;
    }
}

/**
 * Export all functions
 */
export const LendingService = {
    // Validation
    validateSupplyAmount,
    validateBorrowAmount,
    validateAddress,

    // Calculations
    calculateHealthFactor,
    calculateRiskLevel,
    calculateUtilizationRate,

    // Formatting
    formatAmount,
    parseAmount,

    // Contract builders
    buildApproveParams,
    buildSupplyParams,
    buildBorrowParams,
    buildRepayParams,
    buildWithdrawParams,

    // Event emitters
    emitSupplySuccess,
    emitBorrowSuccess,
    emitRepaySuccess,
    emitWithdrawSuccess,

    // Utilities
    needsApproval,
    getUserPositionSummary,
};
