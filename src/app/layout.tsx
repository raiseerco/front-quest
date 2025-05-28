import "@styles/globals.css"
import "@rainbow-me/rainbowkit/styles.css"
import { Providers } from "./providers"
import { Schibsted_Grotesk } from "next/font/google"

const schibsted = Schibsted_Grotesk({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-schibsted",
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${schibsted.variable} light`}>
      <head>
        <title>W0ND3R</title>
        <meta name="description" content="The quest of the Wonderland" />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
