"use client"

import { useAppStore } from "@lib/store"
import { useScroll, useTransform, motion } from "framer-motion"
import { useRef } from "react"

export default function MotionColorTransition({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })
  let appliedColors = []
  const theme = useAppStore((state) => state.theme)
  if (theme === "light") {
    appliedColors = ["#e7e5e4", "#B5838D", "#E5989B", "#FFB4A2", "#e7e5e4"]
  } else if (theme === "dark") {
    appliedColors = ["#251C17", "#47362D", "#47362D", "#251C17"]
  } else if (theme === "reading") {
    appliedColors = ["#ddc9bf", "#B5838D", "#E5989B", "#FFB4A2", "#FFCDB2"]
  }

  // calc points based on sections
  const backgroundColor = useTransform(
    scrollYProgress,
    appliedColors.map((_, i) => i / (appliedColors.length - 1)),
    appliedColors
  )

  return (
    <motion.div
      ref={containerRef}
      style={{ backgroundColor }}
      className="min-h-screen transition-colors  duration-300"
    >
      {children}
    </motion.div>
  )
}
