import { useEffect, useState } from "react";
import { usePublicClient, useBlockNumber } from "wagmi";
import { LENDING_POOL_ADDRESS, LENDING_POOL_ABI } from "@/lib/contracts";

interface Position {
    user: string;
    healthFactor: number;
    collateralUSD: number;
    debtUSD: number;
    maxLiquidatable: number;
    profit: number;
    isEmergency: boolean;
}

interface Stats {
    totalDebtAtRisk: number;
    potentialProfit: number;
    emergencyCount: number;
}

export function useLiquidatablePositions() {
    const [positions, setPositions] = useState<Position[]>([]);
    const [stats, setStats] = useState<Stats>({
        totalDebtAtRisk: 0,
        potentialProfit: 0,
        emergencyCount: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    const publicClient = usePublicClient();
    const { data: blockNumber } = useBlockNumber({ watch: true });

    useEffect(() => {
        async function fetchLiquidatablePositions() {
            if (!publicClient) return;

            try {
                setIsLoading(true);

                // Get recent Borrow events to find users with debt
                const borrowEvents = await publicClient.getLogs({
                    address: LENDING_POOL_ADDRESS,
                    event: {
                        type: 'event',
                        name: 'Borrow',
                        inputs: [
                            { name: 'user', type: 'address', indexed: true },
                            { name: 'asset', type: 'address', indexed: true },
                            { name: 'amount', type: 'uint256', indexed: false },
                        ],
                    },
                    fromBlock: blockNumber ? blockNumber - 10000n : 'earliest',
                    toBlock: 'latest',
                });

                // Get unique users
                const uniqueUsers = [...new Set(borrowEvents.map(event => event.args.user))];

                // Check health factor for each user
                const liquidatablePositions: Position[] = [];

                for (const user of uniqueUsers) {
                    if (!user) continue;

                    try {
                        // Get user's health factor from contract
                        const healthFactor = await publicClient.readContract({
                            address: LENDING_POOL_ADDRESS,
                            abi: LENDING_POOL_ABI,
                            functionName: 'calculateUserHealthFactor',
                            args: [user],
                        }) as bigint;

                        const hf = Number(healthFactor) / 1e27; // Convert from RAY to decimal

                        // Only include if HF < 1.0 (liquidatable)
                        if (hf < 1.0) {
                            // For MVP, we'll use mock data for collateral/debt
                            // In production, you'd call getUserAccountData()
                            const debtUSD = 1000; // Mock value
                            const collateralUSD = debtUSD * hf * 1.25; // Estimate

                            const isEmergency = hf < 0.95;
                            const closeFactor = isEmergency ? 1.0 : 0.5;
                            const maxLiquidatable = debtUSD * closeFactor;
                            const profit = maxLiquidatable * 0.05; // 5% liquidation bonus

                            liquidatablePositions.push({
                                user,
                                healthFactor: hf,
                                collateralUSD,
                                debtUSD,
                                maxLiquidatable,
                                profit,
                                isEmergency,
                            });
                        }
                    } catch (error) {
                        // User might not have debt anymore, skip
                        continue;
                    }
                }

                // Sort by health factor (lowest first = most urgent)
                liquidatablePositions.sort((a, b) => a.healthFactor - b.healthFactor);

                // Calculate stats
                const totalDebtAtRisk = liquidatablePositions.reduce((sum, p) => sum + p.debtUSD, 0);
                const potentialProfit = liquidatablePositions.reduce((sum, p) => sum + p.profit, 0);
                const emergencyCount = liquidatablePositions.filter(p => p.isEmergency).length;

                setPositions(liquidatablePositions);
                setStats({
                    totalDebtAtRisk,
                    potentialProfit,
                    emergencyCount,
                });
            } catch (error) {
                console.error("Error fetching liquidatable positions:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchLiquidatablePositions();
    }, [publicClient, blockNumber]);

    return { positions, stats, isLoading };
}
