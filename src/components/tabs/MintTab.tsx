"use client"

import { useEffect, useState } from "react"
import { useAccount, usePublicClient } from "wagmi"
import { parseUnits, type Address, getAddress, formatUnits } from "viem"
import { TokenMetadata } from "@lib/contracts"
import { useAppStore } from "@lib/store"
import { getBalance, mint, tokensMetadata } from "@lib/contracts/erc20"
import { Spinner } from "@components/Ui/spinner"
import { showContractErrorToast } from "@lib/errorHandler"
import { toast } from "react-toastify"
import { ArchiveIcon } from "@radix-ui/react-icons"

export default function MintTab() {
  const { address: userAddress } = useAccount()
  const publicClient = usePublicClient()
  const [selectedToken, setSelectedToken] = useState<Address>()
  const [amount, setAmount] = useState("")
  const isMinting = useAppStore((s) => s.isMinting)
  const setMinting = useAppStore((s) => s.setMinting)
  const addTransaction = useAppStore((s) => s.addTransaction)

  const balance = useAppStore((s) => (selectedToken ? s.balances[selectedToken] : undefined))
  const setBalance = useAppStore((s) => s.setBalance)

  useEffect(() => {
    const updateBalance = async () => {
      if (selectedToken && selectedToken && userAddress) {
        try {
          const newBalance = await getBalance(selectedToken, userAddress)
          setBalance(selectedToken, newBalance)
        } catch (error) {
          console.error("Error fetching balance:", error)
        }
      }
    }
    updateBalance()
  }, [selectedToken, userAddress, setBalance])

  const updateTransaction = useAppStore((s) => s.updateTransaction)
  const [selectedTokenMetadata, setSelectedTokenMetadata] = useState<TokenMetadata | null>(null)
  const [tokens, setTokens] = useState([])

  useEffect(() => {
    const fetchTokens = async () => {
      const tokenData = await tokensMetadata()
      setTokens(tokenData)
      console.log("tokenData ", tokenData)
    }
    fetchTokens()
  }, [])

  const handleMint = async () => {
    if (!selectedToken || !amount || !userAddress) return

    const amountBigInt = parseUnits(amount, selectedTokenMetadata?.decimals)
    addTransaction({
      // goes to the transaction history
      hash: undefined,
      type: "mint",
      token: selectedToken,
      amount: amountBigInt,
      from: selectedToken,
      to: userAddress as Address,
      status: "initiated",
      timestamp: Date.now(),
    })

    try {
      setMinting(true)
      const mintTx = await mint(selectedToken, amountBigInt)

      // Update transaction with hash
      addTransaction({
        hash: mintTx,
        type: "mint",
        token: selectedToken,
        amount: amountBigInt,
        from: selectedToken,
        to: userAddress as Address,
        status: "initiated",
        timestamp: Date.now(),
      })

      if (!publicClient) throw new Error("Public client not found")

      await publicClient.waitForTransactionReceipt({
        hash: mintTx as `0x${string}`,
      })
      updateTransaction(mintTx, "success")
      setMinting(false)
      toast.success("Minting successful", { autoClose: 5000 })

      // Clear scr
      setAmount("")
      setSelectedToken(undefined)
    } catch (error) {
      const errMapped = showContractErrorToast(error)
      setMinting(false)

      // FIXME remove magic string
      const status = errMapped.type === "USER_REJECTED" ? "rejected" : "error"
      addTransaction({
        type: "mint",
        token: selectedToken,
        amount: amountBigInt,
        from: selectedToken,
        to: userAddress as Address,
        status,
        timestamp: Date.now(),
      })

      if (errMapped.type !== "USER_REJECTED") {
        // Clear form only if it wasnt a user rejection
        setAmount("")
        setSelectedToken(undefined)
      }
    }
  }

  const handleTokenChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAddress = e.target.value
    const token = tokens.find((t) => t.address === selectedAddress) || null

    if (token && userAddress) {
      try {
        const tokenAddress = getAddress(token.address)
        setSelectedToken(tokenAddress)
        setSelectedTokenMetadata(token)
      } catch (error) {
        console.error(error)
      }
    } else {
      setSelectedToken(undefined)
    }
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4 p-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="token-select" className="text-sm font-medium">
          Select Token
        </label>
        <select
          id="token-select"
          className="rounded-lg border border-secondary bg-primary/70 px-3  py-2 outline-none dark:bg-secondary/90"
          value={selectedToken || ""}
          onChange={handleTokenChange}
          disabled={isMinting}
        >
          <option value="">Select a token</option>
          {tokens.map((token) => (
            <option key={token.address} value={token.address}>
              {token.name} ({token.symbol})
            </option>
          ))}
        </select>
        {balance && (
          <div className="flex items-center justify-end gap-2 text-xs">
            <ArchiveIcon /> {balance && formatUnits(balance, selectedTokenMetadata?.decimals)}
            &nbsp;{selectedTokenMetadata?.symbol}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="amount" className="text-sm font-medium">
          Amount
        </label>
        <input
          id="amount"
          type="number"
          className="rounded-lg border border-secondary bg-primary/70  px-3 py-2 outline-none dark:bg-secondary/90"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={!selectedToken || isMinting}
          min="0"
          step="0.000001"
        />
      </div>

      <button
        className="mt-4 flex items-center justify-center gap-2
         rounded-lg bg-amber-500/50 px-6 
        py-3 text-base  font-semibold  transition-all
         hover:scale-105 hover:shadow-xl disabled:opacity-50 sm:px-7 
         sm:py-3.5 sm:text-lg xl:px-8 xl:py-4 xl:text-lg"
        onClick={handleMint}
        disabled={!selectedToken || !amount || isMinting}
      >
        {isMinting ? (
          <>
            <Spinner sizeInPx={24} />
            Minting...
          </>
        ) : (
          "Mint Tokens"
        )}
      </button>
    </div>
  )
}
