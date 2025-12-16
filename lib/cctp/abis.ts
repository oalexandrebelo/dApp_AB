/**
 * Circle CCTP Contract ABIs
 * 
 * These ABIs define the interfaces for Circle's Cross-Chain Transfer Protocol contracts
 * Note: ERC20_ABI is imported from lib/contracts.ts
 */

// TokenMessenger ABI (for depositForBurn)
export const TOKEN_MESSENGER_ABI = [
    {
        "inputs": [
            { "internalType": "uint256", "name": "amount", "type": "uint256" },
            { "internalType": "uint32", "name": "destinationDomain", "type": "uint32" },
            { "internalType": "bytes32", "name": "mintRecipient", "type": "bytes32" },
            { "internalType": "address", "name": "burnToken", "type": "address" }
        ],
        "name": "depositForBurn",
        "outputs": [{ "internalType": "uint64", "name": "_nonce", "type": "uint64" }],
        "stateMutability": "nonpayable",
        "type": "function"
    }
] as const;

// MessageTransmitter ABI (for receiveMessage)
export const MESSAGE_TRANSMITTER_ABI = [
    {
        "inputs": [
            { "internalType": "bytes", "name": "message", "type": "bytes" },
            { "internalType": "bytes", "name": "attestation", "type": "bytes" }
        ],
        "name": "receiveMessage",
        "outputs": [{ "internalType": "bool", "name": "success", "type": "bool" }],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "bytes32", "name": "", "type": "bytes32" }
        ],
        "name": "usedNonces",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    }
] as const;

