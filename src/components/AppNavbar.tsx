"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import MobileMenuButton from "./MobileMenuButton"
import ThemeToggle from "./ThemeToggle"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useWalletSync } from "@lib/hooks/useWalletSync"
import NetworkAlert from "./NetworkAlert"
import { useAppStore } from "@lib/store"

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "#contact", label: "Contact" },
] as const

export default function AppNavbar() {
  useWalletSync()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const theme = useAppStore((state) => state.theme)

  return (
    <>
      <nav className="fixed left-0 right-0 top-0 z-50 bg-transparent ">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 justify-between">
            <div className="flex items-center">
              <Link prefetch={true} href="/" className="flex flex-shrink-0 items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logos/logo-meent.svg"
                  alt="meent logo"
                  className="h-10 w-24 object-contain"
                  style={{
                    filter: theme === "dark" ? "invert(1) saturate(0.01)" : "none",
                  }}
                />
              </Link>
            </div>

            {/* Desktop menu */}
            <div className="hidden items-center space-x-4 md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "text-gray-900x dark:text-gray-100x underline underline-offset-4"
                      : "text-gray-600x hover:text-gray-900x dark:text-gray-300x dark:hover:text-gray-100x"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <ConnectButton accountStatus="address" chainStatus="icon" showBalance={true} />
              <ThemeToggle />
            </div>

            <div className="flex items-center space-x-2 md:hidden">
              <ConnectButton />
              <ThemeToggle />
              <MobileMenuButton isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-1 bg-primary px-2 pb-3 pt-2 sm:px-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-md px-3 py-2 text-base font-medium ${
                    pathname === item.href
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-secondary hover:text-gray-900"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
      <NetworkAlert />
    </>
  )
}
