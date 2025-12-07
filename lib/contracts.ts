
export const ARC_TESTNET_CHAIN_ID = 5042002;

export const USDC_ADDRESS = "0x0000000000000000000000000000000000000000"; // Placeholder
export const ETH_ADDRESS = "0x0000000000000000000000000000000000000000"; // Placeholder (WETH?)
export const WBTC_ADDRESS = "0x0000000000000000000000000000000000000000"; // Placeholder
export const LENDING_POOL_ADDRESS = "0x0000000000000000000000000000000000000000"; // Placeholder

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
] as const ;
