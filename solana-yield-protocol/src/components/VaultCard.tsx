import { motion } from 'framer-motion'
import { ArrowRight, RefreshCw, Zap, Shield, TrendingUp, Clock } from 'lucide-react'
import type { Vault } from '@/types'
import { useAppStore } from '@/store/appStore'
import { formatUSD, formatAPY, formatTimeAgo, riskBg } from '@/lib/utils'
import { TOKEN_ICONS } from '@/data/mockData'

interface VaultCardProps {
  vault: Vault
  index: number
}

const STRATEGY_TYPE_COLORS: Record<string, string> = {
  CLMM: 'tag-elp',
  AMM_LP: 'tag-plasma',
  LENDING: 'tag-amber',
  DELTA_NEUTRAL: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
}

export function VaultCard({ vault, index }: VaultCardProps) {
  const openDepositModal = useAppStore(s => s.openDepositModal)
  const setSelectedVault = useAppStore(s => s.setSelectedVault)
  const userPositions = useAppStore(s => s.userPositions)
  const userPos = userPositions.find(p => p.vaultId === vault.id)

  const strategyTypes = [...new Set(vault.strategies.map(s => s.type))]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 200, damping: 20 }}
      className="glass-card-hover p-6 group cursor-pointer"
      onClick={() => setSelectedVault(vault.id)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-elp-500/20 to-elp-700/20 border border-elp-500/20 flex items-center justify-center relative">
              <span className="text-lg">{TOKEN_ICONS[vault.depositToken] || '🪙'}</span>
              <span className="absolute -bottom-1 -right-1 text-[8px] font-display font-bold bg-surface-1 border border-white/[0.06] text-elp-300 px-1 rounded-md">{vault.symbol}</span>
            </div>
            {vault.status === 'REBALANCING' && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center"
              >
                <RefreshCw className="w-2.5 h-2.5 text-surface-0" />
              </motion.div>
            )}
            {vault.status === 'ACTIVE' && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-elp-400 rounded-full">
                <div className="absolute inset-0 bg-elp-400 rounded-full animate-ping opacity-70" />
              </div>
            )}
          </div>
          <div>
            <h3 className="font-display font-semibold text-white text-base leading-tight">{vault.name}</h3>
            <div className="flex items-center gap-1.5 mt-1">
              {strategyTypes.map(t => (
                <span key={t} className={`tag text-[10px] px-1.5 py-0.5 ${STRATEGY_TYPE_COLORS[t]}`}>
                  {t === 'CLMM' ? 'Conc. Liq' : t === 'AMM_LP' ? 'AMM' : t === 'LENDING' ? 'Lending' : 'Δ-Neutral'}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="font-display font-bold text-2xl elp-gradient-text">
            {formatAPY(vault.totalAPY)}
          </div>
          <div className="stat-label text-[10px]">APY</div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        <div>
          <div className="stat-label mb-1">TVL</div>
          <div className="stat-value text-base">{formatUSD(vault.totalTVL, true)}</div>
        </div>
        <div>
          <div className="stat-label mb-1">Strategies</div>
          <div className="stat-value text-base">{vault.strategies.length}</div>
        </div>
        <div>
          <div className="stat-label mb-1">Perf. Fee</div>
          <div className="stat-value text-base">{vault.performanceFee}%</div>
        </div>
      </div>

      {/* Strategy allocation mini-bars */}
      <div className="mb-5">
        <div className="stat-label mb-2">Strategy Allocation</div>
        <div className="flex gap-1 h-1.5 rounded-full overflow-hidden">
          {vault.strategies.map((s, i) => {
            const colors = ['#14b8a6', '#8b5cf6', '#f59e0b', '#3b82f6']
            return (
              <motion.div
                key={s.id}
                initial={{ width: 0 }}
                animate={{ width: `${s.allocation}%` }}
                transition={{ delay: index * 0.1 + i * 0.05 + 0.3, duration: 0.6, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ backgroundColor: colors[i % colors.length] }}
                title={`${s.name}: ${s.allocation}%`}
              />
            )
          })}
        </div>
        <div className="flex justify-between mt-1.5">
          {vault.strategies.map((s, i) => {
            const colors = ['text-elp-400', 'text-plasma-400', 'text-amber-400', 'text-blue-400']
            return (
              <span key={s.id} className={`font-mono text-[10px] ${colors[i % colors.length]}`}>
                {s.protocol} {s.allocation}%
              </span>
            )
          })}
        </div>
      </div>

      {/* User position (if any) */}
      {userPos && (
        <div className="mb-4 p-3 rounded-xl border border-elp-500/20 bg-elp-500/5">
          <div className="flex justify-between items-center">
            <div>
              <div className="stat-label text-[9px] mb-0.5">Your Position</div>
              <div className="font-display font-semibold text-elp-300 text-sm">
                {formatUSD(userPos.currentValue)}
              </div>
            </div>
            <div className="text-right">
              <div className="stat-label text-[9px] mb-0.5">Yield Earned</div>
              <div className="font-mono text-xs text-elp-400">+{formatUSD(userPos.yieldEarned)}</div>
            </div>
            <div className="text-right">
              <div className="stat-label text-[9px] mb-0.5">PnL</div>
              <div className={`font-mono text-xs ${userPos.pnlPercent >= 0 ? 'text-elp-400' : 'text-red-400'}`}>
                {userPos.pnlPercent >= 0 ? '+' : ''}{userPos.pnlPercent.toFixed(3)}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-white/30">
          <Clock className="w-3 h-3" />
          <span className="font-mono text-[10px]">Harvest {formatTimeAgo(vault.lastHarvest)}</span>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => { e.stopPropagation(); openDepositModal(vault.id) }}
            className="btn-primary py-2 px-4 text-xs"
          >
            Deposit
          </motion.button>
          <motion.button
            whileHover={{ x: 3 }}
            className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-white/40 hover:text-elp-400 hover:border-elp-500/30 transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
