import "@styles/globals.css"
import "@rainbow-me/rainbowkit/styles.css"
import { Providers } from "./providers"
import { Poppins } from "next/font/google"

const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-poppins", // find a less horrid font
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} light`}>
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
