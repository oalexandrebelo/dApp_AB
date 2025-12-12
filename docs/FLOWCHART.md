# 🔄 NEXUX LEND - SYSTEM FLOWCHART

**Version:** 2.0  
**Date:** December 12, 2024

---

## 📊 COMPLETE SYSTEM ARCHITECTURE

```mermaid
graph TB
    subgraph "User Interface"
        UI[Web App Next.js]
        Mobile[Mobile App - Phase 2]
    end

    subgraph "Wallet Layer"
        RK[RainbowKit]
        Wagmi[Wagmi v2]
        MM[MetaMask]
        WC[WalletConnect]
    end

    subgraph "Core Protocol - Arc Network"
        LP[LendingPool Contract]
        PO[Price Oracle]
        IM[Interest Rate Model]
    end

    subgraph "Features"
        Supply[Supply Assets]
        Borrow[Borrow Assets]
        Withdraw[Withdraw]
        Repay[Repay Debt]
        EMode[E-Mode]
        Flash[Flash Loans]
        Liq[Liquidations]
    end

    subgraph "Cross-Chain"
        CCTP[Circle CCTP Bridge]
        ETH[Ethereum Sepolia]
        AVAX[Avalanche Fuji]
        POLY[Polygon Amoy]
    end

    subgraph "Analytics"
        Earn[Earnings Chart]
        Dist[Asset Distribution]
        HF[Health Factor History]
    end

    subgraph "Data Storage"
        LS[LocalStorage]
        BC[Blockchain State]
    end

    UI --> RK
    Mobile -.-> RK
    RK --> Wagmi
    Wagmi --> MM
    Wagmi --> WC
    
    Wagmi --> LP
    LP --> PO
    LP --> IM
    
    LP --> Supply
    LP --> Borrow
    LP --> Withdraw
    LP --> Repay
    LP --> EMode
    LP --> Flash
    LP --> Liq
    
    CCTP --> LP
    ETH --> CCTP
    AVAX --> CCTP
    POLY --> CCTP
    
    LP --> Earn
    LP --> Dist
    LP --> HF
    
    HF --> LS
    UI --> LS
    LP --> BC

    style LP fill:#7F201C,color:#fff
    style CCTP fill:#DEB918,color:#000
    style UI fill:#4CAF50,color:#fff
```

---

## 🔄 USER FLOWS

### **1. SUPPLY FLOW**

```mermaid
sequenceDiagram
    actor User
    participant UI as Web App
    participant Wallet
    participant Token as ERC20 Token
    participant Pool as LendingPool

    User->>UI: Click "Supply"
    UI->>User: Show Supply Modal
    User->>UI: Enter Amount
    UI->>Wallet: Request Approval
    Wallet->>Token: approve(Pool, amount)
    Token-->>Wallet: Approval Success
    UI->>Wallet: Request Supply
    Wallet->>Pool: supply(asset, amount)
    Pool-->>Wallet: Supply Success
    Pool->>User: Mint Interest Tokens
    UI->>User: Show Success + APY
```

---

### **2. BORROW FLOW**

```mermaid
sequenceDiagram
    actor User
    participant UI as Web App
    participant Pool as LendingPool
    participant Oracle as Price Oracle
    participant Wallet

    User->>UI: Click "Borrow"
    UI->>Pool: Check Collateral
    Pool->>Oracle: Get Asset Prices
    Oracle-->>Pool: Return Prices
    Pool-->>UI: Max Borrow Amount
    UI->>User: Show Borrow Modal
    User->>UI: Enter Amount
    UI->>UI: Calculate Health Factor
    alt Health Factor > 1.0
        UI->>Wallet: Request Borrow
        Wallet->>Pool: borrow(asset, amount)
        Pool->>User: Transfer Borrowed Assets
        Pool-->>UI: Borrow Success
    else Health Factor <= 1.0
        UI->>User: Show Error - Insufficient Collateral
    end
```

---

### **3. LIQUIDATION FLOW**

```mermaid
sequenceDiagram
    actor Liquidator
    participant UI as Liquidator Dashboard
    participant Pool as LendingPool
    participant Oracle as Price Oracle

    loop Monitor Positions
        UI->>Pool: Get All Positions
        Pool->>Oracle: Get Current Prices
        Oracle-->>Pool: Return Prices
        Pool-->>UI: Return Positions + Health Factors
        UI->>UI: Filter HF < 1.0
    end

    Liquidator->>UI: Click "Liquidate"
    UI->>UI: Calculate Profit (5% bonus)
    Liquidator->>UI: Confirm Liquidation
    UI->>Pool: liquidate(collateral, debt, user, amount)
    Pool->>Liquidator: Transfer Collateral + Bonus
    Pool->>Pool: Repay User Debt
    Pool-->>UI: Liquidation Success
    UI->>Liquidator: Show Profit
```

---

### **4. FLASH LOAN FLOW**

```mermaid
sequenceDiagram
    actor Developer
    participant Contract as Flash Loan Contract
    participant Pool as LendingPool
    participant DEX as External DEX

    Developer->>Contract: Call executeFlashLoan()
    Contract->>Pool: flashLoan(assets, amounts)
    Pool->>Contract: Transfer Loan
    
    rect rgb(200, 220, 255)
        Note over Contract: Single Transaction
        Contract->>DEX: Arbitrage Trade
        DEX-->>Contract: Profit
    end
    
    Contract->>Pool: Repay Loan + Fee (0.09%)
    alt Repayment Success
        Pool-->>Contract: Success
        Contract->>Developer: Transfer Profit
    else Repayment Failed
        Pool-->>Contract: Revert Transaction
    end
```

---

### **5. CROSS-CHAIN BRIDGE FLOW**

```mermaid
sequenceDiagram
    actor User
    participant UI as Bridge Widget
    participant Source as Source Chain
    participant CCTP as Circle CCTP
    participant Arc as Arc Network
    participant Pool as LendingPool

    User->>UI: Select Chains + Amount
    UI->>User: Show Fee + Time
    User->>UI: Confirm Bridge
    UI->>Source: Burn USDC
    Source->>CCTP: Request Attestation
    
    Note over CCTP: ~15 minutes
    
    CCTP-->>Arc: Attestation Ready
    Arc->>Arc: Mint USDC
    Arc->>User: Transfer USDC
    
    opt Auto-Supply
        UI->>Pool: supply(USDC, amount)
        Pool->>User: Start Earning Interest
    end
    
    UI->>User: Bridge Complete
```

---

## 🏗️ SYSTEM ARCHITECTURE

### **Layer 1: Frontend**

```mermaid
graph LR
    subgraph "Frontend Layer"
        Next[Next.js App]
        Comp[React Components]
        Hooks[Custom Hooks]
        UI[shadcn/ui]
    end

    Next --> Comp
    Comp --> Hooks
    Comp --> UI
```

---

### **Layer 2: Blockchain Interaction**

```mermaid
graph LR
    subgraph "Blockchain Layer"
        Wagmi[Wagmi Hooks]
        Viem[Viem Client]
        RPC[Arc RPC]
        SC[Smart Contracts]
    end

    Wagmi --> Viem
    Viem --> RPC
    RPC --> SC
```

---

### **Layer 3: Smart Contracts**

```mermaid
graph TB
    subgraph "Smart Contract Layer"
        LP[LendingPool]
        PO[PriceOracle]
        IR[InterestRate]
        FL[FlashLoan]
        LIQ[Liquidation]
    end

    LP --> PO
    LP --> IR
    LP --> FL
    LP --> LIQ
```

---

## 📊 DATA FLOW

### **Real-time Data Updates**

```mermaid
graph LR
    subgraph "Data Sources"
        BC[Blockchain Events]
        RPC[RPC Calls]
        LS[LocalStorage]
    end

    subgraph "Processing"
        Hooks[Custom Hooks]
        State[React State]
    end

    subgraph "UI Components"
        Charts[Analytics Charts]
        Tables[Asset Tables]
        Metrics[Hero Metrics]
    end

    BC --> Hooks
    RPC --> Hooks
    LS --> Hooks
    Hooks --> State
    State --> Charts
    State --> Tables
    State --> Metrics
```

---

## 🔐 SECURITY FLOW

### **Transaction Security**

```mermaid
graph TB
    User[User Action]
    Validate[Input Validation]
    HF[Health Factor Check]
    Approve[User Approval]
    Sign[Wallet Signature]
    Execute[Contract Execution]
    Verify[Result Verification]

    User --> Validate
    Validate --> HF
    HF --> Approve
    Approve --> Sign
    Sign --> Execute
    Execute --> Verify

    style Validate fill:#4CAF50
    style HF fill:#FFC107
    style Sign fill:#2196F3
    style Execute fill:#7F201C,color:#fff
```

---

## 🎯 PHASE 2 ADDITIONS

### **Governance Flow (Planned)**

```mermaid
graph TB
    subgraph "Governance - Phase 2"
        Token[NEXUX Token]
        Stake[Staking Contract]
        Vote[Voting Contract]
        Timelock[Timelock]
        Execute[Execution]
    end

    Token --> Stake
    Stake --> Vote
    Vote --> Timelock
    Timelock --> Execute

    style Token fill:#DEB918,color:#000
```

---

**Flowchart Version:** 2.0  
**Last Updated:** December 12, 2024  
**Status:** Production Ready
