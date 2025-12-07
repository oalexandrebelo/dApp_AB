// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/LendingPool.sol";

contract LendingPoolTest is Test {
    LendingPool public pool;
    address public user1;
    address public usdc;

    function setUp() public {
        pool = new LendingPool();
        user1 = makeAddr("user1");
        // In a real test, usdc would be a deployed mock ERC20
        usdc = makeAddr("usdc");
    }

    function testSupply() public {
        vm.startPrank(user1);
        
        uint256 amount = 1000 * 1e6;
        
        // Since contract mocks ERC20 transfer, we don't need real approval logic for this unit test 
        // unless we expand the contract to call SafeTransferFrom.
        // For now, LendingPool.sol just updates storage.
        
        pool.supply(usdc, amount, user1, 0);
        
        assertEq(pool.getUserBalance(user1, usdc), amount);
        assertEq(pool.totalSupplied(usdc), amount);
        
        vm.stopPrank();
    }
}
