import { useReadContract } from 'wagmi';
import { LENDING_POOL_ADDRESS, LENDING_POOL_ABI, USDC_ADDRESS, EURC_ADDRESS, USYC_ADDRESS } from './contracts';

/**
 * Hook to calculate Net APY across all positions
 * Net APY = (Supply Earnings - Borrow Costs) / Total Value
 * 
 * @param suppliedUSDC Amount of USDC supplied
 * @param suppliedEURC Amount of EURC supplied  
 * @param suppliedUSYC Amount of USYC supplied
 * @param borrowedUSDC Amount of USDC borrowed
 * @param borrowedEURC Amount of EURC borrowed
 * @param borrowedUSYC Amount of USYC borrowed
 * @returns Net APY as a formatted percentage string
 */
export function useNetAPY(
    suppliedUSDC: number,
    suppliedEURC: number,
    suppliedUSYC: number,
    borrowedUSDC: number,
    borrowedEURC: number,
    borrowedUSYC: number
) {
    // Fetch all APYs
    const { data: usdcSupplyRate } = useReadContract({
        address: LENDING_POOL_ADDRESS,
        abi: LENDING_POOL_ABI,
        functionName: 'getSupplyRate',
        args: [USDC_ADDRESS],
    });

    const { data: eurcSupplyRate } = useReadContract({
        address: LENDING_POOL_ADDRESS,
        abi: LENDING_POOL_ABI,
        functionName: 'getSupplyRate',
        args: [EURC_ADDRESS],
    });

    const { data: usycSupplyRate } = useReadContract({
        address: LENDING_POOL_ADDRESS,
        abi: LENDING_POOL_ABI,
        functionName: 'getSupplyRate',
        args: [USYC_ADDRESS],
    });

    const { data: usdcBorrowRate } = useReadContract({
        address: LENDING_POOL_ADDRESS,
        abi: LENDING_POOL_ABI,
        functionName: 'getBorrowRate',
        args: [USDC_ADDRESS],
    });

    const { data: eurcBorrowRate } = useReadContract({
        address: LENDING_POOL_ADDRESS,
        abi: LENDING_POOL_ABI,
        functionName: 'getBorrowRate',
        args: [EURC_ADDRESS],
    });

    const { data: usycBorrowRate } = useReadContract({
        address: LENDING_POOL_ADDRESS,
        abi: LENDING_POOL_ABI,
        functionName: 'getBorrowRate',
        args: [USYC_ADDRESS],
    });

    // Convert rates from WAD to decimal
    const usdcSupplyAPY = usdcSupplyRate ? Number(usdcSupplyRate) / 1e18 : 0;
    const eurcSupplyAPY = eurcSupplyRate ? Number(eurcSupplyRate) / 1e18 : 0;
    const usycSupplyAPY = usycSupplyRate ? Number(usycSupplyRate) / 1e18 : 0;

    const usdcBorrowAPY = usdcBorrowRate ? Number(usdcBorrowRate) / 1e18 : 0;
    const eurcBorrowAPY = eurcBorrowRate ? Number(eurcBorrowRate) / 1e18 : 0;
    const usycBorrowAPY = usycBorrowRate ? Number(usycBorrowRate) / 1e18 : 0;

    // Calculate weighted earnings and costs
    const supplyEarnings =
        (suppliedUSDC * usdcSupplyAPY) +
        (suppliedEURC * eurcSupplyAPY) +
        (suppliedUSYC * usycSupplyAPY);

    const borrowCosts =
        (borrowedUSDC * usdcBorrowAPY) +
        (borrowedEURC * eurcBorrowAPY) +
        (borrowedUSYC * usycBorrowAPY);

    const totalValue = suppliedUSDC + suppliedEURC + suppliedUSYC;

    // Net APY = (Earnings - Costs) / Total Value
    if (totalValue === 0) {
        return '0.00%';
    }

    const netAPY = ((supplyEarnings - borrowCosts) / totalValue) * 100;

    // Format with sign
    if (netAPY > 0) {
        return `+${netAPY.toFixed(2)}%`;
    } else if (netAPY < 0) {
        return `${netAPY.toFixed(2)}%`;
    } else {
        return '0.00%';
    }
}
