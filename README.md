# Nexux Lend

![Nexux Lend](public/logo-full.svg)

> **Decentralized Lending Protocol on Arc Network**

A modern DeFi lending platform built on Arc Network with cross-chain bridge capabilities powered by Circle's CCTP (Cross-Chain Transfer Protocol).

---

## 📖 About

**Nexux Lend** is a decentralized lending protocol that enables users to:
- **Supply** assets and earn interest
- **Borrow** against collateral with competitive rates
- **Bridge** tokens across multiple networks using Circle CCTP
- **Monitor** positions with real-time analytics
- **Manage** liquidation risks with automated alerts

Built as a portfolio project by **Alexandre Belo** to demonstrate full-stack DeFi development capabilities for the Arc Network Developer Airdrop program.

---

## ✨ Features

### Core Lending
- ✅ **Supply & Earn** - Deposit USDC, EURC, or USYC and earn competitive APY
- ✅ **Borrow** - Borrow against your supplied collateral
- ✅ **Repay & Withdraw** - Manage your positions with ease
- ✅ **Health Factor Monitoring** - Real-time liquidation risk tracking
- ✅ **E-Mode Support** - Efficiency mode for correlated assets

### Cross-Chain Bridge
- ✅ **Circle CCTP Integration** - Native USDC bridging across chains
- ✅ **Multi-Network Support** - Ethereum, Avalanche, Polygon, Arc Testnet
- ✅ **Instant Transfers** - Fast cross-chain asset movement
- ✅ **Low Fees** - 0.1% bridge fee

### Analytics & Monitoring
- ✅ **Dashboard** - Comprehensive position overview
- ✅ **Transaction History** - Complete activity log
- ✅ **APY Charts** - Historical rate tracking
- ✅ **Asset Distribution** - Portfolio visualization
- ✅ **Health Factor History** - Risk trend analysis

### User Experience
- ✅ **PWA Support** - Install as mobile/desktop app
- ✅ **Dark Mode** - Eye-friendly interface
- ✅ **Responsive Design** - Mobile, tablet, desktop optimized
- ✅ **Wallet Integration** - MetaMask, WalletConnect, Rainbow
- ✅ **Transaction Notifications** - Real-time status updates
- ✅ **Liquidation Alerts** - Automated risk warnings

---

## 🛠 Tech Stack

### Frontend
- **[Next.js 16](https://nextjs.org/)** - React framework with App Router
- **[React 18](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- **[Framer Motion](https://www.framer.com/motion/)** - Animations

### Web3
- **[Wagmi v2](https://wagmi.sh/)** - React hooks for Ethereum
- **[Viem](https://viem.sh/)** - TypeScript Ethereum library
- **[RainbowKit](https://www.rainbowkit.com/)** - Wallet connection UI
- **[@circle-fin/bridge-kit](https://www.circle.com/en/cross-chain-transfer-protocol)** - Circle CCTP SDK

### UI Components
- **[Radix UI](https://www.radix-ui.com/)** - Accessible primitives
- **[Lucide React](https://lucide.dev/)** - Icon library
- **[Recharts](https://recharts.org/)** - Data visualization
- **[cmdk](https://cmdk.paco.me/)** - Command palette

### Smart Contracts
- **[Solidity](https://soliditylang.org/)** - Contract language
- **[Foundry](https://getfoundry.sh/)** - Development framework

---

## 📚 Documentation

### Arc Network
- **Official Docs:** https://docs.arc.network
- **Testnet Faucet:** https://faucet.arc.network
- **Block Explorer:** https://testnet.arcscan.net
- **Chain ID:** 5042002 (Arc Testnet)

### Circle CCTP
- **CCTP Overview:** https://www.circle.com/en/cross-chain-transfer-protocol
- **Developer Docs:** https://developers.circle.com/stablecoins/docs/cctp-getting-started
- **Bridge Kit SDK:** https://developers.circle.com/stablecoins/docs/bridge-kit-quickstart
- **Testnet Guide:** https://developers.circle.com/stablecoins/transfer-usdc-on-testnet-from-ethereum-to-avalanche

### Supported Networks
| Network | Chain ID | USDC Address |
|---------|----------|--------------|
| Ethereum Sepolia | 11155111 | [View Docs](https://developers.circle.com/stablecoins/docs/usdc-on-test-networks) |
| Avalanche Fuji | 43113 | [View Docs](https://developers.circle.com/stablecoins/docs/usdc-on-test-networks) |
| Polygon Amoy | 80002 | [View Docs](https://developers.circle.com/stablecoins/docs/usdc-on-test-networks) |
| Arc Testnet | 5042002 | Custom Deployment |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- MetaMask or compatible Web3 wallet
- Testnet tokens (USDC, EURC, USYC)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/nexux-lend.git
cd nexux-lend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Add your environment variables
# NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
# NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key
```

### Development

```bash
# Run development server
npm run dev

# Open http://localhost:3000
```

### Build

```bash
# Create production build
npm run build

# Start production server
npm start
```

---

## 📁 Project Structure

```
nexux-lend/
├── app/                      # Next.js App Router
│   ├── dashboard/           # Dashboard pages
│   │   ├── analytics/       # Analytics page
│   │   ├── borrow/          # Borrow page
│   │   ├── bridge/          # Bridge page
│   │   ├── settings/        # Settings page
│   │   ├── supply/          # Supply page
│   │   └── transactions/    # Transactions page
│   ├── liquidate/           # Liquidation page
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page
├── components/              # React components
│   ├── analytics/           # Analytics components
│   ├── bridge/              # Bridge components
│   ├── dashboard/           # Dashboard components
│   ├── flows/               # Transaction flow modals
│   ├── liquidator/          # Liquidation components
│   └── ui/                  # UI primitives (Radix)
├── contracts/               # Smart contracts (Solidity)
│   ├── src/                 # Contract source files
│   ├── script/              # Deployment scripts
│   └── test/                # Contract tests
├── hooks/                   # Custom React hooks
├── lib/                     # Utilities and helpers
│   ├── bridgeKit.ts         # Circle CCTP integration
│   ├── contracts.ts         # Contract ABIs and addresses
│   ├── wagmi.ts             # Wagmi configuration
│   └── ...
├── public/                  # Static assets
└── styles/                  # Global styles
```

---

## 🎨 Design System

### Colors
- **Primary:** Blue (#5D9CDB) - Actions, links
- **Success:** Green - Positive states
- **Warning:** Yellow - Caution states
- **Danger:** Red - Critical states, liquidation risk
- **Background:** Dark gradient

### Typography
- **Font:** Inter (Google Fonts)
- **Headings:** Bold, tracking-tight
- **Body:** Regular, readable line-height

### Components
- **Buttons:** Blue gradient with hover effects
- **Cards:** Glass morphism with subtle borders
- **Inputs:** Blue borders, focus states
- **Modals:** Centered, animated entry/exit
- **Toasts:** Bottom-right, auto-dismiss

---

## 🔧 Configuration

### Environment Variables

Create `.env.local` with:

```env
# WalletConnect (Required)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Alchemy (Optional - for better RPC)
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key

# Contract Addresses (Arc Testnet)
NEXT_PUBLIC_LENDING_POOL_ADDRESS=0xYourContractAddress
NEXT_PUBLIC_USDC_ADDRESS=0xYourUSDCAddress
NEXT_PUBLIC_EURC_ADDRESS=0xYourEURCAddress
NEXT_PUBLIC_USYC_ADDRESS=0xYourUSYCAddress
```

### Supported Wallets
- MetaMask
- WalletConnect
- Rainbow Wallet
- Coinbase Wallet
- Trust Wallet

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] Connect wallet (MetaMask, WalletConnect)
- [ ] Supply assets (USDC, EURC, USYC)
- [ ] Borrow against collateral
- [ ] Repay borrowed amount
- [ ] Withdraw supplied assets
- [ ] Bridge tokens across chains
- [ ] Check analytics dashboard
- [ ] Test liquidation alerts
- [ ] Verify transaction history
- [ ] Test settings persistence

### Test Networks
- Arc Testnet: https://faucet.arc.network
- Circle Faucet: https://faucet.circle.com

---

## 🚢 Deployment

### Netlify

1. **Connect Repository**
   ```bash
   # Push to GitHub
   git push origin main
   ```

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: 18+

3. **Set Environment Variables**
   - Add all `NEXT_PUBLIC_*` variables in Netlify dashboard

4. **Deploy**
   - Automatic deployment on push to main

### Vercel (Alternative)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

---

## 🤝 Contributing

This is a portfolio project, but suggestions and feedback are welcome!

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
- **Portfolio:** [www.alexandrebelo.com.br](https://www.alexandrebelo.com.br)
- **LinkedIn:** [linkedin.com/in/alexandrebelo](https://www.linkedin.com/in/alexandrebelo/)
- **Instagram:** [@alexandrebelo](https://www.instagram.com/alexandrebelo/)
- **Role:** Product Designer & Full-Stack Developer
- **Project Purpose:** Arc Network Developer Airdrop Application

---

## 🙏 Acknowledgments

- **Arc Network** - For the testnet infrastructure and developer resources
- **Circle** - For CCTP SDK and cross-chain bridge technology
- **Radix UI** - For accessible component primitives
- **Wagmi & Viem** - For excellent Web3 developer experience

---

## 📞 Support

For questions or issues:
- **GitHub Issues:** Open an issue on this repository
- **LinkedIn:** [Alexandre Belo](https://www.linkedin.com/in/alexandrebelo/)
- **Instagram:** [@alexandrebelo](https://www.instagram.com/alexandrebelo/)
- **Website:** [www.alexandrebelo.com.br](https://www.alexandrebelo.com.br)

---

**Built with ❤️ for the Arc Network ecosystem**
