# Nexux Lend

![Nexux Lend Banner](public/logo-full.svg)

> **The Leading DeFi Lending Protocol on Arc Network**

A modern, secure, and capital-efficient lending platform with native cross-chain bridge powered by Circle's CCTP (Cross-Chain Transfer Protocol).

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16.0.7-black)](https://nextjs.org/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-blue)](https://soliditylang.org/)
[![CCTP](https://img.shields.io/badge/Circle-CCTP-00D4FF)](https://www.circle.com/en/cross-chain-transfer-protocol)

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

### 🌉 Cross-Chain Bridge (Circle CCTP)
-   ✅ **12 Chains Supported** - 6 testnets + 6 mainnets (Ethereum, Avalanche, Polygon, Optimism, Arbitrum, Base)
-   ✅ **Real Fee Collection** - 0.1% fee automatically sent to treasury
-   ✅ **Stuck Transaction Detection** - Alerts for transfers > 30 minutes
-   ✅ **Circuit Breaker** - Exponential backoff with jitter for reliability
-   ✅ **Status Tracking** - Persistent localStorage for resuming transfers

### 📊 Advanced Analytics
-   ✅ **Dashboard** - Comprehensive position overview with charts
-   ✅ **Health Factor History** - Track liquidation risk over time
-   ✅ **Bridge Analytics** - Volume, fees, and success rate tracking
-   ✅ **Asset Distribution** - Portfolio visualization

### 🎨 Premium UX
-   ✅ **Chain Logos** - Professional SVG logos for all supported networks
-   ✅ **PWA Support** - Install as mobile/desktop app
-   ✅ **Dark Mode** - Eye-friendly interface with glassmorphism
-   ✅ **Responsive Design** - Mobile-first, tablet, desktop optimized
-   ✅ **Wallet Integration** - MetaMask, WalletConnect, Rainbow, Coinbase
-   ✅ **Transaction Notifications** - Real-time status updates
-   ✅ **Liquidation Alerts** - Automated risk warnings (HF < 1.5)

---

## 🛠 Tech Stack

### Frontend
-   [Next.js 16](https://nextjs.org/) - React framework with App Router
-   [TypeScript](https://www.typescriptlang.org/) - Type safety
-   [Tailwind CSS](https://tailwindcss.com/) + [Radix UI](https://www.radix-ui.com/) - Styling & components
-   [Framer Motion](https://www.framer.com/motion/) - Animations

### Web3
-   [Wagmi v2](https://wagmi.sh/) - React hooks for Ethereum
-   [Viem](https://viem.sh/) - TypeScript Ethereum library
-   [RainbowKit](https://www.rainbowkit.com/) - Wallet connection
-   **Circle CCTP** - Manual SDK implementation (not Bridge-Kit)

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

# Run E2E tests in headed mode
npm run test:headed
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

# Alchemy (Optional - for better RPC performance)
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key

# Contract Addresses (Auto-configured for Arc Testnet)
# Override only if deploying custom contracts
```

**Get API Keys:**
-   WalletConnect: [cloud.walletconnect.com](https://cloud.walletconnect.com/)
-   Alchemy: [alchemy.com](https://www.alchemy.com/)

---

## 📁 Project Structure

```
nexux-lend/
├── app/                      # Next.js App Router
│   ├── dashboard/           # Main dashboard pages
│   │   ├── analytics/       # Analytics & charts
│   │   ├── borrow/          # Borrow interface
│   │   ├── bridge/          # CCTP bridge
│   │   ├── settings/        # User settings
│   │   ├── supply/          # Supply interface
│   │   └── transactions/    # Transaction history
│   ├── liquidate/           # Liquidation hub
│   └── page.tsx             # Landing page
├── components/              # React components
│   ├── bridge/              # Bridge components
│   ├── dashboard/           # Dashboard components
│   ├── flows/               # Transaction flow modals
│   └── ui/                  # UI primitives (Radix)
├── contracts/               # Smart contracts (Solidity)
│   ├── src/                 # Contract source files
│   │   ├── LendingPool.sol  # Main lending contract
│   │   ├── PriceOracle.sol  # Price oracle
│   │   └── mocks/           # Mock contracts
│   ├── script/              # Foundry deploy scripts
│   └── test/                # Contract tests
├── hooks/                   # Custom React hooks
├── lib/                     # Utilities and helpers
│   ├── cctp/                # CCTP implementation
│   │   ├── bridge.ts        # Manual CCTP SDK
│   │   ├── config.ts        # Chain configurations
│   │   ├── status.ts        # Status tracking
│   │   ├── retry.ts         # Circuit breaker
│   │   └── analytics.ts     # Bridge analytics
│   ├── contracts.ts         # Contract ABIs & addresses
│   ├── healthFactor.ts      # HF calculations
│   ├── wagmi.ts             # Wagmi configuration
│   └── constants.ts         # App constants
├── tests/                   # E2E tests
│   └── e2e/
│       └── bridge.spec.ts   # Bridge flow tests
├── docs/                    # Documentation
│   └── BRIDGE.md            # Bridge technical guide
└── public/                  # Static assets
```

---

## 📚 Documentation

### Arc Network
-   **Official Docs:** [docs.arc.network](https://docs.arc.network)
-   **Testnet Faucet:** [faucet.arc.network](https://faucet.arc.network)
-   **Block Explorer:** [testnet.arcscan.net](https://testnet.arcscan.net)
-   **Chain ID:** 5042002 (Arc Testnet)

### Circle CCTP
-   **CCTP Overview:** [circle.com/cctp](https://www.circle.com/en/cross-chain-transfer-protocol)
-   **Developer Docs:** [developers.circle.com/cctp](https://developers.circle.com/stablecoins/docs/cctp-getting-started)
-   **Supported Networks:** [CCTP Networks](https://developers.circle.com/stablecoins/docs/supported-domains)

### Project Docs
-   **Bridge Guide:** [docs/BRIDGE.md](docs/BRIDGE.md)
-   **Health Factor Analysis:** [Artifacts](C:\Users\AB\.gemini\antigravity\brain\dc514b19-7822-4ada-aa88-503e5f20185b\health_factor_analysis.md) *(internal)*
-   **Fee Manual:** [Artifacts](C:\Users\AB\.gemini\antigravity\brain\dc514b19-7822-4ada-aa88-503e5f20185b\fee_manual.md) *(internal)*
-   **PRD V2:** [Artifacts](C:\Users\AB\.gemini\antigravity\brain\dc514b19-7822-4ada-aa88-503e5f20185b\prd_v2.md) *(internal)*

---

## 💰 Revenue Model

| Revenue Source | Fee | Notes |
|:---|:---:|:---|
| **Reserve Factor (Lending)** | 10% of interest | Industry standard (Aave: 10-20%) |
| **Bridge Fee** | 0.1% per transfer | Competitive vs bridges |
| **Flashloan Fee** | 0.09% per loan | Aligned with Aave |
| **Liquidation Protocol Cut** | 2% of bonus | Unique vs Aave/Compound |

**Example:** 
- Borrow APY: 4% → Suppliers earn: 3.6% | Protocol earns: 0.4%
- Bridge 1000 USDC → User receives: 999 USDC | Treasury earns: 1 USDC

---

## 🧪 Testing

### Manual Testing Checklist
-   [ ] Connect wallet (MetaMask, WalletConnect)
-   [ ] Supply assets (USDC, EURC, USYC)
-   [ ] Borrow against collateral
-   [ ] Monitor health factor changes
-   [ ] Repay borrowed amount
-   [ ] Withdraw supplied assets
-   [ ] Bridge tokens across chains (Sepolia → Fuji)
-   [ ] Check analytics dashboard (charts, history)
-   [ ] Test liquidation alerts (simulate low HF)
-   [ ] Verify settings persistence

### Automated Testing
```bash
# Run E2E test suite (Playwright)
npm test

# Tests include:
# - Complete bridge flow (approve → burn → attestation → mint)
# - Stuck transaction detection
# - Minimum amount validation
# - Analytics tracking
```

### Test Networks
-   **Arc Testnet:** [faucet.arc.network](https://faucet.arc.network)
-   **Circle Faucet:** [faucet.circle.com](https://faucet.circle.com) (USDC/EURC)
-   **Ethereum Sepolia:** [sepoliafaucet.com](https://sepoliafaucet.com/)

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

#Deploy to production
vercel --prod
```

**Configure in Vercel Dashboard:**
1. Add environment variables (`NEXT_PUBLIC_*`)
2. Set build command: `npm run build`
3. Set output directory: `.next`
4. Enable automatic deployments

### Netlify (Alternative)

```bash
# Push to GitHub
git push origin main

# Netlify will auto-deploy from main branch
```

**Configure in netlify.toml** (already included):
-   Build command: `npm run build`
-   Publish directory: `.next`

---

## 🤝 Contributing

This is primarily a portfolio project, but contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Development Guidelines:**
-   Write meaningful commit messages
-   Add tests for new features
-   Update documentation
-   Follow existing code style (ESLint + Prettier)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

**Alexandre Belo**

-   **Role:** Product Designer & Full-Stack Developer
-   **Portfolio:** [alexandrebelo.com.br](https://www.alexandrebelo.com.br)
-   **LinkedIn:** [linkedin.com/in/alexandrebelo](https://www.linkedin.com/in/alexandrebelo/)
-   **Instagram:** [@alexandrebelo](https://www.instagram.com/alexandrebelo/)
-   **Project Purpose:** Arc Network Developer Airdrop Application

---

## 🙏 Acknowledgments

-   **Arc Network** - Testnet infrastructure and developer resources
-   **Circle** - CCTP SDK and cross-chain technology
-   **Aave** - Inspiration for health factor algorithm
-   **Radix UI** - Accessible component primitives
-   **Wagmi & Viem** - Excellent Web3 DX

---

## 🔗 Links

-   **Live Demo:** [Coming Soon - Mainnet Launch]
-   **Documentation:** [docs/BRIDGE.md](docs/BRIDGE.md)
-   **GitHub:** [github.com/oalexandrebelo/dApp_AB](https://github.com/oalexandrebelo/dApp_AB)
-   **Arc Network:** [arc.network](https://arc.network)
-   **Circle CCTP:** [circle.com/cctp](https://www.circle.com/en/cross-chain-transfer-protocol)

---

## 📞 Support

For questions or issues:

-   **GitHub Issues:** [Open an issue](https://github.com/oalexandrebelo/dApp_AB/issues)
-   **LinkedIn:** [Alexandre Belo](https://www.linkedin.com/in/alexandrebelo/)
-   **Email:** [Contact via LinkedIn](https://www.linkedin.com/in/alexandrebelo/)

---

## 🔐 Security

### Audits
⏳ **Planned:** CertiK audit before mainnet launch

### Bug Bounty
⏳ **Planned:** Immunefi program ($500k max payout)

### Report Vulnerabilities
Please report security vulnerabilities privately via:
-   LinkedIn: [@alexandrebelo](https://www.linkedin.com/in/alexandrebelo/)
-   **Do NOT** open public GitHub issues for security concerns

---

## 🗺️ Roadmap V2

See [PRD V2](C:\Users\AB\.gemini\antigravity\brain\dc514b19-7822-4ada-aa88-503e5f20185b\prd_v2.md) *(internal)* for detailed roadmap.

**Q1 2025:**
-   ✅ Testnet launch (Complete)
-   ⏳ Security audit
-   ⏳ Arc Mainnet launch

**Q2 2025:**
-   ⏳ Add WBTC, ETH, stETH
-   ⏳ Launch governance (NEXUX token)
-   ⏳ Deploy to Ethereum/Avalanche mainnets

**Q3-Q4 2025:**
-   ⏳ Mobile app (iOS + Android)
-   ⏳ Advanced analytics
-   ⏳ Insurance module

---

**Built with ❤️ for the Arc Network ecosystem**

**Status:** ✅ Production-Ready for Testnet | ⏳ Mainnet Preparation in Progress
