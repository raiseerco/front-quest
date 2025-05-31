import { describe, it, expect, beforeEach, vi } from "vitest"
import { showContractErrorToast, ContractErrors } from "@lib/errorHandler"
import {
  UserRejectedRequestError,
  ChainMismatchError,
  RpcRequestError,
  TimeoutError,
  Chain,
} from "viem"
import { toast } from "react-toastify"

// Mock the toast
vi.mock("react-toastify", () => ({
  toast: {
    update: vi.fn(),
    warning: vi.fn(),
    error: vi.fn(),
  },
}))

describe("ErrorHandler", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("has all the error messages defined", () => {
    expect(ContractErrors.USER_REJECTED).toBe("Transaction cancelled by user")
    expect(ContractErrors.CHAIN_MISMATCH).toBe("Please switch to the correct network")
    expect(ContractErrors.INSUFFICIENT_FUNDS).toBe("Insufficient funds")
    expect(ContractErrors.UNKNOWN_ERROR).toBe("Unknown error occurred")
  })

  describe("User rejection handling", () => {
    it("handles UserRejectedRequestError", () => {
      const error = new UserRejectedRequestError(new Error("User rejected"))
      const result = showContractErrorToast(error, "test-toast")

      expect(result.type).toBe("USER_REJECTED")
      expect(result.message).toBe(ContractErrors.USER_REJECTED)
      expect(toast.update).toHaveBeenCalledWith("test-toast", {
        render: ContractErrors.USER_REJECTED,
        type: "warning",
        isLoading: false,
        autoClose: 5000,
      })
    })

    it("handles generic user rejection messages", () => {
      const error = new Error("User rejected the transaction")
      const result = showContractErrorToast(error, "test-toast")

      expect(result.type).toBe("USER_REJECTED")
      expect(toast.update).toHaveBeenCalledWith(
        "test-toast",
        expect.objectContaining({
          type: "warning",
        })
      )
    })
  })

  describe("Network and RPC errors", () => {
    it("handles chain mismatch errors", () => {
      const error = new ChainMismatchError({
        chain: { id: 1, name: "Ethereum" } as Chain,
        currentChainId: 5,
      })

      const result = showContractErrorToast(error, "test-toast")

      expect(result.type).toBe("CHAIN_MISMATCH")
      expect(result.message).toBe(ContractErrors.CHAIN_MISMATCH)
    })

    it("handles RPC errors", () => {
      const error = new RpcRequestError({
        body: { method: "eth_call" },
        error: { code: -32000, message: "RPC error" },
        url: "https://rpc.example.com",
      })

      const result = showContractErrorToast(error, "test-toast")
      expect(result.type).toBe("RPC_ERROR")
    })

    it("handles timeout errors", () => {
      const error = new TimeoutError({
        body: { method: "eth_sendTransaction" },
        url: "https://rpc.example.com",
      })

      const result = showContractErrorToast(error, "test-toast")
      expect(result.type).toBe("TIMEOUT")
    })
  })

  describe("Generic error handling", () => {
    it("handles regular Error objects", () => {
      const error = new Error("Something went wrong")
      const result = showContractErrorToast(error, "test-toast")

      expect(result.type).toBe("UNKNOWN_ERROR")
      expect(result.message).toBe("Something went wrong")
    })

    it("handles non-Error types", () => {
      const result = showContractErrorToast("string error", "test-toast")

      expect(result.type).toBe("UNKNOWN_ERROR")
      expect(result.message).toBe(ContractErrors.UNKNOWN_ERROR)
    })

    it("works without toast ID", () => {
      const error = new Error("Test error")
      const result = showContractErrorToast(error)

      expect(result.message).toBe("Test error")
      expect(toast.update).toHaveBeenCalledWith(undefined, expect.any(Object))
    })
  })

  // Test dev logging
  it("logs errors in development", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {})
    vi.stubEnv("NODE_ENV", "development")

    const error = new Error("Test error")
    showContractErrorToast(error, "test-toast")

    expect(consoleSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
    vi.unstubAllEnvs()
  })
})
