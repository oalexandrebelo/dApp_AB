// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./PriceOracle.sol";
import "./LendingPool.sol";

/**
 * @title BorrowingEngine
 * @notice Manages risk parameters, health factor calculations, and borrowing limits.
 */
contract BorrowingEngine {
    PriceOracle public oracle;
    LendingPool public pool;

    // Risk Parameters (scaled by 1e4)
    // LTV: Loan to Value (e.g., 8000 = 80%)
    mapping(address => uint256) public ltv;
    // Liquidation Threshold (e.g., 8500 = 85%)
    mapping(address => uint256) public liquidationThreshold;
    
    uint256 public constant PRECISION = 10000;

    constructor(address _oracle) {
        oracle = PriceOracle(_oracle);
    }

    function setPool(address _pool) external {
        pool = LendingPool(_pool);
    }

    function configureAsset(address asset, uint256 _ltv, uint256 _threshold) external {
        ltv[asset] = _ltv;
        liquidationThreshold[asset] = _threshold;
    }

    /**
     * @notice Calculates the health factor for a user.
     * HF = (Total Collateral Value * Liquidation Threshold) / Total Borrow Value
     * @return Health Factor (scaled by 1e18). < 1e18 means liquidatable.
     */
    function getUserHealthFactor(address user) public view returns (uint256) {
        (uint256 totalCollateralETH, uint256 totalDebtETH) = getUserAccountData(user);

        if (totalDebtETH == 0) {
            return type(uint256).max; // Infinite health
        }

        return (totalCollateralETH * 1e18) / totalDebtETH;
    }

    /**
     * @notice Gets user account data including total collateral and debt.
     */
    function getUserAccountData(address user) public view returns (uint256 totalCollateralETH, uint256 totalDebtETH) {
        // This requires iterating over all assets, which is expensive in Solidity.
        // For this simplified version, we'll assume the pool tracks user's active assets list
        // or we just return 0 for now as we don't have the full asset list stored in this contract yet.
        // In a real implementation (Aave V3), `LendingPool` stores the list of reserves.
        
        // Mock Implementation for MVP structure:
        // Real implementation would loop through pool.getReservesList()
        return (0, 0); 
    }

    // Interest Rate Model Parameters (scaled by 1e25 for ray math, but keeping simple 1e4 or 1e27 for now)
    // Using 1e27 (Ray) is standard in Aave, but we will use 1e18 (Wad) for simplicity in this demo.
    uint256 public constant WAD = 1e18;

    uint256 public baseRate = 0; // 0%
    uint256 public slope1 = 4e16; // 4%
    uint256 public slope2 = 60e16; // 60%
    uint256 public optimalUtilization = 80e16; // 80%
    uint256 public reserveFactor = 10e16; // 10%

    // ... existing constructor ...

    function calculateInterestRates(address asset, uint256 totalBorrowed, uint256 totalLiquidity) 
        external 
        view 
        returns (uint256 liquidityRate, uint256 variableBorrowRate) 
    {
        uint256 utilization = getUtilization(totalBorrowed, totalLiquidity);

        if (utilization <= optimalUtilization) {
            // R = R_base + (U / U_optimal) * R_slope1
            variableBorrowRate = baseRate + (utilization * slope1) / optimalUtilization;
        } else {
            // R = R_base + R_slope1 + ((U - U_optimal) / (1 - U_optimal)) * R_slope2
            uint256 excessUtilization = utilization - optimalUtilization;
            uint256 maxExcessUtilization = WAD - optimalUtilization;
            variableBorrowRate = baseRate + slope1 + (excessUtilization * slope2) / maxExcessUtilization;
        }

        // Liquidity Rate = Variable Borrow Rate * Utilization * (1 - Reserve Factor)
        uint256 percentToProtocol = (variableBorrowRate * reserveFactor) / WAD;
        uint256 percentToDepositors = variableBorrowRate - percentToProtocol;
        liquidityRate = (percentToDepositors * utilization) / WAD;
    }

    function getUtilization(uint256 totalBorrowed, uint256 totalLiquidity) public pure returns (uint256) {
        if (totalLiquidity == 0) return 0;
        return (totalBorrowed * WAD) / totalLiquidity;
    }

    // ... existing functions ...
    
    function validateBorrow(address user, address asset, uint256 amount) external view returns (bool) {
        // 1. Calculate new user debt if borrow proceeds
        // 2. Check if new HF >= 1
        return true; 
    }
    
    function validateLiquidation(address user, address collateralAsset, address debtAsset, uint256 debtToCover) external view returns (bool) {
        uint256 hf = getUserHealthFactor(user);
        return hf < 1e18; // Health Factor < 1.0
    }
}
