// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/CrossChainBridge.sol";

contract DeployBridgeOnly is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Mock LendingPool address (e.g., Deployer address or zero address)
        // Since we are testing the Bridge UI mostly, this is fine.
        address mockPool = address(0x123); 

        CrossChainBridge bridge = new CrossChainBridge(mockPool);

        vm.stopBroadcast();
    }
}
