import { motion } from 'framer-motion'
import { Zap, ArrowLeftRight, Wallet, BarChart3, Vote, Rocket } from 'lucide-react'
import { useAppStore } from '@/store/appStore'

const MOBILE_ITEMS = [
  { id: 'vaults',     label: 'Vaults',   icon: Zap },
  { id: 'swap',       label: 'Swap',     icon: ArrowLeftRight },
  { id: 'portfolio',  label: 'Portfolio', icon: Wallet },
  { id: 'analytics',  label: 'Analytics', icon: BarChart3 },
  { id: 'governance', label: 'Gov',      icon: Vote },
  { id: 'launch',     label: 'Launch',   icon: Rocket },
] as const

export function MobileNav() {
  const activeTab = useAppStore(s => s.activeTab)
  const setActiveTab = useAppStore(s => s.setActiveTab)

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{ background: 'rgba(3,10,10,0.95)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.04)' }}
    >
      <div className="flex items-center justify-around px-2 py-2 max-w-lg mx-auto">
        {MOBILE_ITEMS.map(item => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="relative flex flex-col items-center gap-0.5 py-1.5 px-2 rounded-xl transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="mobile-pill"
                  className="absolute inset-0 rounded-xl bg-elp-500/10 border border-elp-500/20"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon className={`w-4 h-4 relative ${isActive ? 'text-elp-400' : 'text-white/30'}`} />
              <span className={`text-[9px] font-display font-medium relative ${isActive ? 'text-elp-300' : 'text-white/25'}`}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
