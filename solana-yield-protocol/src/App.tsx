import { AnimatePresence, motion } from 'framer-motion'
import { useAppStore } from '@/store/appStore'
import { Navbar } from '@/components/Navbar'
import { VaultsPage } from '@/pages/VaultsPage'
import { PortfolioPage } from '@/pages/PortfolioPage'
import { AnalyticsPage } from '@/pages/AnalyticsPage'
import { GovernancePage } from '@/pages/GovernancePage'
import { DepositModal } from '@/components/DepositModal'
import { VaultDetailPanel } from '@/components/VaultDetailPanel'
import { LaunchPage } from '@/pages/LaunchPage'
import { SwapPage } from '@/pages/SwapPage'
import { MobileNav } from '@/components/MobileNav'
import { Footer } from '@/components/Footer'

const PAGE_TITLES: Record<string, string> = {
  vaults: 'Vaults',
  swap: 'Swap',
  portfolio: 'Portfolio',
  analytics: 'Analytics',
  governance: 'Governance',
  launch: 'Launch',
}

export function App() {
  const activeTab = useAppStore(s => s.activeTab)

  return (
    <div className="min-h-screen bg-surface-0 relative">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-100" />
        <div className="absolute top-0 left-0 right-0 h-96 bg-radial-elp" />
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-radial-plasma" />
        <div className="absolute bottom-0 left-1/4 w-96 h-64"
          style={{ background: 'radial-gradient(ellipse, rgba(20,184,166,0.04) 0%, transparent 70%)' }} />
      </div>

      <Navbar />

      {/* Main content */}
      <main className="relative pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Page title */}
          <motion.div
            key={activeTab + '-title'}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-4 rounded-full bg-elp-400" />
              <span className="stat-label">{PAGE_TITLES[activeTab]}</span>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {activeTab === 'vaults' && (
              <motion.div key="vaults" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <VaultsPage />
              </motion.div>
            )}
            {activeTab === 'swap' && (
              <motion.div key="swap" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <SwapPage />
              </motion.div>
            )}
            {activeTab === 'portfolio' && (
              <motion.div key="portfolio" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <PortfolioPage />
              </motion.div>
            )}
            {activeTab === 'analytics' && (
              <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <AnalyticsPage />
              </motion.div>
            )}
            {activeTab === 'governance' && (
              <motion.div key="governance" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <GovernancePage />
              </motion.div>
            )}
            {activeTab === 'launch' && (
              <motion.div key="launch" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <LaunchPage />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Modals */}
      <DepositModal />
      <VaultDetailPanel />
      <MobileNav />
      <Footer />
    </div>
  )
}
