
import { http, createConfig, cookieStorage, createStorage } from 'wagmi';
import { mainnet, base, arbitrum, polygon, sepolia } from 'wagmi/chains';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
    rainbowWallet,
    metaMaskWallet,
    coinbaseWallet,
    walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';

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

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '3f7b3ba39041babbec36fe69d114fcb';

const connectors = connectorsForWallets(
    [
        {
            groupName: 'Popular',
            wallets: [
                rainbowWallet,
                coinbaseWallet,
                metaMaskWallet,
                walletConnectWallet,
            ],
        },
    ],
    {
        appName: 'Arc Network',
        projectId,
    }
);

export const config = createConfig({
    chains: [sepolia, arcTestnet, mainnet, base, arbitrum, polygon],
    ssr: true,
    connectors,
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
