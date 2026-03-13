import { motion } from 'framer-motion'
import { useAppStore } from '@/store/appStore'
import { formatUSD, formatNumber } from '@/lib/utils'
import { TrendingUp, Users, Zap, Activity, DollarSign, CircleDollarSign } from 'lucide-react'

export function ProtocolBanner() {
  const stats = useAppStore(s => s.protocolStats)

  const items = [
    { label: 'Total Value Locked', value: formatUSD(stats.totalTVL, true), sub: '↑ 12.4% (7d)', icon: TrendingUp, accent: 'elp' },
    { label: 'Total Yield Generated', value: formatUSD(stats.totalYieldGenerated, true), sub: 'All time', icon: Zap, accent: 'elp' },
    { label: 'Active Depositors', value: formatNumber(stats.totalUsersActive), sub: '↑ 84 this week', icon: Users, accent: 'plasma' },
    { label: 'Protocol Transactions', value: formatNumber(stats.totalTransactions, true), sub: 'Since launch', icon: Activity, accent: 'plasma' },
  ]

  const tokenStats = [
    { label: '$ELP Price', value: `$${stats.elpTokenPrice.toFixed(2)}`, color: 'text-elp-400', icon: DollarSign },
    { label: 'Market Cap', value: formatUSD(stats.elpMarketCap, true), color: 'text-white/60', icon: CircleDollarSign },
    { label: 'Circulating', value: `${formatNumber(stats.elpCirculatingSupply / 1_000_000)}M / ${formatNumber(stats.elpTotalSupply / 1_000_000)}M`, color: 'text-white/40', icon: Activity },
  ]

  return (
    <div className="space-y-3">
      {/* Token ticker strip */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-6 px-4 py-2.5 rounded-xl bg-surface-1/60 border border-white/[0.04] overflow-x-auto"
      >
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-elp-400 to-elp-600 flex items-center justify-center">
            <span className="text-[8px] font-bold text-surface-0">⚡</span>
          </div>
          <span className="font-display font-bold text-xs text-white whitespace-nowrap">ELPEDA</span>
        </div>
        <div className="h-4 w-px bg-white/10" />
        {tokenStats.map(stat => (
          <div key={stat.label} className="flex items-center gap-2 whitespace-nowrap">
            <stat.icon className="w-3 h-3 text-white/20 flex-shrink-0" />
            <span className="font-mono text-[10px] text-white/30">{stat.label}</span>
            <span className={`font-mono text-xs font-bold ${stat.color}`}>{stat.value}</span>
          </div>
        ))}
        <div className="h-4 w-px bg-white/10 hidden lg:block" />
        <div className="hidden lg:flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-elp-400 animate-pulse" />
          <span className="font-mono text-[10px] text-white/20">Solana Mainnet</span>
        </div>
      </motion.div>

      {/* Main stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item, i) => {
          const Icon = item.icon
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07 }}
              className="glass-card p-5 relative overflow-hidden group"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                item.accent === 'elp' ? 'bg-elp-500/20' : 'bg-plasma-500/15'
              }`} />
              <div className="flex items-start justify-between mb-3">
                <span className="stat-label">{item.label}</span>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  item.accent === 'elp' ? 'bg-elp-500/10' : 'bg-plasma-500/10'
                }`}>
                  <Icon className={`w-3.5 h-3.5 ${item.accent === 'elp' ? 'text-elp-400' : 'text-plasma-400'}`} />
                </div>
              </div>
              <div className="stat-value text-2xl mb-1">{item.value}</div>
              <div className="text-xs text-white/30 font-mono">{item.sub}</div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
