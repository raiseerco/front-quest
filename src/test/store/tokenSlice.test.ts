import { describe, it, expect, beforeEach } from "vitest"
import { create, type UseBoundStore, type StoreApi } from "zustand"
import { createTokenSlice, type TokenState } from "@lib/store/tokenSlice"

describe("TokenSlice", () => {
  let store: UseBoundStore<StoreApi<TokenState>>

  beforeEach(() => {
    store = create<TokenState>(createTokenSlice)
  })

  it("starts with empty balances", () => {
    const state = store.getState()
    expect(state.balances).toEqual({})
    expect(typeof state.setBalance).toBe("function")
  })

  describe("Balance management", () => {
    it("can set token balance", () => {
      const ethAddress = "0x1234567890123456789012345678901234567890"
      const amount = BigInt("1000000000000000000") // 1 eth

      store.getState().setBalance(ethAddress, amount)
      expect(store.getState().balances[ethAddress]).toBe(amount)
    })

    it("can update existing balance", () => {
      const tokenAddr = "0xA0b86a33E6441E2e21E45d4e04d0e2A2AA0e4667" // usdc

      store.getState().setBalance(tokenAddr, BigInt(1000))
      store.getState().setBalance(tokenAddr, BigInt(2000))

      expect(store.getState().balances[tokenAddr]).toBe(BigInt(2000))
    })

    it("handles multiple tokens", () => {
      const eth = "0x1234567890123456789012345678901234567890"
      const usdc = "0x2222222222222222222222222222222222222222"

      store.getState().setBalance(eth, BigInt("1000000000000000000"))
      store.getState().setBalance(usdc, BigInt("5000000000"))

      const balances = store.getState().balances
      expect(Object.keys(balances)).toHaveLength(2)
      expect(balances[eth]).toBe(BigInt("1000000000000000000"))
      expect(balances[usdc]).toBe(BigInt("5000000000"))
    })

    // Edge case that actually matters
    it("handles zero balance correctly", () => {
      const token = "0x3333333333333333333333333333333333333333"
      store.getState().setBalance(token, BigInt(0))
      expect(store.getState().balances[token]).toBe(BigInt(0))
    })
  })

  describe("State immutability", () => {
    it("creates new state objects when updating", () => {
      const token = "0x4444444444444444444444444444444444444444"

      store.getState().setBalance(token, BigInt(100))
      const firstState = store.getState().balances

      store.getState().setBalance(token, BigInt(200))
      const secondState = store.getState().balances

      expect(firstState).not.toBe(secondState)
      expect(secondState[token]).toBe(BigInt(200))
    })
  })

  // Real world scenario
  it("simulates typical portfolio updates", () => {
    const tokens = {
      eth: "0x1111111111111111111111111111111111111111",
      usdc: "0x2222222222222222222222222222222222222222",
      dai: "0x3333333333333333333333333333333333333333",
    }

    // Initial portfolio setup
    store.getState().setBalance(tokens.eth, BigInt("2500000000000000000")) // 2.5 ETH
    store.getState().setBalance(tokens.usdc, BigInt("1000000000")) // 1000 USDC
    store.getState().setBalance(tokens.dai, BigInt("500000000000000000000")) // 500 DAI

    const portfolio = store.getState().balances
    expect(Object.keys(portfolio)).toHaveLength(3)

    // User spends some tokens
    store.getState().setBalance(tokens.usdc, BigInt("750000000")) // spent 250 USDC

    expect(store.getState().balances[tokens.usdc]).toBe(BigInt("750000000"))
    // Other balances unchanged
    expect(store.getState().balances[tokens.eth]).toBe(BigInt("2500000000000000000"))
    expect(store.getState().balances[tokens.dai]).toBe(BigInt("500000000000000000000"))
  })
})
