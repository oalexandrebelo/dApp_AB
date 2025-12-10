// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/LendingPool.sol";

/**
 * @title DeployLendingPoolV2
 * @notice Deployment script for production-ready LendingPool with interest accrual
 * @dev Run with: forge script script/DeployLendingPoolV2.s.sol:DeployLendingPoolV2 --rpc-url https://rpc.testnet.arc.network --broadcast --verify --legacy
 */
contract DeployLendingPoolV2 is Script {
    // Arc Testnet asset addresses
    address constant USDC = 0x3600000000000000000000000000000000000000;
    address constant EURC = 0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a;
    address constant USYC = 0xe9185F0c5F296Ed1797AaE4238D26CCaBEadb86C;
    
    // Configuration constants
    uint256 constant WAD = 1e18;
    
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // 1. Deploy LendingPool
        console.log("Deploying LendingPool...");
        LendingPool lendingPool = new LendingPool();
        console.log("LendingPool deployed at:", address(lendingPool));
        
        // 2. Initialize USDC (Stablecoin - Conservative)
        console.log("\nInitializing USDC...");
        lendingPool.addAsset(
            USDC,
            0.85e18,  // 85% collateral factor (LTV)
            0.90e18,  // 90% liquidation threshold
            0.05e18,  // 5% liquidation bonus
            0.10e18   // 10% reserve factor
        );
        
        // Set interest rate model for USDC
        lendingPool.setInterestRateModel(
            USDC,
            0,          // 0% base rate
            0.04e18,    // 4% slope1 (below optimal)
            0.60e18,    // 60% slope2 (above optimal)
            0.80e18     // 80% optimal utilization
        );
        console.log("USDC initialized with 85% LTV, 4-60% rate model");
        
        // 3. Initialize EURC (Stablecoin - Conservative)
        console.log("\nInitializing EURC...");
        lendingPool.addAsset(
            EURC,
            0.85e18,  // 85% collateral factor
            0.90e18,  // 90% liquidation threshold
            0.05e18,  // 5% liquidation bonus
            0.10e18   // 10% reserve factor
        );
        
        lendingPool.setInterestRateModel(
            EURC,
            0,          // 0% base rate
            0.035e18,   // 3.5% slope1
            0.60e18,    // 60% slope2
            0.80e18     // 80% optimal utilization
        );
        console.log("EURC initialized with 85% LTV, 3.5-60% rate model");
        
        // 4. Initialize USYC (Yield Coin - More Volatile)
        console.log("\nInitializing USYC...");
        lendingPool.addAsset(
            USYC,
            0.70e18,  // 70% collateral factor (lower for more risk)
            0.75e18,  // 75% liquidation threshold
            0.10e18,  // 10% liquidation bonus (higher incentive)
            0.15e18   // 15% reserve factor
        );
        
        lendingPool.setInterestRateModel(
            USYC,
            0.01e18,    // 1% base rate
            0.05e18,    // 5% slope1
            0.75e18,    // 75% slope2
            0.75e18     // 75% optimal utilization
        );
        console.log("USYC initialized with 70% LTV, 1-5-75% rate model");
        
        vm.stopBroadcast();
        
        // 5. Print deployment summary
        console.log("\n=== DEPLOYMENT SUMMARY ===");
        console.log("LendingPool:", address(lendingPool));
        console.log("\nAssets Configured:");
        console.log("- USDC:", USDC, "| LTV: 85% | Liq: 90% | Bonus: 5%");
        console.log("- EURC:", EURC, "| LTV: 85% | Liq: 90% | Bonus: 5%");
        console.log("- USYC:", USYC, "| LTV: 70% | Liq: 75% | Bonus: 10%");
        console.log("\nNext steps:");
        console.log("1. Verify contract on ArcScan");
        console.log("2. Update frontend with new address");
        console.log("3. Test supply/borrow/withdraw/repay flows");
    }
}
