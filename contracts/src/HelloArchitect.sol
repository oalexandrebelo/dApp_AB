// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract HelloArchitect {
    string public greeting = "Hello, Arc Network!";

    function setGreeting(string memory _greeting) public {
        greeting = _greeting;
    }

    function getGreeting() public view returns (string memory) {
        return greeting;
    }
}
