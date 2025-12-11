"use client";

import { useState, useEffect, useMemo } from 'react';
import { useAccount, useReadContracts } from 'wagmi';
import { USDC_ADDRESS, EURC_ADDRESS, USYC_ADDRESS, LENDING_POOL_ADDRESS, LENDING_POOL_ABI } from './contracts';
import { formatUnits } from 'viem';

interface AssetData {
    name: string;
    value: number;
}

export function useAssetDistribution() {
    const { address } = useAccount();
    const [data, setData] = useState<AssetData[]>([]);

    const { data: results } = useReadContracts({
        contracts: [
            { address: LENDING_POOL_ADDRESS, abi: LENDING_POOL_ABI, functionName: 'getUserBalance', args: [address!, USDC_ADDRESS] },
            { address: LENDING_POOL_ADDRESS, abi: LENDING_POOL_ABI, functionName: 'getUserBalance', args: [address!, EURC_ADDRESS] },
            { address: LENDING_POOL_ADDRESS, abi: LENDING_POOL_ABI, functionName: 'getUserBalance', args: [address!, USYC_ADDRESS] },
        ],
    });

    useEffect(() => {
        if (!results || !address) {
            setData([]);
            return;
        }

        const usdcBalance = results[0]?.result ? Number(formatUnits(results[0].result as bigint, 6)) : 0;
        const eurcBalance = results[1]?.result ? Number(formatUnits(results[1].result as bigint, 6)) : 0;
        const usycBalance = results[2]?.result ? Number(formatUnits(results[2].result as bigint, 6)) : 0;

        const total = usdcBalance + eurcBalance + usycBalance;

        if (total === 0) {
            setData([]);
            return;
        }

        setData([
            { name: 'USDC', value: usdcBalance },
            { name: 'EURC', value: eurcBalance },
            { name: 'USYC', value: usycBalance },
        ].filter(item => item.value > 0)); // Only show assets with balance

    }, [results, address]);

    return data;
}
