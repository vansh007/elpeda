import { useEffect, useRef } from 'react'
import { useAppStore } from '@/store/appStore'

// Simulates on-chain yield accrual every 3 seconds
export function useYieldSimulation() {
  const tick = useAppStore(s => s.tick)
  const userPositions = useAppStore(s => s.userPositions)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (userPositions.length > 0) {
      intervalRef.current = setInterval(() => {
        tick()
      }, 3000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [userPositions.length, tick])
}

// Returns computed portfolio stats
export function usePortfolioStats() {
  const positions = useAppStore(s => s.userPositions)
  const vaults = useAppStore(s => s.vaults)

  const totalDeposited = positions.reduce((sum, p) => sum + p.deposited, 0)
  const totalCurrentValue = positions.reduce((sum, p) => sum + p.currentValue, 0)
  const totalYieldEarned = positions.reduce((sum, p) => sum + p.yieldEarned, 0)
  const totalPnL = totalCurrentValue - totalDeposited
  const totalPnLPercent = totalDeposited > 0 ? (totalPnL / totalDeposited) * 100 : 0

  const weightedAPY = positions.reduce((sum, p) => {
    const vault = vaults.find(v => v.id === p.vaultId)
    if (!vault || totalCurrentValue === 0) return sum
    return sum + vault.totalAPY * (p.currentValue / totalCurrentValue)
  }, 0)

  return {
    totalDeposited,
    totalCurrentValue,
    totalYieldEarned,
    totalPnL,
    totalPnLPercent,
    weightedAPY,
    positionCount: positions.length,
  }
}
