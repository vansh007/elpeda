import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowDown, CheckCircle, AlertCircle, Zap, Info } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { formatUSD, formatAPY, formatShares } from '@/lib/utils'

const PRESET_AMOUNTS = [100, 500, 1000, 5000]

export function DepositModal() {
  const depositModalOpen = useAppStore(s => s.depositModalOpen)
  const depositVaultId = useAppStore(s => s.depositVaultId)
  const closeDepositModal = useAppStore(s => s.closeDepositModal)
  const deposit = useAppStore(s => s.deposit)
  const vaults = useAppStore(s => s.vaults)

  const vault = vaults.find(v => v.id === depositVaultId)

  const [amount, setAmount] = useState('')
  const [step, setStep] = useState<'input' | 'confirm' | 'success'>('input')
  const [isLoading, setIsLoading] = useState(false)

  const numAmount = parseFloat(amount) || 0
  const shares = vault ? numAmount / vault.sharePrice : 0
  const projectedAPY = vault?.totalAPY ?? 0
  const daily = (numAmount * projectedAPY) / 100 / 365
  const monthly = daily * 30
  const yearly = numAmount * projectedAPY / 100

  const handleDeposit = useCallback(async () => {
    if (!vault || numAmount <= 0) return
    setIsLoading(true)
    // Simulate tx delay
    await new Promise(r => setTimeout(r, 1800))
    deposit(vault.id, numAmount)
    setIsLoading(false)
    setStep('success')
  }, [vault, numAmount, deposit])

  const handleClose = useCallback(() => {
    setAmount('')
    setStep('input')
    setIsLoading(false)
    closeDepositModal()
  }, [closeDepositModal])

  if (!vault) return null

  return (
    <AnimatePresence>
      {depositModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="w-full max-w-md pointer-events-auto"
              style={{ background: 'linear-gradient(135deg, #0b1f1f 0%, #061212 100%)', border: '1px solid rgba(20,184,166,0.2)', borderRadius: '24px', boxShadow: '0 0 60px rgba(20,184,166,0.15)' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
                <div>
                  <h2 className="font-display font-bold text-white text-lg">Deposit to Vault</h2>
                  <p className="text-white/40 text-sm font-body mt-0.5">{vault.name}</p>
                </div>
                <button onClick={handleClose} className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                  <X className="w-4 h-4 text-white/60" />
                </button>
              </div>

              <div className="p-6">
                <AnimatePresence mode="wait">
                  {step === 'input' && (
                    <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      {/* APY highlight */}
                      <div className="flex items-center justify-between mb-5 p-3 rounded-xl bg-elp-500/5 border border-elp-500/15">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-elp-400" />
                          <span className="text-sm text-white/60 font-body">Current APY</span>
                        </div>
                        <span className="font-display font-bold text-xl elp-gradient-text">{formatAPY(vault.totalAPY)}</span>
                      </div>

                      {/* Amount input */}
                      <div className="mb-3">
                        <label className="stat-label mb-2 block">Amount ({vault.depositToken})</label>
                        <div className="relative">
                          <input
                            type="number"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="input-elp text-xl font-display pr-20"
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <button onClick={() => setAmount('10000')} className="text-xs text-elp-400 hover:text-elp-300 font-mono transition-colors">MAX</button>
                            <span className="text-white/30 text-sm font-mono">{vault.depositToken}</span>
                          </div>
                        </div>
                      </div>

                      {/* Presets */}
                      <div className="grid grid-cols-4 gap-2 mb-5">
                        {PRESET_AMOUNTS.map(p => (
                          <button
                            key={p}
                            onClick={() => setAmount(String(p))}
                            className={`py-1.5 rounded-lg text-xs font-mono border transition-all ${
                              numAmount === p
                                ? 'border-elp-500/50 bg-elp-500/10 text-elp-300'
                                : 'border-white/8 bg-white/3 text-white/40 hover:border-white/20 hover:text-white/60'
                            }`}
                          >
                            ${p.toLocaleString()}
                          </button>
                        ))}
                      </div>

                      {/* Projections */}
                      {numAmount > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mb-5 p-4 rounded-xl bg-surface-2/50 border border-white/[0.06] space-y-2.5"
                        >
                          <div className="stat-label mb-1">Yield Projections</div>
                          <div className="flex justify-between">
                            <span className="text-white/50 text-sm">Shares received</span>
                            <span className="font-mono text-sm text-white">{formatShares(shares)} {vault.symbol}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/50 text-sm">Daily yield</span>
                            <span className="font-mono text-sm text-elp-400">+{formatUSD(daily)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/50 text-sm">Monthly yield</span>
                            <span className="font-mono text-sm text-elp-400">+{formatUSD(monthly)}</span>
                          </div>
                          <div className="flex justify-between border-t border-white/[0.06] pt-2">
                            <span className="text-white/60 text-sm font-medium">Annual yield</span>
                            <span className="font-display font-bold text-elp-300">+{formatUSD(yearly)}</span>
                          </div>
                        </motion.div>
                      )}

                      {/* Fee info */}
                      <div className="flex items-start gap-2 mb-5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                        <Info className="w-3.5 h-3.5 text-white/30 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-white/30 font-body leading-relaxed">
                          {vault.performanceFee}% performance fee on yield only. {vault.managementFee}% annual management fee.
                          Auto-compounds every {vault.harvestInterval}h.
                        </p>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        disabled={numAmount <= 0}
                        onClick={() => setStep('confirm')}
                        className="btn-primary w-full py-3.5 text-sm disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        Review Deposit
                      </motion.button>
                    </motion.div>
                  )}

                  {step === 'confirm' && (
                    <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                      <div className="space-y-3 mb-6">
                        <div className="p-4 rounded-xl bg-surface-2/50 border border-white/[0.06]">
                          <div className="stat-label mb-3">Transaction Summary</div>
                          {[
                            ['Depositing', `${formatUSD(numAmount)} ${vault.depositToken}`],
                            ['Shares received', `${formatShares(shares)} ${vault.symbol}`],
                            ['Share price', `$${vault.sharePrice.toFixed(4)}`],
                            ['Target APY', formatAPY(vault.totalAPY)],
                            ['Performance fee', `${vault.performanceFee}% of yield`],
                          ].map(([label, value]) => (
                            <div key={label} className="flex justify-between py-1.5 border-b border-white/[0.04] last:border-0">
                              <span className="text-white/40 text-sm">{label}</span>
                              <span className="font-mono text-sm text-white">{value}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/5 border border-amber-500/15">
                          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                          <p className="text-xs text-amber-300/70 font-body">
                            Simulated on Solana devnet. All transactions are demonstration only.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button onClick={() => setStep('input')} className="btn-secondary flex-1 py-3">
                          Back
                        </button>
                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={handleDeposit}
                          disabled={isLoading}
                          className="btn-primary flex-1 py-3 flex items-center justify-center gap-2"
                        >
                          {isLoading ? (
                            <>
                              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                className="w-4 h-4 border-2 border-surface-0/30 border-t-surface-0 rounded-full" />
                              Confirming...
                            </>
                          ) : (
                            'Confirm Deposit'
                          )}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {step === 'success' && (
                    <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-4"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
                        className="w-16 h-16 rounded-2xl bg-elp-500/15 border border-elp-500/30 flex items-center justify-center mx-auto mb-4"
                      >
                        <CheckCircle className="w-8 h-8 text-elp-400" />
                      </motion.div>
                      <h3 className="font-display font-bold text-white text-xl mb-2">Deposit Successful!</h3>
                      <p className="text-white/40 text-sm mb-1">
                        {formatUSD(numAmount)} deposited into {vault.name}
                      </p>
                      <p className="text-elp-400 font-mono text-sm mb-6">
                        Earning {formatAPY(vault.totalAPY)} APY → starts now
                      </p>
                      <div className="flex gap-3">
                        <button onClick={handleClose} className="btn-secondary flex-1 py-3">
                          Close
                        </button>
                        <button
                          onClick={() => { handleClose(); useAppStore.getState().setActiveTab('portfolio') }}
                          className="btn-primary flex-1 py-3"
                        >
                          View Portfolio
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
