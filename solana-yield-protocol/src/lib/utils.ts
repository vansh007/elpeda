export function formatUSD(value: number, compact = false): string {
  if (compact) {
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`
    if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`
    return `$${value.toFixed(2)}`
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatAPY(apy: number): string {
  return `${apy.toFixed(2)}%`
}

export function formatShares(shares: number): string {
  return shares.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })
}

export function formatNumber(n: number, compact = false): string {
  if (compact) {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
    return n.toLocaleString()
  }
  return n.toLocaleString()
}

export function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export function formatTimeRemaining(date: Date): string {
  const ms = date.getTime() - Date.now()
  if (ms <= 0) return 'Ended'
  const hours = Math.floor(ms / 3600000)
  if (hours >= 48) return `${Math.floor(hours / 24)}d remaining`
  if (hours >= 1) return `${hours}h remaining`
  return `${Math.floor(ms / 60000)}m remaining`
}

export function riskColor(risk: 'LOW' | 'MEDIUM' | 'HIGH'): string {
  return {
    LOW: 'text-elp-400',
    MEDIUM: 'text-amber-400',
    HIGH: 'text-red-400',
  }[risk]
}

export function riskBg(risk: 'LOW' | 'MEDIUM' | 'HIGH'): string {
  return {
    LOW: 'tag-elp',
    MEDIUM: 'tag-amber',
    HIGH: 'bg-red-500/10 text-red-400 border border-red-500/20',
  }[risk]
}

export function strategyTypeLabel(type: string): string {
  return {
    AMM_LP: 'AMM LP',
    CLMM: 'Concentrated',
    LENDING: 'Lending',
    DELTA_NEUTRAL: 'Delta Neutral',
  }[type] ?? type
}

export function shortAddress(addr: string): string {
  if (addr.length <= 10) return addr
  return `${addr.slice(0, 4)}...${addr.slice(-4)}`
}

export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max)
}
