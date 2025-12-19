import { useQuery, useMutation } from "@tanstack/react-query";
import { useWalletClient, useAccount } from "wagmi";
import { getBridgeKit, BRIDGE_FEE_CONFIG, CHAIN_NAME_MAP } from "./config";
import { createBridgeAdapter } from "./adapters";

/**
 * Main hook to execute bridge transfers using Circle Bridge-Kit
 */
export function useBridgeKit() {
    const { data: walletClient } = useWalletClient();
    const { isConnected } = useAccount();
    const kit = getBridgeKit();

    const mutation = useMutation({
        mutationFn: async ({
            fromChainId,
            toChainId,
            amount,
        }: {
            fromChainId: number;
            toChainId: number;
            amount: string;
        }) => {
            if (!isConnected || !walletClient) {
                throw new Error("Wallet not connected");
            }

            const adapter = await createBridgeAdapter(walletClient);
            const fromChain = CHAIN_NAME_MAP[fromChainId] as any;
            const toChain = CHAIN_NAME_MAP[toChainId] as any;

            if (!fromChain || !toChain) {
                throw new Error("Chain not supported by Bridge-Kit");
            }

            // kit.bridge is the correct method
            const result = await (kit as any).bridge({
                from: { adapter, chain: fromChain },
                to: { adapter, chain: toChain },
                amount,
                fee: BRIDGE_FEE_CONFIG,
            });

            return result;
        },
    });

    return {
        executeBridge: mutation.mutateAsync,
        isLoading: mutation.isPending,
        error: mutation.error,
        isSuccess: mutation.isSuccess,
        data: mutation.data,
        reset: mutation.reset,
        // Helper compatibility for existing UI which might expect 'progress' string
        // For now, we simplify to loading state, but real progress would need events or steps from SDK
        progress: mutation.isPending ? "Processing transaction..." : "",
    };
}

/**
 * Hook for estimating bridge costs (gas + fees)
 */
export function useBridgeFeeEstimate({
    fromChainId,
    toChainId,
    amount,
}: {
    fromChainId: number;
    toChainId: number;
    amount: string;
}) {
    const { data: walletClient } = useWalletClient();
    const kit = getBridgeKit();

    const query = useQuery({
        queryKey: ['bridgeFeeEstimate', fromChainId, toChainId, amount],
        queryFn: async () => {
            if (!walletClient || !amount || parseFloat(amount) <= 0) return null;

            const adapter = await createBridgeAdapter(walletClient);
            const fromChain = CHAIN_NAME_MAP[fromChainId] as any;
            const toChain = CHAIN_NAME_MAP[toChainId] as any;

            if (!fromChain || !toChain) return null;

            // kit.estimate is the correct method
            const costEstimate = await (kit as any).estimate({
                from: { adapter, chain: fromChain },
                to: { adapter, chain: toChain },
                amount,
            });

            return costEstimate;
        },
        enabled: !!walletClient && !!amount && parseFloat(amount) > 0 && !!fromChainId && !!toChainId,
        staleTime: 1000 * 30, // 30 seconds
        retry: 1,
    });

    return {
        estimate: query.data,
        isLoading: query.isLoading,
        error: query.error,
        refetch: query.refetch,
    };
}
