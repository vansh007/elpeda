import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Sparkles, ArrowRight, Shield, TrendingUp, RefreshCw, Zap } from 'lucide-react'
import { useIntentEngine } from '@/hooks/useIntentEngine'
import { useAppStore } from '@/store/appStore'
import { formatUSD, formatAPY } from '@/lib/utils'

const EXAMPLE_PROMPTS = [
  'Protect my capital, steady income',
  'Maximum SOL yield, high risk OK',
  'Best risk-adjusted return for $1000',
  'I want Bitcoin exposure with passive yield',
  'Maximum degen meme coin returns',
]

const RISK_COLORS: Record<string, string> = {
  LOW: 'text-elp-400',
  MEDIUM: 'text-amber-400',
  HIGH: 'text-red-400',
}

const RISK_DOTS: Record<string, string> = {
  LOW: '●○○',
  MEDIUM: '●●○',
  HIGH: '●●●',
}

export function IntentBar() {
  const [input, setInput] = useState('')
  const { loading, response, error, submitIntent, clearIntent } = useIntentEngine()
  const openDepositModal = useAppStore(s => s.openDepositModal)

  const handleSubmit = () => {
    if (input.trim() && !loading) {
      submitIntent(input)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const vaults = useAppStore(s => s.vaults)
  const getRisk = (vaultId: string) => {
    const vault = vaults.find(v => v.id === vaultId)
    if (!vault) return 'MEDIUM'
    const risks = vault.strategies.map(s => s.risk)
    if (risks.includes('HIGH')) return 'HIGH'
    if (risks.includes('MEDIUM')) return 'MEDIUM'
    return 'LOW'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-card overflow-hidden relative"
    >
      {/* Header */}
      <div className="px-6 pt-5 pb-3 flex items-center gap-2 border-b border-white/[0.04]">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-plasma-500 to-elp-500 flex items-center justify-center">
          <Sparkles className="w-3 h-3 text-white" />
        </div>
        <span className="font-display font-bold text-sm text-white">Elpeda Intent Engine</span>
        <span className="tag-elp text-[10px] ml-1">AI</span>
      </div>

      {/* Input area */}
      <div className="p-6 space-y-4">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tell me your financial goal..."
            className="input-elp pr-12 text-base py-4"
            disabled={loading}
          />
          <button
            onClick={handleSubmit}
            disabled={loading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-elp-500 flex items-center justify-center text-surface-0 hover:bg-elp-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {loading ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                <RefreshCw className="w-3.5 h-3.5" />
              </motion.div>
            ) : (
              <ArrowRight className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Example chips */}
        {!response && !loading && (
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_PROMPTS.map(prompt => (
              <button
                key={prompt}
                onClick={() => { setInput(prompt); submitIntent(prompt) }}
                className="px-3 py-1.5 rounded-xl bg-surface-2 border border-white/[0.06] text-xs text-white/40 hover:text-white/70 hover:border-elp-500/20 transition-all duration-200"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Loading state */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="relative rounded-xl bg-surface-2 border border-elp-500/10 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  >
                    <Sparkles className="w-4 h-4 text-elp-400" />
                  </motion.div>
                  <span className="font-display font-medium text-sm text-white">Analyzing your intent...</span>
                </div>
                {/* Scanning line */}
                <div className="relative h-1 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-elp-400 to-transparent"
                    animate={{ x: ['-100%', '400%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
          >
            {error}
            <button onClick={clearIntent} className="ml-3 underline hover:text-red-300">Retry</button>
          </motion.div>
        )}

        {/* Response */}
        <AnimatePresence>
          {response && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="rounded-xl bg-surface-2 border border-elp-500/15 p-6 space-y-5"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-elp-400" />
                  <span className="font-display font-medium text-sm text-white">Elpeda recommends:</span>
                </div>
                <span className="tag-elp text-xs font-bold">{response.recommendedVaultName}</span>
              </div>

              {/* Explanation */}
              <p className="text-white/60 text-sm leading-relaxed font-body">{response.explanation}</p>

              {/* Risk + APY + Confidence */}
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-white/30" />
                  <span className={`font-mono ${RISK_COLORS[getRisk(response.recommendedVaultId)]}`}>
                    {RISK_DOTS[getRisk(response.recommendedVaultId)]} {getRisk(response.recommendedVaultId)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5 text-white/30" />
                  <span className="font-mono text-elp-300">{formatAPY(response.projectedAPY)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-white/30" />
                  <span className="font-mono text-plasma-400">Confidence: {response.confidence}%</span>
                </div>
              </div>

              {/* Projections */}
              <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-surface-0/50 border border-white/[0.04]">
                <div className="text-center">
                  <div className="stat-label text-[9px] mb-1">Daily</div>
                  <div className="font-mono text-sm text-elp-400">+{formatUSD(response.projectedDaily)}</div>
                </div>
                <div className="text-center border-x border-white/5">
                  <div className="stat-label text-[9px] mb-1">Monthly</div>
                  <div className="font-mono text-sm text-elp-300">+{formatUSD(response.projectedMonthly)}</div>
                </div>
                <div className="text-center">
                  <div className="stat-label text-[9px] mb-1">Annual</div>
                  <div className="font-mono text-sm elp-gradient-text font-bold">+{formatUSD(response.projectedAnnual)}</div>
                </div>
              </div>

              {/* Risk note */}
              <p className="text-white/30 text-xs font-mono italic">{response.riskAssessment}</p>

              {/* Alternative */}
              {response.alternativeReason && (
                <p className="text-white/25 text-xs font-mono">
                  💡 Alternative: {response.alternativeReason}
                </p>
              )}

              {/* CTA */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openDepositModal(response.recommendedVaultId)}
                  className="btn-primary flex-1 py-3.5 flex items-center justify-center gap-2"
                >
                  Deposit into {response.recommendedVaultName.split(' ').pop()} <ArrowRight className="w-4 h-4" />
                </motion.button>
                <button
                  onClick={() => { clearIntent(); setInput('') }}
                  className="btn-secondary px-4"
                >
                  New query
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
