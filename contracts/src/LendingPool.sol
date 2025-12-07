// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./BorrowingEngine.sol";
import "./RiskManager.sol";

/**
 * @title LendingPool
 * @notice Main interaction point for the ArcLend Protocol.
 */
contract LendingPool {
    // ... (rest of contract)
    BorrowingEngine public borrowingEngine;
    RiskManager public riskManager; // New Dependency
    
    // User -> Asset -> Amount (Scaled/Shares)
    mapping(address => mapping(address => uint256)) private _userSupplied;
    mapping(address => mapping(address => uint256)) private _userBorrowed;
    
    // Total amounts
    mapping(address => uint256) public totalSupplied;
    mapping(address => uint256) public totalBorrowed;

    address[] public supportedAssets;

    event Supply(address indexed user, address indexed asset, uint256 amount);
    event Withdraw(address indexed user, address indexed asset, uint256 amount);
    event Borrow(address indexed user, address indexed asset, uint256 amount);
    event Repay(address indexed user, address indexed asset, uint256 amount);

    constructor() {}

    function setBorrowingEngine(address _engine) external {
        borrowingEngine = BorrowingEngine(_engine);
    }
    
    function setRiskManager(address _riskManager) external {
        riskManager = RiskManager(_riskManager);
    }

    function addAsset(address asset) external {
        supportedAssets.push(asset);
    }

    // --- Supply Logic ---

    function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode) external {
        require(amount > 0, "Amount must be > 0");
        
        // Risk Check: Paused? Cap Exceeded?
        if (address(riskManager) != address(0)) {
            riskManager.validateSupply(asset, totalSupplied[asset] + amount);
        }
        
        // In prod: IERC20(asset).safeTransferFrom(msg.sender, address(this), amount);
        
        _userSupplied[onBehalfOf][asset] += amount;
        totalSupplied[asset] += amount;
        
        emit Supply(onBehalfOf, asset, amount);
    }

    function withdraw(address asset, uint256 amount, address to) external {
        require(_userSupplied[msg.sender][asset] >= amount, "Insufficient balance");
        
        // Risk Check: Paused? 
        if (address(riskManager) != address(0)) {
            riskManager.validateWithdraw(asset);
        }
        
        // Check if withdraw leaves user with HF < 1? (If they have borrows)
        // borrowingEngine.validateWithdraw(...)

        _userSupplied[msg.sender][asset] -= amount;
        totalSupplied[asset] -= amount;

        // In prod: IERC20(asset).safeTransfer(to, amount);
        
        emit Withdraw(msg.sender, asset, amount);
    }

    // --- Borrow Logic ---

    function borrow(address asset, uint256 amount, uint256 interestRateMode, uint16 referralCode, address onBehalfOf) external {
        // Risk Check: Paused?
        if (address(riskManager) != address(0)) {
            riskManager.validateBorrow(asset);
        }

        // Validation via Engine
        // require(borrowingEngine.validateBorrow(onBehalfOf, asset, amount), "Borrow validation failed: check collateral");

        _userBorrowed[onBehalfOf][asset] += amount;
        totalBorrowed[asset] += amount;

        // In prod: IERC20(asset).safeTransfer(onBehalfOf, amount);

        emit Borrow(onBehalfOf, asset, amount);
    }

    function repay(address asset, uint256 amount, address onBehalfOf) external {
        // In prod: IERC20(asset).safeTransferFrom(msg.sender, address(this), amount);
        
        uint256 currentDebt = _userBorrowed[onBehalfOf][asset];
        uint256 repayAmount = amount > currentDebt ? currentDebt : amount;

        _userBorrowed[onBehalfOf][asset] -= repayAmount;
        totalBorrowed[asset] -= repayAmount;

        emit Repay(onBehalfOf, asset, repayAmount);
    }

    // --- View Functions ---

    function getUserBalance(address user, address asset) external view returns (uint256) {
        return _userSupplied[user][asset];
    }

    function getUserDebt(address user, address asset) external view returns (uint256) {
        return _userBorrowed[user][asset];
    }
}
