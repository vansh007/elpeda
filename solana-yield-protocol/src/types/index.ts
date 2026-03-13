export type StrategyType = 'AMM_LP' | 'CLMM' | 'LENDING' | 'DELTA_NEUTRAL'
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH'
export type VaultStatus = 'ACTIVE' | 'PAUSED' | 'REBALANCING'
export type EventType = 'HARVEST' | 'REBALANCE' | 'COMPOUND' | 'RISK_ALERT'

export interface Strategy {
  id: string
  name: string
  type: StrategyType
  protocol: string
  apy: number
  apyBase: number
  apyRewards: number
  tvl: number
  allocation: number
  risk: RiskLevel
  tokenA: string
  tokenB: string
  utilizationRate: number
  lastRebalance: Date
  feeTier: number
  impermanentLoss: number
}

export interface Vault {
  id: string
  name: string
  symbol: string
  description: string
  totalTVL: number
  totalAPY: number
  userDeposits: number
  sharePrice: number
  sharePriceChange24h: number
  strategies: Strategy[]
  depositToken: string
  performanceFee: number
  managementFee: number
  harvestInterval: number
  lastHarvest: Date
  autoCompound: boolean
  status: VaultStatus
  totalHarvested: number
  userShares: number
}

export interface UserPosition {
  vaultId: string
  deposited: number
  currentValue: number
  shares: number
  yieldEarned: number
  depositTime: Date
  pnlPercent: number
}

export interface RebalanceEvent {
  id: string
  timestamp: Date
  type: EventType
  vaultId: string
  vaultName: string
  amountHarvested?: number
  newAllocations?: { strategyId: string; oldAlloc: number; newAlloc: number }[]
  reasoning: string
  txHash: string
  gasCost: number
}

export interface GovernanceProposal {
  id: string
  title: string
  description: string
  proposer: string
  status: 'ACTIVE' | 'PASSED' | 'FAILED' | 'PENDING'
  votesFor: number
  votesAgainst: number
  quorum: number
  endTime: Date
  type: 'STRATEGY_ADD' | 'FEE_CHANGE' | 'PARAMETER_UPDATE' | 'VAULT_PAUSE'
}

export interface ProtocolStats {
  totalTVL: number
  totalUsersActive: number
  totalYieldGenerated: number
  totalTransactions: number
  elpTokenPrice: number
  elpMarketCap: number
  elpCirculatingSupply: number
  elpTotalSupply: number
}

export interface IntentResponse {
  recommendedVaultId: string
  recommendedVaultName: string
  explanation: string
  riskAssessment: string
  projectedAPY: number
  projectedDaily: number
  projectedMonthly: number
  projectedAnnual: number
  confidence: number
  alternativeVaultId?: string
  alternativeReason?: string
}

export interface HistoricalDataPoint {
  timestamp: number
  tvl: number
  apy: number
  sharePrice: number
  volume: number
}
