"use client";

import { useState, useEffect, useMemo } from 'react';
import { useAccount, useReadContracts } from 'wagmi';
import { USDC_ADDRESS, EURC_ADDRESS, USYC_ADDRESS, LENDING_POOL_ADDRESS, LENDING_POOL_ABI } from './contracts';
import { calculateHealthFactor } from './healthFactor';
import { parseBalances } from './contractHelpers';

interface HealthFactorDataPoint {
    day: string;
    healthFactor: number;
    timestamp: number;
}

const STORAGE_KEY = 'nexux_health_factor_history';
const MAX_DAYS = 30;

export function useHealthFactorHistory() {
    const { address } = useAccount();
    const [data, setData] = useState<HealthFactorDataPoint[]>([]);

    const { data: results } = useReadContracts({
        contracts: [
            // Supplied Balances
            { address: LENDING_POOL_ADDRESS, abi: LENDING_POOL_ABI, functionName: 'getUserBalance', args: [address!, USDC_ADDRESS] },
            { address: LENDING_POOL_ADDRESS, abi: LENDING_POOL_ABI, functionName: 'getUserBalance', args: [address!, EURC_ADDRESS] },
            { address: LENDING_POOL_ADDRESS, abi: LENDING_POOL_ABI, functionName: 'getUserBalance', args: [address!, USYC_ADDRESS] },
            // Borrowed Balances
            { address: LENDING_POOL_ADDRESS, abi: LENDING_POOL_ABI, functionName: 'getUserDebt', args: [address!, USDC_ADDRESS] },
            { address: LENDING_POOL_ADDRESS, abi: LENDING_POOL_ABI, functionName: 'getUserDebt', args: [address!, EURC_ADDRESS] },
            { address: LENDING_POOL_ADDRESS, abi: LENDING_POOL_ABI, functionName: 'getUserDebt', args: [address!, USYC_ADDRESS] },
        ],
    });

    useEffect(() => {
        if (!results || !address) {
            setData([]);
            return;
        }

        // Parse current balances
        const balances = parseBalances(results);
        const currentHF = calculateHealthFactor(balances[0] + balances[1] + balances[2], balances[3] + balances[4] + balances[5]);

        // Load history from localStorage
        const loadHistory = (): HealthFactorDataPoint[] => {
            try {
                const stored = localStorage.getItem(`${STORAGE_KEY}_${address}`);
                return stored ? JSON.parse(stored) : [];
            } catch {
                return [];
            }
        };

        const history = loadHistory();
        const now = Date.now();
        const today = new Date().toDateString();

        // Check if we already have a record for today
        const todayIndex = history.findIndex(item =>
            new Date(item.timestamp).toDateString() === today
        );

        let updatedHistory: HealthFactorDataPoint[] = [];

        if (todayIndex >= 0) {
            // Update today's record
            updatedHistory = [...history];
            updatedHistory[todayIndex] = {
                day: `Day ${updatedHistory.length}`,
                healthFactor: currentHF,
                timestamp: now
            };
        } else {
            // Add new record for today
            updatedHistory = [
                ...history,
                {
                    day: `Day ${history.length + 1}`,
                    healthFactor: currentHF,
                    timestamp: now
                }
            ];
        }

        // Keep only last MAX_DAYS
        if (updatedHistory.length > MAX_DAYS) {
            updatedHistory = updatedHistory.slice(-MAX_DAYS);
            // Renumber days
            updatedHistory = updatedHistory.map((item, index) => ({
                ...item,
                day: `Day ${index + 1}`
            }));
        }

        // Save to localStorage
        try {
            localStorage.setItem(`${STORAGE_KEY}_${address}`, JSON.stringify(updatedHistory));
        } catch (error) {
            console.error('Failed to save health factor history:', error);
        }

        setData(updatedHistory);
    }, [results, address]);

    return data;
}
