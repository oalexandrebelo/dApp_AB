/**
 * Bridge Chains Configuration
 * 
 * Chain metadata, CCTP support flags, and route validation
 */

import { parseEther } from 'viem';
import { isCCTPSupported } from '../cctp';
import type { ChainMetadata, BridgeRoute, BridgeWarning } from './types';

// Chain Metadata for all supported chains
export const CHAIN_METADATA: Record<number, ChainMetadata> = {
    // Ethereum Sepolia
    11155111: {
        chainId: 11155111,
        name: 'Ethereum Sepolia',
        shortName: 'Sepolia',
        nativeCurrency: {
            name: 'Sepolia Ether',
            symbol: 'ETH',
            decimals: 18,
        },
        rpcUrl: 'https://rpc.sepolia.org',
        blockExplorer: 'https://sepolia.etherscan.io',
        cctpSupported: true,
        minGasBalance: parseEther('0.01'), // 0.01 ETH
    },

    // Avalanche Fuji
    43113: {
        chainId: 43113,
        name: 'Avalanche Fuji',
        shortName: 'Fuji',
        nativeCurrency: {
            name: 'Avalanche',
            symbol: 'AVAX',
            decimals: 18,
        },
        rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
        blockExplorer: 'https://testnet.snowtrace.io',
        cctpSupported: true,
        minGasBalance: parseEther('0.1'), // 0.1 AVAX
    },

    // Optimism Sepolia
    11155420: {
        chainId: 11155420,
        name: 'Optimism Sepolia',
        shortName: 'OP Sepolia',
        nativeCurrency: {
            name: 'Sepolia Ether',
            symbol: 'ETH',
            decimals: 18,
        },
        rpcUrl: 'https://sepolia.optimism.io',
        blockExplorer: 'https://sepolia-optimism.etherscan.io',
        cctpSupported: true,
        minGasBalance: parseEther('0.005'), // 0.005 ETH
    },

    // Arbitrum Sepolia
    421614: {
        chainId: 421614,
        name: 'Arbitrum Sepolia',
        shortName: 'Arb Sepolia',
        nativeCurrency: {
            name: 'Sepolia Ether',
            symbol: 'ETH',
            decimals: 18,
        },
        rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc',
        blockExplorer: 'https://sepolia.arbiscan.io',
        cctpSupported: true,
        minGasBalance: parseEther('0.005'), // 0.005 ETH
    },

    // Base Sepolia
    84532: {
        chainId: 84532,
        name: 'Base Sepolia',
        shortName: 'Base',
        nativeCurrency: {
            name: 'Sepolia Ether',
            symbol: 'ETH',
            decimals: 18,
        },
        rpcUrl: 'https://sepolia.base.org',
        blockExplorer: 'https://sepolia.basescan.org',
        cctpSupported: true,
        minGasBalance: parseEther('0.005'), // 0.005 ETH
    },

    // Polygon Amoy
    80002: {
        chainId: 80002,
        name: 'Polygon Amoy',
        shortName: 'Amoy',
        nativeCurrency: {
            name: 'MATIC',
            symbol: 'MATIC',
            decimals: 18,
        },
        rpcUrl: 'https://rpc-amoy.polygon.technology',
        blockExplorer: 'https://amoy.polygonscan.com',
        cctpSupported: true,
        minGasBalance: parseEther('0.1'), // 0.1 MATIC
    },

    // Arc Testnet (No CCTP)
    5042002: {
        chainId: 5042002,
        name: 'Arc Testnet',
        shortName: 'Arc',
        nativeCurrency: {
            name: 'USDC',
            symbol: 'USDC',
            decimals: 6,
        },
        rpcUrl: 'https://rpc-testnet.arc.network',
        blockExplorer: 'https://testnet.arcscan.net',
        cctpSupported: false,
        minGasBalance: BigInt(1000000), // 1 USDC (6 decimals)
    },
};

/**
 * Get all chains that support CCTP
 */
export function getCCTPChains(): ChainMetadata[] {
    return Object.values(CHAIN_METADATA).filter(chain => chain.cctpSupported);
}

/**
 * Get chain metadata by chain ID
 */
export function getChainMetadata(chainId: number): ChainMetadata | undefined {
    return CHAIN_METADATA[chainId];
}

/**
 * Validate if a bridge route is supported
 */
export function validateBridgeRoute(fromChainId: number, toChainId: number): {
    valid: boolean;
    errors: string[];
    warnings: BridgeWarning[];
} {
    const errors: string[] = [];
    const warnings: BridgeWarning[] = [];

    const fromChain = getChainMetadata(fromChainId);
    const toChain = getChainMetadata(toChainId);

    if (!fromChain) {
        errors.push(`Source chain ${fromChainId} not supported`);
    }

    if (!toChain) {
        errors.push(`Destination chain ${toChainId} not supported`);
    }

    if (fromChainId === toChainId) {
        errors.push('Source and destination chains must be different');
    }

    if (fromChain && !fromChain.cctpSupported) {
        errors.push(`${fromChain.name} does not support CCTP`);
        warnings.push({
            type: 'chain',
            severity: 'high',
            message: `${fromChain.name} doesn't have official CCTP deployment. Try Ethereum Sepolia, Avalanche Fuji, or Polygon Amoy.`,
        });
    }

    if (toChain && !toChain.cctpSupported) {
        errors.push(`${toChain.name} does not support CCTP`);
        warnings.push({
            type: 'chain',
            severity: 'high',
            message: `${toChain.name} doesn't have official CCTP deployment.`,
        });
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings,
    };
}

/**
 * Get the best route between two chains
 * (For now, returns the direct route if supported)
 */
export function getBestRoute(fromChainId: number, toChainId: number): BridgeRoute | null {
    const fromChain = getChainMetadata(fromChainId);
    const toChain = getChainMetadata(toChainId);

    if (!fromChain || !toChain) {
        return null;
    }

    const validation = validateBridgeRoute(fromChainId, toChainId);

    // Estimate time based on chains
    let estimatedTime = '~15-20 minutes';
    if (fromChainId === 11155111 || toChainId === 11155111) {
        estimatedTime = '~15-20 minutes'; // Ethereum finality
    } else {
        estimatedTime = '~5-10 minutes'; // L2 finality
    }

    return {
        from: fromChain,
        to: toChain,
        estimatedTime,
        estimatedFee: {
            cctpFee: '0.00', // Will be calculated separately
            gasFee: '0.00',
            totalFee: '0.00',
            feePercentage: 0.1,
        },
        supported: validation.valid,
        warnings: validation.warnings,
    };
}

/**
 * Get all supported chains (for UI dropdowns)
 */
export function getAllChains(): ChainMetadata[] {
    return Object.values(CHAIN_METADATA);
}

/**
 * Check if chain supports CCTP
 */
export function isChainCCTPSupported(chainId: number): boolean {
    return isCCTPSupported(chainId);
}
