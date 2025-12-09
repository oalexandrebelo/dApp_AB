# Controle e Propriedade dos Contratos (ArcLend)

Este documento detalha a propriedade, controle e chaves de acesso dos contratos inteligentes implantados na Arc Testnet.

## 🔑 Chaves de Acesso (Deployer / Dono)

*   **Endereço Público (Owner/Deployer):** `0xE4f12835765b0bde77f35387dEaD2591527357b8`
*   **Chave Privada:** `0x4b888a259a8077cf5a9db4fa0de03ec2c69e5ced4c71f00f527aaa288d6bc96c`
    *   🔴 **ALERTA:** Esta chave dá controle TOTAL sobre os contratos. Mantenha-a segura. Em produção, nunca compartilhe.

## 📜 Contratos Implantados

| Nome | Endereço | Função |
|---|---|---|
| **LendingPool** | `0x39017e82f621ba946a2c502c6a5e2cb54fadd1a9` | O "Cofre" principal. Gerencia depósitos, empréstimos e taxas. |
| **PriceOracle** | `0x2fb8deed447d946434ae461c5a64d4b64cf17a39` | Define os preços dos ativos para cálculos. |
| **Bridge** | `0x173ea08292d8a02d50c4919e1ec430a29297a2b4` | Envia/Recebe mensagens usando CCTP. |

## 🕹️ Poderes do Dono (Owner)

Como dono da carteira `0xE4f1...`, você tem os seguintes poderes sobre o contrato `LendingPool` (após a atualização):

1.  **Definir Tesouraria (`setTreasury`)**:
    *   Você pode definir para onde vão as taxas do protocolo.
    *   Comando padrão: A tesouraria é sua própria carteira.

2.  **Resgatar Fundos (`rescueFunds`)**:
    *   Se necessário (ex: migração ou emergência), você pode sacar tokens do contrato para sua carteira.

3.  **Configurar Módulos**:
    *   Pode trocar o `BorrowingEngine` (motor de juros) ou `RiskManager` (gestor de risco) se quiser atualizar a lógica do sistema sem mexer no saldo dos usuários.

## 💰 Receitas e Taxas

*   Atualmente, o protocolo acumula o spread entre a Taxa de Empréstimo e a Taxa de Depósito.
*   Esse excedente fica no contrato `LendingPool`.
*   Use a função `rescueFunds` ou implemente `withdrawFees` para coletar esses lucros.

## 🔗 Links Úteis

*   **Explorer:** [ArcScan Testnet](https://testnet.arcscan.app/)
*   **Faucet USDC:** [Arc Faucet](https://faucet.arc.network/)
