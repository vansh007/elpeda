import { motion } from 'framer-motion'
import { TrendingUp, Wallet, Zap, ArrowUpRight, BarChart2 } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { usePortfolioStats, useYieldSimulation } from '@/hooks/useYieldSimulation'
import { formatUSD, formatAPY, formatShares, formatTimeAgo } from '@/lib/utils'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useMemo, useState, useEffect } from 'react'

function LiveTicker({ value, prefix = '$' }: { value: number; prefix?: string }) {
  const [displayed, setDisplayed] = useState(value)
  
  useEffect(() => {
    setDisplayed(value)
  }, [value])

  return (
    <span className="font-display font-bold tabular-nums">
      {prefix}{displayed.toLocaleString('en-US', { minimumFractionDigits: 6, maximumFractionDigits: 6 })}
    </span>
  )
}

export function PortfolioPage() {
  useYieldSimulation()
  const positions = useAppStore(s => s.userPositions)
  const vaults = useAppStore(s => s.vaults)
  const openDepositModal = useAppStore(s => s.openDepositModal)
  const setActiveTab = useAppStore(s => s.setActiveTab)
  const { totalDeposited, totalCurrentValue, totalYieldEarned, totalPnL, totalPnLPercent, weightedAPY } = usePortfolioStats()

  // Rolling yield history for sparkline
  const [yieldHistory, setYieldHistory] = useState<{ t: number; v: number }[]>([])
  useEffect(() => {
    if (totalYieldEarned > 0) {
      setYieldHistory(prev => {
        const next = [...prev, { t: Date.now(), v: parseFloat(totalYieldEarned.toFixed(8)) }]
        return next.slice(-60)
      })
    }
  }, [totalYieldEarned])

  if (positions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-32 text-center"
      >
        <div className="w-20 h-20 rounded-3xl bg-elp-500/10 border border-elp-500/20 flex items-center justify-center mb-6">
          <Wallet className="w-10 h-10 text-elp-400/50" />
        </div>
        <h2 className="font-display font-bold text-white text-2xl mb-3">No Active Positions</h2>
        <p className="text-white/40 font-body max-w-sm mb-8 leading-relaxed">
          Deposit into a vault to start earning auto-compounded yield across Solana's top DeFi protocols.
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveTab('vaults')}
          className="btn-primary px-8 py-4 text-base flex items-center gap-2"
        >
          <Zap className="w-4 h-4" />
          Explore Vaults
        </motion.button>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Deposited', value: formatUSD(totalDeposited), icon: Wallet, color: 'white' },
          { label: 'Current Value', value: formatUSD(totalCurrentValue), icon: TrendingUp, color: 'elp' },
          { label: 'Total Yield Earned', value: formatUSD(totalYieldEarned), icon: Zap, color: 'elp' },
          { label: 'Blended APY', value: formatAPY(weightedAPY), icon: BarChart2, color: 'plasma' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="glass-card p-5"
          >
            <div className="stat-label mb-2">{stat.label}</div>
            <div className={`stat-value text-xl ${stat.color === 'elp' ? 'elp-gradient-text' : stat.color === 'plasma' ? 'text-plasma-400' : 'text-white'}`}>
              {stat.value}
            </div>
            {stat.label === 'Current Value' && (
              <div className={`text-xs font-mono mt-1 ${totalPnL >= 0 ? 'text-elp-400' : 'text-red-400'}`}>
                {totalPnL >= 0 ? '+' : ''}{formatUSD(totalPnL)} ({totalPnLPercent.toFixed(3)}%)
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Live yield ticker */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6 relative overflow-hidden"
        style={{ borderColor: 'rgba(20,184,166,0.2)' }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl bg-elp-500/5 -translate-y-1/2 translate-x-1/2" />
        <div className="flex items-center justify-between relative">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-elp-400 animate-pulse" />
              <span className="stat-label">LIVE YIELD ACCUMULATING</span>
            </div>
            <div className="text-3xl elp-gradient-text">
              <LiveTicker value={totalYieldEarned} />
            </div>
            <div className="text-white/30 font-mono text-xs mt-1">
              ${((totalCurrentValue * weightedAPY / 100) / (365 * 24 * 3600)).toFixed(8)}/sec
            </div>
          </div>

          {yieldHistory.length > 3 && (
            <div className="w-48 h-16">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={yieldHistory}>
                  <Line type="monotone" dataKey="v" stroke="#14b8a6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </motion.div>

      {/* Positions */}
      <div>
        <div className="stat-label mb-4">Active Positions ({positions.length})</div>
        <div className="space-y-4">
          {positions.map((pos, i) => {
            const vault = vaults.find(v => v.id === pos.vaultId)
            if (!vault) return null
            const shares = pos.shares
            
            return (
              <motion.div
                key={pos.vaultId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="glass-card-hover p-5"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-elp-500/15 border border-elp-500/20 flex items-center justify-center">
                      <span className="font-display font-bold text-elp-300 text-xs">{vault.symbol}</span>
                    </div>
                    <div>
                      <div className="font-display font-semibold text-white">{vault.name}</div>
                      <div className="font-mono text-xs text-white/30 mt-0.5">
                        {formatShares(shares)} {vault.symbol} shares
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display font-bold text-white text-lg">{formatUSD(pos.currentValue)}</div>
                    <div className={`text-xs font-mono ${pos.pnlPercent >= 0 ? 'text-elp-400' : 'text-red-400'}`}>
                      {pos.pnlPercent >= 0 ? '+' : ''}{pos.pnlPercent.toFixed(4)}%
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="stat-label text-[9px] mb-0.5">Deposited</div>
                    <div className="font-mono text-sm text-white/70">{formatUSD(pos.deposited)}</div>
                  </div>
                  <div>
                    <div className="stat-label text-[9px] mb-0.5">Yield Earned</div>
                    <div className="font-mono text-sm text-elp-400">+{formatUSD(pos.yieldEarned)}</div>
                  </div>
                  <div>
                    <div className="stat-label text-[9px] mb-0.5">Current APY</div>
                    <div className="font-mono text-sm text-elp-300">{formatAPY(vault.totalAPY)}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-white/25">
                    Deposited {formatTimeAgo(pos.depositTime)}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => useAppStore.getState().withdraw(pos.vaultId, pos.shares * 0.5)}
                      className="btn-secondary py-1.5 px-3 text-xs"
                    >
                      Withdraw 50%
                    </button>
                    <button
                      onClick={() => openDepositModal(pos.vaultId)}
                      className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1"
                    >
                      Add More <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
