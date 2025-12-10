import { useEffect, useState } from "react";
import { usePublicClient, useBlockNumber } from "wagmi";
import { LENDING_POOL_ADDRESS, LENDING_POOL_ABI } from "@/lib/contracts";

interface Position {
    user: `0x${string}`;
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
    const { data: blockNumber } = useBlockNumber({ watch: false }); // ✅ Removed watch:true

    useEffect(() => {
        async function fetchLiquidatablePositions() {
            if (!publicClient || !blockNumber) return;

            try {
                setIsLoading(true);

                // ✅ Reduced from 10,000 to 1,000 blocks
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
                    fromBlock: blockNumber - BigInt(1000), // ✅ Changed from 10000
                    toBlock: 'latest',
                });

                const uniqueUsers = [...new Set(borrowEvents.map(event => event.args.user))];
                const liquidatablePositions: Position[] = [];

                // ✅ Limit to first 20 users to avoid excessive calls
                const usersToCheck = uniqueUsers.slice(0, 20);

                for (const user of usersToCheck) {
                    if (!user) continue;

                    try {
                        const healthFactor = await publicClient.readContract({
                            address: LENDING_POOL_ADDRESS,
                            abi: LENDING_POOL_ABI,
                            functionName: 'calculateUserHealthFactor',
                            args: [user],
                        }) as bigint;

                        const hf = Number(healthFactor) / 1e27;

                        if (hf < 1.0) {
                            const debtUSD = 1000;
                            const collateralUSD = debtUSD * hf * 1.25;
                            const isEmergency = hf < 0.95;
                            const closeFactor = isEmergency ? 1.0 : 0.5;
                            const maxLiquidatable = debtUSD * closeFactor;
                            const profit = maxLiquidatable * 0.05;

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
                        continue;
                    }
                }

                liquidatablePositions.sort((a, b) => a.healthFactor - b.healthFactor);

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

        // ✅ Initial fetch
        fetchLiquidatablePositions();

        // ✅ Refresh every 60 seconds instead of every block
        const interval = setInterval(fetchLiquidatablePositions, 60000);

        return () => clearInterval(interval);
    }, [publicClient, blockNumber]); // blockNumber only used for initial value

    return { positions, stats, isLoading };
}
