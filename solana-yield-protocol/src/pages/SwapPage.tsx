import { motion, AnimatePresence } from 'framer-motion'
import { useState, useMemo, useCallback } from 'react'
import { ArrowDownUp, ArrowRight, ChevronDown, Info, Zap, Shield, Settings, X, CheckCircle } from 'lucide-react'
import { TOKEN_ICONS } from '@/data/mockData'
import { formatUSD } from '@/lib/utils'
import { useAppStore } from '@/store/appStore'
import type { TokenData } from '@/lib/priceService'

// Simulated token prices
const TOKEN_PRICES: Record<string, number> = {
  USDC: 1.00, USDT: 1.00, SOL: 148.52, BONK: 0.0000312,
  JUP: 0.87, ORCA: 1.12, mSOL: 164.18, ELP: 1.24,
  wBTC: 67420.00, WIF: 2.84, POPCAT: 0.78, RAY: 1.95,
  PYTH: 0.42, HNT: 8.12, RENDER: 7.84, JITO: 3.42,
  BSOL: 152.40, USDY: 1.05,
}

const TOKENS = Object.keys(TOKEN_PRICES)

const ROUTES: Record<string, { path: string[]; name: string; fee: number }[]> = {
  default: [
    { path: ['Orca Whirlpool'], name: 'Direct', fee: 0.30 },
    { path: ['Raydium CLMM'], name: 'Alternative', fee: 0.25 },
    { path: ['Jupiter Aggregator', 'Multi-hop'], name: 'Best Price', fee: 0.20 },
  ],
}

interface TokenSelectorProps {
  selected: string
  onSelect: (token: string) => void
  exclude: string
  label: string
  tokenPricesStore: Record<string, TokenData>
}

function TokenSelector({ selected, onSelect, exclude, label, tokenPricesStore }: TokenSelectorProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-2 border border-white/[0.08] hover:border-elp-500/20 transition-colors"
      >
        {tokenPricesStore[selected]?.image ? (
          <img src={tokenPricesStore[selected].image} alt={selected} className="w-5 h-5 rounded-full" />
        ) : (
          <span className="text-lg">{TOKEN_ICONS[selected] || '🪙'}</span>
        )}
        <span className="font-display font-semibold text-white text-sm">{selected}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            className="absolute top-full mt-2 left-0 z-30 w-60 max-h-64 overflow-y-auto rounded-xl border border-white/[0.08] bg-surface-1 shadow-2xl"
          >
            <div className="p-2 border-b border-white/[0.06]">
              <span className="stat-label text-[9px] px-2">{label}</span>
            </div>
            <div className="p-1">
              {TOKENS.filter(t => t !== exclude).map(token => (
                <button
                  key={token}
                  onClick={() => { onSelect(token); setOpen(false) }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    token === selected
                      ? 'bg-elp-500/10 text-elp-300'
                      : 'hover:bg-white/[0.04] text-white/70'
                  }`}
                >
                  {tokenPricesStore[token]?.image ? (
                    <img src={tokenPricesStore[token].image} alt={token} className="w-6 h-6 rounded-full flex-shrink-0" />
                  ) : (
                    <span className="text-base flex-shrink-0">{TOKEN_ICONS[token] || '🪙'}</span>
                  )}
                  <div>
                    <div className="font-display font-medium text-sm">{token}</div>
                    <div className="font-mono text-[10px] text-white/30">${(tokenPricesStore[token]?.current_price || TOKEN_PRICES[token]).toLocaleString(undefined, { maximumFractionDigits: 6 })}</div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function SwapPage() {
  const [fromToken, setFromToken] = useState('USDC')
  const [toToken, setToToken] = useState('SOL')
  const [fromAmount, setFromAmount] = useState('')
  const [slippage, setSlippage] = useState(0.5)
  const [showSettings, setShowSettings] = useState(false)
  const [swapping, setSwapping] = useState(false)
  const [swapSuccess, setSwapSuccess] = useState(false)
  const openDepositModal = useAppStore(s => s.openDepositModal)
  const tokenPricesStore = useAppStore(s => s.tokenPrices)

  const numFrom = parseFloat(fromAmount) || 0
  const rate = useMemo(() => {
    const fromPrice = tokenPricesStore[fromToken]?.current_price || TOKEN_PRICES[fromToken] || 1
    const toPrice = tokenPricesStore[toToken]?.current_price || TOKEN_PRICES[toToken] || 1
    return fromPrice / toPrice
  }, [fromToken, toToken, tokenPricesStore])

  const toAmount = useMemo(() => numFrom * rate, [numFrom, rate])
  const priceImpact = useMemo(() => {
    if (numFrom === 0) return 0
    const fromPrice = tokenPricesStore[fromToken]?.current_price || TOKEN_PRICES[fromToken] || 1
    const valUSD = numFrom * fromPrice
    if (valUSD < 1000) return 0.01
    if (valUSD < 10000) return 0.05
    if (valUSD < 100000) return 0.12
    return 0.45
  }, [numFrom, fromToken, tokenPricesStore])

  const networkFee = 0.000005  // ~0.000005 SOL

  const bestRoute = ROUTES.default[2] // Jupiter best price

  const flipTokens = useCallback(() => {
    const old = fromToken
    setFromToken(toToken)
    setToToken(old)
    setFromAmount('')
  }, [fromToken, toToken])

  const handleSwap = async () => {
    if (numFrom <= 0) return
    setSwapping(true)
    await new Promise(r => setTimeout(r, 2200))
    setSwapping(false)
    setSwapSuccess(true)
    setTimeout(() => setSwapSuccess(false), 4000)
    setFromAmount('')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-lg mx-auto space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <h2 className="font-display font-bold text-white text-2xl">Swap</h2>
        <p className="text-white/40 text-sm mt-1 font-body">Trade any Solana token at the best rates</p>
      </div>

      {/* Swap card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card overflow-hidden relative"
      >
        {/* Settings */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <span className="stat-label">Swap Tokens</span>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="w-7 h-7 rounded-lg bg-surface-2 border border-white/[0.06] flex items-center justify-center text-white/30 hover:text-white/60 transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Settings panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-6 overflow-hidden"
            >
              <div className="pb-4 border-b border-white/[0.04]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-white/50">Slippage Tolerance</span>
                  <button onClick={() => setShowSettings(false)} className="text-white/30 hover:text-white/60">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex gap-2">
                  {[0.1, 0.5, 1.0, 3.0].map(s => (
                    <button
                      key={s}
                      onClick={() => setSlippage(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                        slippage === s
                          ? 'border-elp-500/40 bg-elp-500/10 text-elp-300'
                          : 'border-white/[0.08] text-white/40 hover:text-white/60'
                      }`}
                    >
                      {s}%
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-6 space-y-2">
          {/* From */}
          <div className="p-4 rounded-2xl bg-surface-0/50 border border-white/[0.04]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/30 font-body">From</span>
              <span className="font-mono text-[10px] text-white/20">
                Balance: 10,000 {fromToken}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={fromAmount}
                onChange={e => setFromAmount(e.target.value)}
                placeholder="0.00"
                className="flex-1 bg-transparent text-2xl font-display font-bold text-white outline-none placeholder-white/15 min-w-0"
              />
              <TokenSelector selected={fromToken} onSelect={setFromToken} exclude={toToken} label="You Pay" tokenPricesStore={tokenPricesStore} />
            </div>
            {numFrom > 0 && (
              <div className="mt-1 font-mono text-[10px] text-white/20">
                ≈ {formatUSD(numFrom * (tokenPricesStore[fromToken]?.current_price || TOKEN_PRICES[fromToken] || 1))}
              </div>
            )}
          </div>

          {/* Flip button */}
          <div className="flex justify-center -my-3 relative z-10">
            <motion.button
              whileHover={{ rotate: 180, scale: 1.1 }}
              onClick={flipTokens}
              className="w-10 h-10 rounded-xl bg-surface-1 border border-white/[0.08] flex items-center justify-center text-white/50 hover:text-elp-400 hover:border-elp-500/30 transition-colors"
            >
              <ArrowDownUp className="w-4 h-4" />
            </motion.button>
          </div>

          {/* To */}
          <div className="p-4 rounded-2xl bg-surface-0/50 border border-white/[0.04]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/30 font-body">To (estimated)</span>
              <span className="font-mono text-[10px] text-white/20">
                Balance: 0 {toToken}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 text-2xl font-display font-bold text-white/70">
                {toAmount > 0 ? toAmount.toLocaleString('en-US', { maximumFractionDigits: 6 }) : '0.00'}
              </div>
              <TokenSelector selected={toToken} onSelect={setToToken} exclude={fromToken} label="You Receive" tokenPricesStore={tokenPricesStore} />
            </div>
            {toAmount > 0 && (
              <div className="mt-1 font-mono text-[10px] text-white/20">
                ≈ {formatUSD(toAmount * (tokenPricesStore[toToken]?.current_price || TOKEN_PRICES[toToken] || 1))}
              </div>
            )}
          </div>
        </div>

        {/* Route & Details */}
        {numFrom > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="px-6 pb-6 space-y-3"
          >
            {/* Best Route */}
            <div className="p-3 rounded-xl bg-surface-0/40 border border-white/[0.04] space-y-2">
              <div className="flex items-center justify-between">
                <span className="stat-label text-[9px]">Best Route</span>
                <span className="tag-elp text-[9px]">⚡ {bestRoute.name}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-white/50">
                <span className="text-elp-400">{fromToken}</span>
                {bestRoute.path.map(hop => (
                  <span key={hop} className="flex items-center gap-1">
                    <ArrowRight className="w-3 h-3 text-white/20" />
                    <span className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-white/40 text-[10px]">{hop}</span>
                  </span>
                ))}
                <ArrowRight className="w-3 h-3 text-white/20" />
                <span className="text-elp-400">{toToken}</span>
              </div>
            </div>

            {/* Swap details */}
            <div className="space-y-1.5">
              {[
                ['Rate', `1 ${fromToken} = ${rate.toLocaleString('en-US', { maximumFractionDigits: 6 })} ${toToken}`],
                ['Price Impact', `${priceImpact.toFixed(2)}%`],
                ['Slippage Tolerance', `${slippage}%`],
                ['Network Fee', `~${networkFee} SOL`],
                ['Route Fee', `${bestRoute.fee}%`],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between py-1">
                  <span className="text-white/30 text-xs font-body">{label}</span>
                  <span className={`font-mono text-xs ${
                    label === 'Price Impact' && priceImpact > 0.1 ? 'text-amber-400' : 'text-white/50'
                  }`}>{value}</span>
                </div>
              ))}
            </div>

            {priceImpact > 0.1 && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/15">
                <Info className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span className="text-[11px] text-amber-300/70 font-body">High price impact — consider splitting into smaller trades.</span>
              </div>
            )}
          </motion.div>
        )}

        {/* CTA */}
        <div className="p-6 border-t border-white/[0.04]">
          {swapSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-3 py-3.5 rounded-xl bg-elp-500/10 border border-elp-500/20"
            >
              <CheckCircle className="w-5 h-5 text-elp-400" />
              <span className="font-display font-semibold text-elp-300">Swap Successful!</span>
            </motion.div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleSwap}
              disabled={numFrom <= 0 || swapping}
              className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {swapping ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-surface-0/30 border-t-surface-0 rounded-full" />
                  Swapping...
                </>
              ) : numFrom <= 0 ? (
                'Enter amount'
              ) : (
                <>
                  Swap {fromToken} for {toToken} <Zap className="w-4 h-4" />
                </>
              )}
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Security info */}
      <div className="flex items-center justify-center gap-4 text-white/20">
        <div className="flex items-center gap-1.5">
          <Shield className="w-3 h-3" />
          <span className="font-mono text-[10px]">Non-custodial</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-white/10" />
        <div className="flex items-center gap-1.5">
          <Zap className="w-3 h-3" />
          <span className="font-mono text-[10px]">Jupiter Powered</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-white/10" />
        <div className="flex items-center gap-1.5">
          <Shield className="w-3 h-3" />
          <span className="font-mono text-[10px]">MEV Protected</span>
        </div>
      </div>
    </motion.div>
  )
}
