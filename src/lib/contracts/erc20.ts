import { type Address, erc20Abi, type PublicClient } from "viem"
import { sepolia } from "wagmi/chains"
import { useAppStore } from "@lib/store"
import { TOKEN_ADDRESSES } from "@lib/contracts"

// Extend the abi to include mint function
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

async function getTokenMetadata(provider: PublicClient, tokenAddress: Address) {
  const [name, symbol, decimals] = await Promise.all([
    provider.readContract({
      address: tokenAddress,
      abi: erc20Abi,
      functionName: "name",
    }),
    provider.readContract({
      address: tokenAddress,
      abi: erc20Abi,
      functionName: "symbol",
    }),
    provider.readContract({
      address: tokenAddress,
      abi: erc20Abi,
      functionName: "decimals",
    }),
  ])

  return { name, symbol, decimals }
}

export async function tokensMetadata() {
  const provider = useAppStore.getState().provider as PublicClient
  if (!provider) throw new Error("Provider not found")

  const tokens = Object.entries(TOKEN_ADDRESSES.sepolia).map(([symbol, address]) => ({
    symbol,
    address: address as Address,
  }))

  const enriched = await Promise.all(
    tokens.map(async ({ symbol, address }) => {
      const metadata = await getTokenMetadata(provider, address)
      return {
        symbol,
        address,
        ...metadata,
      }
    })
  )

  return enriched
}

export async function checkAllowance(tokenAddress: Address, userAddress: Address): Promise<bigint> {
  const provider = useAppStore.getState().provider as PublicClient
  if (!provider) throw new Error("Provider not found")

  try {
    const allowance = await provider.readContract({
      address: tokenAddress,
      abi: tokenAbi,
      functionName: "allowance",
      args: [userAddress, userAddress], // i am the spender
    })
    console.log("allowance", allowance)
    return allowance
  } catch (error) {
    console.error("Error checking allowance:", error)
    return BigInt(0)
  }
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

export async function approve(tokenAddress: Address, spenderAddress: Address, amount: bigint) {
  const provider = useAppStore.getState().provider
  const walletClient = useAppStore.getState().walletClient
  if (!walletClient) throw new Error("Provider or wallet not connected")

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

  const currentAllowance = await checkAllowance(tokenAddress, account.address)
  if (currentAllowance < amount) {
    const { request: approveRequest } = await provider.simulateContract({
      address: tokenAddress,
      abi: tokenAbi,
      functionName: "approve",
      args: [to, amount],
      account,
      chain: sepolia,
    })
    await walletClient.writeContract(approveRequest)
  }

  const { request: transferRequest } = await provider.simulateContract({
    address: tokenAddress,
    abi: tokenAbi,
    functionName: "transferFrom",
    args: [account.address, to, amount],
    account,
    chain: sepolia,
  })

  return walletClient.writeContract(transferRequest)
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
