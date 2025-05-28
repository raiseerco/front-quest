"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { parseUnits, type Address, getAddress, formatUnits } from "viem"
import { TokenMetadata } from "@lib/contracts"
import { useAppStore } from "@lib/store"
import {
  transfer,
  checkAllowance,
  approve,
  MAX_UINT256,
  getBalance,
  tokensMetadata,
} from "@lib/contracts/erc20"
import { Spinner } from "@components/Ui/spinner"
import { toast } from "react-toastify"

export default function TransferTab() {
  const { address: userAddress } = useAccount()
  const [selectedToken, setSelectedToken] = useState<Address>()
  const [selectedTokenMetadata, setSelectedTokenMetadata] = useState<TokenMetadata | null>(null)
  const [amount, setAmount] = useState("")
  const [recipient, setRecipient] = useState<Address>()
  const [currentAllowance, setCurrentAllowance] = useState<bigint>()
  const [showApproveOptions, setShowApproveOptions] = useState(false)
  const [isApproving, setIsApproving] = useState(false)
  const [isTransferring, setIsTransferring] = useState(false)
  const [tokens, setTokens] = useState([])

  const balance = useAppStore((s) => (selectedToken ? s.balances[selectedToken] : undefined))
  const addTransaction = useAppStore((s) => s.addTransaction)
  const updateTransaction = useAppStore((s) => s.updateTransaction)
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

  useEffect(() => {
    const amountBigInt = amount ? parseUnits(amount, selectedTokenMetadata?.decimals) : BigInt(0)

    if (currentAllowance !== undefined && currentAllowance < amountBigInt) {
      setShowApproveOptions(true)
    } else {
      setShowApproveOptions(false)
    }
  }, [currentAllowance, amount])

  useEffect(() => {
    const fetchTokens = async () => {
      const tokenData = await tokensMetadata()
      setTokens(tokenData)
      console.log("tokenData ", tokenData)
    }
    fetchTokens()
  }, [])

  const handleApprove = async (approveAmount) => {
    const amountBigInt = approveAmount
      ? parseUnits(approveAmount, selectedTokenMetadata?.decimals)
      : BigInt(0)
    if (!selectedToken || !recipient) return

    const approveToast = toast.loading("Awaiting wallet approval", {
      closeOnClick: true,
      autoClose: false,
    })

    try {
      setIsApproving(true)
      const approveTx = await approve(selectedToken, userAddress, amountBigInt) // FIXME

      addTransaction({
        hash: approveTx,
        type: "approve",
        token: selectedToken,
        amount: amountBigInt,
        from: userAddress,
        to: recipient,
        status: "pending",
        timestamp: Date.now(),
      })

      await useAppStore.getState().provider?.waitForTransactionReceipt({ hash: approveTx })
      updateTransaction(approveTx, "success")

      // Updates allowance
      const newAllowance: bigint = await checkAllowance(selectedToken, userAddress)
      console.log("newAllowance ", newAllowance)
      setCurrentAllowance(newAllowance)

      toast.dismiss(approveToast)
      setShowApproveOptions(false)
    } catch (error) {
      console.error("Error approving:", error)
      toast.update(approveToast, {
        render: "Approval failed",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      })
    } finally {
      setIsApproving(false)
    }
  }

  const handleTransfer = async () => {
    const newBalance = await getBalance(selectedToken, userAddress)
    setBalance(selectedToken, newBalance)

    if (!selectedToken || !amount || !recipient || !userAddress || !balance) {
      console.log(balance)
      return
    }

    const transferToast = toast.loading("Awaiting transfer", {
      closeOnClick: true,
      autoClose: false,
    })

    try {
      const amountBigInt = parseUnits(amount, selectedTokenMetadata?.decimals)
      if (balance < amountBigInt) {
        throw new Error("Insufficient balance")
      }

      setIsTransferring(true)
      const transferTx = await transfer(selectedToken, recipient, amountBigInt)

      addTransaction({
        hash: transferTx,
        type: "transfer",
        token: selectedToken,
        amount: amountBigInt,
        from: userAddress,
        to: recipient,
        status: "pending",
        timestamp: Date.now(),
      })

      await useAppStore.getState().provider?.waitForTransactionReceipt({ hash: transferTx })
      updateTransaction(transferTx, "success")

      toast.dismiss(transferToast)
      toast.success("Operation successful", { autoClose: 5000 })

      // Reset form
      setAmount("")
      setRecipient(undefined)
      setSelectedToken(undefined)
      setShowApproveOptions(false)
    } catch (error) {
      console.error("Error transferring:", error)
      toast.update(transferToast, {
        render: "Transfer failed",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      })
    } finally {
      setIsTransferring(false)
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

        checkAllowance(tokenAddress, userAddress).then(setCurrentAllowance)
      } catch (error) {
        console.error("Invalid address:", error)
      }
    } else {
      setSelectedToken(undefined)
    }
  }

  const isValidAmount = amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0
  const isValidRecipient = recipient && /^0x[a-fA-F0-9]{40}$/.test(recipient)

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
          onChange={handleTokenChange}
          disabled={isApproving || isTransferring}
        >
          <option value="">Select a token</option>
          {tokens.map((token) => (
            <option key={token.address} value={token.address}>
              {token.name} ({token.symbol})
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="recipient" className="text-sm font-medium">
          Recipient Address
        </label>
        <input
          id="recipient"
          type="text"
          className="rounded-lg border border-gray-300 p-2"
          value={recipient || ""}
          onChange={(e) => {
            try {
              const value = e.target.value
              const address = value ? getAddress(value) : undefined
              setRecipient(address)
              // Check allowance if recipient changes
              if (selectedToken && address) {
                checkAllowance(selectedToken, userAddress).then(setCurrentAllowance)
              }
            } catch {
              // If not a valid address, just dont update the state
            }
          }}
          disabled={isApproving || isTransferring}
          placeholder="0x..."
        />
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
          disabled={!selectedToken || isApproving || isTransferring}
          min="0"
        />
        <button onClick={() => setAmount(formatUnits(balance, selectedTokenMetadata?.decimals))}>
          MAX: {balance && formatUnits(balance, selectedTokenMetadata?.decimals)}
        </button>
        {selectedToken && userAddress && currentAllowance !== undefined && (
          <label className="text-sm font-medium">
            Current Allowance: {formatUnits(currentAllowance, selectedTokenMetadata?.decimals)}
          </label>
        )}
      </div>
      {!showApproveOptions ? (
        <button
          className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-white disabled:opacity-50"
          onClick={() => handleTransfer()}
          disabled={
            !selectedToken || !isValidAmount || !isValidRecipient || isApproving || isTransferring
          }
        >
          {isApproving || isTransferring ? (
            <>
              <Spinner sizeInPx={32} />
              Transferring...
            </>
          ) : (
            "Transfer"
          )}
        </button>
      ) : (
        <div className="flex flex-col gap-2">
          <button
            className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
            onClick={() => handleApprove(amount)}
            disabled={isApproving}
          >
            {isApproving ? (
              <>
                <Spinner sizeInPx={32} />
                Approving...
              </>
            ) : (
              `Approve ${amount}`
            )}
          </button>

          <button
            className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
            onClick={() => handleApprove(MAX_UINT256)}
            disabled={isApproving}
          >
            {isApproving ? (
              <>
                <Spinner sizeInPx={32} />
                Approving...
              </>
            ) : (
              "Approve unlimited"
            )}
          </button>
        </div>
      )}
    </div>
  )
}
