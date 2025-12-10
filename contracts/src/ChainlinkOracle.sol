// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IPriceOracle.sol";
import "./SimplePriceOracle.sol";

/**
 * @title ChainlinkOracle
 * @notice Production oracle with Chainlink integration and fallback
 * @dev Implements staleness checks and graceful degradation
 */

interface AggregatorV3Interface {
    function decimals() external view returns (uint8);
    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        );
}

contract ChainlinkOracle is IPriceOracle {
    address public owner;
    SimplePriceOracle public fallbackOracle;
    
    // Asset => Chainlink feed address
    mapping(address => address) public assetFeeds;
    
    // Staleness threshold (default: 1 hour)
    uint256 public constant STALENESS_THRESHOLD = 3600;
    
    event FeedUpdated(address indexed asset, address indexed feed);
    event FallbackUsed(address indexed asset, string reason);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }
    
    constructor(address _fallbackOracle) {
        owner = msg.sender;
        fallbackOracle = SimplePriceOracle(_fallbackOracle);
    }
    
    /**
     * @notice Set Chainlink feed for an asset
     * @param asset Asset address
     * @param feed Chainlink aggregator address
     */
    function setAssetFeed(address asset, address feed) external onlyOwner {
        require(feed != address(0), "Invalid feed");
        assetFeeds[asset] = feed;
        emit FeedUpdated(asset, feed);
    }
    
    /**
     * @notice Get asset price with Chainlink + fallback
     * @param asset Asset address
     * @return Price in USD with 8 decimals (1e8 = $1.00)
     */
    function getAssetPrice(address asset) external view returns (uint256) {
        address feed = assetFeeds[asset];
        
        // If no Chainlink feed, use fallback
        if (feed == address(0)) {
            return fallbackOracle.getAssetPrice(asset);
        }
        
        try this._getChainlinkPrice(feed) returns (uint256 price) {
            return price;
        } catch {
            // Chainlink failed, use fallback
            return fallbackOracle.getAssetPrice(asset);
        }
    }
    
    /**
     * @notice Internal function to get Chainlink price with staleness check
     * @dev Public for try/catch, but should be treated as internal
     */
    function _getChainlinkPrice(address feed) external view returns (uint256) {
        require(msg.sender == address(this), "Internal only");
        
        AggregatorV3Interface priceFeed = AggregatorV3Interface(feed);
        
        (
            uint80 roundId,
            int256 answer,
            ,
            uint256 updatedAt,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();
        
        // Validation checks
        require(answer > 0, "Invalid price");
        require(answeredInRound >= roundId, "Stale round");
        require(block.timestamp - updatedAt <= STALENESS_THRESHOLD, "Stale price");
        
        // Convert to 8 decimals
        uint8 feedDecimals = priceFeed.decimals();
        
        if (feedDecimals == 8) {
            return uint256(answer);
        } else if (feedDecimals < 8) {
            return uint256(answer) * (10 ** (8 - feedDecimals));
        } else {
            return uint256(answer) / (10 ** (feedDecimals - 8));
        }
    }
    
    /**
     * @notice Check if Chainlink feed is healthy
     * @param asset Asset address
     * @return isHealthy True if feed is working and fresh
     */
    function isFeedHealthy(address asset) external view returns (bool) {
        address feed = assetFeeds[asset];
        if (feed == address(0)) return false;
        
        try this._getChainlinkPrice(feed) returns (uint256) {
            return true;
        } catch {
            return false;
        }
    }
    
    /**
     * @notice Transfer ownership
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        owner = newOwner;
    }
}
