import { useReadContract, useAccount } from 'wagmi';
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
 * Hook to fetch actual balance with interest from contract
 * @param assetAddress Address of the asset
 * @param decimals Token decimals (6 for USDC/EURC/USYC)
 * @returns Actual balance including accumulated interest
 */
export function useActualBalance(assetAddress: `0x${string}`, decimals: number = 6) {
    const { address } = useAccount();

    const { data: balance, isLoading } = useReadContract({
        address: LENDING_POOL_ADDRESS,
        abi: LENDING_POOL_ABI,
        functionName: 'getUserBalance',
        args: [address!, assetAddress],
        query: {
            enabled: !!address,
            refetchInterval: 30000,
        }
    });

    if (isLoading || !balance || !address) {
        return 0;
    }

    // Convert from token decimals to number
    return Number(balance) / Math.pow(10, decimals);
}

/**
 * Hook to fetch actual debt with interest from contract
 * @param assetAddress Address of the asset
 * @param decimals Token decimals (6 for USDC/EURC/USYC)
 * @returns Actual debt including accumulated interest
 */
export function useActualDebt(assetAddress: `0x${string}`, decimals: number = 6) {
    const { address } = useAccount();

    const { data: debt, isLoading } = useReadContract({
        address: LENDING_POOL_ADDRESS,
        abi: LENDING_POOL_ABI,
        functionName: 'getUserDebt',
        args: [address!, assetAddress],
        query: {
            enabled: !!address,
            refetchInterval: 30000,
        }
    });

    if (isLoading || !debt || !address) {
        return 0;
    }

    // Convert from token decimals to number
    return Number(debt) / Math.pow(10, decimals);
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
 * @param actualBalance Current balance with interest (from getUserBalance)
 * @param suppliedAmount Original supplied amount (principal)
 * @returns Interest earned as a number
 */
export function calculateInterestEarned(actualBalance: number, suppliedAmount: number): number {
    return Math.max(0, actualBalance - suppliedAmount);
}

/**
 * Calculate interest accrued on borrowed assets
 * @param actualDebt Current debt with interest (from getUserDebt)
 * @param borrowedAmount Original borrowed amount (principal)
 * @returns Interest accrued as a number
 */
export function calculateInterestAccrued(actualDebt: number, borrowedAmount: number): number {
    return Math.max(0, actualDebt - borrowedAmount);
}
