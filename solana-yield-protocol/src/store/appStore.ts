import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Vault, UserPosition, ProtocolStats, IntentResponse } from '@/types'
import { MOCK_VAULTS, PROTOCOL_STATS } from '@/data/mockData'
import { fetchLiveTokenData, type TokenData } from '@/lib/priceService'

interface AppStore {
  // Data
  vaults: Vault[]
  userPositions: UserPosition[]
  protocolStats: ProtocolStats
  elpBalance: number
  tokenPrices: Record<string, TokenData>
  
  // UI State
  activeTab: 'vaults' | 'swap' | 'portfolio' | 'governance' | 'analytics' | 'launch'
  selectedVaultId: string | null
  depositModalOpen: boolean
  depositVaultId: string | null
  
  // Intent Engine State
  intentInput: string
  intentLoading: boolean
  intentResponse: IntentResponse | null
  intentError: string | null

  // DeAura Launch State
  launchProgress: number
  totalLiquidityTarget: number
  currentVolume: number
  isLaunched: boolean

  // Simulation
  simulatedTick: number
  
  // Actions
  setActiveTab: (tab: AppStore['activeTab']) => void
  setSelectedVault: (id: string | null) => void
  openDepositModal: (vaultId: string) => void
  closeDepositModal: () => void
  deposit: (vaultId: string, amount: number) => void
  withdraw: (vaultId: string, shares: number) => void
  setIntentInput: (input: string) => void
  setIntentResponse: (response: IntentResponse | null) => void
  setIntentLoading: (loading: boolean) => void
  setIntentError: (error: string | null) => void
  clearIntent: () => void
  tick: () => void
  fetchPrices: () => Promise<void>
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      vaults: MOCK_VAULTS,
      userPositions: [],
      protocolStats: PROTOCOL_STATS,
      elpBalance: 10000,
      tokenPrices: {},
      
      activeTab: 'vaults',
      selectedVaultId: null,
      depositModalOpen: false,
      depositVaultId: null,
      
      // Intent Engine
      intentInput: '',
      intentLoading: false,
      intentResponse: null,
      intentError: null,

      // DeAura Launch
      launchProgress: 71,
      totalLiquidityTarget: 200000,
      currentVolume: 142500,
      isLaunched: false,

      simulatedTick: 0,

      setActiveTab: (tab) => set({ activeTab: tab }),
      setSelectedVault: (id) => set({ selectedVaultId: id }),
      openDepositModal: (vaultId) => set({ depositModalOpen: true, depositVaultId: vaultId }),
      closeDepositModal: () => set({ depositModalOpen: false, depositVaultId: null }),

      setIntentInput: (input) => set({ intentInput: input }),
      setIntentResponse: (response) => set({ intentResponse: response }),
      setIntentLoading: (loading) => set({ intentLoading: loading }),
      setIntentError: (error) => set({ intentError: error }),
      clearIntent: () => set({ intentInput: '', intentResponse: null, intentError: null, intentLoading: false }),

      deposit: (vaultId, amount) => {
        set((state) => {
          const vault = state.vaults.find(v => v.id === vaultId)
          if (!vault) return state

          const shares = amount / vault.sharePrice
          const existingPos = state.userPositions.find(p => p.vaultId === vaultId)
          
          const newPositions = existingPos
            ? state.userPositions.map(p =>
                p.vaultId === vaultId
                  ? { ...p, deposited: p.deposited + amount, shares: p.shares + shares, currentValue: p.currentValue + amount }
                  : p
              )
            : [...state.userPositions, {
                vaultId,
                deposited: amount,
                currentValue: amount,
                shares,
                yieldEarned: 0,
                depositTime: new Date(),
                pnlPercent: 0,
              }]

          const newVaults = state.vaults.map(v =>
            v.id === vaultId
              ? { ...v, totalTVL: v.totalTVL + amount, userDeposits: v.userDeposits + amount }
              : v
          )

          return {
            userPositions: newPositions,
            vaults: newVaults,
            protocolStats: { ...state.protocolStats, totalTVL: state.protocolStats.totalTVL + amount },
          }
        })
      },

      withdraw: (vaultId, sharesToWithdraw) => {
        set((state) => {
          const vault = state.vaults.find(v => v.id === vaultId)
          const pos = state.userPositions.find(p => p.vaultId === vaultId)
          if (!vault || !pos) return state

          const withdrawValue = sharesToWithdraw * vault.sharePrice
          const remainingShares = pos.shares - sharesToWithdraw

          const newPositions = remainingShares <= 0
            ? state.userPositions.filter(p => p.vaultId !== vaultId)
            : state.userPositions.map(p =>
                p.vaultId === vaultId
                  ? { ...p, shares: remainingShares, currentValue: remainingShares * vault.sharePrice, deposited: p.deposited - withdrawValue }
                  : p
              )

          return {
            userPositions: newPositions,
            vaults: state.vaults.map(v =>
              v.id === vaultId
                ? { ...v, totalTVL: Math.max(0, v.totalTVL - withdrawValue) }
                : v
            ),
          }
        })
      },

      tick: () => {
        set((state) => {
          const newPositions = state.userPositions.map(pos => {
            const vault = state.vaults.find(v => v.id === pos.vaultId)
            if (!vault) return pos
            const hourlyRate = vault.totalAPY / 100 / 8760
            const yieldThisTick = pos.currentValue * hourlyRate * (1 / 60)
            return {
              ...pos,
              currentValue: pos.currentValue + yieldThisTick,
              yieldEarned: pos.yieldEarned + yieldThisTick,
              pnlPercent: pos.deposited > 0 ? ((pos.currentValue + yieldThisTick - pos.deposited) / pos.deposited) * 100 : 0,
            }
          })

          const newVaults = state.vaults.map(vault => ({
            ...vault,
            sharePrice: vault.sharePrice * (1 + (vault.totalAPY / 100 / 8760) * (1 / 60)),
          }))

          return {
            userPositions: newPositions,
            vaults: newVaults,
            simulatedTick: state.simulatedTick + 1,
          }
        })
      },

      fetchPrices: async () => {
        const prices = await fetchLiveTokenData()
        set((state) => {
          // Merge new prices, don't overwrite completely if API fails for some
          if (Object.keys(prices).length > 0) {
             return { tokenPrices: { ...state.tokenPrices, ...prices } }
          }
          return state
        })
      },
    }),
    {
      name: 'elpeda-storage',
    }
  )
)
