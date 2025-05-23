"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { parseUnits, type Address, getAddress } from "viem"
import { TOKEN_ADDRESSES } from "@lib/contracts"
import { useAppStore } from "@lib/store"
import { useTokenBalance } from "@lib/hooks/useTokenBalance"
import { transfer } from "@lib/contracts/erc20"

export default function TransferTab() {
  const { address } = useAccount()
  const [selectedToken, setSelectedToken] = useState<Address>()
  const [amount, setAmount] = useState("")
  const [recipient, setRecipient] = useState("")

  const isTransferring = useAppStore((s) => s.isTransferring)
  const setTransferring = useAppStore((s) => s.setTransferring)
  const addTransaction = useAppStore((s) => s.addTransaction)
  const updateTransaction = useAppStore((s) => s.updateTransaction)

  const balance = useAppStore((s) => (selectedToken ? s.balances[selectedToken] : undefined))
  useTokenBalance(selectedToken)

  const tokens = Object.entries(TOKEN_ADDRESSES.sepolia).map(([symbol, address]) => ({
    symbol,
    address: address as Address,
  }))

  const handleTransfer = async () => {
    if (!selectedToken || !amount || !recipient || !address || !balance) return

    try {
      const amountBigInt = parseUnits(amount, 6) // Assuming all tokens have 6 decimals like USDC
      const recipientAddress = getAddress(recipient)

      if (balance < amountBigInt) {
        throw new Error("Insufficient balance")
      }

      setTransferring(true)
      const transferTx = await transfer(selectedToken, recipientAddress, amountBigInt)
      addTransaction({
        hash: transferTx,
        type: "transfer",
        token: selectedToken,
        amount: amountBigInt,
        from: address as Address,
        to: recipientAddress,
        status: "pending",
        timestamp: Date.now(),
      })

      // Wait for trf confirmation
      await useAppStore.getState().provider?.waitForTransactionReceipt({ hash: transferTx })
      updateTransaction(transferTx, "success")

      setAmount("")
      setRecipient("")
      setSelectedToken(undefined)
    } catch (error) {
      console.error("Error transferring tokens:", error)
      setTransferring(false)
    }
  }

  const hasBalance = balance && balance > BigInt(0)
  const amountValue = parseFloat(amount)
  const isValidAmount = !isNaN(amountValue) && amountValue > 0
  const isValidRecipient = /^0x[a-fA-F0-9]{40}$/.test(recipient)

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4 p-4">
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
          disabled={isTransferring}
        >
          <option value="">Select a token</option>
          {tokens.map((token) => (
            <option key={token.address} value={token.address}>
              {token.symbol}
            </option>
          ))}
        </select>
        {selectedToken && !hasBalance && (
          <p className="text-sm text-red-500">Insufficient balance</p>
        )}
        {selectedToken && hasBalance && (
          <p className="text-sm text-gray-500">
            Balance: {balance ? `${Number(balance) / 1e6}` : "Loading..."}
          </p>
        )}
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
          disabled={!selectedToken || !hasBalance || isTransferring}
          min="0"
          step="0.000001"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="recipient" className="text-sm font-medium">
          Recipient Address
        </label>
        <input
          id="recipient"
          type="text"
          className="rounded-lg border border-gray-300 p-2"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          disabled={!selectedToken || !hasBalance || !isValidAmount || isTransferring}
          placeholder="0x..."
        />
        {recipient && !isValidRecipient && (
          <p className="text-sm text-red-500">Invalid address format</p>
        )}
      </div>

      <button
        className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        onClick={handleTransfer}
        disabled={
          !selectedToken || !hasBalance || !isValidAmount || !isValidRecipient || isTransferring
        }
      >
        {isTransferring ? "Transferring..." : "Transfer Tokens"}
      </button>
    </div>
  )
}
