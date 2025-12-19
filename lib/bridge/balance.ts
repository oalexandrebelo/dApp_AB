/**
 * Bridge Balance Module
 * 
 * Functions for checking USDC and gas balances,
 * validating sufficient balances for bridge operations
 */

import { type PublicClient, formatUnits, parseUnits } from 'viem';
import { ERC20_ABI } from '../contracts';
import { getChainMetadata } from './chains';
import type { BalanceInfo, BalanceValidation } from './types';

/**
 * Check USDC balance for an address on a specific chain
 */
export async function checkUSDCBalance(
    address: `0x${string}`,
    chainId: number,
    publicClient: PublicClient
): Promise<bigint> {
    const chainMetadata = getChainMetadata(chainId);
    const usdcAddress = chainMetadata?.usdc;

    if (!usdcAddress) {
        throw new Error(`USDC address not found for chain ${chainId}`);
    }

    try {
        const balance = await publicClient.readContract({
            address: usdcAddress,
            abi: ERC20_ABI,
            functionName: 'balanceOf',
            args: [address],
        });

        return balance as bigint;
    } catch (error) {
        console.error('[Balance] Error checking USDC balance:', error);
        return BigInt(0);
    }
}

/**
 * Check gas balance (native token) for an address
 */
export async function checkGasBalance(
    address: `0x${string}`,
    publicClient: PublicClient
): Promise<bigint> {
    try {
        const balance = await publicClient.getBalance({ address });
        return balance;
    } catch (error) {
        console.error('[Balance] Error checking gas balance:', error);
        return BigInt(0);
    }
}

/**
 * Get complete balance information
 */
export async function getBalanceInfo(
    address: `0x${string}`,
    chainId: number,
    publicClient: PublicClient
): Promise<BalanceInfo> {
    const [usdc, gas] = await Promise.all([
        checkUSDCBalance(address, chainId, publicClient),
        checkGasBalance(address, publicClient),
    ]);

    const chainMetadata = getChainMetadata(chainId);
    const gasDecimals = chainMetadata?.nativeCurrency.decimals || 18;

    return {
        usdc,
        gas,
        formattedUsdc: formatUnits(usdc, 6), // USDC has 6 decimals
        formattedGas: formatUnits(gas, gasDecimals),
    };
}

/**
 * Validate if user has enough balance for bridge operation
 */
export async function validateBalances(
    address: `0x${string}`,
    chainId: number,
    amount: string,
    publicClient: PublicClient
): Promise<BalanceValidation> {
    const errors: string[] = [];
    const warnings: string[] = [];

    const chainMetadata = getChainMetadata(chainId);
    if (!chainMetadata) {
        errors.push('Chain not supported');
        return {
            hasEnoughUsdc: false,
            hasEnoughGas: false,
            usdcBalance: BigInt(0),
            gasBalance: BigInt(0),
            requiredUsdc: BigInt(0),
            requiredGas: BigInt(0),
            errors,
            warnings,
        };
    }

    // Get balances
    const [usdcBalance, gasBalance] = await Promise.all([
        checkUSDCBalance(address, chainId, publicClient),
        checkGasBalance(address, publicClient),
    ]);

    // Parse required USDC amount
    const requiredUsdc = parseUnits(amount, 6); // USDC has 6 decimals

    // Check USDC balance
    const hasEnoughUsdc = usdcBalance >= requiredUsdc;
    if (!hasEnoughUsdc) {
        errors.push(
            `Insufficient USDC balance. You have ${formatUnits(usdcBalance, 6)} USDC but need ${amount} USDC`
        );
    }

    // Check gas balance
    const requiredGas = chainMetadata.minGasBalance;
    const hasEnoughGas = gasBalance >= requiredGas;

    if (!hasEnoughGas) {
        const gasSymbol = chainMetadata.nativeCurrency.symbol;
        const gasDecimals = chainMetadata.nativeCurrency.decimals;
        errors.push(
            `Insufficient ${gasSymbol} for gas. You have ${formatUnits(gasBalance, gasDecimals)} ${gasSymbol} but need at least ${formatUnits(requiredGas, gasDecimals)} ${gasSymbol}`
        );
    }

    // Warnings for low balances
    if (hasEnoughUsdc && usdcBalance < requiredUsdc * BigInt(2)) {
        warnings.push('Low USDC balance. Consider keeping some USDC for future transactions.');
    }

    if (hasEnoughGas && gasBalance < requiredGas * BigInt(3)) {
        const gasSymbol = chainMetadata.nativeCurrency.symbol;
        warnings.push(`Low ${gasSymbol} balance. You may need more for multiple transactions.`);
    }

    return {
        hasEnoughUsdc,
        hasEnoughGas,
        usdcBalance,
        gasBalance,
        requiredUsdc,
        requiredGas,
        errors,
        warnings,
    };
}

/**
 * Format balance for display
 */
export function formatBalance(balance: bigint, decimals: number = 6, maxDecimals: number = 2): string {
    const formatted = formatUnits(balance, decimals);
    const num = parseFloat(formatted);

    if (num === 0) return '0.00';
    if (num < 0.01) return '< 0.01';

    return num.toFixed(maxDecimals);
}

/**
 * Check if balance is sufficient (simple check)
 */
export function hasSufficientBalance(balance: bigint, required: bigint): boolean {
    return balance >= required;
}
