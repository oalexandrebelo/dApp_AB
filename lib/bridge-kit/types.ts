export type BridgeKitChain =
    | "Ethereum_Sepolia"
    | "Avalanche_Fuji"
    | "Optimism_Sepolia"
    | "Arbitrum_Sepolia"
    | "Base_Sepolia"
    | "Polygon_Amoy"
    | "Solana_Devnet"
    | "Arc_Testnet";

export interface BridgeKitConfig {
    rpcUrls?: Record<string, string>;
    transferSpeed?: 'fast' | 'standard';
}

export interface BridgeFeeConfig {
    percentage: number;
    recipient: `0x${string}`;
}

export interface BridgeParams {
    fromChainId: number;
    toChainId: number;
    amount: string;
}
