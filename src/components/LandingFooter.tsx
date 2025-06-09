"use client"
/* eslint-disable @next/next/no-img-element */
import { useAppStore } from "@lib/store"

export default function LandingFooter() {
  const theme = useAppStore((state) => state.theme)

  return (
    <footer
      className="relative z-[100] bg-secondary text-foreground/80"
      style={{ pointerEvents: "auto" }}
    >
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-lg font-semibold text-foreground/80">About</h3>
            <p>
              I am a software engineer with a passion for building products that help people live
              better lives.
            </p>
          </div>
          <div></div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-foreground/80">Contact</h3>

            <div id="contact" className="flex space-x-4">
              <a
                href="https://www.linkedin.com/in/blockls"
                className="text-foreground/80 hover:text-foreground"
              >
                <img
                  style={{
                    filter: theme === "dark" ? "invert(1) saturate(0.01)" : "none",
                  }}
                  src="/logos/logo-linkedin.svg"
                  alt="LinkedIn"
                  width={24}
                  height={24}
                />
              </a>
              <a href="https://x.com/ethsagan" className="text-foreground/80 hover:text-foreground">
                <img
                  style={{
                    filter: theme === "dark" ? "invert(1) saturate(0.01)" : "none",
                  }}
                  src="/logos/logo-x.svg"
                  alt="X"
                  width={24}
                  height={24}
                />
              </a>
              <a
                href="https://github.com/raiseerco"
                className="text-foreground/80 hover:text-foreground"
              >
                <img
                  style={{
                    filter: theme === "dark" ? "invert(1) saturate(0.01)" : "none",
                  }}
                  src="/logos/logo-github.svg"
                  alt="Github"
                  width={24}
                  height={24}
                />
              </a>
            </div>
            <p className="mt-4 text-xs">
              &copy; {new Date().getFullYear()} Leo Sagan. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
