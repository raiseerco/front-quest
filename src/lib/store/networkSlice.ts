import { StateCreator } from "zustand"

export interface NetworkState {
  address?: string
  chainId?: number
  setAddress: (address: string) => void
}

// tbd
export const createNetworkSlice: StateCreator<NetworkState, [], [], NetworkState> = (set) => ({
  address: undefined,
  chainId: undefined,
  setAddress: (address) => set({ address }),
})
