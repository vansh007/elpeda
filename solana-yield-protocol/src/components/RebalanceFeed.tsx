import { motion } from 'framer-motion'
import { Zap, RefreshCw, AlertTriangle, ArrowUpDown } from 'lucide-react'
import { REBALANCE_HISTORY } from '@/data/mockData'
import { formatUSD, formatTimeAgo } from '@/lib/utils'
import type { EventType } from '@/types'

const EVENT_CONFIG: Record<EventType, { icon: typeof Zap; color: string; bg: string }> = {
  HARVEST: { icon: Zap, color: 'text-elp-400', bg: 'bg-elp-500/10' },
  COMPOUND: { icon: RefreshCw, color: 'text-plasma-400', bg: 'bg-plasma-500/10' },
  REBALANCE: { icon: ArrowUpDown, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  RISK_ALERT: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
}

export function RebalanceFeed() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-elp-400 animate-pulse" />
          <span className="stat-label">Live Protocol Activity</span>
        </div>
        <span className="font-mono text-[10px] text-white/20">{REBALANCE_HISTORY.length} recent events</span>
      </div>

      <div className="space-y-3">
        {REBALANCE_HISTORY.map((event, i) => {
          const config = EVENT_CONFIG[event.type]
          const Icon = config.icon

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.08 }}
              className="flex items-start gap-3 p-3 rounded-xl bg-surface-0/30 border border-white/[0.03] hover:border-white/[0.06] transition-colors"
            >
              <div className={`w-7 h-7 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                <Icon className={`w-3.5 h-3.5 ${config.color}`} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-mono text-[10px] font-bold ${config.color}`}>{event.type}</span>
                  <span className="font-mono text-[10px] text-white/20">•</span>
                  <span className="font-mono text-[10px] text-white/30">{event.vaultName}</span>
                  {event.amountHarvested && (
                    <>
                      <span className="font-mono text-[10px] text-white/20">•</span>
                      <span className="font-mono text-[10px] text-elp-400">+{formatUSD(event.amountHarvested)}</span>
                    </>
                  )}
                </div>
                <p className="text-white/40 text-xs font-body leading-relaxed line-clamp-2">{event.reasoning}</p>
              </div>

              <span className="font-mono text-[9px] text-white/15 flex-shrink-0">{formatTimeAgo(event.timestamp)}</span>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
