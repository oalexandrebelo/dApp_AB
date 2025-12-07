// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Since we don't have the forge-std lib installed in the environment, we'll mock the Script interface 
// or write a simpler standard version. Assuming the user will have foundry, we should use standard imports.
// If compilation fails later due to missing libs, user needs to `forge install`.

import "forge-std/Script.sol";
import "../src/LendingPool.sol";
import "../src/BorrowingEngine.sol";
import "../src/PriceOracle.sol";
import "../src/CrossChainBridge.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        PriceOracle oracle = new PriceOracle();
        BorrowingEngine engine = new BorrowingEngine(address(oracle));
        LendingPool pool = new LendingPool();
        CrossChainBridge bridge = new CrossChainBridge(address(pool));

        pool.setBorrowingEngine(address(engine));
        engine.setPool(address(pool));

        vm.stopBroadcast();
    }
}
