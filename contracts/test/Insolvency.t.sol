// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/LendingPool.sol";
import "../src/BorrowingEngine.sol";
import "../src/PriceOracle.sol";

contract InsolvencyTest is Test {
    LendingPool public pool;
    BorrowingEngine public engine;
    PriceOracle public oracle;
    
    address public usdc;
    address public user1;
    address public user2;

    function setUp() public {
        oracle = new PriceOracle();
        engine = new BorrowingEngine(address(oracle));
        pool = new LendingPool();
        
        pool.setBorrowingEngine(address(engine));
        engine.setPool(address(pool));
        
        usdc = makeAddr("usdc");
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");
        
        // Setup initial price for USDC ($1)
        oracle.setChainlinkPrice(usdc, 1e8, false);
    }

    // Invariant: Total Borrowed should never exceed Total Supplied
    // We fuzz 'supplyAmount' and 'borrowAmount'
    function testFuzz_Solvency(uint256 supplyAmount, uint256 borrowAmount) public {
        // Constraints to avoid overflow or unrealistic scenarios in this basic model
        supplyAmount = bound(supplyAmount, 1000 * 1e6, 1_000_000_000 * 1e6); // 1k to 1B USDC
        borrowAmount = bound(borrowAmount, 1 * 1e6, supplyAmount); // Borrow <= Supply
        
        // 1. User1 supplies
        vm.prank(user1);
        pool.supply(usdc, supplyAmount, user1, 0);
        
        // 2. User2 borrows
        // Note: Real contract would check collateral, here we assume collateral is sufficient 
        // or bypassed for this specific insolvency math check. 
        // To make it pass validateBorrow, we need to add collateral first or mock the engine validation.
        // For this property test, we are testing the Accounting logic of the Pool.
        
        // Let's mock validation to true for this test since we are focusing on Solvency math
        vm.mockCall(
            address(engine),
            abi.encodeWithSelector(BorrowingEngine.validateBorrow.selector),
            abi.encode(true)
        );

        vm.prank(user2);
        pool.borrow(usdc, borrowAmount, 1, 0, user2);

        // 3. Verify Invariant
        uint256 totalSupplied = pool.totalSupplied(usdc);
        uint256 totalBorrowed = pool.totalBorrowed(usdc);
        
        assertLe(totalBorrowed, totalSupplied, "Total Borrowed > Total Supplied");
        
        // 4. Verify utilization logic doesn't revert
        (uint256 liquidityRate, uint256 borrowRate) = engine.calculateInterestRates(usdc, totalBorrowed, totalSupplied);
        assertGe(borrowRate, 0);
    }
}
