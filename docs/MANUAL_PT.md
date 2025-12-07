# ArcLend Protocol - Manual de Deploy e Operação

Este documento detalha o processo de deploy, verificação e manutenção do Protocolo ArcLend.

## 1. Deploy dos Smart Contracts (Foundry)

### Pré-requisitos
- Foundry instalado (`curl -L https://foundry.paradigm.xyz | bash`)
- Chave privada com saldo na rede alvo (Arc Testnet ou Mainnet).

### Passos
1. Compile os contratos:
   ```bash
   forge build
   ```
2. Execute o script de deploy:
   ```bash
   cd contracts
   forge script script/Deploy.s.sol:Deploy --rpc-url <RPC_URL> --broadcast --private-key <PRIVATE_KEY>
   ```
3. Verifique os contratos (Opcional):
   ```bash
   forge verify-contract <ADDRESS> src/LendingPool.sol:LendingPool --chain-id <CHAIN_ID> --watch
   ```

## 2. Deploy do Frontend (Next.js) no Netlify via GitHub

Este é o método recomendado para colocar a interface no ar de forma contínua e automatizada.

### Passo 1: Preparar Repositório
1. Certifique-se de que todo o código está commitado no GitHub.
2. O arquivo `next.config.mjs` deve estar configurado para exportação correta se for usar 'Static Site Generation' (SSG), mas o Netlify suporta SSR (Server Side Rendering) nativamente.

### Passo 2: Configurar Netlify
1. Faça login no [Netlify](https://www.netlify.com/).
2. Clique em **"Add new site"** -> **"Import an existing project"**.
3. Escolha **GitHub**.
4. Autorize o Netlify e selecione o repositório do `ArcLend`.

### Passo 3: Configurações de Build
O Netlify deve detectar automaticamente que é um projeto Next.js, mas confirme os campos:
- **Build command**: `npm run build`
- **Publish directory**: `.next` ou `out` (dependendo da sua config). Para Next.js moderno, deixe o padrão.

### Passo 4: Variáveis de Ambiente
No painel do Netlify, vá em **Site settings > Build & deploy > Environment variables** e adicione:
- `NEXT_PUBLIC_RPC_URL`: URL da RPC da Arc Network.
- `NEXT_PUBLIC_WALLET_CONNECT_ID`: Seu ID do WalletConnect.
- `DATABASE_URL`: URL do seu banco de dados PostgreSQL (se estiver usando a API).

### Passo 5: Deploy
Clique em **"Deploy site"**. O Netlify vai construir o projeto e fornecer uma URL pública (ex: `arclend-protocol.netlify.app`).

## 3. Segurança e Manutenção

### Fuzzing Tests
Para garantir a solvência do protocolo antes de atualizações críticas:
```bash
forge test --match-contract InvariantSecurityTest
```

### Circuit Breakers (Emergência)
Se for detectada uma anomalia, o `Guardian` pode pausar ativos específicos através do contrato `RiskManager`:
- Função: `pauseAsset(address asset)`
- Função: `pauseProtocol()` (Parada total)
