import { describe, it, expect } from "vitest"
import { config } from "@lib/wagmi"
import { mainnet, sepolia } from "wagmi/chains"

describe("Wagmi Configuration", () => {
  it("should have required project ID", () => {
    expect(process.env.NEXT_PUBLIC_RAINBOW_PROJECT_ID).toBeDefined()
  })

  it("should support mainnet and sepolia chains", () => {
    const configChainIds = config.chains.map((chain) => chain.id)
    expect(configChainIds).toContain(mainnet.id)
    expect(configChainIds).toContain(sepolia.id)
  })
})
