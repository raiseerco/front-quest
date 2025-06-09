"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { parseUnits, type Address, getAddress, formatUnits } from "viem"
import { TokenMetadata } from "@lib/contracts"
import { useAppStore } from "@lib/store"
import { transfer, checkAllowance, approve, getBalance, tokensMetadata } from "@lib/contracts/erc20"
import { Spinner } from "@components/Ui/spinner"
import { toast } from "react-toastify"
import { showContractErrorToast } from "@lib/errorHandler"
import { ExternalLinkIcon } from "@radix-ui/react-icons"
import { MAX_UINT256 } from "@lib/constants"

export default function TransferTab() {
  const { address: userAddress } = useAccount()
  const [selectedToken, setSelectedToken] = useState<Address>()
  const [selectedTokenMetadata, setSelectedTokenMetadata] = useState<TokenMetadata | null>(null)
  const [amount, setAmount] = useState("")
  const [recipient, setRecipient] = useState<Address>()
  const [currentAllowance, setCurrentAllowance] = useState<bigint>()
  const [showApproveOptions, setShowApproveOptions] = useState(false)
  const [showApproveUnlimited, setShowApproveUnlimited] = useState(true)
  const [showApproveDiscrete, setShowApproveDiscrete] = useState(true)
  const [isApproving, setIsApproving] = useState(false)
  const [isTransferring, setIsTransferring] = useState(false)
  const [tokens, setTokens] = useState([])

  const addTransaction = useAppStore((s) => s.addTransaction)
  const updateTransaction = useAppStore((s) => s.updateTransaction)

  // FIXME move to a custom hook
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

  useEffect(() => {
    const amountBigInt = amount ? parseUnits(amount, selectedTokenMetadata?.decimals) : BigInt(0)

    if (currentAllowance !== undefined && currentAllowance < amountBigInt) {
      setShowApproveOptions(true)
    } else {
      setShowApproveOptions(false)
    }
  }, [currentAllowance, amount, selectedTokenMetadata?.decimals])

  useEffect(() => {
    const fetchTokens = async () => {
      const tokenData = await tokensMetadata()
      setTokens(tokenData)
      console.log("tokenData ", tokenData)
    }
    fetchTokens()
  }, [])

  const handleApprove = async (approveAmount) => {
    const amountBigInt =
      approveAmount === MAX_UINT256
        ? MAX_UINT256
        : parseUnits(approveAmount, selectedTokenMetadata?.decimals)
    if (!selectedToken || !recipient) return

    addTransaction({
      type: "approve",
      token: selectedToken,
      amount: amountBigInt,
      from: userAddress,
      to: recipient,
      status: "initiated",
      timestamp: Date.now(),
    })

    const approveToast = toast.loading("Awaiting wallet approval", {
      closeOnClick: false,
      autoClose: false,
    })

    try {
      setIsApproving(true)
      const approveTx = await approve(selectedToken, userAddress, amountBigInt)

      // Update transaction with hash
      addTransaction({
        hash: approveTx,
        type: "approve",
        token: selectedToken,
        amount: amountBigInt,
        from: userAddress,
        to: recipient,
        status: "initiated",
        timestamp: Date.now(),
      })

      await useAppStore.getState().provider?.waitForTransactionReceipt({ hash: approveTx })
      updateTransaction(approveTx, "success")

      // Updates allowance
      const newAllowance: bigint = await checkAllowance(selectedToken, userAddress)
      console.log("newAllowance ", newAllowance)
      setCurrentAllowance(newAllowance)

      toast.update(approveToast, {
        render: "Approval successful",
        type: "success",
        isLoading: false,
        autoClose: 5000,
      })

      if (approveAmount === MAX_UINT256) {
        setShowApproveDiscrete(false)
      } else {
        setShowApproveUnlimited(false)
      }
      setShowApproveOptions(false)
    } catch (error) {
      const errMapped = showContractErrorToast(error, approveToast)

      const status = errMapped.type === "USER_REJECTED" ? "rejected" : "error"
      addTransaction({
        type: "approve",
        token: selectedToken,
        amount: amountBigInt,
        from: userAddress,
        to: recipient,
        status,
        timestamp: Date.now(),
      })

      setShowApproveUnlimited(true)
      setShowApproveDiscrete(true)
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

    const amountBigInt = parseUnits(amount, selectedTokenMetadata?.decimals)
    if (balance < amountBigInt) {
      return
    }

    addTransaction({
      type: "transfer",
      token: selectedToken,
      amount: amountBigInt,
      from: userAddress,
      to: recipient,
      status: "initiated",
      timestamp: Date.now(),
    })

    const transferToast = toast.loading("Transfer initiated", {
      closeOnClick: false,
      autoClose: false,
    })

    try {
      setIsTransferring(true)
      const transferTx = await transfer(selectedToken, recipient, amountBigInt)

      addTransaction({
        hash: transferTx,
        type: "transfer",
        token: selectedToken,
        amount: amountBigInt,
        from: userAddress,
        to: recipient,
        status: "initiated",
        timestamp: Date.now(),
      })

      toast.update(transferToast, {
        render: (
          <div className="flex items-center gap-2">
            Confirming transfer
            <a
              href={`https://sepolia.etherscan.io/tx/${transferTx}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#61dafb", textDecoration: "underline" }}
            >
              <ExternalLinkIcon />
            </a>
          </div>
        ),
        closeOnClick: false,
        autoClose: false,
      })

      await useAppStore.getState().provider?.waitForTransactionReceipt({ hash: transferTx })
      updateTransaction(transferTx, "success")

      toast.update(transferToast, {
        render: "Operation successful",
        type: "success",
        isLoading: false,
        autoClose: 5000,
      })

      // Reset form
      setAmount("")
      setRecipient(undefined)
      setSelectedToken(undefined)
      setShowApproveOptions(false)
      setShowApproveUnlimited(true)
      setShowApproveDiscrete(true)
    } catch (error) {
      console.error("Error transferring:", error)
      const errMapped = showContractErrorToast(error, transferToast)

      const status = errMapped.type === "USER_REJECTED" ? "rejected" : "error"
      addTransaction({
        type: "transfer",
        token: selectedToken,
        amount: amountBigInt,
        from: userAddress,
        to: recipient,
        status,
        timestamp: Date.now(),
      })

      setShowApproveUnlimited(true)
      setShowApproveDiscrete(true)
    } finally {
      setIsTransferring(false)
      setShowApproveUnlimited(true)
      setShowApproveDiscrete(true)
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

  // Check if the entered amount exceeds the available balance
  const amountBigInt =
    amount && selectedTokenMetadata ? parseUnits(amount, selectedTokenMetadata.decimals) : BigInt(0)
  const hasInsufficientBalance = balance !== undefined && amountBigInt > balance

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
          className="rounded-lg border border-secondary bg-primary/70 px-3  py-2 outline-none dark:bg-secondary/90"
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
          className="rounded-lg border border-secondary bg-primary/70 px-3  py-2 outline-none dark:bg-secondary/90"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={!selectedToken || isApproving || isTransferring}
          min="0"
        />
        <button
          className="rounded-lg px-3 py-2 text-sm"
          onClick={() => setAmount(formatUnits(balance, selectedTokenMetadata?.decimals))}
        >
          MAX: {balance && formatUnits(balance, selectedTokenMetadata?.decimals)}
        </button>
        {selectedToken && userAddress && currentAllowance !== undefined && (
          <label className="text-sm font-medium">
            Current Allowance:{" "}
            {currentAllowance === MAX_UINT256
              ? "Unlimited"
              : formatUnits(currentAllowance, selectedTokenMetadata?.decimals)}
          </label>
        )}
      </div>
      {!showApproveOptions ? (
        <button
          className="mt-4 flex items-center justify-center gap-2
          rounded-lg bg-amber-500/50 px-6 
          py-3 text-base  font-semibold  transition-all
          hover:scale-105 hover:shadow-xl disabled:opacity-50 sm:px-7 
          sm:py-3.5 sm:text-lg xl:px-8 xl:py-4 xl:text-lg"
          onClick={() => handleTransfer()}
          disabled={
            !selectedToken || !isValidAmount || !isValidRecipient || isApproving || isTransferring
          }
        >
          {isApproving || isTransferring ? (
            <>
              <Spinner sizeInPx={24} />
              Transferring...
            </>
          ) : hasInsufficientBalance ? (
            "Insufficient balance"
          ) : (
            "Transfer"
          )}
        </button>
      ) : (
        <div className="flex flex-col gap-2">
          {hasInsufficientBalance ? (
            <button
              className="mt-4 flex cursor-not-allowed items-center justify-center
              gap-2 rounded-lg bg-amber-500/50 
             px-6 py-3  text-base  font-semibold opacity-50 sm:px-7 
              sm:py-3.5 sm:text-lg xl:px-8 xl:py-4 xl:text-lg"
              disabled={true}
            >
              Insufficient balance
            </button>
          ) : (
            <>
              {showApproveDiscrete && (
                <button
                  className="mt-4 flex items-center justify-center gap-2
                  rounded-lg bg-amber-500/50 px-6 
                  py-3 text-base  font-semibold  transition-all
                  hover:scale-105 hover:shadow-xl disabled:opacity-50 sm:px-7 
                  sm:py-3.5 sm:text-lg xl:px-8 xl:py-4 xl:text-lg"
                  onClick={() => {
                    handleApprove(amount)
                    setShowApproveUnlimited(false)
                  }}
                  disabled={isApproving}
                >
                  {isApproving ? (
                    <>
                      <Spinner sizeInPx={24} />
                      Approving {amount} {selectedTokenMetadata?.symbol}...
                    </>
                  ) : (
                    `Approve ${amount}`
                  )}
                </button>
              )}

              {showApproveUnlimited && (
                <button
                  className="mt-4 flex items-center justify-center gap-2
                  rounded-lg bg-amber-500/50 px-6 
                  py-3 text-base  font-semibold  transition-all
                  hover:scale-105 hover:shadow-xl disabled:opacity-50 sm:px-7 
                  sm:py-3.5 sm:text-lg xl:px-8 xl:py-4 xl:text-lg"
                  onClick={() => {
                    handleApprove(MAX_UINT256)
                    setShowApproveDiscrete(false)
                  }}
                  disabled={isApproving}
                >
                  {isApproving ? (
                    <>
                      <Spinner sizeInPx={24} />
                      Approving unlimited {selectedTokenMetadata?.symbol}...
                    </>
                  ) : (
                    "Approve unlimited"
                  )}
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
