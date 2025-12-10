// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SimplePriceOracle
 * @notice Simple price oracle for MVP - returns 1:1 pricing for stablecoins
 * @dev In production, replace with Chainlink or Pyth oracle
 */
contract SimplePriceOracle {
    address public owner;
    
    // Asset address => Price in USD (8 decimals, e.g., 1e8 = $1.00)
    mapping(address => uint256) private prices;
    
    event PriceUpdated(address indexed asset, uint256 price);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @notice Get asset price in USD
     * @param asset Address of the asset
     * @return Price in USD with 8 decimals (1e8 = $1.00)
     */
    function getAssetPrice(address asset) external view returns (uint256) {
        uint256 price = prices[asset];
        require(price > 0, "Price not set");
        return price;
    }
    
    /**
     * @notice Set asset price (owner only)
     * @param asset Address of the asset
     * @param price Price in USD with 8 decimals
     */
    function setAssetPrice(address asset, uint256 price) external onlyOwner {
        require(price > 0, "Invalid price");
        prices[asset] = price;
        emit PriceUpdated(asset, price);
    }
    
    /**
     * @notice Set multiple asset prices at once
     * @param assets Array of asset addresses
     * @param _prices Array of prices (must match assets length)
     */
    function setAssetPrices(address[] calldata assets, uint256[] calldata _prices) external onlyOwner {
        require(assets.length == _prices.length, "Length mismatch");
        for (uint256 i = 0; i < assets.length; i++) {
            require(_prices[i] > 0, "Invalid price");
            prices[assets[i]] = _prices[i];
            emit PriceUpdated(assets[i], _prices[i]);
        }
    }
    
    /**
     * @notice Transfer ownership
     * @param newOwner New owner address
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        owner = newOwner;
    }
}
