import { Address } from "viem"

export const TOKEN_ADDRESSES = {
  sepolia: {
    DAI: "0x1D70D57ccD2798323232B2dD027B3aBcA5C00091",
    USDC: "0xC891481A0AaC630F4D89744ccD2C7D2C4215FD47",
  },
  mainnet: {
    DAI: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    USDC: "0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  },
} as const

// FIXME move to another file
export interface TokenMetadata {
  address: Address
  symbol: string
  name: string
  decimals: number
}
