/**
 * WAD precision constant (1e18) for scaled math
 */
const PRECISION_WAD = BigInt(10) ** BigInt(18);

/**
 * Calculate health factor based on supplied and borrowed amounts (BigInt version)
 * @param totalSuppliedUSD Total supplied in USD (6 decimals, as bigint)
 * @param totalBorrowedUSD Total borrowed in USD (6 decimals, as bigint)
 * @param eModeCategory E-Mode category (0 = disabled, 1 = stablecoins)
 * @returns Health factor as bigint scaled by WAD (1e18). Divide by 1e18 for display.
 */
export function calculateHealthFactor(
    totalSuppliedUSD: bigint,
    totalBorrowedUSD: bigint,
    eModeCategory: number = 0
): bigint {
    if (totalBorrowedUSD === BigInt(0)) return BigInt(Number.MAX_SAFE_INTEGER); // Infinite health

    // LTV in basis points: 9700 = 97%, 7500 = 75%
    const ltvBasisPoints = eModeCategory === 1 ? BigInt(9700) : BigInt(7500);

    // Calculate max borrow = totalSupplied * LTV / 10000
    const maxBorrow = (totalSuppliedUSD * ltvBasisPoints) / BigInt(10000);

    // Health factor = maxBorrow / totalBorrowed (scaled by WAD for precision)
    return (maxBorrow * PRECISION_WAD) / totalBorrowedUSD;
}

/**
 * Legacy wrapper for backward compatibility with components using number
 * @deprecated Use calculateHealthFactor with BigInt instead
 */
export function calculateHealthFactorLegacy(
    totalSupplied: number,
    totalBorrowed: number,
    eModeCategory: number = 0
): number {
    if (totalBorrowed === 0) return 999;
    const ltv = eModeCategory === 1 ? 0.97 : 0.75;
    const maxBorrow = totalSupplied * ltv;
    return maxBorrow / totalBorrowed;
}

/**
 * Get color class for health factor
 */
export function getHealthFactorColor(hf: number): string {
    if (hf >= 2) return "text-success-500";
    if (hf >= 1.2) return "text-warning-500";
    return "text-error-500";
}

/**
 * Get status label for health factor
 */
export function getHealthFactorStatus(hf: number): string {
    if (hf >= 2) return "Safe";
    if (hf >= 1.2) return "Moderate";
    return "At Risk";
}

/**
 * Get background color class for health factor
 */
export function getHealthFactorBgColor(hf: number): string {
    if (hf >= 2) return "border-success-500/20 bg-success-500/5";
    if (hf >= 1.2) return "border-warning-500/20 bg-warning-500/5";
    return "border-error-500/20 bg-error-500/5";
}

/**
 * Get badge color class for health factor
 */
export function getHealthFactorBadgeColor(hf: number): string {
    if (hf >= 2) return "bg-success-500/20 text-success-700";
    if (hf >= 1.2) return "bg-warning-500/20 text-warning-700";
    return "bg-error-500/20 text-error-700";
}
