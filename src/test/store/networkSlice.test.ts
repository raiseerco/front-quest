import { describe, it, expect, beforeEach } from "vitest"
import { create, type UseBoundStore, type StoreApi } from "zustand"
import { createNetworkSlice, NetworkState, type Transaction } from "@lib/store/networkSlice"

// Just some basic test data - nothing fancy
const userAddress = "0x1234567890123456789012345678901234567890"
const tokenAddress = "0x1234567890123456789012345678901234567890"
const fromAddress = "0x1111111111111111111111111111111111111111"

describe("NetworkSlice", () => {
  let store: UseBoundStore<StoreApi<NetworkState>>

  beforeEach(() => {
    store = create<NetworkState>(createNetworkSlice)
  })

  // Basic functionality tests
  describe("Initial State", () => {
    it("should start with correct defaults", () => {
      const state = store.getState()

      expect(state.address).toBeUndefined()
      expect(state.chainId).toBeUndefined()
      expect(state.isConnected).toBe(false)
      expect(state.isDisconnected).toBe(true)
      expect(state.transactionHistory).toEqual([])
    })
  })

  describe("Address and Chain management", () => {
    it("can set user address", () => {
      store.getState().setAddress(userAddress)
      expect(store.getState().address).toBe(userAddress)
    })

    it("can clear address", () => {
      store.getState().setAddress(userAddress)
      store.getState().setAddress(undefined)
      expect(store.getState().address).toBeUndefined()
    })

    it("handles chain ID updates", () => {
      store.getState().setChainId(1)
      expect(store.getState().chainId).toBe(1)

      // Switch to different chain
      store.getState().setChainId(5)
      expect(store.getState().chainId).toBe(5)
    })
  })

  describe("Connection Status", () => {
    it("updates when connecting", () => {
      store.getState().setConnectionStatus({
        isConnected: false,
        isConnecting: true,
        isDisconnected: false,
      })

      const state = store.getState()
      expect(state.isConnecting).toBe(true)
      expect(state.isConnected).toBe(false)
    })

    it("updates when connected", () => {
      store.getState().setConnectionStatus({
        isConnected: true,
        isConnecting: false,
        isDisconnected: false,
      })

      expect(store.getState().isConnected).toBe(true)
    })
  })

  describe("Transaction History", () => {
    it("can add transactions", () => {
      const tx: Transaction = {
        hash: "0xabc123",
        type: "mint",
        token: tokenAddress,
        amount: BigInt(1000),
        from: fromAddress,
        status: "initiated",
        timestamp: Date.now(),
      }

      store.getState().addTransaction(tx)
      expect(store.getState().transactionHistory).toHaveLength(1)
      expect(store.getState().transactionHistory[0]).toEqual(tx)
    })

    it("can update transaction status", () => {
      const tx: Transaction = {
        hash: "0xupdate123",
        type: "transfer",
        token: tokenAddress,
        amount: BigInt(500),
        from: fromAddress,
        status: "initiated",
        timestamp: Date.now(),
      }

      store.getState().addTransaction(tx)
      store.getState().updateTransaction("0xupdate123", "success")

      const history = store.getState().transactionHistory
      expect(history[0].status).toBe("success")
    })

    // Test that wrong hash doesn't break anything
    it("ignores updates for non-existent transactions", () => {
      const tx: Transaction = {
        hash: "0xexisting",
        type: "approve",
        token: tokenAddress,
        amount: BigInt(200),
        from: fromAddress,
        status: "initiated",
        timestamp: Date.now(),
      }

      store.getState().addTransaction(tx)
      store.getState().updateTransaction("0xwrongHash", "success")

      expect(store.getState().transactionHistory[0].status).toBe("initiated")
    })
  })

  // Basic integration test
  describe("Real-world usage", () => {
    it("simulates typical user flow", () => {
      // User connects wallet
      store.getState().setAddress(userAddress)
      store.getState().setChainId(1)
      store.getState().setConnectionStatus({
        isConnected: true,
        isConnecting: false,
        isDisconnected: false,
      })

      expect(store.getState().isConnected).toBe(true)
      expect(store.getState().address).toBe(userAddress)

      // User makes a transaction
      const mintTx: Transaction = {
        hash: "0xmint456",
        type: "mint",
        token: tokenAddress,
        amount: BigInt("1000000000000000000"), // 1 ETH
        from: userAddress,
        status: "initiated",
        timestamp: Date.now(),
      }

      store.getState().addTransaction(mintTx)
      expect(store.getState().transactionHistory).toHaveLength(1)

      // Transaction succeeds
      store.getState().updateTransaction("0xmint456", "success")
      expect(store.getState().transactionHistory[0].status).toBe("success")
    })
  })
})
