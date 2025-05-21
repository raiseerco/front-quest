"use client"

import type React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider } from "wagmi"
import { RainbowKitProvider, lightTheme, darkTheme, Theme } from "@rainbow-me/rainbowkit"
import merge from "lodash.merge"

import { config } from "@lib/wagmi"
import ThemeProvider from "@components/ThemeProvider"

const queryClient = new QueryClient()
const customLightTheme = merge(lightTheme(), {
  colors: {
    accentColor: "#00096d",
  },
  fonts: {
    body: "var(--font-poppins) !important",
  },
} as Theme)
const customDarkTheme = merge(lightTheme(), {
  colors: {
    accentColor: "#07296d",
  },
} as Theme)

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          modalSize="compact"
          theme={{
            lightMode: customLightTheme,
            darkMode: customDarkTheme,
          }}
        >
          <ThemeProvider>{children}</ThemeProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
