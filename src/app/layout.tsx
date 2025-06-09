import "@styles/globals.css"
import "@rainbow-me/rainbowkit/styles.css"
import { Providers } from "./providers"
import { Space_Grotesk as desiredFont } from "next/font/google"

const defaultFont = desiredFont({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-schibsted",
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${defaultFont.variable} light`}>
      <head>
        <title>meent</title>
        <meta name="description" content="The quest of the Wonderland" />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
