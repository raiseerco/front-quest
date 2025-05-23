import {
  UserRejectedRequestError,
  ContractFunctionExecutionError,
  ChainMismatchError,
  RpcRequestError,
  TimeoutError,
} from "viem"
import { toast } from "react-toastify"

export const ContractErrors = {
  USER_REJECTED: "Transaction cancelled by user",
  CHAIN_MISMATCH: "Please switch to the correct network",
  INSUFFICIENT_FUNDS: "Insufficient funds",
  MINT_DISABLED: "Minting is currently disabled/paused",
  APPROVAL_FAILED: "Token approval failed",
  NOT_OWNER: "You are not the damn contract owner",
  RPC_ERROR: "Network RPC error. Please try again.",
  TIMEOUT: "Request timed out. Check your connection.",
  UNKNOWN_ERROR: "Unknown error occurred",
} as const

export type ContractErrorType = keyof typeof ContractErrors

export interface ErrorMapping {
  type: ContractErrorType
  message: string
}

function extractRevertReason(errorMessage: string): string | null {
  try {
    const revertPattern = /execution reverted(?::\s*)?(["']?)(?<reason>.+?)\1/i
    const match = errorMessage.match(revertPattern)
    return match?.groups?.reason || null
  } catch (error) {
    console.error("Error extracting revert reason:", error)
    return null
  }
}

const knownRevertReasons: Record<string, ContractErrorType> = {
  Insufficient: "INSUFFICIENT_FUNDS",
  MintDisabled: "MINT_DISABLED",
  ApprovalFailed: "APPROVAL_FAILED",
  "Ownable: caller is not the owner": "NOT_OWNER",
}

function errorMapping(type: ContractErrorType, fallbackMessage?: string): ErrorMapping {
  return {
    type,
    message: fallbackMessage || ContractErrors[type] || ContractErrors.UNKNOWN_ERROR,
  }
}

export function mapContractError(error: unknown): ErrorMapping {
  if (
    error instanceof UserRejectedRequestError ||
    (error instanceof Error &&
      (error.message.toLowerCase().includes("user rejected") ||
        error.message.toLowerCase().includes("user denied"))) ||
    (error instanceof ContractFunctionExecutionError &&
      error.message.toLowerCase().includes("user rejected"))
  ) {
    return errorMapping("USER_REJECTED")
  }

  if (error instanceof ChainMismatchError) return errorMapping("CHAIN_MISMATCH")
  if (error instanceof RpcRequestError) return errorMapping("RPC_ERROR")
  if (error instanceof TimeoutError) return errorMapping("TIMEOUT")

  if (error instanceof ContractFunctionExecutionError) {
    const reason = extractRevertReason(error.message)
    if (reason) {
      for (const key in knownRevertReasons) {
        if (reason.includes(key)) {
          return errorMapping(knownRevertReasons[key])
        }
      }
      return errorMapping("UNKNOWN_ERROR", reason)
    }
    return errorMapping("UNKNOWN_ERROR", "Transaction failed (contract reverted)")
  }

  return errorMapping("UNKNOWN_ERROR", error instanceof Error ? error.message : undefined)
}

export function showContractErrorToast(error: unknown): ErrorMapping {
  const { type, message } = mapContractError(error)

  if (type === "USER_REJECTED") {
    toast.warning(message)
  } else {
    toast.error(message)
  }

  if (process.env.NODE_ENV === "development") {
    console.log(`[${type}]`, error)
  }

  return { type, message }
}
