// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CrossChainBridge
 * @notice Simplified Bridge for ArcLend using CCTP concepts.
 */
contract CrossChainBridge {
    address public lendingPool;
    
    event MessageSent(uint256 destinationChainId, bytes payload);
    event MessageReceived(uint256 sourceChainId, bytes payload);

    constructor(address _lendingPool) {
        lendingPool = _lendingPool;
    }

    /**
     * @notice Sends a deposit message to another chain.
     * @param destinationChainId The target chain ID.
     * @param asset The asset address.
     * @param amount The amount to bridge.
     */
    function sendCrossChainDeposit(uint256 destinationChainId, address asset, uint256 amount) external {
        // 1. Lock/Burn assets on this chain
        // 2. Emit event for CCTP Relayer
        bytes memory payload = abi.encode(msg.sender, asset, amount, "DEPOSIT");
        emit MessageSent(destinationChainId, payload);
    }

    /**
     * @notice Receives a message from another chain (Simulated).
     * @dev In prod, this would be authenticated by the CCTP MessageAttester.
     */
    function receiveMessage(uint256 sourceChainId, bytes calldata payload) external {
        (address user, address asset, uint256 amount, string memory stringType) = abi.decode(payload, (address, address, uint256, string));
        
        // 1. Mint/Unlock assets
        // 2. Call LendingPool.supply() on behalf of user
        
        emit MessageReceived(sourceChainId, payload);
    }
}
