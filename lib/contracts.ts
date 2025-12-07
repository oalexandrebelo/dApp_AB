
export const ARC_TESTNET_CHAIN_ID = 5042002;

export const BRIDGE_ADDRESS = "0xDb4186A4B68351713F57a9AA729f88c6Aa49400e"; // Deployed on Arc Testnet

export const USDC_ADDRESS = "0x3600000000000000000000000000000000000000"; // Arc Testnet Native USDC
export const EURC_ADDRESS = "0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a"; // Arc Testnet EURC
export const USYC_ADDRESS = "0xe9185F0c5F296Ed1797AaE4238D26CCaBEadb86C"; // Arc Testnet USYC
// ETH and WBTC are not supported on Arc Testnet

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
        constant: false,
        inputs: [
            { name: "_to", type: "address" },
            { name: "_value", type: "uint256" },
        ],
        name: "transfer",
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
