import { useReadContract } from 'wagmi';
import { LENDING_POOL_ADDRESS, LENDING_POOL_ABI } from './contracts';

/**
 * Hook to fetch dynamic APY from the LendingPool contract
 * @param assetAddress Address of the asset (USDC, EURC, USYC)
 * @param type 'supply' or 'borrow'
 * @returns APY as a formatted percentage string (e.g., "4.50%")
 */
export function useAssetAPY(assetAddress: `0x${string}`, type: 'supply' | 'borrow') {
    const functionName = type === 'supply' ? 'getSupplyRate' : 'getBorrowRate';

    const { data: rate, isLoading } = useReadContract({
        address: LENDING_POOL_ADDRESS,
        abi: LENDING_POOL_ABI,
        functionName,
        args: [assetAddress],
        query: {
            refetchInterval: 30000, // Refresh every 30s
        }
    });

    if (isLoading || !rate) {
        return '...';
    }

    // Convert from WAD (1e18 = 100%) to percentage
    const apy = (Number(rate) / 1e18) * 100;
    return apy.toFixed(2) + '%';
}

/**
 * Hook to fetch utilization rate for an asset
 * @param assetAddress Address of the asset
 * @returns Utilization as a formatted percentage string
 */
export function useUtilizationRate(assetAddress: `0x${string}`) {
    const { data: utilization, isLoading } = useReadContract({
        address: LENDING_POOL_ADDRESS,
        abi: LENDING_POOL_ABI,
        functionName: 'getUtilizationRate',
        args: [assetAddress],
        query: {
            refetchInterval: 30000,
        }
    });

    if (isLoading || !utilization) {
        return '0.00%';
    }

    const rate = (Number(utilization) / 1e18) * 100;
    return rate.toFixed(2) + '%';
}

/**
 * Calculate interest earned on supplied assets
 * @param currentBalance Current balance with interest (from getUserBalance)
 * @param suppliedAmount Original supplied amount (from dashboard calculation)
 * @returns Interest earned as a number
 */
export function calculateInterestEarned(currentBalance: number, suppliedAmount: number): number {
    return Math.max(0, currentBalance - suppliedAmount);
}

/**
 * Calculate interest accrued on borrowed assets
 * @param currentDebt Current debt with interest (from getUserDebt)
 * @param borrowedAmount Original borrowed amount (from dashboard calculation)
 * @returns Interest accrued as a number
 */
export function calculateInterestAccrued(currentDebt: number, borrowedAmount: number): number {
    return Math.max(0, currentDebt - borrowedAmount);
}
