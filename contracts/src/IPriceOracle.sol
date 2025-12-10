// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IPriceOracle
 * @notice Generic price oracle interface
 */
interface IPriceOracle {
    function getAssetPrice(address asset) external view returns (uint256);
}
