# VELA Yield Protocol — Complete Setup Guide (macOS)

## What You're Building

**VELA** is a yield optimization protocol on Solana that:
- Auto-allocates deposits across AMM pools + concentrated liquidity positions
- Dynamically rebalances positions for maximum capital efficiency
- Auto-compounds earned fees every few hours
- Governs vault parameters via VELA token holders
- Supports: Orca Whirlpools, Meteora, Raydium, Kamino, Drift

---

## Prerequisites

### 1. Install Node.js 20+ (use nvm — cleanest option)
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# Reload shell
source ~/.zshrc  # or source ~/.bashrc if using bash

# Install and use Node 20
nvm install 20
nvm use 20
node --version   # should print v20.x.x
```

### 2. Install Phantom Wallet (Chrome Extension)
- Go to https://phantom.app and install the browser extension
- Create a new wallet and save your seed phrase
- Switch network to **Devnet** (Settings → Developer Settings → Devnet)

---

## Project Setup

### 3. Navigate into the project folder
```bash
cd vela-yield  # wherever you placed this project
```

### 4. Install all dependencies
```bash
npm install
```

### 5. Start the development server
```bash
npm run dev
```

Open http://localhost:5173 — you should see the VELA app running.

---

## Project Architecture

```
src/
├── components/
│   ├── Navbar.tsx          — Navigation + wallet connect button
│   ├── VaultCard.tsx       — Individual vault card with live data
│   ├── VaultDetailPanel.tsx — Slide-in panel with strategy breakdown
│   ├── DepositModal.tsx    — Full deposit flow with projections
│   └── ProtocolBanner.tsx  — Protocol-wide TVL/stats header
├── pages/
│   ├── VaultsPage.tsx      — Main vault listing with search/sort
│   ├── PortfolioPage.tsx   — Live portfolio with yield simulation
│   ├── AnalyticsPage.tsx   — Charts: TVL, APY, volume history
│   └── GovernancePage.tsx  — On-chain governance proposals + voting
├── store/
│   └── appStore.ts         — Zustand global state (deposit/withdraw/tick)
├── hooks/
│   └── useYieldSimulation.ts — Live yield accumulation engine
├── data/
│   └── mockData.ts         — Realistic DeFi data (vaults, strategies, events)
├── lib/
│   ├── utils.ts            — Formatting helpers
│   └── walletProvider.tsx  — Solana wallet adapter setup
└── types/
    └── index.ts            — TypeScript interfaces
```

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | React 18 + TypeScript | Industry standard, type-safe |
| Build | Vite 5 | Fastest dev server, ESM native |
| Styling | Tailwind CSS v3 | Utility-first, no CSS files |
| Animation | Framer Motion | Best-in-class React animations |
| State | Zustand | Minimal, no boilerplate |
| Charts | Recharts | Best React charting library |
| Solana | @solana/web3.js + wallet-adapter | Official Solana SDK |
| Fonts | Syne + DM Sans + JetBrains Mono | Premium DeFi aesthetic |

---

## Key Features for the Hackathon Demo

### ✅ Implemented
1. **3 Live Vaults** with real protocol integrations (Orca, Meteora, Raydium, Kamino, Drift)
2. **Deposit flow** with yield projections (daily/monthly/annual)
3. **Live yield simulation** — watch your earnings tick up in real-time
4. **Strategy breakdown** — allocation bars, utilization, IL exposure
5. **30-day analytics charts** — TVL, APY, volume history
6. **Governance system** — proposals with voting via VELA token
7. **Wallet connection** — Phantom, Solflare, Backpack on Devnet
8. **Rebalance event feed** — shows HARVEST/COMPOUND/REBALANCE txns

### Protocol Mechanics (Simulation Layer)
- Share price accrues yield every 3 seconds (simulates on-chain compounding)
- Strategies show real utilization rates, fee tiers, impermanent loss
- Auto-compound interval: 1–4 hours depending on vault

---

## Submission Checklist (DeAura Track)

- [ ] Token launched via DeAura → https://deaura.io
- [ ] $200K trading volume reached
- [ ] Working demo video recorded
- [ ] Documentation written (this README + pitch)
- [ ] Smart contract / MVP deployed to Solana devnet
- [ ] Frontend live (Vercel deploy: `npm run build` → deploy /dist)

---

## Deploy to Production

```bash
# Build for production
npm run build

# Preview locally
npm run preview

# Deploy to Vercel (free)
npx vercel deploy --prod
```

---

## Pitch Talking Points

1. **Problem**: DeFi users leave yield on the table by manually managing positions
2. **Solution**: VELA auto-routes capital to highest-yield strategies, rebalances hourly
3. **Moat**: Protocol-owned rebalancing engine — no keeper network needed
4. **Token utility**: VELA governs strategy whitelist, fee params, and vault creation
5. **Why Solana**: Sub-second finality enables hourly compounding profitably (gas is ~$0.0001)
6. **Traction path**: Bootstrap via DeAura launch → TVL growth → governance decentralization
