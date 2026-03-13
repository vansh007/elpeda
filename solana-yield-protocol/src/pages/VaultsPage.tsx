import { motion } from 'framer-motion'
import { useState } from 'react'
import { Search } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { VaultCard } from '@/components/VaultCard'
import { ProtocolBanner } from '@/components/ProtocolBanner'
import { IntentBar } from '@/components/IntentBar'
import { RebalanceFeed } from '@/components/RebalanceFeed'

const SORT_OPTIONS = ['APY (High)', 'TVL (High)', 'Risk (Low)'] as const
type SortOption = typeof SORT_OPTIONS[number]

export function VaultsPage() {
  const vaults = useAppStore(s => s.vaults)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortOption>('APY (High)')

  const filtered = vaults
    .filter(v => v.name.toLowerCase().includes(search.toLowerCase()) || v.depositToken.toLowerCase().includes(search.toLowerCase()) || v.symbol.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'APY (High)') return b.totalAPY - a.totalAPY
      if (sort === 'TVL (High)') return b.totalTVL - a.totalTVL
      const riskOrder = { LOW: 0, MEDIUM: 1, HIGH: 2 }
      const aRisk = Math.min(...a.strategies.map(s => riskOrder[s.risk]))
      const bRisk = Math.min(...b.strategies.map(s => riskOrder[s.risk]))
      return aRisk - bRisk
    })

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      {/* Protocol stats */}
      <ProtocolBanner />

      {/* AI Intent Engine — Hero Feature */}
      <IntentBar />

      {/* Section header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-white text-xl">Yield Vaults</h2>
          <p className="text-white/40 text-sm mt-0.5 font-body">Auto-compounding strategies across Solana DeFi</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search vaults..."
              className="input-elp pl-9 w-44 h-9 text-xs"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-1 bg-surface-1/60 border border-white/[0.06] rounded-xl p-1">
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt}
                onClick={() => setSort(opt)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-150 ${
                  sort === opt
                    ? 'bg-elp-500/15 text-elp-300 border border-elp-500/20'
                    : 'text-white/30 hover:text-white/50'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Vault grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((vault, i) => (
          <VaultCard key={vault.id} vault={vault} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-white/30">
          <p className="font-display text-lg">No vaults match "{search}"</p>
        </div>
      )}

      {/* Live Protocol Activity Feed */}
      <RebalanceFeed />
    </motion.div>
  )
}
