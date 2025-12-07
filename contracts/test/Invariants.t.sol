// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "forge-std/StdInvariant.sol";
import "../src/LendingPool.sol";
import "../src/BorrowingEngine.sol";
import "../src/PriceOracle.sol";
import "../src/RiskManager.sol";

// Handler contract to constrain inputs to reasonable values
contract Handler is Test {
    LendingPool pool;
    address usdc;
    address user1;
    address user2;

    constructor(LendingPool _pool, address _usdc) {
        pool = _pool;
        usdc = _usdc;
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");
    }

    function supply(uint256 amount) public {
        amount = bound(amount, 1, 1_000_000 * 1e6);
        vm.prank(user1);
        pool.supply(usdc, amount, user1, 0);
    }
    
    function withdraw(uint256 amount) public {
        amount = bound(amount, 0, 1_000_000 * 1e6);
        
        // Only try withdraw if user has balance (to avoid useless reverts in fuzzing)
        // In real handler we track ghost variables, but here we try/catch or let revert 
        // to test robust handling.
        vm.prank(user1);
        try pool.withdraw(usdc, amount, user1) {} catch {}
    }
}

contract InvariantSecurityTest is StdInvariant, Test {
    LendingPool public pool;
    BorrowingEngine public engine;
    PriceOracle public oracle;
    RiskManager public riskManager;
    Handler public handler;
    address public usdc;

    function setUp() public {
        oracle = new PriceOracle();
        engine = new BorrowingEngine(address(oracle));
        riskManager = new RiskManager();
        pool = new LendingPool();
        
        pool.setBorrowingEngine(address(engine));
        pool.setRiskManager(address(riskManager));
        engine.setPool(address(pool));
        
        usdc = makeAddr("usdc");
        oracle.setChainlinkPrice(usdc, 1e8, false);

        handler = new Handler(pool, usdc);
        
        // Define specific targets for invariant fuzzing
        targetContract(address(handler)); 
        // We target the Handler which proxies calls to Pool, 
        // preventing random meaningless calls that waste fuzz cycles.
    }

    // INVARIANT 1: Solvency
    // Total Borrowed + Cash (Liquidity) >= Total Supplied
    // (Ignoring interest accrual for this basic check, typically Supply = Borrow + Cash)
    // Actually: Total Supplied should MATCH Borrowed + Available Liquidity
    function invariant_solvency() public view {
        uint256 supplied = pool.totalSupplied(usdc);
        uint256 borrowed = pool.totalBorrowed(usdc);
        
        // For this simplified MVP, we don't have real token balances, 
        // so we can't check 'Cash' balance of ERC20.
        // But the internal accounting must balance: 
        // If we implement 'Cash' tracking later, the formula is: Supplied <= Cash + Borrowed
        
        // For now, let's verify that Borrowed isn't somehow greater than Supplied (impossible in basic logic but good to fuzz)
        assertLe(borrowed, supplied, "Solvency Broken: Borrowed > Supplied");
    }

    // INVARIANT 2: Protocol Paused State
    // If protocol is paused, no State Changes should occur (Supply/Borrow)
    // This is hard to test with stateful fuzzing purely via invariants 
    // unless we have 'ghost variables' tracking calls. 
    // Instead we test: If RiskManager.paused(), verify no new supply events (complex for this setup).
}
