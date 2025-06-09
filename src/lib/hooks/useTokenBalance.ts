import { useEffect } from "react"
import { usePublicClient, useAccount } from "wagmi"
import { erc20Abi } from "viem"
import { useAppStore } from "@lib/store"

export function useTokenBalance(tokenAddress: `0x${string}`) {
  const publicClient = usePublicClient()
  const { address: walletAddress } = useAccount()

  const setBalance = useAppStore((s) => s.setBalance)

  useEffect(() => {
    if (!walletAddress) return

    const fetchBalance = async () => {
      try {
        if (!tokenAddress) return
        const balance = await publicClient.readContract({
          address: tokenAddress,
          abi: erc20Abi,
          functionName: "balanceOf",
          args: [walletAddress],
        })
        setBalance(tokenAddress, balance)
      } catch (err) {
        console.error("Failed to fetch balance:", err)
      }
    }

    const interval = setInterval(fetchBalance, 10000)
    fetchBalance()

    const unwatch = publicClient.watchContractEvent({
      address: tokenAddress,
      abi: erc20Abi,
      eventName: "Transfer",
      onLogs: (logs) => {
        const affected = logs.some((log) => {
          const from = log.args?.from?.toLowerCase()
          const to = log.args?.to?.toLowerCase()
          const wallet = walletAddress.toLowerCase()
          return from === wallet || to === wallet
        })
        if (affected) fetchBalance()
      },
    })

    return () => {
      clearInterval(interval)
      unwatch()
    }
  }, [walletAddress, tokenAddress, publicClient, setBalance])
}
