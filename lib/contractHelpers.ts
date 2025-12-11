import { formatUnits } from 'viem';

/**
 * Parse a single balance result from contract read
 */
export function parseBalance(
    result: any,
    decimals: number = 6
): number {
    if (!result) return 0;
    return Number(formatUnits(result as bigint, decimals));
}

/**
 * Parse multiple balance results
 */
export function parseBalances(
    results: any[],
    decimals: number = 6
): number[] {
    return results.map(r => parseBalance(r?.result, decimals));
}
