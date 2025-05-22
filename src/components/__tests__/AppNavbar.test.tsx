import { render, screen, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import AppNavbar from "../AppNavbar"
import { RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { WagmiProvider } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import ThemeProvider from "@components/ThemeProvider"
import { config } from "@lib/wagmi"

vi.setConfig({ testTimeout: 20000 })

const queryClient = new QueryClient()

// Mock usePathname
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}))

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize="compact">
          <ThemeProvider>{children}</ThemeProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

describe("AppNavbar", () => {
  it("renders ConnectButton in desktop view", async () => {
    render(<AppNavbar />, { wrapper: Wrapper })

    await waitFor(
      () => {
        // As rk doesnt use id for naming its elements Ill use
        // getAllByTestId handle multiple buttons
        const connectButtons = screen.getAllByTestId("rk-connect-button")

        // check for mobile and desktop buttons
        expect(connectButtons).toHaveLength(2)

        const visibleButtons = connectButtons.filter((button) => {
          const styles = window.getComputedStyle(button)
          return styles.display !== "none" && styles.visibility !== "hidden"
        })

        expect(visibleButtons.length).toBeGreaterThan(0)
      },
      {
        timeout: 15000,
        interval: 1000,
      }
    )
  })

  it("renders ConnectButton in mobile view", async () => {
    global.innerWidth = 500
    global.dispatchEvent(new Event("resize"))

    render(<AppNavbar />, { wrapper: Wrapper })

    await waitFor(
      () => {
        const connectButtons = screen.getAllByTestId("rk-connect-button")
        expect(connectButtons).toHaveLength(2)

        const visibleButtons = connectButtons.filter((button) => {
          const styles = window.getComputedStyle(button)
          return styles.display !== "none" && styles.visibility !== "hidden"
        })

        expect(visibleButtons.length).toBeGreaterThan(0)
      },
      {
        timeout: 15000,
        interval: 1000,
      }
    )
  })
})
