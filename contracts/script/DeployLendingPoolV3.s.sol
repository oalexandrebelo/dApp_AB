// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/LendingPool.sol";
import "../src/SimplePriceOracle.sol";

/**
 * @title DeployLendingPoolV3
 * @notice Deploy LendingPool V3 with liquidation engine and price oracle
 */
contract DeployLendingPoolV3 is Script {
    // Asset addresses on Arc Testnet
    address constant USDC = 0x3600000000000000000000000000000000000000;
    address constant EURC = 0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a;
    address constant USYC = 0xe9185F0c5F296Ed1797AaE4238D26CCaBEadb86C;
    
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        
        // 1. Deploy SimplePriceOracle
        SimplePriceOracle priceOracle = new SimplePriceOracle();
        console.log("SimplePriceOracle deployed at:", address(priceOracle));
        
        // 2. Set 1:1 prices for all stablecoins ($1.00 = 1e8)
        address[] memory assets = new address[](3);
        assets[0] = USDC;
        assets[1] = EURC;
        assets[2] = USYC;
        
        uint256[] memory prices = new uint256[](3);
        prices[0] = 1e8; // $1.00
        prices[1] = 1e8; // $1.00
        prices[2] = 1e8; // $1.00
        
        priceOracle.setAssetPrices(assets, prices);
        console.log("Prices set: USDC, EURC, USYC = $1.00");
        
        // 3. Deploy LendingPool V3
        LendingPool lendingPool = new LendingPool();
        console.log("LendingPool V3 deployed at:", address(lendingPool));
        
        // 4. Set price oracle
        lendingPool.setPriceOracle(address(priceOracle));
        console.log("Price oracle set");
        
        // 5. Configure E-Mode Category 1: Stablecoins
        lendingPool.setEModeCategory(
            1,      // categoryId
            9700,   // 97% LTV
            9800,   // 98% liquidation threshold
            101,    // 1% liquidation bonus
            "Stablecoins"
        );
        console.log("E-Mode Category 1 (Stablecoins) configured: 97% LTV");
        
        // 6. Add assets with liquidation parameters
        // USDC
        lendingPool.addAsset(
            USDC,
            0.75e18,    // 75% collateral factor (LTV)
            0.80e18,    // 80% liquidation threshold
            0.05e18,    // 5% liquidation bonus
            0.10e18,    // 10% reserve factor
            1000000e6,  // 1M USDC supply cap
            500000e6,   // 500K USDC borrow cap
            1           // E-Mode category 1 (Stablecoins)
        );
        console.log("USDC added with caps and E-Mode");
        
        // EURC
        lendingPool.addAsset(
            EURC,
            0.75e18,    // 75% collateral factor
            0.80e18,    // 80% liquidation threshold
            0.05e18,    // 5% liquidation bonus
            0.10e18,    // 10% reserve factor
            1000000e6,  // 1M EURC supply cap
            500000e6,   // 500K EURC borrow cap
            1           // E-Mode category 1 (Stablecoins)
        );
        console.log("EURC added with caps and E-Mode");
        
        // USYC (higher risk, lower LTV)
        lendingPool.addAsset(
            USYC,
            0.70e18,    // 70% collateral factor
            0.75e18,    // 75% liquidation threshold
            0.07e18,    // 7% liquidation bonus (higher risk)
            0.15e18,    // 15% reserve factor
            500000e6,   // 500K USYC supply cap (lower)
            250000e6,   // 250K USYC borrow cap (lower)
            1           // E-Mode category 1 (Stablecoins)
        );
        console.log("USYC added with caps and E-Mode");
        
        vm.stopBroadcast();
        
        // Print summary
        console.log("\n=== Deployment Summary ===");
        console.log("SimplePriceOracle:", address(priceOracle));
        console.log("LendingPool V4:", address(lendingPool));
        console.log("\nE-Mode Categories:");
        console.log("- Category 1 (Stablecoins): 97% LTV, 98% Liq Threshold, 1% Bonus");
        console.log("\nAssets configured:");
        console.log("- USDC: 75% LTV, 80% Liq Threshold, 5% Bonus, 1M supply cap, 500K borrow cap");
        console.log("- EURC: 75% LTV, 80% Liq Threshold, 5% Bonus, 1M supply cap, 500K borrow cap");
        console.log("- USYC: 70% LTV, 75% Liq Threshold, 7% Bonus, 500K supply cap, 250K borrow cap");
        console.log("\nAll assets in E-Mode Category 1");
        console.log("All assets priced at $1.00");
    }
}
