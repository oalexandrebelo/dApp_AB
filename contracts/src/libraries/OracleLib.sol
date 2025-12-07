// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title OracleLib
 * @notice Library for checking Chainlink Oracle data validity and staleness.
 */
library OracleLib {
    error OraclePriceStale(address asset, uint256 updatedAt, uint256 heartbeat);
    error OraclePriceNegative(address asset, int256 price);

    uint256 public constant TIMEOUT = 3 hours; // Standard Heartbeat

    /**
     * @notice Validates the price data from a Chainlink Aggregator.
     * @param price The price returned by the oracle.
     * @param updatedAt The timestamp of the last update.
     * @param asset The asset address for error reporting.
     */
    function validatePrice(int256 price, uint256 updatedAt, address asset) internal view {
        // 1. Check for negative price
        if (price <= 0) {
            revert OraclePriceNegative(asset, price);
        }

        // 2. Check for staleness (Heartbeat)
        uint256 secondsSince = block.timestamp - updatedAt;
        if (secondsSince > TIMEOUT) {
            revert OraclePriceStale(asset, updatedAt, TIMEOUT);
        }
    }

    /**
     * @notice Checks the L2 Sequencer Uptime Feed.
     * @dev To be implemented with Chainlink L2 Sequencer Uptime Feed interface.
     * For now, this is a placeholder that always returns true (Healthy).
     */
    function checkSequencerUptime(address sequencerFeed) internal view {
        // Real implementation would call:
        // (, int256 answer, uint256 startedAt, ,) = AggregatorV3Interface(sequencerFeed).latestRoundData();
        // require(answer == 0, "Sequencer Down");
    }
}
