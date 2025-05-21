"use client"

import { ReactNode, useEffect } from "react"
import { useAppStore } from "@lib/store"

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useAppStore((state) => state.theme)

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark", "reading")
    root.classList.add(theme)
  }, [theme])

  return <>{children}</>
}
