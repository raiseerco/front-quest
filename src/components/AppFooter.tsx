"use client"

import { type ReactNode } from "react"
import { useAppStore } from "@lib/store"

interface AppFooterProps {
  children?: ReactNode
}

export default function AppFooter({ children }: AppFooterProps) {
  const { address, chainId, isConnected } = useAppStore()

  return (
    <footer className="bg-primary text-foreground">
      {children}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">Wallet Status</h3>
            <p className="text-foreground/80">
              Connection:{" "}
              <span className={`font-mono ${isConnected ? "text-green-400" : "text-red-400"}`}>
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </p>
          </div>

          {/* more space for sth */}
          <div></div>

          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">Network Info</h3>
            <p className="text-foreground/80">
              Chain ID: <span className="font-mono">{chainId || "N/A"}</span>
            </p>
            <p className="text-foreground/80">
              Address:{" "}
              <span className="font-mono">
                {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Not connected"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
