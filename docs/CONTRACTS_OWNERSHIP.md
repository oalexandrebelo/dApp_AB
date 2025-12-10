# Controle e Propriedade dos Contratos (ArcLend)

Este documento detalha a propriedade, controle e chaves de acesso dos contratos inteligentes implantados na Arc Testnet.

## 🔑 Segurança

⚠️ **NUNCA compartilhe sua chave privada!**
- Mantenha sua private key no arquivo `.env` (nunca commite no Git)
- Use hardware wallet para produção/mainnet
- Considere multi-sig (Gnosis Safe) para contratos de produção

---

## 📜 Contratos Ativos (Arc Testnet)

### LendingPool V2 ✅ (PRODUÇÃO - Com Interest Accrual)
- **Endereço**: `0x31FA94AE9E505A320aB274212B4b236FD5945829`
- **Owner**: Sua wallet (deployer)
- **Deployed**: 09/12/2024 22:56 BRT
- **Status**: ✅ **ATIVO E VERIFICADO**
- **Explorer**: https://testnet.arcscan.app/address/0x31fa94ae9e505a320ab274212b4b236fd5945829
- **Features**:
  - ✅ Interest accrual (juros compostos por segundo)
  - ✅ Interest rate model (2-slope curve)
  - ✅ Per-asset collateral factors
  - ✅ Reserve factor (10-15% protocol revenue)
  - ✅ Dynamic APY based on utilization

**Assets Configurados:**
| Asset | Address | LTV | Liquidation | Bonus | Reserve | Rate Model |
|-------|---------|-----|-------------|-------|---------|------------|
| USDC  | `0x3600000000000000000000000000000000000000` | 85% | 90% | 5% | 10% | 0-4-60% @ 80% |
| EURC  | `0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a` | 85% | 90% | 5% | 10% | 0-3.5-60% @ 80% |
| USYC  | `0xe9185F0c5F296Ed1797AaE4238D26CCaBEadb86C` | 70% | 75% | 10% | 15% | 1-5-75% @ 75% |

### CrossChainBridge ✅ (ATIVO)
- **Endereço**: `0x278d9d6a0bd526a22562ff61d51532ab8b707555`
- **Owner**: Sua wallet
- **Status**: ✅ Ativo
- **Função**: P2P transfers e cross-chain messaging

---

## 🗄️ Contratos Deprecados (Não Usar)

### ⚠️ LendingPool V1 (DEPRECATED)
- **Endereço**: `0x4da5065a1b25e6e39029299a553a4f524c72c2fe`
- **Status**: ❌ **DEPRECATED - NÃO USAR**
- **Motivo**: Sem interest accrual, APY fixo, sem reserve factor
- **Ação**: Saque todos os fundos antes de usar V2

### ⚠️ Contratos Antigos (Testes Anteriores)
```
# Contratos de testes anteriores (não usar):
LendingPool (old): 0x39017e82f621ba946a2c502c6a5e2cb54fadd1a9
PriceOracle (old): 0x2fb8deed447d946434ae461c5a64d4b64cf17a39
Bridge (old):      0x173ea08292d8a02d50c4919e1ec430a29297a2b4
```

---

## 🕹️ Poderes do Owner (Você)

Como owner do LendingPool V2, você pode:

### Configuração
- `setTreasury(address)` - Definir endereço do treasury
- `setInterestRateModel(asset, base, slope1, slope2, optimal)` - Ajustar curva de APY
- `addAsset(asset, ltv, liqThreshold, liqBonus, reserveFactor)` - Adicionar novos ativos

### Receita do Protocolo
- `withdrawReserves(asset, amount)` - Sacar taxas acumuladas (10-15% dos juros)
- Ver reservas: `reserves(asset)` (view function)

### Emergência
- `rescueFunds(asset, amount)` - Resgatar fundos em emergência (usar com cuidado!)

---

## 💰 Receitas e Taxas

**Como funciona:**
1. Usuários pegam emprestado a X% APY
2. Protocolo paga aos depositantes Y% APY (Y < X)
3. Diferença vai para `reserves` (10-15% dependendo do asset)
4. Você pode sacar as reserves com `withdrawReserves()`

**Exemplo:**
- Total borrowed: 1000 USDC @ 5% APY = 50 USDC/ano de juros
- Reserve factor: 10%
- Protocol revenue: 5 USDC/ano
- Suppliers receive: 45 USDC/ano

---

## 🔗 Links Úteis

- **Explorer**: https://testnet.arcscan.app
- **Faucet USDC**: https://faucet.arc.network
- **RPC URL**: https://rpc.testnet.arc.network
- **Chain ID**: 5042002

---

## 📊 Histórico de Deployment

| Data | Contrato | Versão | Endereço | Status |
|------|----------|--------|----------|--------|
| 09/12/2024 | LendingPool | V2 | `0x31FA94AE9E505A320aB274212B4b236FD5945829` | ✅ Ativo |
| [Anterior] | LendingPool | V1 | `0x4da5065a1b25e6e39029299a553a4f524c72c2fe` | ❌ Deprecated |
| [Anterior] | CrossChainBridge | V1 | `0x278d9d6a0bd526a22562ff61d51532ab8b707555` | ✅ Ativo |

---

**Última Atualização**: 09/12/2024 22:56 BRT  
**Mantido Por**: AB (Owner)

