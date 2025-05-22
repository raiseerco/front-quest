"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

type NavItem = {
  href: string
  label: string
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/profile", label: "Profile" },
  { href: "/settings", label: "Settings" },
  { href: "/help", label: "Help & Support" },
]

export default function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-16 hidden h-[calc(100vh-4rem)] w-64 border-r bg-white md:block">
      <div className="p-4">
        <nav className="space-y-1">
          <h2 className="mb-4 px-2 text-lg font-semibold text-gray-700">Navigation</h2>

          {navItems.map(({ href, label }) => {
            const isActive = pathname === href

            return (
              <Link
                key={href}
                href={new URL(href)}
                className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <span className={` ${isActive ? "text-blue-500" : "text-gray-400"}`}>{label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
