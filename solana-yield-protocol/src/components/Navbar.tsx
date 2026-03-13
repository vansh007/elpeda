import { motion } from 'framer-motion'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Zap, BarChart3, Vote, TrendingUp, Wallet, Rocket, ArrowLeftRight } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { usePortfolioStats } from '@/hooks/useYieldSimulation'
import { formatUSD } from '@/lib/utils'

const NAV_ITEMS = [
  { id: 'vaults',     label: 'Vaults',     icon: Zap },
  { id: 'swap',       label: 'Swap',       icon: ArrowLeftRight },
  { id: 'portfolio',  label: 'Portfolio',  icon: Wallet },
  { id: 'analytics',  label: 'Analytics',  icon: BarChart3 },
  { id: 'governance', label: 'Governance', icon: Vote },
  { id: 'launch',     label: 'Launch',     icon: Rocket },
] as const

export function Navbar() {
  const activeTab = useAppStore(s => s.activeTab)
  const setActiveTab = useAppStore(s => s.setActiveTab)
  const { totalCurrentValue, positionCount } = usePortfolioStats()

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Backdrop blur bar */}
      <div className="absolute inset-0 border-b border-white/[0.04]"
        style={{ background: 'rgba(3,10,10,0.85)', backdropFilter: 'blur(20px)' }} />

      <div className="relative max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 rounded-lg bg-elp-500/20 animate-pulse-slow" />
            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-elp-400 to-elp-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-surface-0" />
            </div>
          </div>
          <div>
            <span className="font-display font-bold text-lg tracking-tight text-white">ELPEDA</span>
            <span className="font-mono text-[10px] text-elp-400/70 block leading-none -mt-0.5">YIELD INTELLIGENCE</span>
          </div>
        </motion.div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-surface-1/60 border border-white/[0.05] rounded-2xl p-1">
          {NAV_ITEMS.map((item, i) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setActiveTab(item.id)}
                className="relative px-4 py-2 rounded-xl font-display text-sm font-medium transition-colors duration-200 flex items-center gap-2"
                style={{ color: isActive ? '#030a0a' : 'rgba(255,255,255,0.45)' }}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-xl"
                    style={{ background: 'linear-gradient(135deg, #14b8a6, #0d9488)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                  {item.id === 'portfolio' && positionCount > 0 && (
                    <span className="bg-elp-500 text-surface-0 text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {positionCount}
                    </span>
                  )}
                </span>
              </motion.button>
            )
          })}
        </nav>

        {/* Right: portfolio value + wallet */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          {positionCount > 0 && (
            <div className="hidden sm:flex flex-col items-end">
              <span className="font-display font-bold text-sm text-white">{formatUSD(totalCurrentValue)}</span>
              <span className="stat-label text-[9px]">Portfolio Value</span>
            </div>
          )}
          <WalletMultiButton />
        </motion.div>
      </div>
    </header>
  )
}
