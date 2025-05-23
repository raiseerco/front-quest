import { StateCreator } from "zustand"

export type TokenState = {
  balances: Record<string, bigint> // tokenAddress -> balance
  setBalance: (token: string, balance: bigint) => void
}

export const createTokenSlice: StateCreator<TokenState, [], [], TokenState> = (set) => ({
  balances: {},
  setBalance: (token, balance) =>
    set((state) => ({
      balances: { ...state.balances, [token]: balance },
    })),
})
