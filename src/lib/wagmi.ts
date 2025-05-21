import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { mainnet, sepolia } from "wagmi/chains"

export const config = getDefaultConfig({
  appName: "Wonder",
  projectId: process.env.NEXT_PUBLIC_RAINBOW_PROJECT_ID,
  chains: [mainnet, sepolia],

  ssr: true,
})
