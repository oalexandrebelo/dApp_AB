/**
 * Protocol Constants
 * 
 * Based on deep market research (Aave, Compound, Venus)
 * All values are realistic and implementable
 * 
 * Research sources:
 * - Aave V3 parameters (2024)
 * - Compound kinked interest model
 * - Circle CCTP documentation
 */

// ========================================
// LENDING PARAMETERS
// ========================================

export const LENDING_PARAMETERS = {
    // Normal Mode (conservative but competitive)
    NORMAL: {
        LTV: 0.75,                    // 75% - Conservative (Aave uses 70-80%)
        LIQUIDATION_THRESHOLD: 0.82,  // 82% - Buffer of 7%
        LIQUIDATION_PENALTY: 0.05,    // 5% - Market standard
    },

    // E-Mode Stablecoins (aggressive like Aave)
    EMODE_STABLECOINS: {
        LTV: 0.95,                    // 95% - Same as Aave
        LIQUIDATION_THRESHOLD: 0.97,  // 97%
        LIQUIDATION_PENALTY: 0.02,    // 2% - Lower risk
    },
} as const;

// ========================================
// INTEREST RATE MODEL (Kinked/Jump Rate)
// ========================================

export const INTEREST_RATE_MODEL = {
    // Model type
    TYPE: 'KINKED' as const,

    // Base rate at 0% utilization
    BASE_RATE: 0.02,              // 2% annual

    // Slope before kink (0-80%)
    SLOPE_1: 0.05,                // +5% per year per unit of utilization

    // Optimal utilization (kink point)
    OPTIMAL_UTILIZATION: 0.80,    // 80% - Market standard

    // Slope after kink (80-100%)
    SLOPE_2: 1.50,                // +150% per year (discourages over-borrowing)

    // Reserve factor (protocol revenue)
    RESERVE_FACTOR: 0.10,         // 10% of interest
} as const;

// ========================================
// E-MODE CATEGORIES
// ========================================

export enum EModeCategory {
    NONE = 0,
    STABLECOINS = 1,
}

export const EMODE_CONFIGS = {
    [EModeCategory.NONE]: {
        label: 'Normal Mode',
        ltv: LENDING_PARAMETERS.NORMAL.LTV,
        liquidationThreshold: LENDING_PARAMETERS.NORMAL.LIQUIDATION_THRESHOLD,
        liquidationBonus: LENDING_PARAMETERS.NORMAL.LIQUIDATION_PENALTY,
    },

    [EModeCategory.STABLECOINS]: {
        label: 'Stablecoins (USD)',
        ltv: LENDING_PARAMETERS.EMODE_STABLECOINS.LTV,
        liquidationThreshold: LENDING_PARAMETERS.EMODE_STABLECOINS.LIQUIDATION_THRESHOLD,
        liquidationBonus: LENDING_PARAMETERS.EMODE_STABLECOINS.LIQUIDATION_PENALTY,
        assets: ['USDC', 'EURC', 'USYC'] as const,
    },
} as const;

// ========================================
// LIQUIDATION CONFIGURATION
// ========================================

export const LIQUIDATION_CONFIG = {
    // Bonus for liquidators
    NORMAL_BONUS: 0.05,             // 5% (conservative, like Aave)
    EMODE_BONUS: 0.02,              // 2% (stablecoins = less risk)

    // Close factor (max % of debt that can be liquidated)
    MAX_CLOSE_FACTOR: 0.50,         // 50% (like Aave/Compound)

    // Permissionless liquidations
    PERMISSIONLESS: true,           // Anyone can liquidate

    // Health factor thresholds
    LIQUIDATION_THRESHOLD_HF: 1.0,  // HF < 1.0 = liquidatable
    CRITICAL_HF: 0.95,              // HF < 0.95 = full liquidation

    // Protocol cut from liquidation bonus
    PROTOCOL_CUT: 0.02,             // 2% of liquidation bonus (like Aave V3)
} as const;

// ========================================
// BRIDGE CONFIGURATION
// ========================================

export const BRIDGE_CONFIG = {
    // Circle CCTP
    CCTP: {
        PROTOCOL_FEE: 0.0,            // 0% - Circle doesn't charge
        SUPPORTED_CHAINS: [
            'Ethereum Sepolia',
            'Avalanche Fuji',
            'Polygon Amoy',
            'Arbitrum Sepolia',
            'Optimism Sepolia',
            'Base Sepolia',
        ] as const,
    },

    // Nexux Bridge Fee
    NEXUX_FEE: 0.001,               // 0.1% (covers operational costs)

    // Transaction limits
    LIMITS: {
        MIN_AMOUNT: 10,               // $10 USD minimum
        MAX_AMOUNT: 50000,            // $50k USD maximum (testnet)
        DAILY_VOLUME_PER_USER: 100000, // $100k daily per user
        MAX_DAILY_TRANSACTIONS: 10,   // 10 transactions per day
        PROTOCOL_DAILY_CAP: 1000000,  // $1M total daily volume
    },

    // Rate limiting
    RATE_LIMIT: {
        ENABLED: true,
        COOLDOWN_SECONDS: 300,        // 5 minutes between transactions
    },

    // Gas estimates
    ESTIMATED_GAS_USD: {
        APPROVE: 0.30,
        BURN: 0.50,
        MINT: 0.50,
        TOTAL: 1.30,
    },
} as const;


// ========================================
// REVENUE MODEL
// ========================================

export const REVENUE_MODEL = {
    // Lending spread
    RESERVE_FACTOR: INTEREST_RATE_MODEL.RESERVE_FACTOR,

    // Bridge fee (0.1%)
    BRIDGE_FEE: BRIDGE_CONFIG.NEXUX_FEE,

    // Flash loan fee
    FLASHLOAN_FEE: 0.0009,          // 0.09% (same as Aave)

    // Liquidation protocol cut
    LIQUIDATION_CUT: LIQUIDATION_CONFIG.PROTOCOL_CUT,

    // Treasury address (where fees go)
    // TODO: Replace with actual multisig or DAO treasury
    TREASURY: (process.env.NEXT_PUBLIC_TREASURY_ADDRESS ||
        '0x0000000000000000000000000000000000000000') as `0x${string}`,
} as const;


// ========================================
// ANALYTICS & RETENTION
// ========================================

export const ANALYTICS_CONFIG = {
    // Data retention
    RETENTION: {
        TRANSACTIONS_DAYS: 365,       // 1 year
        BALANCES_DAYS: 90,            // 3 months
        EVENTS_DAYS: 30,              // 1 month
    },

    // Export features
    EXPORT: {
        ENABLED: true,
        FORMATS: ['CSV', 'JSON'] as const,
        MAX_ROWS: 10000,
    },

    // PWA Notifications
    NOTIFICATIONS: {
        ENABLED: true,
        TYPES: [
            'LIQUIDATION_RISK',
            'TRANSACTION_COMPLETE',
            'RATE_CHANGE',
        ] as const,
    },
} as const;

// ========================================
// HEALTH FACTOR LEVELS
// ========================================

export const HEALTH_FACTOR_LEVELS = {
    SAFE: 2.0,                      // HF >= 2.0 = Safe
    MODERATE: 1.5,                  // HF >= 1.5 = Moderate
    RISKY: 1.1,                     // HF >= 1.1 = Risky
    CRITICAL: 1.0,                  // HF < 1.0 = Critical (liquidatable)
} as const;

// ========================================
// UTILITY TYPES
// ========================================

export type RiskLevel = 'safe' | 'moderate' | 'risky' | 'critical';

export type SupportedAsset = 'USDC' | 'EURC' | 'USYC';

export type CCTPChain = typeof BRIDGE_CONFIG.CCTP.SUPPORTED_CHAINS[number];

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Get risk level from health factor
 */
export function getRiskLevel(healthFactor: number): RiskLevel {
    if (healthFactor >= HEALTH_FACTOR_LEVELS.SAFE) return 'safe';
    if (healthFactor >= HEALTH_FACTOR_LEVELS.MODERATE) return 'moderate';
    if (healthFactor >= HEALTH_FACTOR_LEVELS.RISKY) return 'risky';
    return 'critical';
}

/**
 * Calculate borrow rate using kinked model
 */
export function calculateBorrowRate(utilizationRate: number): number {
    const { BASE_RATE, SLOPE_1, SLOPE_2, OPTIMAL_UTILIZATION } = INTEREST_RATE_MODEL;

    if (utilizationRate <= OPTIMAL_UTILIZATION) {
        return BASE_RATE + SLOPE_1 * utilizationRate;
    } else {
        const excessUtilization = utilizationRate - OPTIMAL_UTILIZATION;
        return BASE_RATE + SLOPE_1 * OPTIMAL_UTILIZATION + SLOPE_2 * excessUtilization;
    }
}

/**
 * Calculate supply rate from borrow rate
 */
export function calculateSupplyRate(borrowRate: number, utilizationRate: number): number {
    const { RESERVE_FACTOR } = INTEREST_RATE_MODEL;
    return borrowRate * utilizationRate * (1 - RESERVE_FACTOR);
}

/**
 * Check if asset is in eMode category
 */
export function isInEMode(asset: SupportedAsset, category: EModeCategory): boolean {
    if (category === EModeCategory.NONE) return false;
    const config = EMODE_CONFIGS[category];
    return 'assets' in config && config.assets.includes(asset);
}

/**
 * Get LTV for asset and mode
 */
export function getLTV(asset: SupportedAsset, eModeCategory: EModeCategory): number {
    if (eModeCategory === EModeCategory.STABLECOINS && isInEMode(asset, eModeCategory)) {
        return LENDING_PARAMETERS.EMODE_STABLECOINS.LTV;
    }
    return LENDING_PARAMETERS.NORMAL.LTV;
}

/**
 * Get liquidation threshold for asset and mode
 */
export function getLiquidationThreshold(
    asset: SupportedAsset,
    eModeCategory: EModeCategory
): number {
    if (eModeCategory === EModeCategory.STABLECOINS && isInEMode(asset, eModeCategory)) {
        return LENDING_PARAMETERS.EMODE_STABLECOINS.LIQUIDATION_THRESHOLD;
    }
    return LENDING_PARAMETERS.NORMAL.LIQUIDATION_THRESHOLD;
}

// Export all constants as default
export default {
    LENDING_PARAMETERS,
    INTEREST_RATE_MODEL,
    EMODE_CONFIGS,
    LIQUIDATION_CONFIG,
    BRIDGE_CONFIG,
    REVENUE_MODEL,
    ANALYTICS_CONFIG,
    HEALTH_FACTOR_LEVELS,
    getRiskLevel,
    calculateBorrowRate,
    calculateSupplyRate,
    isInEMode,
    getLTV,
    getLiquidationThreshold,
};
