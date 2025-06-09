"use client"

import { useEffect, useRef } from "react"
import Lenis from "lenis"

export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      wheelMultiplier: 1,
      touchMultiplier: 2,
      autoRaf: true,
      smoothWheel: true,
      syncTouch: false,
      infinite: false,
    })

    return () => {
      lenisRef.current?.destroy()
    }
  }, [])

  return lenisRef.current
}
