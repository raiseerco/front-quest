import { type Address, erc20Abi } from "viem"
import { sepolia } from "wagmi/chains"
import { useAppStore } from "@lib/store"

const tokenAbi = [
  ...erc20Abi,
  {
    inputs: [
      { internalType: "address", name: "_address", type: "address" },
      { internalType: "uint256", name: "_value", type: "uint256" },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const

export async function checkAllowance(
  tokenAddress: Address,
  ownerAddress: Address,
  spenderAddress: Address
) {
  const provider = useAppStore.getState().provider
  if (!provider) throw new Error("Provider not found")

  return provider.readContract({
    address: tokenAddress,
    abi: tokenAbi,
    functionName: "allowance",
    args: [ownerAddress, spenderAddress],
  })
}

export async function approve(tokenAddress: Address, spenderAddress: Address, amount: bigint) {
  const provider = useAppStore.getState().provider
  const walletClient = useAppStore.getState().walletClient
  if (!provider || !walletClient) throw new Error("Provider or wallet not connected")

  const account = walletClient.account
  if (!account) throw new Error("No account found")

  const { request } = await provider.simulateContract({
    address: tokenAddress,
    abi: tokenAbi,
    functionName: "approve",
    args: [spenderAddress, amount],
    account,
    chain: sepolia,
  })

  return walletClient.writeContract(request)
}

export async function transfer(tokenAddress: Address, to: Address, amount: bigint) {
  const provider = useAppStore.getState().provider
  const walletClient = useAppStore.getState().walletClient
  if (!provider || !walletClient) throw new Error("Provider or wallet not connected")

  const account = walletClient.account
  if (!account) throw new Error("No account found")

  const { request } = await provider.simulateContract({
    address: tokenAddress,
    abi: tokenAbi,
    functionName: "transfer",
    args: [to, amount],
    account,
    chain: sepolia,
  })

  return walletClient.writeContract(request)
}

export async function mint(tokenAddress: Address, amount: bigint) {
  const walletClient = useAppStore.getState().walletClient
  if (!walletClient) throw new Error("Wallet not connected")

  const account = walletClient.account
  if (!account) throw new Error("No account found")

  return walletClient.writeContract({
    address: tokenAddress,
    abi: tokenAbi,
    functionName: "mint",
    args: [account.address, amount],
    chain: sepolia,
    account: account.address,
  })
}

export async function getBalance(tokenAddress: Address, address: Address) {
  const provider = useAppStore.getState().provider
  if (!provider) throw new Error("Provider not found")

  return provider.readContract({
    address: tokenAddress,
    abi: tokenAbi,
    functionName: "balanceOf",
    args: [address],
  })
}
