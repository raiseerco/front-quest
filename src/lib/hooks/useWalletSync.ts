import { useEffect } from "react"
import { useAccount, useClient, useConnectorClient } from "wagmi"
import { useAppStore } from "@lib/store"

export function useWalletSync() {
  const { address, chain, isConnected, isConnecting, isDisconnected } = useAccount()
  const { data: walletClient } = useConnectorClient()
  const publicClient = useClient()

  const setAddress = useAppStore((state) => state.setAddress)
  const setChainId = useAppStore((state) => state.setChainId)
  const setConnectionStatus = useAppStore((state) => state.setConnectionStatus)
  const setProvider = useAppStore((state) => state.setProvider)
  const setWalletClient = useAppStore((state) => state.setWalletClient)

  useEffect(() => {
    setAddress(address)
  }, [address, setAddress])

  useEffect(() => {
    setChainId(chain?.id)
  }, [chain?.id, setChainId])

  useEffect(() => {
    setConnectionStatus({ isConnected, isConnecting, isDisconnected })
  }, [isConnected, isConnecting, isDisconnected, setConnectionStatus])

  useEffect(() => {
    setProvider(publicClient)
  }, [publicClient, setProvider])

  useEffect(() => {
    setWalletClient(walletClient)
  }, [walletClient, setWalletClient])
}
