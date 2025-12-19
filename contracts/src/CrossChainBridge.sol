// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CrossChainBridge
 * @notice ⚠️ MOCK CONTRACT - NOT FOR PRODUCTION USE ⚠️
 * 
 * This is a simplified mock bridge for LOCAL TESTING ONLY.
 * The production frontend uses Circle CCTP directly via SDK (lib/cctp/bridge.ts).
 * 
 * DO NOT DEPLOY THIS CONTRACT TO MAINNET.
 * DO NOT USE THIS CONTRACT WITH REAL FUNDS.
 * 
 * For production cross-chain transfers, use:
 * - Circle CCTP V2 (TokenMessenger + MessageTransmitter)
 * - Frontend implementation in lib/cctp/bridge.ts
 * 
 * This contract lacks:
 * - Authentication (anyone can call receiveMessage)
 * - Integration with actual CCTP contracts
 * - Security validations
 * - Proper access control
 */
contract CrossChainBridge {
    address public lendingPool;
    
    event MessageSent(uint256 destinationChainId, bytes payload);
    event MessageReceived(uint256 sourceChainId, bytes payload);

    constructor(address _lendingPool) {
        lendingPool = _lendingPool;
    }

    /**
     * @notice ⚠️ MOCK FUNCTION - DO NOT USE IN PRODUCTION
     */
    function sendCrossChainDeposit(
        uint256 destinationChainId,
        address asset,
        uint256 amount,
        address recipient
    ) external {
        revert("MOCK: Use Circle CCTP via frontend (lib/cctp/bridge.ts)");
    }

    /**
     * @notice ⚠️ MOCK FUNCTION - DO NOT USE IN PRODUCTION
     */
    function receiveMessage(uint256 sourceChainId, bytes calldata payload) external {
        revert("MOCK: Use Circle CCTP via frontend (lib/cctp/bridge.ts)");
    }
}
