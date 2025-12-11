/**
 * Calculate health factor based on supplied and borrowed amounts
 */
export function calculateHealthFactor(
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
