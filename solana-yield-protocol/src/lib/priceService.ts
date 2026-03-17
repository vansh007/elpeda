export interface TokenData {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  price_change_percentage_24h: number
}

// Map of protocol symbols to CoinGecko IDs
export const COINGECKO_IDS: Record<string, string> = {
  USDC: 'usd-coin',
  USDT: 'tether',
  SOL: 'solana',
  BONK: 'bonk',
  JUP: 'jupiter-exchange-solana',
  ORCA: 'orca',
  mSOL: 'msol',
  wBTC: 'wrapped-bitcoin',
  WIF: 'dogwifcoin',
  POPCAT: 'popcat',
  RAY: 'raydium',
  PYTH: 'pyth-network',
  HNT: 'helium',
  RENDER: 'render-token',
  JITO: 'jito-governance-token',
  BSOL: 'blazestake-staked-sol',
  USDY: 'ondo-us-dollar-yield',
}

// Reverse map for quick lookup by ID
const REVERSE_ID_MAP = Object.entries(COINGECKO_IDS).reduce((acc, [symbol, id]) => {
  acc[id] = symbol
  return acc
}, {} as Record<string, string>)

export async function fetchLiveTokenData(): Promise<Record<string, TokenData>> {
  try {
    const ids = Object.values(COINGECKO_IDS).join(',')
    // Note: Free CoinGecko API has rate limits. In production, use a pro key or a proxy/cache.
    const res = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}`)
    
    if (!res.ok) {
      throw new Error(`CoinGecko API error: ${res.statusText}`)
    }

    const data: any[] = await res.json()
    
    const tokenMap: Record<string, TokenData> = {}
    data.forEach(item => {
      const symbol = REVERSE_ID_MAP[item.id]
      if (symbol) {
        tokenMap[symbol] = {
          id: item.id,
          symbol: item.symbol.toUpperCase(),
          name: item.name,
          image: item.image,
          current_price: item.current_price,
          price_change_percentage_24h: item.price_change_percentage_24h,
        }
      }
    })

    // Fallbacks for missing tokens (sometimes API might omit newly added or less liquid ones)
    if (!tokenMap['wBTC'] && tokenMap['BTC']) {
       tokenMap['wBTC'] = { ...tokenMap['BTC'], symbol: 'wBTC' }
    }

    return tokenMap
  } catch (error) {
    console.error('Failed to fetch live token data:', error)
    return {}
  }
}
