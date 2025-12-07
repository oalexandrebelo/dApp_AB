# ArcLend Protocol - Product Requirements Document
**Version:** 1.0  
**Status:** Draft  

## 1. Visão Geral
**ArcLend** é um protocolo de empréstimos descentralizado (DeFi Lending) construído na Arc Network EVM que permite aos usuários emprestar e tomar empréstimos de criptoativos de forma instantânea e cross-chain.

## 2. Solução
- **Lending Cross-Chain**: Deposite colateral em uma chain e tome empréstimo em outra.
- **Gas Token Eficiente**: Utiliza USDC como gas token via Arc Network.
- **Interface Unificada**: Uma experiência fluida independente da chain de origem.

## 3. Arquitetura Técnica
### Smart Contracts (Solidity)
- `LendingPool.sol`: Contrato principal para depósitos e saques.
- `BorrowingEngine.sol`: Gestão de risco, LTV e Health Factor.
- `PriceOracle.sol`: Agregador de preços de ativos.

### Backend & Indexer
- **Next.js API**: Endpoints para dados de usuário e analytics.
- **Prisma + PostgreSQL**: Persistência de dados off-chain.
- **Worker/Indexer**: Escuta eventos da blockchain (`Supply`, `Borrow`) para atualizar o banco de dados.

## 4. Funcionalidades (MVP)
- **Supply**: Deposite WBTC, ETH, USDC para ganhar juros.
- **Borrow**: Use colateral para tomar empréstimos.
- **Dashboard**: Visualize net worth, APY e saúde do empréstimo.
- **Multilanguage**: Suporte completo a Inglês, Português e Espanhol.

## 5. Segurança & Lógica Avançada (Phase 3)
### Interest Rate Model
- **Modelo**: Taxa de juros variável baseada na utilização (U).
- **Parâmetros**:
  - `Base Rate`: 0%
  - `Slope 1`: 4% (até U=80%)
  - `Slope 2`: 60% (acima de U=80%)
  - `Optimal Utils`: 80%
  - `Reserve Factor`: 10%

### Oráculos & Resiliência
- **Estratégia**: Multi-Oracle Fallback.
- **Fluxo**: Chainlink (Primário) -> Pyth (Secundário) -> TWAP Dex (Emergência).

### Verificação (Fuzzing)
- Testes de propriedade para garantir `Solvência` (Borrow <= Supply).
- Testes de robustez para `Oráculos` (Fallback automático).
