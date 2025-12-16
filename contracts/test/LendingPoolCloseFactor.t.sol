// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/LendingPool.sol";
import "../src/mocks/MockERC20.sol";
import "../src/mocks/MockPriceOracle.sol";

/**
 * @title LendingPoolVariableCloseFactorTest
 * @notice Additional tests for variable close factor functionality
 */
contract LendingPoolVariableCloseFactorTest is Test {
    LendingPool public pool;
    MockERC20 public usdc;
    MockPriceOracle public oracle;
    
    address public owner = address(this);
    address public user1 = address(0x1);
    address public liquidator = address(0x2);
    
    uint256 constant INITIAL_BALANCE = 100_000e6;
    
    function setUp() public {
        // Deploy
        oracle = new MockPriceOracle();
        pool = new LendingPool(address(oracle));
        usdc = new MockERC20("USD Coin", "USDC", 6);
        
        // Configure USDC
        pool.initializeAsset(
            address(usdc),
            0.80e18,  // LTV: 80%
            0.85e18,  // LT: 85%
            1.05e18,  // Bonus: 5%
            0.10e18,  // Reserve: 10%
            1         // E-Mode: Stablecoins
        );
        
        oracle.setAssetPrice(address(usdc), 1e8);
        
        // Fund users
        usdc.mint(user1, INITIAL_BALANCE);
        usdc.mint(liquidator, INITIAL_BALANCE);
    }
    
    // ============ Variable Close Factor Tests ============
    
    function testCloseFactorCritical() public {
        assertEq(pool.getCloseFactor(0.90e27), 10000, "Should be 100% for HF=0.9");
        assertEq(pool.getCloseFactor(0.94e27), 10000, "Should be 100% for HF=0.94");
    }
    
    function testCloseFactorDanger() public {
        assertEq(pool.getCloseFactor(0.95e27), 7500, "Should be 75% for HF=0.95");
        assertEq(pool.getCloseFactor(0.96e27), 7500, "Should be 75% for HF=0.96");
        assertEq(pool.getCloseFactor(0.97e27), 7500, "Should be 75% for HF=0.97");
    }
    
    function testCloseFactorWarning() public {
        assertEq(pool.getCloseFactor(0.98e27), 5000, "Should be 50% for HF=0.98");
        assertEq(pool.getCloseFactor(0.99e27), 5000, "Should be 50% for HF=0.99");
    }
    
    function testCloseFactorBoundaries() public {
        assertEq(pool.getCloseFactor(0.9499e27), 10000, "Just below 0.95");
        assertEq(pool.getCloseFactor(0.95e27), 7500, "At 0.95");
        assertEq(pool.getCloseFactor(0.9799e27), 7500, "Just below 0.98");
        assertEq(pool.getCloseFactor(0.98e27), 5000, "At 0.98");
    }
    
    // ============ Health Factor Tests ============
    
    function testHealthFactorNoDebt() public {
        vm.startPrank(user1);
        usdc.approve(address(pool), 10_000e6);
        pool.supply(address(usdc), 10_000e6, user1);
        vm.stopPrank();
        
        assertEq(pool.calculateUserHealthFactor(user1), type(uint256).max);
    }
    
    function testHealthFactorWithDebt() public {
        vm.startPrank(user1);
        usdc.approve(address(pool), 10_000e6);
        pool.supply(address(usdc), 10_000e6, user1);
        pool.borrow(address(usdc), 5_000e6, user1);
        vm.stopPrank();
        
        // HF = (10000 × 0.85) / 5000 = 1.7
        assertEq(pool.calculateUserHealthFactor(user1), 1.7e27);
    }
    
    function testHealthFactorEMode() public {
        vm.startPrank(user1);
        usdc.approve(address(pool), 10_000e6);
        pool.supply(address(usdc), 10_000e6, user1);
        pool.setUserEMode(user1, 1); // Enable stablecoin E-Mode
        pool.borrow(address(usdc), 5_000e6, user1);
        vm.stopPrank();
        
        // HF = (10000 × 0.98) / 5000 = 1.96
        assertEq(pool.calculateUserHealthFactor(user1), 1.96e27);
    }
}
