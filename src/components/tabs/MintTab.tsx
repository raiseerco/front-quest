"use client"

import { useState } from "react"
import { useAccount, usePublicClient } from "wagmi"
import { parseUnits, type Address, getAddress } from "viem"
import { TOKEN_ADDRESSES } from "@lib/contracts"
import { useAppStore } from "@lib/store"
import { mint } from "@lib/contracts/erc20"
import { Spinner } from "@components/Ui/spinner"
import { showContractErrorToast } from "@lib/errorHandler"

export default function MintTab() {
  const { address } = useAccount()
  const publicClient = usePublicClient()
  const [selectedToken, setSelectedToken] = useState<Address>()
  const [amount, setAmount] = useState("")

  const isMinting = useAppStore((s) => s.isMinting)
  const setMinting = useAppStore((s) => s.setMinting)
  const addTransaction = useAppStore((s) => s.addTransaction)
  const updateTransaction = useAppStore((s) => s.updateTransaction)

  const tokens = Object.entries(TOKEN_ADDRESSES.sepolia).map(([symbol, address]) => ({
    symbol,
    address: address as Address,
  }))

  const handleMint = async () => {
    if (!selectedToken || !amount || !address) return

    try {
      const amountBigInt = parseUnits(amount, 6) // FIXME: get decimals from token

      setMinting(true)
      try {
        const mintTx = await mint(selectedToken, amountBigInt)

        addTransaction({
          hash: mintTx,
          type: "mint",
          token: selectedToken,
          amount: amountBigInt,
          from: selectedToken,
          to: address as Address,
          status: "pending",
          timestamp: Date.now(),
        })

        if (!publicClient) throw new Error("Public client not found")

        await publicClient.waitForTransactionReceipt({
          hash: mintTx as `0x${string}`,
        })
        updateTransaction(mintTx, "success")
        setMinting(false)

        // Clear scr
        setAmount("")
        setSelectedToken(undefined)
      } catch (error) {
        showContractErrorToast(error)
        if (isMinting) {
          setMinting(false)
        }
      }
    } catch (error) {
      console.log("Error in transaction processing:", error)
      const errMapped = showContractErrorToast(error)

      if (isMinting) {
        setMinting(false)
      }

      // Clear form only if it wasn't a user rejection
      if (errMapped.type !== "USER_REJECTED") {
        setAmount("")
        setSelectedToken(undefined)
      }
    }
  }

  return (
    <div suppressHydrationWarning className="mx-auto flex max-w-lg flex-col gap-4 p-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="token-select" className="text-sm font-medium">
          Select Token
        </label>
        <select
          id="token-select"
          className="rounded-lg border border-gray-300 p-2"
          value={selectedToken || ""}
          onChange={(e) => {
            const value = e.target.value
            if (value) {
              try {
                setSelectedToken(getAddress(value))
              } catch (error) {
                console.error("Invalid address:", error)
              }
            } else {
              setSelectedToken(undefined)
            }
          }}
          disabled={isMinting}
        >
          <option value="">Select a token</option>
          {tokens.map((token) => (
            <option key={token.address} value={token.address}>
              {token.symbol}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="amount" className="text-sm font-medium">
          Amount
        </label>
        <input
          id="amount"
          type="number"
          className="rounded-lg border border-gray-300 p-2"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={!selectedToken || isMinting}
          min="0"
          step="0.000001"
        />
      </div>

      <button
        className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        onClick={handleMint}
        disabled={!selectedToken || !amount || isMinting}
      >
        {isMinting ? (
          <>
            <Spinner sizeInPx={32} />
            Minting...
          </>
        ) : (
          "Mint Tokens"
        )}
      </button>
    </div>
  )
}
