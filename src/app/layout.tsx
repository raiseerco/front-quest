import "./globals.css"
import { ReactNode } from "react"

export const metadata = {
  title: "Challenge demo",
  description: "The quest of the Wonderland",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
