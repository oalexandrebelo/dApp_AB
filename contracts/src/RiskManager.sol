// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title RiskManager
 * @notice Manages risk parameters, circuit breakers, and rate limits.
 */
contract RiskManager {
    address public owner;
    address public guardian; // Emergency role

    // Circuit Breakers
    mapping(address => bool) public isPaused; // operations paused per asset
    bool public protocolPaused; // global pause

    // Supply Caps (0 = unlimited)
    mapping(address => uint256) public supplyCaps;

    // Events
    event ProtocolPaused(address indexed guardian);
    event ProtocolUnpaused(address indexed owner);
    event AssetPaused(address indexed asset, address indexed guardian);
    event AssetUnpaused(address indexed asset, address indexed owner);
    event SupplyCapUpdated(address indexed asset, uint256 newCap);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only Owner");
        _;
    }

    modifier onlyGuardianOrOwner() {
        require(msg.sender == guardian || msg.sender == owner, "Only Guardian or Owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        guardian = msg.sender; // Default guardian is deployer
    }

    function setGuardian(address _guardian) external onlyOwner {
        guardian = _guardian;
    }

    // --- Circuit Breakers ---

    function pauseProtocol() external onlyGuardianOrOwner {
        protocolPaused = true;
        emit ProtocolPaused(msg.sender);
    }

    function unpauseProtocol() external onlyOwner {
        protocolPaused = false;
        emit ProtocolUnpaused(msg.sender);
    }

    function pauseAsset(address asset) external onlyGuardianOrOwner {
        isPaused[asset] = true;
        emit AssetPaused(asset, msg.sender);
    }

    function unpauseAsset(address asset) external onlyOwner {
        isPaused[asset] = false;
        emit AssetUnpaused(asset, msg.sender);
    }

    // --- Risk Parameters ---

    function setSupplyCap(address asset, uint256 cap) external onlyOwner {
        supplyCaps[asset] = cap;
        emit SupplyCapUpdated(asset, cap);
    }

    // --- Validation Hooks (called by LendingPool) ---

    function validateSupply(address asset, uint256 newTotalSupply) external view {
        require(!protocolPaused, "Protocol Paused");
        require(!isPaused[asset], "Asset Paused");
        
        uint256 cap = supplyCaps[asset];
        if (cap > 0) {
            require(newTotalSupply <= cap, "Supply Cap Exceeded");
        }
    }

    function validateBorrow(address asset) external view {
        require(!protocolPaused, "Protocol Paused");
        require(!isPaused[asset], "Asset Paused");
    }

    function validateWithdraw(address asset) external view {
        require(!protocolPaused, "Protocol Paused");
        // Note: We might allow withdrawals even if asset is paused for new supply/borrow,
        // but for strict safety, we pause everything if compromised.
        // A refined implementation would separate PauseMint vs PauseRedeem.
        require(!isPaused[asset], "Asset Paused");
    }
}
