import { motion } from 'framer-motion'
import { useState } from 'react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { useAppStore } from '@/store/appStore'
import { generateHistoricalData } from '@/data/mockData'
import { formatUSD, formatAPY } from '@/lib/utils'
import { REBALANCE_HISTORY } from '@/data/mockData'
import { formatTimeAgo } from '@/lib/utils'
import { RefreshCw, Zap, ArrowLeftRight } from 'lucide-react'

const VAULT_COLORS = ['#14b8a6', '#8b5cf6', '#f59e0b', '#3b82f6', '#ec4899', '#22c55e']

const EVENT_ICONS = {
  HARVEST: Zap,
  COMPOUND: RefreshCw,
  REBALANCE: ArrowLeftRight,
  RISK_ALERT: Zap,
}
const EVENT_COLORS = {
  HARVEST: 'text-elp-400',
  COMPOUND: 'text-plasma-400',
  REBALANCE: 'text-amber-400',
  RISK_ALERT: 'text-red-400',
}

export function AnalyticsPage() {
  const vaults = useAppStore(s => s.vaults)
  const [selectedVault, setSelectedVault] = useState(vaults[0].id)

  const vault = vaults.find(v => v.id === selectedVault)!
  const history = generateHistoricalData(selectedVault)
  const chartData = history.map(d => ({
    date: new Date(d.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    tvl: parseFloat((d.tvl / 1_000_000).toFixed(3)),
    apy: parseFloat(d.apy.toFixed(2)),
    price: parseFloat(d.sharePrice.toFixed(4)),
    volume: parseFloat((d.volume / 1_000).toFixed(1)),
  }))

  const allocationData = vault.strategies.map(s => ({
    name: s.protocol,
    value: s.allocation,
    apy: s.apy,
  }))

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
      return (
        <div className="p-3 rounded-xl border border-white/10" style={{ background: '#0b1f1f', fontSize: '11px' }}>
          <div className="text-white/40 mb-2">{label}</div>
          {payload.map((p: any) => (
            <div key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</div>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Vault selector */}
      <div className="flex gap-2">
        {vaults.map(v => (
          <button
            key={v.id}
            onClick={() => setSelectedVault(v.id)}
            className={`px-4 py-2 rounded-xl font-display text-sm font-medium transition-all duration-200 ${
              selectedVault === v.id
                ? 'bg-elp-500/15 border border-elp-500/30 text-elp-300'
                : 'border border-white/[0.06] text-white/40 hover:text-white/60 hover:border-white/10'
            }`}
          >
            {v.symbol}
          </button>
        ))}
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Current APY', value: formatAPY(vault.totalAPY) },
          { label: 'Share Price', value: `$${vault.sharePrice.toFixed(4)}` },
          { label: 'Total Harvested', value: formatUSD(vault.totalHarvested, true) },
        ].map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }} className="glass-card p-4"
          >
            <div className="stat-label mb-1">{k.label}</div>
            <div className="font-display font-bold text-xl elp-gradient-text">{k.value}</div>
          </motion.div>
        ))}
      </div>

      {/* TVL chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="glass-card p-6"
      >
        <div className="stat-label mb-4">TVL History (30d) — Millions USD</div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="tvlGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 9 }} tickLine={false} axisLine={false} interval={6} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 9 }} tickLine={false} axisLine={false} tickFormatter={v => `$${v}M`} />
              <Tooltip content={customTooltip} />
              <Area type="monotone" dataKey="tvl" name="TVL ($M)" stroke="#14b8a6" strokeWidth={2} fill="url(#tvlGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* APY + Volume charts side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <div className="stat-label mb-4">APY Over Time</div>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="apyGradA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 9 }} tickLine={false} axisLine={false} interval={7} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 9 }} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
                <Tooltip content={customTooltip} />
                <Area type="monotone" dataKey="apy" name="APY %" stroke="#8b5cf6" strokeWidth={2} fill="url(#apyGradA)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="glass-card p-6"
        >
          <div className="stat-label mb-4">Protocol Volume & Revenue ($K)</div>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 9 }} tickLine={false} axisLine={false} interval={7} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 9 }} tickLine={false} axisLine={false} tickFormatter={v => `$${v}K`} />
                <Tooltip content={customTooltip} />
                <Bar dataKey="volume" name="Volume" fill="rgba(94, 234, 212, 0.4)" stackId="a" radius={[2, 2, 0, 0]} />
                <Bar dataKey="apy" name="Fees" fill="#8b5cf6" stackId="a" radius={[2, 2, 0, 0]} opacity={0.6} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Strategy allocation pie + rebalance log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <div className="stat-label mb-4">Strategy Allocation</div>
          <div className="h-48 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={allocationData} cx="50%" cy="50%" innerRadius={55} outerRadius={80}
                  paddingAngle={4} dataKey="value"
                >
                  {allocationData.map((_, i) => (
                    <Cell key={i} fill={VAULT_COLORS[i % VAULT_COLORS.length]} opacity={0.85} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => [`${v}%`, 'Allocation']}
                  contentStyle={{ background: '#0b1f1f', border: '1px solid rgba(20,184,166,0.2)', borderRadius: '12px', fontSize: '11px' }}
                />
                <Legend formatter={(v) => <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          className="glass-card p-6"
        >
          <div className="stat-label mb-4">Recent Protocol Events</div>
          <div className="space-y-3">
            {REBALANCE_HISTORY.map((evt, i) => {
              const Icon = EVENT_ICONS[evt.type]
              const colorClass = EVENT_COLORS[evt.type]
              return (
                <motion.div key={evt.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                  className="flex items-center gap-3 py-2 border-b border-white/[0.04] last:border-0"
                >
                  <div className={`w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-xs font-medium ${colorClass}`}>{evt.type}</span>
                      {evt.amountHarvested && (
                        <span className="font-mono text-xs text-white/50">+{formatUSD(evt.amountHarvested)}</span>
                      )}
                    </div>
                    <div className="font-mono text-[10px] text-white/25">{evt.txHash} · {formatTimeAgo(evt.timestamp)}</div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
