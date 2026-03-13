import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, TrendingUp, Shield, Zap, RefreshCw, AlertCircle } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { formatUSD, formatAPY, formatTimeAgo, riskColor, riskBg, strategyTypeLabel } from '@/lib/utils'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { generateHistoricalData } from '@/data/mockData'
import { useMemo } from 'react'

export function VaultDetailPanel() {
  const selectedVaultId = useAppStore(s => s.selectedVaultId)
  const setSelectedVault = useAppStore(s => s.setSelectedVault)
  const openDepositModal = useAppStore(s => s.openDepositModal)
  const vaults = useAppStore(s => s.vaults)

  const vault = vaults.find(v => v.id === selectedVaultId)
  const histData = useMemo(() => vault ? generateHistoricalData(vault.id) : [], [vault?.id])
  const chartData = histData.map(d => ({
    date: new Date(d.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    apy: parseFloat(d.apy.toFixed(2)),
    tvl: parseFloat((d.tvl / 1_000_000).toFixed(3)),
    price: parseFloat(d.sharePrice.toFixed(4)),
  }))

  return (
    <AnimatePresence>
      {vault && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedVault(null)}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-xl overflow-y-auto"
            style={{ background: 'linear-gradient(180deg, #0b1f1f 0%, #061212 100%)', borderLeft: '1px solid rgba(20,184,166,0.15)' }}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-white/[0.06]"
              style={{ background: 'rgba(6,18,18,0.95)', backdropFilter: 'blur(20px)' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-elp-500/15 border border-elp-500/20 flex items-center justify-center">
                  <span className="font-display font-bold text-elp-300 text-xs">{vault.symbol}</span>
                </div>
                <div>
                  <h2 className="font-display font-bold text-white">{vault.name}</h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${vault.status === 'ACTIVE' ? 'bg-elp-400' : 'bg-amber-400'}`} />
                    <span className="font-mono text-[10px] text-white/40 uppercase">{vault.status}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedVault(null)} className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                <X className="w-4 h-4 text-white/60" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* APY + CTA */}
              <div className="flex items-center justify-between p-5 rounded-2xl border"
                style={{ background: 'rgba(20,184,166,0.04)', borderColor: 'rgba(20,184,166,0.15)' }}
              >
                <div>
                  <div className="stat-label mb-1">Total APY</div>
                  <div className="font-display font-bold text-4xl elp-gradient-text">{formatAPY(vault.totalAPY)}</div>
                  <div className="text-white/30 text-xs font-mono mt-1">Auto-compounds every {vault.harvestInterval}h</div>
                </div>
                <div className="text-right space-y-2">
                  <div>
                    <div className="stat-label text-[9px]">TVL</div>
                    <div className="font-display font-semibold text-white">{formatUSD(vault.totalTVL, true)}</div>
                  </div>
                  <div>
                    <div className="stat-label text-[9px]">Share Price</div>
                    <div className="font-mono text-elp-300 text-sm">${vault.sharePrice.toFixed(4)}</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-white/50 text-sm font-body leading-relaxed">{vault.description}</p>

              {/* APY Chart */}
              <div>
                <div className="stat-label mb-3">APY History (30d)</div>
                <div className="h-32 -mx-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="apyGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 9 }} tickLine={false} axisLine={false} interval={6} />
                      <YAxis tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 9 }} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
                      <Tooltip
                        contentStyle={{ background: '#0b1f1f', border: '1px solid rgba(20,184,166,0.2)', borderRadius: '12px', fontSize: '11px' }}
                        labelStyle={{ color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}
                        itemStyle={{ color: '#5eead4' }}
                        formatter={(v: number) => [`${v}%`, 'APY']}
                      />
                      <Area type="monotone" dataKey="apy" stroke="#14b8a6" strokeWidth={2} fill="url(#apyGrad)" dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Strategies */}
              <div>
                <div className="stat-label mb-3">Active Strategies ({vault.strategies.length})</div>
                <div className="space-y-3">
                  {vault.strategies.map((strategy, i) => (
                    <motion.div
                      key={strategy.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-elp-500/20 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-display font-semibold text-white text-sm">{strategy.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`tag text-[10px] px-1.5 py-0.5 ${riskBg(strategy.risk)}`}>{strategy.risk}</span>
                            <span className="tag-elp text-[10px] px-1.5 py-0.5">{strategyTypeLabel(strategy.type)}</span>
                            <span className="tag text-[10px] px-1.5 py-0.5 bg-white/5 text-white/40 border border-white/8">{strategy.protocol}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-display font-bold text-lg elp-gradient-text">{formatAPY(strategy.apy)}</div>
                          <div className="stat-label text-[9px]">{strategy.allocation}% alloc</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <div>
                          <div className="stat-label text-[9px]">Base APY</div>
                          <div className="font-mono text-sm text-white/70">{formatAPY(strategy.apyBase)}</div>
                        </div>
                        <div>
                          <div className="stat-label text-[9px]">Reward APY</div>
                          <div className="font-mono text-sm text-elp-400">{formatAPY(strategy.apyRewards)}</div>
                        </div>
                        <div>
                          <div className="stat-label text-[9px]">TVL</div>
                          <div className="font-mono text-sm text-white/70">{formatUSD(strategy.tvl, true)}</div>
                        </div>
                      </div>

                      {/* Utilization bar */}
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="stat-label text-[9px]">Utilization</span>
                          <span className="font-mono text-[10px] text-white/40">{strategy.utilizationRate}%</span>
                        </div>
                        <div className="progress-bar">
                          <motion.div
                            className="progress-fill"
                            initial={{ width: 0 }}
                            animate={{ width: `${strategy.utilizationRate}%` }}
                            transition={{ delay: 0.2 + i * 0.05, duration: 0.8 }}
                          />
                        </div>
                      </div>

                      {strategy.impermanentLoss > 0 && (
                        <div className="flex items-center gap-1.5 mt-2">
                          <AlertCircle className="w-3 h-3 text-amber-400/60" />
                          <span className="font-mono text-[10px] text-amber-400/60">
                            IL exposure: ~{strategy.impermanentLoss.toFixed(1)}%
                          </span>
                        </div>
                      )}
                      <div className="text-white/25 text-[10px] font-mono mt-1.5">
                        Last rebalanced {formatTimeAgo(strategy.lastRebalance)}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Fee structure */}
              <div>
                <div className="stat-label mb-3">Fee Structure</div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Performance Fee', value: `${vault.performanceFee}%`, sub: 'of yield earned' },
                    { label: 'Management Fee', value: `${vault.managementFee}%`, sub: 'annual, on TVL' },
                  ].map(f => (
                    <div key={f.label} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <div className="stat-label text-[9px] mb-1">{f.label}</div>
                      <div className="font-display font-bold text-white">{f.value}</div>
                      <div className="text-white/30 text-[10px] font-mono">{f.sub}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => { setSelectedVault(null); openDepositModal(vault.id) }}
                className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Deposit into {vault.symbol}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
