# Nexux Lend

![Nexux Lend Banner](public/logo-full.svg)

> **The Leading DeFi Lending Protocol on Arc Network**

A modern, secure, and capital-efficient lending platform with native cross-chain bridge powered by Circle's CCTP (Cross-Chain Transfer Protocol) and Bridge-Kit SDK.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16.0.7-black)](https://nextjs.org/)
[![TanStack Query](https://img.shields.io/badge/TanStack%20Query-v5-ff4154)](https://tanstack.com/query/latest)
[![CCTP](https://img.shields.io/badge/Circle-Bridge--Kit-00D4FF)](https://www.circle.com/en/cross-chain-transfer-protocol)

---

## 📖 About

**Nexux Lend** is a decentralized lending protocol that enables users to:

-   **💵 Supply & Earn** - Deposit USDC, EURC, or USYC and earn competitive APY
-   **💸 Borrow** - Borrow against your collateral with Aave-style health factors
-   **🌉 Bridge** - Transfer tokens across 12 chains using Circle CCTP (0.1% fee)
-   **📊 Monitor** - Real-time analytics, health factor tracking, and liquidation alerts
-   **🚀 Optimize** - E-Mode for stablecoins (up to 98% LTV)

Built as a portfolio project by **Alexandre Belo** for the Arc Network Developer Airdrop program.

---

## ✨ Key Features

### 🏦 Core Lending
-   ✅ **Aave V3-style Health Factor** - Weighted liquidation thresholds
-   ✅ **Compound Interest Model** - Dynamic rates based on utilization
-   ✅ **E-Mode (Efficiency Mode)** - 98% LTV for correlated assets (stablecoins)
-   ✅ **Variable Close Factor** - Three-tier liquidation (100%, 75%, 50% based on HF)
-   ✅ **Flashloans** - 0.09% fee (aligned with Aave)
-   ✅ **Liquidation Mechanism** - 5% bonus, gradual user protection

### 🌉 Cross-Chain Bridge (Powered by Bridge-Kit)
-   ✅ **SDK Integration** - Migrated to `@circle-fin/bridge-kit` for enterprise-grade reliability
-   ✅ **12 Chains Supported** - Full support for Ethereum, Solana, and L2s
-   ✅ **Automated Fee Collection** - 0.1% protocol fee handled natively by the SDK
-   ✅ **Instant Estimations** - Real-time gas and CCTP fee calculations via TanStack Query
-   ✅ **Smart Retries** - Built-in recovery for interrupted transfers
-   ✅ **Status Tracking** - Granular progress updates (Burn -> Attest -> Mint)

### 📊 Advanced Analytics
-   ✅ **Dashboard** - Comprehensive position overview with charts
-   ✅ **Health Factor History** - Track liquidation risk over time
-   ✅ **Bridge Analytics** - Volume, fees, and success rate tracking
-   ✅ **Asset Distribution** - Portfolio visualization

### 🎨 Premium UX
-   ✅ **State Management** - Powered by TanStack Query for caching and deduplication
-   ✅ **PWA Support** - Installable as a native app on iOS/Android
-   ✅ **Chain Logos** - Professional SVG logos for all supported networks
-   ✅ **Dark Mode** - Eye-friendly interface with glassmorphism
-   ✅ **Responsive Design** - Mobile-first, tablet, desktop optimized
-   ✅ **Wallet Integration** - Wagmi v2 + RainbowKit

---

## 🛠 Tech Stack

### Frontend
-   [Next.js 16](https://nextjs.org/) - React framework with App Router
-   [TypeScript](https://www.typescriptlang.org/) - Type safety
-   [TanStack Query](https://tanstack.com/query/latest) - Async state management
-   [Tailwind CSS](https://tailwindcss.com/) + [Radix UI](https://www.radix-ui.com/) - Styling & components
-   [Framer Motion](https://www.framer.com/motion/) - Animations

### Web3
-   [Wagmi v2](https://wagmi.sh/) - React hooks for Ethereum
-   [Viem](https://viem.sh/) - TypeScript Ethereum library
-   [RainbowKit](https://www.rainbowkit.com/) - Wallet connection
-   **Circle Bridge-Kit** - Official SDK for CCTP transfers

### Smart Contracts
-   **Solidity 0.8.20** - Contract language
-   **Foundry** - Development framework
-   **OpenZeppelin** - Security standards

### Additional Tools
-   [Prisma](https://www.prisma.io/) - PostgreSQL ORM
-   [Playwright](https://playwright.dev/) - E2E testing
-   [Recharts](https://recharts.org/) - Data visualization

---

## 🚀 Getting Started

### Prerequisites
-   Node.js 18+ and npm
-   MetaMask or compatible Web3 wallet
-   Testnet tokens ([Arc Faucet](https://faucet.arc.network) | [Circle Faucet](https://faucet.circle.com))

### Installation

```bash
# Clone the repository
git clone https://github.com/oalexandrebelo/dApp_AB.git
cd dApp_AB

# Install dependencies
npm install

# Install Playwright browsers (for E2E testing)
npx playwright install

# Create environment file
cp .env.example .env.local

# Add your environment variables (see Configuration)
```

### Development

```bash
# Run development server
npm run dev

# Open http://localhost:3000
```

### Testing

```bash
# Run E2E tests
npm test

# Run E2E tests with UI
npm run test:ui
```

### Build

```bash
# Create production build
npm run build

# Analyze bundle size
npm run analyze

# Start production server
npm start
```

---

## 🔧 Configuration

### Environment Variables

Create `.env.local` with:

```env
# WalletConnect (Required)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Treasury Address (Required for fee collection)
NEXT_PUBLIC_TREASURY_ADDRESS=0xYourMultisigAddress

# Database URL (Required for Prisma)
DATABASE_URL=postgresql://user:password@localhost:5432/nexux_lend
```

**Get API Keys:**
-   WalletConnect: [cloud.walletconnect.com](https://cloud.walletconnect.com/)

---

## 📁 Project Structure

```
nexux-lend/
├── app/                      # Next.js App Router
│   ├── dashboard/           # Main dashboard pages
│   ├── liquidate/           # Liquidation hub
│   └── page.tsx             # Landing page
├── components/              # React components
│   ├── bridge/              # Bridge components
│   ├── flows/               # Transaction flow widgets (Refactored)
│   └── ui/                  # UI primitives (Radix)
├── contracts/               # Smart contracts (Solidity)
├── hooks/                   # Custom React hooks
├── lib/                     # Utilities and helpers
│   ├── bridge-kit/          # Circle SDK Integration (New)
│   │   ├── adapters.ts      # Viem Adapters
│   │   ├── config.ts        # Singleton Configuration
│   │   └── hooks.ts         # React Query Wrappers
│   ├── bridge/              # Shared bridge utilities
│   ├── contracts.ts         # Contract ABIs & addresses
│   └── constants.ts         # App constants
├── tests/                   # E2E tests
├── docs/                    # Documentation
└── public/                  # Static assets
```

---

## 📚 Documentation

### Arc Network
-   **Official Docs:** [docs.arc.network](https://docs.arc.network)
-   **Block Explorer:** [testnet.arcscan.net](https://testnet.arcscan.net)
-   **Chain ID:** 5042002 (Arc Testnet)

### Circle CCTP
-   **SDK:** `@circle-fin/bridge-kit`
-   **Docs:** [developers.circle.com/cctp](https://developers.circle.com/stablecoins/docs/cctp-getting-started)

---

## 💰 Revenue Model

| Revenue Source | Fee | Notes |
|:---|:---:|:---|
| **Reserve Factor (Lending)** | 10% of interest | Industry standard (Aave: 10-20%) |
| **Bridge Fee** | 0.1% per transfer | Collected automatically via SDK |
| **Flashloan Fee** | 0.09% per loan | Aligned with Aave |

**Example:** 
- Borrow APY: 4% → Suppliers earn: 3.6% | Protocol earns: 0.4%
- Bridge 1000 USDC → User receives: 999 USDC | Treasury earns: 1 USDC

---

## 🤝 Contributing

This is primarily a portfolio project, but contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

**Alexandre Belo**

-   **Role:** Product Designer & Full-Stack Developer
-   **Portfolio:** [alexandrebelo.com.br](https://www.alexandrebelo.com.br)
-   **LinkedIn:** [linkedin.com/in/alexandrebelo](https://www.linkedin.com/in/alexandrebelo/)
-   **Project Purpose:** Arc Network Developer Airdrop Application

---

## 🙏 Acknowledgments

-   **Arc Network** - Testnet infrastructure
-   **Circle** - For the amazing Bridge-Kit SDK
-   **Aave** - Inspiration for health factor algorithm
-   **TanStack** - For Query state management

---

**Built with ❤️ for the Arc Network ecosystem**

**Status:** ✅ Production-Ready v1.1.0
