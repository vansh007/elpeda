import type { IntentResponse } from '@/types'

const VAULT_DATA = [
  {
    id: 'elp-stable-vault',
    name: 'Elpeda Stable Yield',
    symbol: 'epUSD',
    apy: 18.4,
    risk: 'LOW',
    desc: 'Orca CLMM stable pools + Kamino lending',
  },
  {
    id: 'elp-sol-vault',
    name: 'Elpeda SOL Maximizer',
    symbol: 'epSOL',
    apy: 34.7,
    risk: 'MEDIUM',
    desc: 'Orca concentrated liquidity + Raydium + Drift delta-neutral',
  },
  {
    id: 'elp-defi-vault',
    name: 'Elpeda DeFi Alpha',
    symbol: 'epDEFI',
    apy: 67.2,
    risk: 'HIGH',
    desc: 'JUP/ORCA concentrated positions + funding rate arbitrage',
  },
  {
    id: 'elp-btc-vault',
    name: 'Elpeda BTC Hedge',
    symbol: 'epBTC',
    apy: 12.8,
    risk: 'LOW',
    desc: 'Wrapped BTC lending + delta-neutral hedging',
  },
  {
    id: 'elp-meme-vault',
    name: 'Elpeda Meme Alpha',
    symbol: 'epMEME',
    apy: 142.5,
    risk: 'HIGH',
    desc: 'BONK/WIF/POPCAT concentrated liquidity pools',
  },
  {
    id: 'elp-rwa-vault',
    name: 'Elpeda RWA Yield',
    symbol: 'epRWA',
    apy: 7.8,
    risk: 'LOW',
    desc: 'Tokenized treasuries + RWA lending protocols',
  },
]

function matchVault(input: string): typeof VAULT_DATA[number] {
  const lower = input.toLowerCase()
  
  // Risk-based matching
  if (lower.includes('safe') || lower.includes('protect') || lower.includes('conservative') || lower.includes('capital preservation') || lower.includes('steady') || lower.includes('stable')) {
    return VAULT_DATA[0] // stable
  }
  if (lower.includes('btc') || lower.includes('bitcoin') || lower.includes('hedge')) {
    return VAULT_DATA[3] // btc
  }
  if (lower.includes('rwa') || lower.includes('treasury') || lower.includes('institutional') || lower.includes('real world')) {
    return VAULT_DATA[5] // rwa
  }
  if (lower.includes('meme') || lower.includes('degen') || lower.includes('bonk') || lower.includes('wif') || lower.includes('popcat') || lower.includes('moon')) {
    return VAULT_DATA[4] // meme
  }
  if (lower.includes('sol') || lower.includes('medium risk') || lower.includes('balanced')) {
    return VAULT_DATA[1] // sol
  }
  if (lower.includes('max') || lower.includes('aggressive') || lower.includes('alpha') || lower.includes('high risk') || lower.includes('high yield')) {
    return VAULT_DATA[2] // defi
  }
  
  // Default to SOL maximizer (good middle ground)
  return VAULT_DATA[1]
}

function getExplanation(vault: typeof VAULT_DATA[number], input: string): string {
  const explanations: Record<string, string> = {
    'elp-stable-vault': `Based on your focus on capital preservation, the Stable Yield vault is your best fit. It allocates across low-risk Orca stablecoin pools and Kamino's battle-tested lending protocols for consistent ${vault.apy}% APY with near-zero impermanent loss.`,
    'elp-sol-vault': `For your risk profile, the SOL Maximizer vault offers the ideal balance. It farms concentrated liquidity on Orca's highest-volume SOL pairs while maintaining a Drift delta-neutral hedge to protect against drawdowns. Currently running at ${vault.apy}% APY.`,
    'elp-defi-vault': `As an experienced DeFi user comfortable with volatility, the DeFi Alpha vault gives you maximum yield exposure. It targets JUP/ORCA concentrated positions and captures funding rate arbitrage on Drift — currently yielding ${vault.apy}% APY.`,
    'elp-btc-vault': `For Bitcoin holders seeking yield on Solana, the BTC Hedge vault is purpose-built. It combines wBTC lending on Kamino with delta-neutral positions on Drift, earning you ${vault.apy}% APY while maintaining your BTC exposure.`,
    'elp-meme-vault': `The Meme Alpha vault is built for degens who want maximum upside from Solana's meme token ecosystem. It rotates across BONK, WIF, and POPCAT concentrated liquidity pools — currently yielding ${vault.apy}% APY with aggressive position management.`,
    'elp-rwa-vault': `For institutional-grade stability, the RWA Yield vault allocates to tokenized US Treasury exposure via Ondo USDY and senior lending pools on Maple. Currently offering ${vault.apy}% APY with counterparty risk nearly eliminated by protocol insurance.`,
  }
  return explanations[vault.id] || ''
}

function getRiskAssessment(vault: typeof VAULT_DATA[number]): string {
  const assessments: Record<string, string> = {
    LOW: 'Minimal risk — stablecoin exposure with smart contract risk being the primary concern.',
    MEDIUM: 'Moderate risk — exposed to SOL price movement and concentrated liquidity IL.',
    HIGH: 'High risk — significant impermanent loss potential, governance token volatility, and liquidation risk in leveraged positions.',
  }
  return assessments[vault.risk] || assessments.MEDIUM
}

export async function parseIntent(userInput: string, depositAmount: number): Promise<IntentResponse> {
  // Simulate network delay for mock
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000))

  const vault = matchVault(userInput)
  const apy = vault.apy / 100
  const amount = depositAmount || 1000

  // Find an alternative vault
  const alts = VAULT_DATA.filter(v => v.id !== vault.id)
  const alt = vault.risk === 'LOW' ? alts.find(v => v.risk === 'MEDIUM') :
              vault.risk === 'HIGH' ? alts.find(v => v.risk === 'MEDIUM') :
              alts.find(v => v.risk === 'LOW')

  return {
    recommendedVaultId: vault.id,
    recommendedVaultName: vault.name,
    explanation: getExplanation(vault, userInput),
    riskAssessment: getRiskAssessment(vault),
    projectedAPY: vault.apy,
    projectedDaily: (amount * apy) / 365,
    projectedMonthly: (amount * apy) / 12,
    projectedAnnual: amount * apy,
    confidence: Math.floor(75 + Math.random() * 20),
    alternativeVaultId: alt?.id,
    alternativeReason: alt ? `${alt.name} offers ${alt.apy}% APY at ${alt.risk} risk` : undefined,
  }
}
