"use client";

import { useState, useEffect, useMemo } from 'react';
import { useAccount, useReadContracts } from 'wagmi';
import { USDC_ADDRESS, EURC_ADDRESS, USYC_ADDRESS, LENDING_POOL_ADDRESS, LENDING_POOL_ABI } from './contracts';
import { formatUnits } from 'viem';

interface EarningsData {
    time: string;
    earnings: number;
}

export function useEarningsData(timeframe: '24h' | '7d' | '30d') {
    const { address } = useAccount();
    const [data, setData] = useState<EarningsData[]>([]);

    const { data: results } = useReadContracts({
        contracts: [
            // Get current supplied balances
            { address: LENDING_POOL_ADDRESS, abi: LENDING_POOL_ABI, functionName: 'getUserBalance', args: [address!, USDC_ADDRESS] },
            { address: LENDING_POOL_ADDRESS, abi: LENDING_POOL_ABI, functionName: 'getUserBalance', args: [address!, EURC_ADDRESS] },
            { address: LENDING_POOL_ADDRESS, abi: LENDING_POOL_ABI, functionName: 'getUserBalance', args: [address!, USYC_ADDRESS] },
            // Get APY rates
            { address: LENDING_POOL_ADDRESS, abi: LENDING_POOL_ABI, functionName: 'getSupplyAPY', args: [USDC_ADDRESS] },
            { address: LENDING_POOL_ADDRESS, abi: LENDING_POOL_ABI, functionName: 'getSupplyAPY', args: [EURC_ADDRESS] },
            { address: LENDING_POOL_ADDRESS, abi: LENDING_POOL_ABI, functionName: 'getSupplyAPY', args: [USYC_ADDRESS] },
        ],
    });

    useEffect(() => {
        if (!results || !address) {
            setData([]);
            return;
        }

        // Parse balances
        const usdcBalance = results[0]?.result ? Number(formatUnits(results[0].result as bigint, 6)) : 0;
        const eurcBalance = results[1]?.result ? Number(formatUnits(results[1].result as bigint, 6)) : 0;
        const usycBalance = results[2]?.result ? Number(formatUnits(results[2].result as bigint, 6)) : 0;

        // Parse APYs (assuming they're in basis points, e.g., 500 = 5%)
        const usdcAPY = results[3]?.result ? Number(results[3].result) / 10000 : 0;
        const eurcAPY = results[4]?.result ? Number(results[4].result) / 10000 : 0;
        const usycAPY = results[5]?.result ? Number(results[5].result) / 10000 : 0;

        // Calculate total current balance
        const totalBalance = usdcBalance + eurcBalance + usycBalance;

        // Calculate weighted average APY
        const weightedAPY = totalBalance > 0
            ? (usdcBalance * usdcAPY + eurcBalance * eurcAPY + usycBalance * usycAPY) / totalBalance
            : 0;

        // Generate historical data based on current balance and APY
        // This simulates historical earnings growth
        const generateData = () => {
            let dataPoints: EarningsData[] = [];

            if (timeframe === '24h') {
                // 24 hours of data
                for (let i = 0; i < 24; i++) {
                    const hourlyRate = weightedAPY / 365 / 24;
                    const earnings = totalBalance * hourlyRate * (i + 1);
                    dataPoints.push({
                        time: `${i}:00`,
                        earnings: earnings
                    });
                }
            } else if (timeframe === '7d') {
                // 7 days of data
                for (let i = 0; i < 7; i++) {
                    const dailyRate = weightedAPY / 365;
                    const earnings = totalBalance * dailyRate * (i + 1);
                    dataPoints.push({
                        time: `Day ${i + 1}`,
                        earnings: earnings
                    });
                }
            } else {
                // 30 days of data
                for (let i = 0; i < 30; i++) {
                    const dailyRate = weightedAPY / 365;
                    const earnings = totalBalance * dailyRate * (i + 1);
                    dataPoints.push({
                        time: `Day ${i + 1}`,
                        earnings: earnings
                    });
                }
            }

            return dataPoints;
        };

        setData(generateData());
    }, [results, address, timeframe]);

    return data;
}
