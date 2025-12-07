// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PriceOracle
 * @notice Simplified Price Oracle for ArcLend. 
 * @dev In production, this would aggregate Chainlink and Pyth feeds.
 */
contract PriceOracle {
    // Asset => Price in USD (8 decimals)
    mapping(address => uint256) private prices;
    address public owner;

    event PriceUpdated(address indexed asset, uint256 price);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    // Mock Oracle Sources (for testing fallback logic)
    mapping(address => uint256) public chainlinkPrices;
    mapping(address => bool) public chainlinkBroken;
    
    mapping(address => uint256) public pythPrices;
    mapping(address => bool) public pythBroken;
    
    mapping(address => uint256) public twapPrices; // Internal DEX TWAP (Fallback)

    // ... existing constructor ...

    function setChainlinkPrice(address asset, uint256 price, bool isBroken) external onlyOwner {
        chainlinkPrices[asset] = price;
        chainlinkBroken[asset] = isBroken;
    }

    function setPythPrice(address asset, uint256 price, bool isBroken) external onlyOwner {
        pythPrices[asset] = price;
        pythBroken[asset] = isBroken;
    }

    function setTwapPrice(address asset, uint256 price) external onlyOwner {
        twapPrices[asset] = price;
    }

    /**
     * @notice Gets the price of an asset with robust fallback logic.
     * Strategy: Chainlink -> Pyth -> TWAP
     * @param asset The asset address.
     * @return The price in USD (8 decimals).
     */
    function getAssetPrice(address asset) external view returns (uint256) {
        // 1. Primary: Chainlink
        if (!chainlinkBroken[asset] && chainlinkPrices[asset] > 0) {
            return chainlinkPrices[asset];
        }

        // 2. Secondary: Pyth
        if (!pythBroken[asset] && pythPrices[asset] > 0) {
            return pythPrices[asset];
        }

        // 3. Fallback: Internal TWAP
        if (twapPrices[asset] > 0) {
            return twapPrices[asset];
        }
        
        // 4. Ultimate Fallback for simple tests
        if (prices[asset] > 0) {
            return prices[asset];
        }

        return 1000 * 10**8; // Default unsafe fallback
    }
}
