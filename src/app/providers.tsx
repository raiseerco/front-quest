"use client"

import type React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider } from "wagmi"
import { RainbowKitProvider, lightTheme, darkTheme, Theme } from "@rainbow-me/rainbowkit"
import merge from "lodash.merge"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import { config } from "@lib/wagmi"
import ThemeProvider from "@components/ThemeProvider"
import { useAppStore } from "@lib/store"

const queryClient = new QueryClient()
const customLightTheme = merge(lightTheme(), {
  colors: {
    accentColor: "#f59e0b",
  },
  fonts: {
    body: "var(--font-schibsted) !important",
  },
} as Theme)
const customDarkTheme = merge(darkTheme(), {
  colors: {
    accentColor: "#57534e",
  },
  fonts: {
    body: "var(--font-schibsted) !important",
  },
} as Theme)

function RainbowKitThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useAppStore((state) => state.theme)
  const rainbowkitTheme = theme === "dark" ? customDarkTheme : customLightTheme

  return (
    <RainbowKitProvider modalSize="compact" theme={rainbowkitTheme}>
      {children}
    </RainbowKitProvider>
  )
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <RainbowKitThemeProvider>
            {children}
            <ToastContainer position="bottom-right" />
          </RainbowKitThemeProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
