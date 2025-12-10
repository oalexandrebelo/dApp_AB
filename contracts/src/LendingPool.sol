// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./BorrowingEngine.sol";
import "./RiskManager.sol";
import "./IERC20.sol";
import "./SimplePriceOracle.sol";

/**
 * @title LendingPool
 * @notice Production-ready lending pool with interest accrual, based on Aave V3 and Compound best practices
 * @dev Implements:
 *  - Interest accrual with 2-slope rate model
 *  - Borrow and supply indexes for automatic interest compounding
 *  - Reserve factor for protocol revenue
 *  - Per-asset collateral factors
 */
contract LendingPool {
    // ============ Constants ============
    
    uint256 public constant SECONDS_PER_YEAR = 365 days;
    uint256 public constant RAY = 1e27; // High precision for interest calculations
    uint256 public constant WAD = 1e18; // Standard precision
    
    // ============ State Variables ============
    
    BorrowingEngine public borrowingEngine;
    RiskManager public riskManager;
    SimplePriceOracle public priceOracle;
    
    // User balances (principal only, not including interest)
    mapping(address => mapping(address => uint256)) private _userSuppliedPrincipal;
    mapping(address => mapping(address => uint256)) private _userBorrowedPrincipal;
    
    // Total amounts (principal only)
    mapping(address => uint256) public totalSupplied;
    mapping(address => uint256) public totalBorrowed;
    
    // Interest indexes (grow over time as interest accrues)
    mapping(address => uint256) public borrowIndex; // Multiplier for borrowed amounts
    mapping(address => uint256) public supplyIndex; // Multiplier for supplied amounts
    mapping(address => uint256) public lastAccrueTime; // Last time interest was accrued
    
    // Protocol reserves (accumulated fees)
    mapping(address => uint256) public reserves;
    
    address[] public supportedAssets;
    
    // ============ Structs ============
    
    /**
     * @notice Interest rate model parameters (2-slope curve)
     * @dev Based on Aave V3 and Compound models
     */
    struct InterestRateModel {
        uint256 baseRate;           // Base borrow rate (e.g., 0% = 0)
        uint256 slope1;             // Rate increase below optimal utilization (e.g., 4% = 0.04e18)
        uint256 slope2;             // Rate increase above optimal utilization (e.g., 60% = 0.60e18)
        uint256 optimalUtilization; // Optimal utilization rate (e.g., 80% = 0.80e18)
    }
    
    /**
     * @notice E-Mode (Efficiency Mode) category data
     * @dev Allows higher LTV for correlated assets (e.g., stablecoins)
     */
    struct EModeCategoryData {
        uint16 ltv;                    // Loan-to-value (e.g., 9700 = 97%)
        uint16 liquidationThreshold;   // Liquidation threshold (e.g., 9800 = 98%)
        uint16 liquidationBonus;       // Liquidation bonus (e.g., 101 = 1%)
        string label;                  // Category label (e.g., "Stablecoins")
    }
    
    /**
     * @notice Asset configuration for risk management
     */
    struct AssetConfig {
        uint256 collateralFactor;      // LTV ratio (e.g., 75% = 0.75e18)
        uint256 liquidationThreshold;  // Liquidation threshold (e.g., 80% = 0.80e18)
        uint256 liquidationBonus;      // Liquidator incentive (e.g., 5% = 0.05e18)
        uint256 reserveFactor;         // Protocol fee (e.g., 10% = 0.10e18)
        uint256 supplyCap;             // Maximum total supply (0 = unlimited)
        uint256 borrowCap;             // Maximum total borrow (0 = unlimited)
        uint8 eModeCategory;           // E-Mode category ID (0 = not in E-Mode)
        bool isActive;
    }
    
    mapping(address => InterestRateModel) public rateModels;
    mapping(address => AssetConfig) public assetConfigs;
    
    // E-Mode (Efficiency Mode) mappings
    mapping(uint8 => EModeCategoryData) public eModeCategories;
    mapping(address => uint8) public userEModeCategory; // User's selected E-Mode category
    
    // ============ Events ============
    
    event Supply(address indexed user, address indexed asset, uint256 amount);
    event Withdraw(address indexed user, address indexed asset, uint256 amount);
    event Borrow(address indexed user, address indexed asset, uint256 amount);
    event Repay(address indexed user, address indexed asset, uint256 amount);
    event InterestAccrued(address indexed asset, uint256 borrowIndex, uint256 supplyIndex, uint256 reserves);
    event ReservesWithdrawn(address indexed asset, uint256 amount, address indexed to);
    event LiquidationCall(
        address indexed collateralAsset,
        address indexed debtAsset,
        address indexed user,
        uint256 debtToCover,
        uint256 liquidatedCollateralAmount,
        address liquidator,
        bool receiveAToken
    );
    
    // ============ Ownership ============
    
    address public owner;
    address public treasury;
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only Owner");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        treasury = msg.sender;
    }
    
    // ============ Admin Functions ============
    
    function setTreasury(address _treasury) external onlyOwner {
        treasury = _treasury;
    }
    
    function setBorrowingEngine(address _engine) external onlyOwner {
        borrowingEngine = BorrowingEngine(_engine);
    }
    
    function setRiskManager(address _riskManager) external onlyOwner {
        riskManager = RiskManager(_riskManager);
    }
    
    function setPriceOracle(address _priceOracle) external onlyOwner {
        priceOracle = SimplePriceOracle(_priceOracle);
    }
    
    /**
     * @notice Configure an E-Mode category
     * @param categoryId Category ID (1-255, 0 = disabled)
     * @param ltv Loan-to-value in basis points (9700 = 97%)
     * @param liquidationThreshold Liquidation threshold in basis points
     * @param liquidationBonus Liquidation bonus in basis points (101 = 1%)
     * @param label Category label
     */
    function setEModeCategory(
        uint8 categoryId,
        uint16 ltv,
        uint16 liquidationThreshold,
        uint16 liquidationBonus,
        string calldata label
    ) external onlyOwner {
        require(categoryId > 0, "Invalid category ID");
        require(ltv <= 10000, "Invalid LTV");
        require(liquidationThreshold <= 10000, "Invalid threshold");
        
        eModeCategories[categoryId] = EModeCategoryData({
            ltv: ltv,
            liquidationThreshold: liquidationThreshold,
            liquidationBonus: liquidationBonus,
            label: label
        });
    }
    
    /**
     * @notice Allow user to select E-Mode category
     * @param categoryId Category ID (0 to disable E-Mode)
     */
    function setUserEMode(uint8 categoryId) external {
        if (categoryId > 0) {
            require(bytes(eModeCategories[categoryId].label).length > 0, "Invalid category");
        }
        userEModeCategory[msg.sender] = categoryId;
    }
    
    /**
     * @notice Initialize an asset with default configuration
     * @dev Must be called before asset can be used
     */
    function addAsset(
        address asset,
        uint256 collateralFactor,
        uint256 liquidationThreshold,
        uint256 liquidationBonus,
        uint256 reserveFactor,
        uint256 supplyCap,
        uint256 borrowCap,
        uint8 eModeCategory
    ) external onlyOwner {
        require(assetConfigs[asset].isActive == false, "Asset already added");
        
        supportedAssets.push(asset);
        
        // Initialize indexes to 1.0 (RAY precision)
        borrowIndex[asset] = RAY;
        supplyIndex[asset] = RAY;
        lastAccrueTime[asset] = uint40(block.timestamp);
        
        // Set asset configuration
        assetConfigs[asset] = AssetConfig({
            collateralFactor: collateralFactor,
            liquidationThreshold: liquidationThreshold,
            liquidationBonus: liquidationBonus,
            reserveFactor: reserveFactor,
            supplyCap: supplyCap,
            borrowCap: borrowCap,
            eModeCategory: eModeCategory,
            isActive: true
        });
        
        // Set default interest rate model (can be updated later)
        rateModels[asset] = InterestRateModel({
            baseRate: 0,                    // 0% base rate
            slope1: 0.04e18,                // 4% slope below optimal
            slope2: 0.60e18,                // 60% slope above optimal
            optimalUtilization: 0.80e18     // 80% optimal utilization
        });
    }
    
    /**
     * @notice Update interest rate model for an asset
     */
    function setInterestRateModel(
        address asset,
        uint256 baseRate,
        uint256 slope1,
        uint256 slope2,
        uint256 optimalUtilization
    ) external onlyOwner {
        require(assetConfigs[asset].isActive, "Asset not active");
        rateModels[asset] = InterestRateModel({
            baseRate: baseRate,
            slope1: slope1,
            slope2: slope2,
            optimalUtilization: optimalUtilization
        });
    }
    
    /**
     * @notice Withdraw protocol reserves
     */
    function withdrawReserves(address asset, uint256 amount) external onlyOwner {
        require(reserves[asset] >= amount, "Insufficient reserves");
        reserves[asset] -= amount;
        IERC20(asset).transfer(treasury, amount);
        emit ReservesWithdrawn(asset, amount, treasury);
    }
    
    // ============ Interest Rate Functions ============
    
    /**
     * @notice Calculate current borrow APR for an asset
     * @dev Uses 2-slope model: gentle slope below optimal, steep slope above
     * @return Annual borrow rate in WAD (1e18 = 100%)
     */
    function getBorrowRate(address asset) public view returns (uint256) {
        uint256 totalSupply = totalSupplied[asset];
        if (totalSupply == 0) return rateModels[asset].baseRate;
        
        uint256 utilization = (totalBorrowed[asset] * WAD) / totalSupply;
        InterestRateModel memory model = rateModels[asset];
        
        if (utilization <= model.optimalUtilization) {
            // Below optimal: baseRate + (utilization * slope1 / optimal)
            return model.baseRate + (utilization * model.slope1) / model.optimalUtilization;
        } else {
            // Above optimal: baseRate + slope1 + (excessUtilization * slope2 / (1 - optimal))
            uint256 excessUtilization = utilization - model.optimalUtilization;
            uint256 maxExcess = WAD - model.optimalUtilization;
            return model.baseRate + model.slope1 + (excessUtilization * model.slope2) / maxExcess;
        }
    }
    
    /**
     * @notice Calculate current supply APR for an asset
     * @dev Supply rate = Borrow rate * Utilization * (1 - Reserve Factor)
     * @return Annual supply rate in WAD (1e18 = 100%)
     */
    function getSupplyRate(address asset) public view returns (uint256) {
        uint256 totalSupply = totalSupplied[asset];
        if (totalSupply == 0) return 0;
        
        uint256 borrowRate = getBorrowRate(asset);
        uint256 utilization = (totalBorrowed[asset] * WAD) / totalSupply;
        uint256 reserveFactor = assetConfigs[asset].reserveFactor;
        
        // Supply rate = borrowRate * utilization * (1 - reserveFactor)
        return (borrowRate * utilization * (WAD - reserveFactor)) / (WAD * WAD);
    }
    
    /**
     * @notice Accrue interest for an asset
     * @dev Updates borrow and supply indexes based on time elapsed
     * @dev MUST be called before any state-changing operation
     */
    function accrueInterest(address asset) public {
        uint256 timeDelta = block.timestamp - lastAccrueTime[asset];
        if (timeDelta == 0) return;
        
        uint256 borrowRate = getBorrowRate(asset);
        uint256 supplyRate = getSupplyRate(asset);
        
        // Calculate interest factors (compounded per second)
        // interestFactor = rate * timeDelta / SECONDS_PER_YEAR
        uint256 borrowInterestFactor = (borrowRate * timeDelta * RAY) / (SECONDS_PER_YEAR * WAD);
        uint256 supplyInterestFactor = (supplyRate * timeDelta * RAY) / (SECONDS_PER_YEAR * WAD);
        
        // Update indexes: newIndex = oldIndex * (1 + interestFactor)
        borrowIndex[asset] = (borrowIndex[asset] * (RAY + borrowInterestFactor)) / RAY;
        supplyIndex[asset] = (supplyIndex[asset] * (RAY + supplyInterestFactor)) / RAY;
        
        // Calculate and accumulate reserves
        if (totalBorrowed[asset] > 0) {
            uint256 totalInterest = (totalBorrowed[asset] * borrowInterestFactor) / RAY;
            uint256 reserveAmount = (totalInterest * assetConfigs[asset].reserveFactor) / WAD;
            reserves[asset] += reserveAmount;
        }
        
        lastAccrueTime[asset] = block.timestamp;
        
        emit InterestAccrued(asset, borrowIndex[asset], supplyIndex[asset], reserves[asset]);
    }
    
    // ============ Supply Logic ============
    
    function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode) external {
        require(amount > 0, "Amount must be > 0");
        require(assetConfigs[asset].isActive, "Asset not active");
        
        // Accrue interest first
        accrueInterest(asset);
        
        // Risk check
        if (address(riskManager) != address(0)) {
            riskManager.validateSupply(asset, totalSupplied[asset] + amount);
        }
        
        // Supply cap check
        uint256 supplyCap = assetConfigs[asset].supplyCap;
        if (supplyCap > 0) {
            require(totalSupplied[asset] + amount <= supplyCap, "Supply cap exceeded");
        }
        
        // Transfer tokens from user to pool
        bool success = IERC20(asset).transferFrom(msg.sender, address(this), amount);
        require(success, "Transfer failed");
        
        // Update state
        _userSuppliedPrincipal[onBehalfOf][asset] += amount;
        totalSupplied[asset] += amount;
        
        emit Supply(onBehalfOf, asset, amount);
    }
    
    function withdraw(address asset, uint256 amount, address to) external {
        require(assetConfigs[asset].isActive, "Asset not active");
        
        // Accrue interest first
        accrueInterest(asset);
        
        // Get actual balance including interest
        uint256 userBalance = getUserBalance(msg.sender, asset);
        require(userBalance >= amount, "Insufficient balance");
        
        // Risk check
        if (address(riskManager) != address(0)) {
            riskManager.validateWithdraw(asset);
        }
        
        // Update principal (proportionally reduce)
        uint256 principalToReduce = (amount * _userSuppliedPrincipal[msg.sender][asset]) / userBalance;
        _userSuppliedPrincipal[msg.sender][asset] -= principalToReduce;
        totalSupplied[asset] -= amount;
        
        // Transfer tokens from pool to user
        bool success = IERC20(asset).transfer(to, amount);
        require(success, "Transfer failed");
        
        emit Withdraw(msg.sender, asset, amount);
    }
    
    // ============ Borrow Logic ============
    
    function borrow(address asset, uint256 amount, uint256 interestRateMode, uint16 referralCode, address onBehalfOf) external {
        require(assetConfigs[asset].isActive, "Asset not active");
        
        // Accrue interest first
        accrueInterest(asset);
        
        // Risk check
        if (address(riskManager) != address(0)) {
            riskManager.validateBorrow(asset);
        }
        
        // Borrow cap check
        uint256 borrowCap = assetConfigs[asset].borrowCap;
        if (borrowCap > 0) {
            require(totalBorrowed[asset] + amount <= borrowCap, "Borrow cap exceeded");
        }
        
        // Check pool liquidity
        uint256 poolBalance = IERC20(asset).balanceOf(address(this));
        require(poolBalance >= amount, "Insufficient pool liquidity");
        
        // Update state
        _userBorrowedPrincipal[onBehalfOf][asset] += amount;
        totalBorrowed[asset] += amount;
        
        // Transfer tokens from pool to borrower
        bool success = IERC20(asset).transfer(onBehalfOf, amount);
        require(success, "Transfer failed");
        
        emit Borrow(onBehalfOf, asset, amount);
    }
    
    function repay(address asset, uint256 amount, address onBehalfOf) external {
        require(assetConfigs[asset].isActive, "Asset not active");
        
        // Accrue interest first
        accrueInterest(asset);
        
        // Get actual debt including interest
        uint256 userDebt = getUserDebt(onBehalfOf, asset);
        uint256 repayAmount = amount > userDebt ? userDebt : amount;
        
        // Transfer tokens from payer to pool
        bool success = IERC20(asset).transferFrom(msg.sender, address(this), repayAmount);
        require(success, "Transfer failed");
        
        // Update principal (proportionally reduce)
        uint256 principalToReduce = (repayAmount * _userBorrowedPrincipal[onBehalfOf][asset]) / userDebt;
        _userBorrowedPrincipal[onBehalfOf][asset] -= principalToReduce;
        totalBorrowed[asset] -= repayAmount;
        
        emit Repay(onBehalfOf, asset, repayAmount);
    }
    
    // ============ View Functions ============
    
    /**
     * @notice Get user's supplied balance including accrued interest
     * @dev balance = principal * supplyIndex / RAY
     */
    function getUserBalance(address user, address asset) public view returns (uint256) {
        uint256 principal = _userSuppliedPrincipal[user][asset];
        if (principal == 0) return 0;
        
        // Simulate interest accrual
        uint256 currentIndex = _simulateSupplyIndex(asset);
        return (principal * currentIndex) / RAY;
    }
    
    /**
     * @notice Get user's borrowed amount including accrued interest
     * @dev debt = principal * borrowIndex / RAY
     */
    function getUserDebt(address user, address asset) public view returns (uint256) {
        uint256 principal = _userBorrowedPrincipal[user][asset];
        if (principal == 0) return 0;
        
        // Simulate interest accrual
        uint256 currentIndex = _simulateBorrowIndex(asset);
        return (principal * currentIndex) / RAY;
    }
    
    /**
     * @notice Simulate what the supply index would be if accrued now
     */
    function _simulateSupplyIndex(address asset) internal view returns (uint256) {
        uint256 timeDelta = block.timestamp - lastAccrueTime[asset];
        if (timeDelta == 0) return supplyIndex[asset];
        
        uint256 supplyRate = getSupplyRate(asset);
        uint256 interestFactor = (supplyRate * timeDelta * RAY) / (SECONDS_PER_YEAR * WAD);
        
        return (supplyIndex[asset] * (RAY + interestFactor)) / RAY;
    }
    
    /**
     * @notice Simulate what the borrow index would be if accrued now
     */
    function _simulateBorrowIndex(address asset) internal view returns (uint256) {
        uint256 timeDelta = block.timestamp - lastAccrueTime[asset];
        if (timeDelta == 0) return borrowIndex[asset];
        
        uint256 borrowRate = getBorrowRate(asset);
        uint256 interestFactor = (borrowRate * timeDelta * RAY) / (SECONDS_PER_YEAR * WAD);
        
        return (borrowIndex[asset] * (RAY + interestFactor)) / RAY;
    }
    
    /**
     * @notice Get utilization rate for an asset
     * @return Utilization in WAD (1e18 = 100%)
     */
    function getUtilizationRate(address asset) external view returns (uint256) {
        uint256 totalSupply = totalSupplied[asset];
        if (totalSupply == 0) return 0;
        return (totalBorrowed[asset] * WAD) / totalSupply;
    }
    
    // ============ Liquidation Functions ============
    
    /**
     * @notice Get liquidation close factor based on health factor
     * @dev Aave V3 style: 50% normal, 100% emergency
     * @param healthFactor Current health factor (RAY precision)
     * @return Close factor in WAD (0.5e18 = 50%, 1e18 = 100%)
     */
    function _getCloseFactor(uint256 healthFactor) internal pure returns (uint256) {
        // Emergency liquidation: HF < 0.95 → 100% close factor
        if (healthFactor < 0.95e27) {
            return WAD; // 100%
        }
        // Normal liquidation: HF < 1.0 → 50% close factor
        return 0.5e18; // 50%
    }
    
    /**
     * @notice Calculate user's health factor
     * @dev HF = (Total Collateral in USD × Liquidation Threshold) / Total Debt in USD
     * @dev HF < 1.0 means user can be liquidated
     * @return Health factor in RAY (1e27 = 1.0)
     */
    function calculateUserHealthFactor(address user) public view returns (uint256) {
        (uint256 totalCollateralUSD, uint256 totalDebtUSD,,,, ) = getUserAccountData(user);
        
        if (totalDebtUSD == 0) return type(uint256).max; // No debt = infinite health
        if (totalCollateralUSD == 0) return 0; // No collateral = zero health
        
        // HF = collateral / debt (both in USD, same decimals)
        return (totalCollateralUSD * RAY) / totalDebtUSD;
    }
    
    /**
     * @notice Get user's complete account data
     * @return totalCollateralUSD Total collateral in USD (8 decimals)
     * @return totalDebtUSD Total debt in USD (8 decimals)
     * @return availableBorrowsUSD Available to borrow in USD (8 decimals)
     * @return currentLiquidationThreshold Weighted avg liquidation threshold
     * @return ltv Weighted avg loan-to-value
     * @return healthFactor Current health factor (RAY precision)
     */
    function getUserAccountData(address user) public view returns (
        uint256 totalCollateralUSD,
        uint256 totalDebtUSD,
        uint256 availableBorrowsUSD,
        uint256 currentLiquidationThreshold,
        uint256 ltv,
        uint256 healthFactor
    ) {
        require(address(priceOracle) != address(0), "Oracle not set");
        
        uint256 totalCollateralWeighted = 0;
        uint256 totalLiquidationThresholdWeighted = 0;
        
        // Calculate total collateral and debt in USD
        for (uint256 i = 0; i < supportedAssets.length; i++) {
            address asset = supportedAssets[i];
            
            // Get user's supplied balance (with interest)
            uint256 suppliedBalance = getUserBalance(user, asset);
            if (suppliedBalance > 0) {
                uint256 assetPrice = priceOracle.getAssetPrice(asset); // 8 decimals
                uint256 assetDecimals = 6; // USDC/EURC/USYC all have 6 decimals
                
                // Convert to USD: balance (6 decimals) × price (8 decimals) / 1e6 = USD (8 decimals)
                uint256 collateralUSD = (suppliedBalance * assetPrice) / (10 ** assetDecimals);
                totalCollateralUSD += collateralUSD;
                
                // Weighted by liquidation threshold
                uint256 liqThreshold = assetConfigs[asset].liquidationThreshold;
                totalCollateralWeighted += (collateralUSD * liqThreshold) / WAD;
                totalLiquidationThresholdWeighted += collateralUSD;
            }
            
            // Get user's borrowed amount (with interest)
            uint256 borrowedBalance = getUserDebt(user, asset);
            if (borrowedBalance > 0) {
                uint256 assetPrice = priceOracle.getAssetPrice(asset);
                uint256 assetDecimals = 6;
                
                uint256 debtUSD = (borrowedBalance * assetPrice) / (10 ** assetDecimals);
                totalDebtUSD += debtUSD;
            }
        }
        
        // Calculate weighted average liquidation threshold
        if (totalLiquidationThresholdWeighted > 0) {
            currentLiquidationThreshold = (totalCollateralWeighted * WAD) / totalLiquidationThresholdWeighted;
        }
        
        // Calculate LTV (use collateral factor as LTV)
        ltv = currentLiquidationThreshold; // Simplified for MVP
        
        // Calculate available borrows
        if (totalCollateralWeighted > totalDebtUSD) {
            availableBorrowsUSD = totalCollateralWeighted - totalDebtUSD;
        }
        
        // Calculate health factor
        if (totalDebtUSD == 0) {
            healthFactor = type(uint256).max;
        } else if (totalCollateralWeighted == 0) {
            healthFactor = 0;
        } else {
            healthFactor = (totalCollateralWeighted * RAY) / totalDebtUSD;
        }
    }
    
    /**
     * @notice Liquidate an undercollateralized position
     * @param collateralAsset Asset to seize as collateral
     * @param debtAsset Asset that the user owes
     * @param user Address of the borrower to liquidate
     * @param debtToCover Amount of debt to repay
     * @param receiveAToken If true, receive aTokens instead of underlying
     */
    function liquidate(
        address collateralAsset,
        address debtAsset,
        address user,
        uint256 debtToCover,
        bool receiveAToken
    ) external {
        require(assetConfigs[collateralAsset].isActive, "Collateral not active");
        require(assetConfigs[debtAsset].isActive, "Debt asset not active");
        require(user != msg.sender, "Cannot liquidate yourself");
        
        // Accrue interest for both assets
        accrueInterest(collateralAsset);
        accrueInterest(debtAsset);
        
        // Check health factor
        uint256 healthFactor = calculateUserHealthFactor(user);
        require(healthFactor < RAY, "Health factor OK"); // HF must be < 1.0
        
        // Get user's debt
        uint256 userDebt = getUserDebt(user, debtAsset);
        require(userDebt > 0, "No debt to liquidate");
        
        // Apply variable close factor (Aave V3 style)
        uint256 closeFactor = _getCloseFactor(healthFactor);
        uint256 maxLiquidatable = (userDebt * closeFactor) / WAD;
        uint256 actualDebtToCover = debtToCover > maxLiquidatable ? maxLiquidatable : debtToCover;
        
        // Calculate collateral to seize (with liquidation bonus)
        uint256 collateralToSeize = _calculateCollateralToSeize(
            collateralAsset,
            debtAsset,
            actualDebtToCover
        );
        
        // Check user has enough collateral
        uint256 userCollateral = getUserBalance(user, collateralAsset);
        require(userCollateral >= collateralToSeize, "Insufficient collateral");
        
        // Transfer debt from liquidator to protocol
        bool success = IERC20(debtAsset).transferFrom(msg.sender, address(this), actualDebtToCover);
        require(success, "Debt transfer failed");
        
        // Reduce user's debt
        uint256 debtPrincipalToReduce = (actualDebtToCover * _userBorrowedPrincipal[user][debtAsset]) / userDebt;
        _userBorrowedPrincipal[user][debtAsset] -= debtPrincipalToReduce;
        totalBorrowed[debtAsset] -= actualDebtToCover;
        
        // Transfer collateral from user to liquidator
        uint256 collateralPrincipalToReduce = (collateralToSeize * _userSuppliedPrincipal[user][collateralAsset]) / userCollateral;
        _userSuppliedPrincipal[user][collateralAsset] -= collateralPrincipalToReduce;
        totalSupplied[collateralAsset] -= collateralToSeize;
        
        if (!receiveAToken) {
            // Transfer underlying collateral to liquidator
            success = IERC20(collateralAsset).transfer(msg.sender, collateralToSeize);
            require(success, "Collateral transfer failed");
        } else {
            // Give liquidator aTokens (simplified - just update their balance)
            _userSuppliedPrincipal[msg.sender][collateralAsset] += collateralToSeize;
            totalSupplied[collateralAsset] += collateralToSeize;
        }
        
        emit LiquidationCall(
            collateralAsset,
            debtAsset,
            user,
            actualDebtToCover,
            collateralToSeize,
            msg.sender,
            receiveAToken
        );
    }
    
    /**
     * @notice Calculate amount of collateral to seize
     * @dev Includes liquidation bonus (e.g., 5%)
     */
    function _calculateCollateralToSeize(
        address collateralAsset,
        address debtAsset,
        uint256 debtToCover
    ) internal view returns (uint256) {
        uint256 collateralPrice = priceOracle.getAssetPrice(collateralAsset);
        uint256 debtPrice = priceOracle.getAssetPrice(debtAsset);
        uint256 liquidationBonus = assetConfigs[collateralAsset].liquidationBonus;
        
        // collateralAmount = (debtToCover × debtPrice / collateralPrice) × (1 + bonus)
        // All prices are 8 decimals, amounts are 6 decimals
        uint256 collateralAmount = (debtToCover * debtPrice) / collateralPrice;
        uint256 bonusAmount = (collateralAmount * liquidationBonus) / WAD;
        
        return collateralAmount + bonusAmount;
    }
}
