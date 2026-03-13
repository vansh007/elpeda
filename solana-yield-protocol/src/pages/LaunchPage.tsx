import { motion } from 'framer-motion'
import { useAppStore } from '@/store/appStore'
import { Rocket, Target, BarChart3, Users, Zap, ExternalLink, ShieldCheck, Lock, Timer } from 'lucide-react'
import { formatUSD } from '@/lib/utils'

const TOKEN_DISTRIBUTION = [
  { label: 'Community & Governance', pct: 40, color: '#14b8a6' },
  { label: 'Protocol Treasury', pct: 25, color: '#8b5cf6' },
  { label: 'Team (4yr vest)', pct: 20, color: '#f59e0b' },
  { label: 'Early Investors', pct: 10, color: '#3b82f6' },
  { label: 'Ecosystem Grants', pct: 5, color: '#ec4899' },
]

export function LaunchPage() {
  const { launchProgress, totalLiquidityTarget, currentVolume } = useAppStore()

  const launchPhases = [
    { title: 'Token Creation', status: 'COMPLETED', label: 'SPL Token Minted' },
    { title: 'Liquidity Bootstrap', status: 'ACTIVE', label: `Progress: ${launchProgress}%` },
    { title: 'Protocol Genesis', status: 'LOCKED', label: 'TBA' },
  ]

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="space-y-8 max-w-5xl mx-auto"
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl p-8 lg:p-12 border border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-elp-500/10 via-surface-1 to-surface-0 -z-10" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-elp-500/20 rounded-full blur-[100px]" />
        
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-elp-500/10 border border-elp-500/20 text-elp-400 font-mono text-xs font-bold uppercase tracking-wider">
              <Zap className="w-3 h-3" /> DeAura Exclusive Launch
            </div>
            <h1 className="font-display font-extrabold text-4xl lg:text-5xl text-white leading-tight">
              Powering the <span className="elp-gradient-text">Future</span> of Solana Yield
            </h1>
            <p className="text-white/60 text-lg font-body leading-relaxed max-w-xl mx-auto lg:mx-0">
              The $ELP token launches via DeAura to bootstrap deep liquidity and 
              decentralize protocol control. Join the genesis phase.
            </p>
            <div className="flex flex-wrap items-center gap-4 justify-center lg:justify-start">
              <motion.button 
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="btn-primary px-8 py-4 flex items-center gap-2"
              >
                Join Launch on DeAura <ExternalLink className="w-4 h-4" />
              </motion.button>
              <button className="btn-secondary px-8 py-4">View Pitch Deck</button>
            </div>
          </div>

          <div className="flex-shrink-0 w-52 h-52 relative">
             <div className="absolute inset-0 rounded-full bg-elp-500/20 animate-pulse blur-2xl" />
             <div className="relative w-full h-full rounded-full border-2 border-white/5 flex items-center justify-center p-8 bg-surface-1/50 backdrop-blur-xl">
                <Rocket className="w-24 h-24 text-elp-400 rotate-45" />
             </div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Launch Goal', value: formatUSD(totalLiquidityTarget), icon: Target },
          { label: 'Current Volume', value: formatUSD(currentVolume), icon: BarChart3 },
          { label: 'Progress', value: launchProgress + '%', icon: Rocket },
          { label: 'Security', value: 'Audited', icon: ShieldCheck },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            className="glass-card p-6"
          >
            <stat.icon className="w-5 h-5 text-elp-400 mb-3" />
            <div className="stat-label mb-1">{stat.label}</div>
            <div className="stat-value text-2xl">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Progress Section */}
      <section className="glass-card p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display font-bold text-xl text-white">Bootstrap Progress</h2>
          <span className="font-mono text-sm text-elp-400 font-bold">{formatUSD(currentVolume)} / {formatUSD(totalLiquidityTarget)}</span>
        </div>
        
        <div className="relative h-4 rounded-full bg-white/5 overflow-hidden mb-12">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${launchProgress}%` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-elp-600 to-elp-400"
            />
            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.1)_75%,transparent_75%,transparent)] bg-[length:20px_20px]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {launchPhases.map((phase) => (
             <div key={phase.title} className="relative pl-8 border-l border-white/10">
                <div className={`absolute top-0 -left-1.5 w-3 h-3 rounded-full ${
                  phase.status === 'COMPLETED' ? 'bg-elp-500' : 
                  phase.status === 'ACTIVE' ? 'bg-elp-400 animate-pulse' : 'bg-white/10'
                }`} />
                <div className="stat-label mb-1">{phase.title}</div>
                <div className="text-white font-semibold">{phase.label}</div>
             </div>
          ))}
        </div>
      </section>

      {/* Tokenomics */}
      <section className="glass-card p-8">
        <h2 className="font-display font-bold text-xl text-white mb-6">$ELP Tokenomics</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Distribution bars */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <span className="stat-label">Distribution</span>
              <span className="font-mono text-xs text-white/30">Total Supply: 100M $ELP</span>
            </div>
            {TOKEN_DISTRIBUTION.map(item => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-white/70 font-body">{item.label}</span>
                  <span className="font-mono text-sm font-bold" style={{ color: item.color }}>{item.pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.pct}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Token utility */}
          <div className="space-y-4">
            <span className="stat-label">Token Utility</span>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: '🗳️', title: 'Governance', desc: 'Vote on strategies, fees, vault parameters' },
                { icon: '💎', title: 'Fee Discount', desc: 'Stake ELP to reduce perf fee up to 50%' },
                { icon: '🚀', title: 'Boost Rewards', desc: 'Earn protocol fee share from staking' },
                { icon: '🔐', title: 'Alpha Access', desc: 'Some strategies require min ELP stake' },
              ].map(item => (
                <div key={item.title} className="p-3 rounded-xl bg-surface-0/50 border border-white/[0.04]">
                  <div className="text-lg mb-1">{item.icon}</div>
                  <div className="text-xs font-display font-semibold text-white mb-0.5">{item.title}</div>
                  <div className="text-[10px] text-white/30 font-body leading-snug">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Security & Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="glass-card p-8 space-y-4">
           <h3 className="font-display font-bold text-white text-lg">DeAura Launch Strategy</h3>
           <p className="text-white/50 text-sm leading-relaxed">
             We use DeAura's concentrated liquidity hooks to ensure that 100% of the 
             initial liquidity is locked in a protocol-owned vault. The $ELP token 
             incentivizes long-term depositors through yield-sharing and governance.
           </p>
           <ul className="space-y-3">
             {[
               'Fair-launch distribution via bonding curve',
               'Initial LP tokens permanently burned',
               'Target Volume for TGE: $200k',
               'Smart contracts audited by Hacken',
             ].map(text => (
              <li key={text} className="flex items-center gap-3 text-sm text-white/70">
                <div className="w-1.5 h-1.5 rounded-full bg-elp-500" />
                {text}
              </li>
             ))}
           </ul>
        </section>

        <section className="glass-card p-8 space-y-6">
           <h3 className="font-display font-bold text-white text-lg">Security & Trust</h3>
           <div className="grid grid-cols-2 gap-4">
              {[
                { icon: ShieldCheck, label: 'Hacken Audit', sub: 'Completed' },
                { icon: Lock, label: 'Time-Locked', sub: 'Upgrades' },
                { icon: Timer, label: '4yr Vesting', sub: 'Team Tokens' },
                { icon: Zap, label: 'Emergency', sub: 'Pause Mechanism' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-surface-0/30 border border-white/[0.04]">
                  <item.icon className="w-5 h-5 text-elp-400" />
                  <div>
                    <div className="text-xs font-semibold text-white">{item.label}</div>
                    <div className="text-[10px] text-white/30 font-mono">{item.sub}</div>
                  </div>
                </div>
              ))}
           </div>
           <button className="btn-primary w-full py-4">Connect Wallet to Participate</button>
        </section>
      </div>
    </motion.div>
  )
}
