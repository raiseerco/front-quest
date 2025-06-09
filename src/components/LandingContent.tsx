"use client"

import { Schibsted_Grotesk as desiredFont } from "next/font/google"
import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useLenis } from "@lib/hooks/useLenis"
import MotionColorTransition from "./MotionTransition"
import Globe from "./GlobeWebGL"
import TechStackCard from "./TechStackCard"
import { useAppStore } from "@lib/store"
import { TECH_STACK_CARDS } from "@lib/constants"
import Link from "next/link"

const questrial = desiredFont({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-questrial",
})

export default function LandingContent() {
  useLenis()
  const theme = useAppStore((state) => state.theme)
  const [scrollY, setScrollY] = useState(0)
  const [mounted, setMounted] = useState(false)
  const quoteRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const heroHeight = mounted ? window.innerHeight - 64 : 0 // 64px = 4rem header height
  const blurAmount = mounted ? Math.min((scrollY / heroHeight) * 8, 8) : 0 // max blur of 8px

  let opacity = 1
  if (mounted) {
    // init fade based on scroll
    const initialOpacity = Math.max(1 - (scrollY / heroHeight) * 0.5, 0.5)

    //  fade when approaching quote section
    if (quoteRef.current) {
      const quoteTop = quoteRef.current.offsetTop
      const windowHeight = window.innerHeight
      const fadeStartDistance = windowHeight * 0.8
      const distanceToQuote = quoteTop - scrollY - windowHeight

      if (distanceToQuote <= fadeStartDistance) {
        const fadeProgress = Math.max(0, distanceToQuote / fadeStartDistance)
        opacity = initialOpacity * fadeProgress
      } else {
        opacity = initialOpacity
      }
    } else {
      opacity = initialOpacity
    }
  }

  //  coming from opposite sides
  const cardVariants = {
    hidden: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        duration: 0.8,
      },
    },
  }

  return (
    <main>
      <MotionColorTransition>
        <section
          className="fixed left-0 right-0 top-16 z-0 mx-auto flex h-[calc(100vh-4rem)] w-full
             max-w-7xl flex-1 flex-col items-center
           lg:flex-row lg:items-center"
          style={{
            filter: `blur(${blurAmount}px)`,
            opacity: opacity,
            pointerEvents: "none",
          }}
        >
          {/* hero*/}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 1.8,
              ease: "easeOut",
            }}
            className="order-2 flex h-auto w-full flex-col items-center gap-6
              text-left md:h-[60%] md:items-start md:pl-4 md:text-center lg:order-1
              lg:h-full  lg:w-1/2 lg:justify-end lg:pb-10"
          >
            <h1
              className={`${questrial.variable} font-questrial 
              z-0 px-8 text-center text-6xl
              font-bold tracking-tighter 
            md:px-0
              md:text-left md:text-8xl
                lg:text-8xl
                2xl:text-8xl xl:text-8xl`}
            >
              Where the Wonderland quest&nbsp;
              <span className="font-questrial font-semibold text-white [text-shadow:_0_0_18px_#fcd34d,_0_0_62px_#fbbf24]">
                begins
              </span>
            </h1>

            <Link
              href="/application"
              className="w-fit rounded-lg bg-amber-300/70 
              px-6 py-3 text-base font-semibold text-stone-500
              transition-all hover:scale-105 hover:shadow-xl sm:px-7 
              sm:py-3.5 sm:text-lg xl:px-8 xl:py-4 xl:text-lg"
              style={{ pointerEvents: "auto" }}
            >
              Step into the app
            </Link>
          </motion.div>

          {/* le petit globe, gosh, it was a hard one */}
          <div
            className="z-1 h-[calc(100vh-4rem] order-1 flex
              w-full  items-center justify-center"
          >
            <Globe />
          </div>
        </section>

        {/* sp to push content down */}
        <div className="h-[calc(100dvh-4rem)]"></div>

        {/* stack */}
        <div
          className="relative z-10 mx-auto grid max-w-7xl 
          grid-cols-1 gap-4  px-4 pb-64 md:grid-cols-2 lg:gap-20"
        >
          {TECH_STACK_CARDS.map((item, index) => {
            const direction = index % 2 === 0 ? -1 : 1

            return (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                custom={direction}
                variants={cardVariants}
                className="mx-auto flex h-dvh
                  max-w-7xl py-40 text-center"
              >
                <TechStackCard
                  title={item.title}
                  logo={item.logo}
                  description={item.description}
                  theme={theme}
                />
              </motion.div>
            )
          })}
        </div>

        <div
          ref={quoteRef}
          className="relative z-10 mx-auto flex max-w-7xl flex-col  items-center  justify-center
          gap-20 py-32 "
        >
          <p
            className={`${questrial.variable} font-questrial 
            text-center text-6xl font-thin`}
          >
            &quot;Mint the future, don&apos;t
            <br />
            just spend the past&quot;
          </p>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logos/logo-meent.svg"
            alt="meent logo"
            className="h-20 w-60 object-contain transition-all duration-300 hover:scale-105"
            style={{
              filter: theme === "dark" ? "invert(1) saturate(0.01)" : "none",
            }}
          />
        </div>
      </MotionColorTransition>
    </main>
  )
}
