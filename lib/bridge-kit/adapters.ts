import { type WalletClient } from "viem";
import { createAdapterFromProvider } from "@circle-fin/adapter-viem-v2";

/**
 * Create Bridge-Kit adapter from Wagmi wallet client
 */
export async function createBridgeAdapter(walletClient: WalletClient | undefined) {
    if (!walletClient || !walletClient.account) {
        throw new Error("Wallet not connected or missing account");
    }

    // Viem v2 WalletClient uses transport as the provider
    // createAdapterFromProvider is the correct export
    return createAdapterFromProvider({
        provider: walletClient.transport as any
    });
}

/**
 * Validate adapter is ready
 */
export function isAdapterReady(walletClient: WalletClient | undefined): boolean {
    return !!walletClient && !!walletClient.account;
}
