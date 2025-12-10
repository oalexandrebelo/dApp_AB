/**
 * Utility functions for converting contract values to human-readable formats
 */

/**
 * Convert WAD (1e18) to percentage
 * @param wad Value in WAD format (1e18 = 100%)
 * @returns Percentage string (e.g., "4.50%")
 */
export function wadToPercentage(wad: bigint | undefined): string {
    if (!wad) return "0.00%";
    const percentage = (Number(wad) / 1e18) * 100;
    return percentage.toFixed(2) + "%";
}

/**
 * Convert RAY (1e27) to decimal
 * @param ray Value in RAY format
 * @returns Decimal number
 */
export function rayToDecimal(ray: bigint | undefined): number {
    if (!ray) return 0;
    return Number(ray) / 1e27;
}

/**
 * Calculate APY from APR (annual percentage rate)
 * @param apr Annual rate in WAD (1e18 = 100%)
 * @param compoundingPerYear Number of times interest compounds per year (default: 365*24*60*60 for per-second)
 * @returns APY as percentage string
 */
export function aprToApy(apr: bigint | undefined, compoundingPerYear: number = 31536000): string {
    if (!apr) return "0.00%";

    const aprDecimal = Number(apr) / 1e18;
    const ratePerPeriod = aprDecimal / compoundingPerYear;
    const apy = Math.pow(1 + ratePerPeriod, compoundingPerYear) - 1;

    return (apy * 100).toFixed(2) + "%";
}

/**
 * Format utilization rate
 * @param utilization Utilization in WAD (1e18 = 100%)
 * @returns Percentage string
 */
export function formatUtilization(utilization: bigint | undefined): string {
    if (!utilization) return "0.00%";
    const percentage = (Number(utilization) / 1e18) * 100;
    return percentage.toFixed(2) + "%";
}
