import { BridgeKit } from "@circle-fin/bridge-kit";

// Singleton instance
let kitInstance: BridgeKit | null = null;

/**
 * Get or create Bridge-Kit instance
 */
export function getBridgeKit(): BridgeKit {
    if (!kitInstance) {
        // BridgeKit config might be simpler or different than initially thought
        // Search suggested kit.bridge and kit.estimate are main methods
        kitInstance = new BridgeKit();
    }

    return kitInstance;
}

/**
 * Fee configuration
 */
export const BRIDGE_FEE_CONFIG = {
    percentage: 0.1, // 0.1% fee
    recipient: process.env.NEXT_PUBLIC_TREASURY_ADDRESS as `0x${string}`,
};

/**
 * Chain name mapping (Nexux Lend -> Bridge-Kit)
 */
export const CHAIN_NAME_MAP: Record<number, string> = {
    11155111: "Ethereum_Sepolia",
    43113: "Avalanche_Fuji",
    11155420: "Optimism_Sepolia",
    421614: "Arbitrum_Sepolia",
    84532: "Base_Sepolia",
    80002: "Polygon_Amoy",
    // Arc Testnetfallback or native mapping if supported later
    5042002: "Arc_Testnet",
};
