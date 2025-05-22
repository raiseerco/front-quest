"use client"

import { useAppStore } from "@lib/store"
import { useWalletSync } from "@lib/hooks/useWalletSync"

export default function AppFooter() {
  useWalletSync()
  const { address, chainId, isConnected } = useAppStore()

  return (
    <footer className="bg-primary text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-lg font-semibold">Wallet Status</h3>
            <div className="space-y-2 text-foreground/80">
              <p>
                Status:{" "}
                <span className="font-mono">{isConnected ? "Connected" : "Disconnected"}</span>
              </p>
              <p>
                Chain ID: <span className="font-mono">{chainId || "Not connected"}</span>
              </p>
              <p>
                Address:{" "}
                <span className="font-mono">
                  {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Not connected"}
                </span>
              </p>
            </div>
          </div>
          <div></div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Contact</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-foreground/80 hover:text-foreground">
                <span className="sr-only">LinkedIn</span>
                <div className="h-6 w-6 bg-foreground/80"></div>
              </a>
              <a href="#" className="text-foreground/80 hover:text-foreground">
                <span className="sr-only">X</span>
                <div className="h-6 w-6 bg-foreground/80"></div>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-foreground/20 pt-8 text-center text-foreground/80">
          <p>&copy; {new Date().getFullYear()} Leo Sagan. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
