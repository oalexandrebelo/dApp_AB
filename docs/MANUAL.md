# ArcLend - Deployment & Operations Manual

---

## 🇧🇷 Manual em Português

### 1. Pré-requisitos
Para rodar este projeto localmente, você precisa ter instalado:
- **Node.js** (v18+)
- **Git**
- **Foundry** (Forge/Cast/Anvil) para contratos inteligentes.
  - Instalação: https://getfoundry.sh/

### 2. Instalação do Projeto
1.  **Clone o repositório** (se aplicável) ou extraia os arquivos.
2.  **Instale dependências do Frontend**:
    ```bash
    npm install
    ```
3.  **Instale dependências do Foundry**:
    ```bash
    cd contracts
    forge install foundry-rs/forge-std --no-commit
    forge install openzeppelin/openzeppelin-contracts --no-commit
    cd ..
    ```

### 3. Executando Localmente
1.  **Inicie o Frontend**:
    ```bash
    npm run dev
    ```
    Acesse http://localhost:3000

    cd contracts
    forge test
    ```

3.  **Executar Testes de Segurança (Fuzzing)**:
    O projeto agora inclui testes avançados de "Fuzzing" que simulam milhares de cenários:
    ```bash
    cd contracts
    forge test --match-test Fuzz
    ```
    Isso validará a solvência do protocolo e a resiliência dos oráculos.

4.  **Simular Blockchain Local (Opcional)**:
    Se quiser remover o erro "Failed to fetch" e interagir de verdade:
    ```bash
    # Em um novo terminal
    anvil
    ```
    Isso iniciará uma rede local em `http://127.0.0.1:8545`.

### 4. Deploy de Contratos
1.  Configure sua chave privada (para testnet real) ou use uma do Anvil.
2.  Execute o script:
    ```bash
    cd contracts
    forge script script/Deploy.s.sol:Deploy --rpc-url <URL_DA_RPC> --broadcast --private-key <SUA_KEY>
    ```

---

## 🇺🇸 English Manual

### 1. Prerequisites
To run this project locally, you need:
- **Node.js** (v18+)
- **Git**
- **Foundry** (Forge/Cast/Anvil) for smart contracts.
  - Install guide: https://getfoundry.sh/

### 2. Project Installation
1.  **Clone repository** or extract files.
2.  **Install Frontend dependencies**:
    ```bash
    npm install
    ```
3.  **Install Foundry dependencies**:
    ```bash
    cd contracts
    forge install foundry-rs/forge-std --no-commit
    forge install openzeppelin/openzeppelin-contracts --no-commit
    cd ..
    ```

### 3. Running Locally
1.  **Start Frontend**:
    ```bash
    npm run dev
    ```
    Visit http://localhost:3000

    cd contracts
    forge test
    ```

3.  **Run Security Tests (Fuzzing)**:
    The project includes advanced Fuzzing tests to verify protocol solvency and oracle resilience:
    ```bash
    cd contracts
    forge test --match-test Fuzz
    ```

4.  **Local Blockchain Simulation (Optional)**:
    To verify contract interactions locally:
    ```bash
    # In a new terminal
    anvil
    ```
    Starts a local chain at `http://127.0.0.1:8545`.

### 4. Contract Deployment
1.  Set up your private key.
2.  Run deployment script:
    ```bash
### 5. Defense in Depth (Security)
- **Invariant Testing**: We use Handler-based fuzzing to verify solvency.
  ```bash
  forge test --match-contract InvariantSecurityTest
  ```
- **Frontend Security**: Transaction Review screens prevent "Blind Signing".
- **Risk Contracts**: `RiskManager.sol` handles circuit breakers and caps.
