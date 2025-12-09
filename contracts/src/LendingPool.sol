// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./BorrowingEngine.sol";
import "./RiskManager.sol";
import "./IERC20.sol";

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



    // Ownership & Revenue
    address public owner;
    address public treasury;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only Owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        treasury = msg.sender; // Default treasury is owner
    }

    function setTreasury(address _treasury) external onlyOwner {
        treasury = _treasury;
    }

    // Emergency/Fee Withdrawal
    function rescueFunds(address asset, uint256 amount) external onlyOwner {
        IERC20(asset).transfer(owner, amount);
    }

    function setBorrowingEngine(address _engine) external onlyOwner {
        borrowingEngine = BorrowingEngine(_engine);
    }
    
    function setRiskManager(address _riskManager) external onlyOwner {
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
        
        // REAL LOGIC: Transfer tokens from user to pool
        bool success = IERC20(asset).transferFrom(msg.sender, address(this), amount);
        require(success, "Transfer failed");
        
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
        
        _userSupplied[msg.sender][asset] -= amount;
        totalSupplied[asset] -= amount;

        // REAL LOGIC: Transfer tokens from pool to user
        bool success = IERC20(asset).transfer(to, amount);
        require(success, "Transfer failed");
        
        emit Withdraw(msg.sender, asset, amount);
    }

    // --- Borrow Logic ---

    function borrow(address asset, uint256 amount, uint256 interestRateMode, uint16 referralCode, address onBehalfOf) external {
        // Risk Check: Paused?
        if (address(riskManager) != address(0)) {
            riskManager.validateBorrow(asset);
        }

        // Check Pool Liquidity
        uint256 poolBalance = IERC20(asset).balanceOf(address(this));
        require(poolBalance >= amount, "Insufficient Pool Liquidity: Supply assets first!");

        _userBorrowed[onBehalfOf][asset] += amount;
        totalBorrowed[asset] += amount;

        // REAL LOGIC: Transfer tokens from pool to borrower
        bool success = IERC20(asset).transfer(onBehalfOf, amount);
        require(success, "Transfer failed");

        emit Borrow(onBehalfOf, asset, amount);
    }

    function repay(address asset, uint256 amount, address onBehalfOf) external {
        // REAL LOGIC: Transfer tokens from payer to pool
        bool success = IERC20(asset).transferFrom(msg.sender, address(this), amount);
        require(success, "Transfer failed");
        
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
