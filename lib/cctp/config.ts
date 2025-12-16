/**
 * Circle CCTP Configuration
 * 
 * Contract addresses and domain mappings for CCTP testnet deployments
 * Source: https://developers.circle.com/stablecoins/cctp-protocol-contract
 */

export interface CCTPConfig {
    usdc: `0x${string}`;
    tokenMessenger: `0x${string}`;
    messageTransmitter: `0x${string}`;
    domain: number;
}

// CCTP Domain IDs
export const CCTP_DOMAINS = {
    ethereum: 0,
    avalanche: 1,
    polygon: 7,
} as const;

// CCTP Contract Addresses (Testnet)
export const CCTP_CONTRACTS: Record<number, CCTPConfig> = {
    // Ethereum Sepolia
    11155111: {
        usdc: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
        tokenMessenger: '0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5',
        messageTransmitter: '0x7865fAfC2db2093669d92c0F33AeEF291086BEFD',
        domain: 0,
    },
    // Avalanche Fuji
    43113: {
        usdc: '0x5425890298aed601595a70AB815c96711a31Bc65',
        tokenMessenger: '0xeb08f243e5d3fcff26a9e38ae5520a669f4019d0',
        messageTransmitter: '0xa9fb1b3009dcb79e2fe346c16a604b8fa8ae0a79',
        domain: 1,
    },
    // Polygon Amoy
    80002: {
        usdc: '0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582',
        tokenMessenger: '0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5',
        messageTransmitter: '0x7865fAfC2db2093669d92c0F33AeEF291086BEFD',
        domain: 7,
    },
};

// Circle Attestation API
export const ATTESTATION_API_URL = 'https://iris-api-sandbox.circle.com/attestations';

// Helper function to get CCTP config by chain ID
export function getCCTPConfig(chainId: number): CCTPConfig | undefined {
    return CCTP_CONTRACTS[chainId];
}

// Helper function to check if chain supports CCTP
export function isCCTPSupported(chainId: number): boolean {
    return chainId in CCTP_CONTRACTS;
}

// Helper function to get domain by chain ID
export function getDomainByChainId(chainId: number): number | undefined {
    return CCTP_CONTRACTS[chainId]?.domain;
}
