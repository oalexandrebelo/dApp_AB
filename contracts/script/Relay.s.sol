// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/CrossChainBridge.sol";

contract RelayScript is Script {
    function run() external {
        // 1. Get Private Key
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        // 2. Setup Addresses (Arc Testnet)
        address bridgeAddress = 0x1234567890123456789012345678901234567890; 
        
        // Arc Testnet USDC (Native/System Contract)
        address asset = 0x3600000000000000000000000000000000000000;
        address recipient = deployer; 
        string memory messageType = "DEPOSIT";

        vm.startBroadcast(deployerPrivateKey);

        // Test 1: 0.33 USDC (6 decimals)
        uint256 amount1 = 330000; 
        bytes memory payload1 = abi.encode(recipient, asset, amount1, messageType);
        CrossChainBridge(bridgeAddress).receiveMessage(1, payload1);

        // Test 2: 0.44 USDC (6 decimals)
        uint256 amount2 = 440000;
        bytes memory payload2 = abi.encode(recipient, asset, amount2, messageType);
        CrossChainBridge(bridgeAddress).receiveMessage(1, payload2);

        vm.stopBroadcast();
    }
}
