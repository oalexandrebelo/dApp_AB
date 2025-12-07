
export const ARC_TESTNET_CHAIN_ID = 5042002;

export const BRIDGE_ADDRESS = "0x1234567890123456789012345678901234567890"; // Testnet Placeholder - REPLACE WITH REAL DEPLOYMENT

export const USDC_ADDRESS = "0x0000000000000000000000000000000000000000"; // Placeholder
export const ETH_ADDRESS = "0x0000000000000000000000000000000000000000"; // Placeholder (WETH?)

export const ERC20_ABI = [
    {
        constant: true,
        inputs: [{ name: "_owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "balance", type: "uint256" }],
        type: "function",
    },
    {
        constant: false,
        inputs: [
            { name: "_spender", type: "address" },
            { name: "_value", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ name: "", type: "bool" }],
        type: "function",
    },
    {
        constant: true,
        inputs: [
            { name: "_owner", type: "address" },
            { name: "_spender", type: "address" },
        ],
        name: "allowance",
        outputs: [{ name: "", type: "uint256" }],
        type: "function",
    },
] as const;

export const WBTC_ADDRESS = "0x0000000000000000000000000000000000000000"; // Placeholder
export const LENDING_POOL_ADDRESS = "0x0000000000000000000000000000000000000000"; // Placeholder

export const LENDING_POOL_ABI = [
    {
        inputs: [
            { name: "asset", type: "address" },
            { name: "amount", type: "uint256" },
            { name: "onBehalfOf", type: "address" },
            { name: "referralCode", type: "uint16" },
        ],
        name: "supply",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { name: "asset", type: "address" },
            { name: "amount", type: "uint256" },
            { name: "interestRateMode", type: "uint256" },
            { name: "referralCode", type: "uint16" },
            { name: "onBehalfOf", type: "address" },
        ],
        name: "borrow",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
] as const;

export const CROSS_CHAIN_BRIDGE_ABI = [
    {
        anonymous: false,
        inputs: [
            { indexed: false, name: "destinationChainId", type: "uint256" },
            { indexed: false, name: "payload", type: "bytes" },
        ],
        name: "MessageSent",
        type: "event",
    },
    {
        inputs: [
            { name: "destinationChainId", type: "uint256" },
            { name: "asset", type: "address" },
            { name: "amount", type: "uint256" },
            { name: "recipient", type: "address" },
        ],
        name: "sendCrossChainDeposit",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
] as const;
