import "./globals.css"
import { ReactNode } from "react"
import ThemeProvider from "./components/ThemeProvider"

export const metadata = {
  title: "W0ND3R",
  description: "The quest of the Wonderland",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="light">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
