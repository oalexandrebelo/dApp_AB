
import { http, createConfig, cookieStorage, createStorage } from 'wagmi';
import { mainnet, base, arbitrum, polygon, sepolia } from 'wagmi/chains';
import { injected, coinbaseWallet, walletConnect } from 'wagmi/connectors';

const arcTestnet = {
    id: 5042002,
    name: 'Arc Testnet',
    nativeCurrency: { name: 'USDC', symbol: 'USDC', decimals: 18 },
    rpcUrls: {
        default: { http: ['https://rpc.testnet.arc.network'] },
    },
    blockExplorers: {
        default: { name: 'ArcScan', url: 'https://testnet.arcscan.app' },
    },
} as const;

export const config = createConfig({
    chains: [sepolia, arcTestnet, mainnet, base, arbitrum, polygon],
    ssr: true,
    connectors: [
        injected(),
        walletConnect({ projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID' }),
        coinbaseWallet({ appName: 'Arc Network' }),
    ],
    storage: createStorage({
        storage: cookieStorage,
    }),
    transports: {
        [sepolia.id]: http(),
        [arcTestnet.id]: http(),
        [mainnet.id]: http(),
        [base.id]: http(),
        [arbitrum.id]: http(),
        [polygon.id]: http(),
    },
});
