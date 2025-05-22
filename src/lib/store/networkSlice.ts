import { StateCreator } from "zustand"
import { type PublicClient, type WalletClient } from "viem"
import { type Transport } from "viem"
import { type Chain } from "viem"

export interface NetworkState {
  address?: string
  chainId?: number
  isConnected: boolean
  isConnecting: boolean
  isDisconnected: boolean
  provider?: PublicClient<Transport, Chain>
  walletClient?: WalletClient<Transport, Chain>
  setAddress: (address: string | undefined) => void
  setChainId: (chainId: number | undefined) => void
  setConnectionStatus: (status: {
    isConnected: boolean
    isConnecting: boolean
    isDisconnected: boolean
  }) => void
  setProvider: (provider: PublicClient<Transport, Chain> | undefined) => void
  setWalletClient: (walletClient: WalletClient<Transport, Chain> | undefined) => void
}

// should I create a middleware to log the state changes? soon(tm)
export const createNetworkSlice: StateCreator<NetworkState, [], [], NetworkState> = (set) => ({
  address: undefined,
  chainId: undefined,
  isConnected: false,
  isConnecting: false,
  isDisconnected: true,
  provider: undefined,
  walletClient: undefined,
  setAddress: (address) => set({ address }),
  setChainId: (chainId) => set({ chainId }),
  setConnectionStatus: (status) => set(status),
  setProvider: (provider) => set({ provider }),
  setWalletClient: (walletClient) => set({ walletClient }),
})
