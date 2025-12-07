// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/PriceOracle.sol";

contract OracleFuzzTest is Test {
    PriceOracle public oracle;
    address public btc;

    function setUp() public {
        oracle = new PriceOracle();
        btc = makeAddr("btc");
    }

    // Fuzz test: Ensure fallback logic works for random prices
    function testFuzz_OracleFallback(uint256 chainlinkPrice, uint256 pythPrice, uint256 twapPrice) public {
        // Bound prices to realistic non-zero values
        chainlinkPrice = bound(chainlinkPrice, 100, 1e10);
        pythPrice = bound(pythPrice, 100, 1e10);
        twapPrice = bound(twapPrice, 100, 1e10);

        // Scenario 1: All Healthy -> Should return Chainlink
        oracle.setChainlinkPrice(btc, chainlinkPrice, false); // Healthy
        oracle.setPythPrice(btc, pythPrice, false);
        oracle.setTwapPrice(btc, twapPrice);
        
        assertEq(oracle.getAssetPrice(btc), chainlinkPrice, "Should prioritize Chainlink");

        // Scenario 2: Chainlink Broken -> Should return Pyth
        oracle.setChainlinkPrice(btc, chainlinkPrice, true); // Broken
        
        assertEq(oracle.getAssetPrice(btc), pythPrice, "Should fallback to Pyth");

        // Scenario 3: Chainlink & Pyth Broken -> Should return TWAP
        oracle.setPythPrice(btc, pythPrice, true); // Broken
        
        assertEq(oracle.getAssetPrice(btc), twapPrice, "Should fallback to TWAP");
    }
}
