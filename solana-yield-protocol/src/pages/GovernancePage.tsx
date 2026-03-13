import { motion } from 'framer-motion'
import { useState } from 'react'
import { Vote, CheckCircle, XCircle, Clock, Plus } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { GOVERNANCE_PROPOSALS } from '@/data/mockData'
import { formatNumber, formatTimeRemaining } from '@/lib/utils'

const STATUS_CONFIG = {
  ACTIVE:   { label: 'Active',  color: 'text-elp-400',   bg: 'bg-elp-500/10 border-elp-500/20' },
  PASSED:   { label: 'Passed',  color: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/20' },
  FAILED:   { label: 'Failed',  color: 'text-red-400',    bg: 'bg-red-500/10 border-red-500/20' },
  PENDING:  { label: 'Pending', color: 'text-amber-400',  bg: 'bg-amber-500/10 border-amber-500/20' },
}

const TYPE_LABELS = {
  STRATEGY_ADD:       'Strategy Add',
  FEE_CHANGE:         'Fee Change',
  PARAMETER_UPDATE:   'Parameter Update',
  VAULT_PAUSE:        'Vault Pause',
}

export function GovernancePage() {
  const elpBalance = useAppStore(s => s.elpBalance)
  const [votedIds, setVotedIds] = useState<Record<string, 'for' | 'against'>>({})

  const vote = (id: string, direction: 'for' | 'against') => {
    setVotedIds(prev => ({ ...prev, [id]: direction }))
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-display font-bold text-white text-xl">Protocol Governance</h2>
          <p className="text-white/40 text-sm mt-1 font-body">$ELP holders vote on protocol parameters, strategy additions, and fee changes.</p>
        </div>
        <div className="glass-card px-4 py-3 text-right">
          <div className="stat-label mb-0.5">Your Voting Power</div>
          <div className="font-display font-bold text-white">{formatNumber(elpBalance)} $ELP</div>
        </div>
      </div>

      {/* Voting power info */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active Proposals', value: GOVERNANCE_PROPOSALS.filter(p => p.status === 'ACTIVE').length },
          { label: 'Quorum Required', value: '5,000,000 $ELP' },
          { label: 'Voting Period', value: '7 Days' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }} className="glass-card p-4"
          >
            <div className="stat-label mb-1">{s.label}</div>
            <div className="font-display font-semibold text-white">{s.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Proposals */}
      <div className="space-y-4">
        {GOVERNANCE_PROPOSALS.map((proposal, i) => {
          const status = STATUS_CONFIG[proposal.status]
          const total = proposal.votesFor + proposal.votesAgainst
          const forPct = total > 0 ? (proposal.votesFor / total) * 100 : 0
          const voted = votedIds[proposal.id]

          return (
            <motion.div
              key={proposal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
              className="glass-card-hover p-6"
            >
              {/* Header row */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`tag text-[10px] px-2 py-0.5 border ${status.bg} ${status.color}`}>
                      {status.label}
                    </span>
                    <span className="tag text-[10px] px-2 py-0.5 bg-white/5 border-white/8 text-white/40">
                      {TYPE_LABELS[proposal.type]}
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-white text-base">{proposal.title}</h3>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-1.5 text-white/30">
                    <Clock className="w-3 h-3" />
                    <span className="font-mono text-xs">{formatTimeRemaining(proposal.endTime)}</span>
                  </div>
                </div>
              </div>

              <p className="text-white/40 text-sm font-body leading-relaxed mb-4">{proposal.description}</p>

              {/* Vote bars */}
              <div className="mb-4">
                <div className="flex justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-3 h-3 text-elp-400" />
                    <span className="font-mono text-xs text-elp-400">FOR {forPct.toFixed(1)}%</span>
                    <span className="font-mono text-xs text-white/30">({formatNumber(proposal.votesFor, true)})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs text-white/30">({formatNumber(proposal.votesAgainst, true)})</span>
                    <span className="font-mono text-xs text-red-400">{(100 - forPct).toFixed(1)}% AGAINST</span>
                    <XCircle className="w-3 h-3 text-red-400" />
                  </div>
                </div>
                <div className="h-2 rounded-full overflow-hidden bg-red-500/15">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-elp-500 to-elp-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${forPct}%` }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                  />
                </div>

                {/* Quorum progress */}
                {proposal.quorum > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="font-mono text-[10px] text-white/25">Quorum</span>
                      <span className="font-mono text-[10px] text-white/25">{formatNumber(proposal.votesFor + proposal.votesAgainst, true)} / {formatNumber(proposal.quorum, true)}</span>
                    </div>
                    <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-plasma-400/60"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, ((proposal.votesFor + proposal.votesAgainst) / proposal.quorum) * 100)}%` }}
                        transition={{ delay: 0.5 + i * 0.1, duration: 0.6, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              {proposal.status === 'ACTIVE' && (
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-white/25">Proposer: {proposal.proposer}</span>
                  {voted ? (
                    <div className={`flex items-center gap-1.5 text-sm font-mono ${voted === 'for' ? 'text-elp-400' : 'text-red-400'}`}>
                      <CheckCircle className="w-4 h-4" />
                      Voted {voted === 'for' ? 'FOR' : 'AGAINST'}
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => vote(proposal.id, 'against')}
                        className="px-4 py-2 rounded-xl text-xs font-display font-medium border border-red-500/25 text-red-400 bg-red-500/5 hover:bg-red-500/10 transition-colors"
                      >
                        Vote Against
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => vote(proposal.id, 'for')}
                        className="btn-primary py-2 px-4 text-xs"
                      >
                        Vote For
                      </motion.button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
