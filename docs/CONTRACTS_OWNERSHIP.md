# 🔐 Contratos Deployed - Arc Network Lending Protocol

**Última Atualização:** 10 de Dezembro de 2024, 14:03 PM

---

## 🆕 CONTRATOS ATIVOS (V4) - EM USO

### LendingPool V4 ✅ ATUAL
**Endereço:** `0x6Ad44Fd3a516730adE6cF795a3c35baEEF45f8C0`
**Deployed:** 10/12/2024, 13:54 PM
**Network:** Arc Testnet (Chain ID: 5042002)
**Block:** 15636359
**Gas Pago:** 0.470309895 ETH

**Features:**
- ✅ Flashloans (0.09% premium)
- ✅ E-Mode (97% LTV para Stablecoins)
- ✅ Reentrancy Guard
- ✅ Supply/Borrow Caps
- ✅ Enhanced Liquidation Engine
- ✅ Protocol Analytics

**Transaction Hash:** `0x9ad98719cc89e9e9bc37a6648cb7b79bc5ab611381e4f7b180aa3037027d9990`

**ArcScan:** https://testnet.arcscan.net/address/0x6Ad44Fd3a516730adE6cF795a3c35baEEF45f8C0

---

### SimplePriceOracle ✅ ATUAL
**Endereço:** `0xbc5C76b22DbE3672882887c71417e9Ae0a6D439C`
**Deployed:** 10/12/2024, 13:54 PM
**Network:** Arc Testnet
**Block:** 15636359
**Gas Pago:** 0.05285544 ETH

**Preços Configurados:**
- USDC: $1.00 (1e8)
- EURC: $1.00 (1e8)
- USYC: $1.00 (1e8)

**Transaction Hash:** `0x31e00de7887a97af972cf4812cf824967bfd479628c43ebf9404ec228241ee89`

**ArcScan:** https://testnet.arcscan.net/address/0xbc5C76b22DbE3672882887c71417e9Ae0a6D439C

---

## 📜 CONTRATOS ANTERIORES (HISTÓRICO)

### LendingPool V2 ⚠️ DEPRECATED
**Endereço:** `0x31FA94AE9E505A320aB274212B4b236FD5945829`
**Deployed:** 09/12/2024
**Network:** Arc Testnet
**Status:** ⚠️ Não usar mais (substituído por V4)

**Features:**
- Interest Accrual
- Basic Liquidations
- Supply/Borrow/Repay/Withdraw

**Motivo da Substituição:**
- Faltava Flashloans
- Faltava E-Mode
- Sem Reentrancy Guard
- Sem Supply/Borrow Caps

---

### CrossChainBridge
**Endereço:** `0x278d9d6a0bd526a22562ff61d51532ab8b707555`
**Deployed:** Anterior
**Network:** Arc Testnet
**Status:** ✅ Ativo (independente)

**Purpose:** Bridge entre chains



---

## 📊 ASSETS CONFIGURADOS (V4)

### USDC
**Address:** `0x3600000000000000000000000000000000000000`
**LTV:** 75% (normal) / 97% (E-Mode)
**Liquidation Threshold:** 80% (normal) / 98% (E-Mode)
**Liquidation Bonus:** 5% (normal) / 1% (E-Mode)
**Supply Cap:** 1,000,000 USDC
**Borrow Cap:** 500,000 USDC
**E-Mode Category:** 1 (Stablecoins)

### EURC
**Address:** `0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a`
**LTV:** 75% (normal) / 97% (E-Mode)
**Liquidation Threshold:** 80% (normal) / 98% (E-Mode)
**Liquidation Bonus:** 5% (normal) / 1% (E-Mode)
**Supply Cap:** 1,000,000 EURC
**Borrow Cap:** 500,000 EURC
**E-Mode Category:** 1 (Stablecoins)

### USYC
**Address:** `0xe9185F0c5F296Ed1797AaE4238D26CCaBEadb86C`
**LTV:** 70% (normal) / 97% (E-Mode)
**Liquidation Threshold:** 75% (normal) / 98% (E-Mode)
**Liquidation Bonus:** 7% (normal) / 1% (E-Mode)
**Supply Cap:** 500,000 USYC
**Borrow Cap:** 250,000 USYC
**E-Mode Category:** 1 (Stablecoins)

---

## 🎯 E-MODE CONFIGURATION

### Category 1: Stablecoins
**ID:** 1
**Label:** "Stablecoins"
**LTV:** 97% (9700 basis points)
**Liquidation Threshold:** 98% (9800 basis points)
**Liquidation Bonus:** 1% (101 basis points)

**Assets incluídos:**
- USDC
- EURC
- USYC

---

## 💰 CUSTOS DE DEPLOYMENT

### V4 Deployment (10/12/2024)
**Total Gas:** 0.731672205 ETH
**Gas Used:** 4,434,377 gas
**Gas Price:** 165 gwei (média)

**Breakdown:**
- SimplePriceOracle: 0.05285544 ETH
- LendingPool V4: 0.470309895 ETH
- Configurações: ~0.208 ETH

---

## 🔗 LINKS ÚTEIS

**ArcScan (Testnet):**
- LendingPool V4: https://testnet.arcscan.net/address/0x6Ad44Fd3a516730adE6cF795a3c35baEEF45f8C0
- SimplePriceOracle: https://testnet.arcscan.net/address/0xbc5C76b22DbE3672882887c71417e9Ae0a6D439C

**Frontend:**
- Netlify: (auto-deploy após push)

**Repositório:**
- GitHub: https://github.com/oalexandrebelo/dApp_AB

---

## 📝 NOTAS

1. **V4 é a versão atual** - Usar apenas este endereço no frontend
2. **V2 foi deprecated** - Manter apenas para histórico
3. **Chave privada** está segura (apenas no ambiente local)
4. **Todos os contratos** estão verificados no ArcScan
5. **E-Mode ativo** - Usuários podem ativar para 97% LTV

---

