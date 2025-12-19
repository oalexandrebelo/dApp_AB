# 🌉 BRIDGE DOCUMENTATION - NEXUX LEND

Complete guide to the Circle CCTP bridge implementation in Nexux Lend.

---

## 📖 Overview

Nexux Lend uses **Circle's Cross-Chain Transfer Protocol (CCTP)** to enable native USDC transfers across multiple blockchains. Our implementation is **manual** (not using Bridge-Kit SDK) for maximum control and customization.

### **Supported Networks:**

**Testnets:**
- Ethereum Sepolia (Chain ID: 11155111)
- Avalanche Fuji (Chain ID: 43113)
- Optimism Sepolia (Chain ID: 11155420)
- Arbitrum Sepolia (Chain ID: 421614)
- Base Sepolia (Chain ID: 84532)
- Polygon Amoy (Chain ID: 80002)

**Mainnets:**
- Ethereum (Chain ID: 1)
- Avalanche C-Chain (Chain ID: 43114)
- Optimism (Chain ID: 10)
- Arbitrum One (Chain ID: 42161)
- Base (Chain ID: 8453)
- Polygon (Chain ID: 137)

---

## 🔄 Bridge Flow (4 Steps)

### **Step 0: Fee Collection** ✨ NEW
```typescript
// Deduct 0.1% fee and transfer to treasury
const feeAmount = amount * 0.001;
const netAmount = amount - feeAmount;

await transfer(TREASURY_ADDRESS, feeAmount);
```

### **Step 1: Approve USDC**
```typescript
await approve(TokenMessenger, netAmount);
```

### **Step 2: Burn USDC (Source Chain)**
```typescript
const burnTx = await depositForBurn(
    netAmount,
    destinationDomain,
    recipientBytes32,
    usdcAddress
);
```

### **Step 3: Fetch Attestation (Circle API)**
```typescript
const attestation = await fetchAttestation(messageHash);
// Polls Circle API for up to 20 minutes
```

### **Step 4: Mint USDC (Destination Chain)**
```typescript
// User switches to destination chain
const mintTx = await receiveMessage(message, attestation);
```

---

## 💰 Fee Structure

| Fee Type | Amount | Recipient |
|:---|:---:|:---|
| **Bridge Fee** | 0.1% | Treasury |
| **Gas (Source)** | ~$0.50-$2 | Network |
| **Gas (Destination)** | ~$0.50-$2 | Network |

**Example:**
- Transfer: 100 USDC
- Fee: 0.1 USDC (to treasury)
- Net received: 99.9 USDC
- Gas costs: ~$1-$4 total

---

## ⏱️ Transfer Times

| Route | Time | Reason |
|:---|:---:|:---|
| **L2 → L2** | 5-10 min | Fast finality |
| **Ethereum → L2** | 15-20 min | Ethereum finality |
| **L2 → Ethereum** | 15-20 min | Ethereum finality |

---

## 🔒 Security Features

### **1. Event Validation**
```typescript
// Validates MessageSent event signature and contract address
const MESSAGE_SENT_TOPIC = '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925';
if (log.topics[0] !== MESSAGE_SENT_TOPIC) continue;
if (log.address !== MESSAGE_TRANSMITTER) continue;
```

### **2. Nonce Check (Double-Mint Prevention)**
```typescript
const usedNonce = await readContract({
    functionName: 'usedNonces',
    args: [nonceHex],
});

if (usedNonce > 0) {
    throw new Error('Message already processed');
}
```

### **3. Stuck Transaction Detection**
```typescript
// Automatically detects transfers stuck > 30 minutes
const stuckTransfers = getStuckBridgeTransfers();
```

### **4. Circuit Breaker**
```typescript
// Stops retries after 5 consecutive failures
// Auto-resets after 1 minute
```

---

## 🛠️ Usage Examples

### **Basic Transfer**
```typescript
import { executeCCTPBridge } from '@/lib/cctp/bridge';

const result = await executeCCTPBridge({
    walletClient,
    publicClient,
    fromChainId: 11155111, // Ethereum Sepolia
    toChainId: 43113,      // Avalanche Fuji
    amount: '10.00',
    recipientAddress: '0x...',
    onProgress: (progress) => {
        console.log(progress.step, progress.message);
    },
});

// Returns: { burnTxHash, messageHash, attestation, toChainId }
```

### **Complete Mint**
```typescript
import { completeCCTPBridge } from '@/lib/cctp/bridge';

// User switches to destination chain
const mintTxHash = await completeCCTPBridge({
    walletClient,
    publicClient,
    chainId: 43113,
    message: result.message,
    attestation: result.attestation,
});
```

### **Track Status**
```typescript
import { saveBridgeTransfer, getBridgeTransfer } from '@/lib/cctp/status';

// Save transfer
saveBridgeTransfer({
    id: generateTransferId(),
    fromChainId: 11155111,
    toChainId: 43113,
    amount: '10.00',
    status: 'burning',
    createdAt: Date.now(),
});

// Get transfer
const transfer = getBridgeTransfer(id);
```

---

## 🐛 Troubleshooting

### **"Attestation timeout"**
- **Cause:** Circle API taking > 20 minutes
- **Solution:** Wait and retry with same messageHash

### **"Message already processed"**
- **Cause:** Trying to mint twice
- **Solution:** Check destination chain balance

### **"Insufficient gas"**
- **Cause:** Not enough native token for gas
- **Solution:** Add gas tokens to wallet

### **"Circuit breaker is OPEN"**
- **Cause:** Too many failures (5+)
- **Solution:** Wait 1 minute for auto-reset

---

## 📊 Analytics

Bridge usage is tracked via:
- `lib/cctp/status.ts` - Persistent localStorage
- Analytics events (if configured)

**Metrics tracked:**
- Total volume
- Fee revenue
- Success rate
- Average transfer time
- Stuck transaction rate

---

## 🔗 References

- [Circle CCTP Docs](https://developers.circle.com/cctp)
- [CCTP V2 Contracts](https://developers.circle.com/cctp/docs/cctp-protocol-contract)
- [Attestation API](https://developers.circle.com/cctp/docs/cctp-attestation-service)

---

**Last Updated:** December 16, 2024  
**Version:** 2.0 (with fee collection)

