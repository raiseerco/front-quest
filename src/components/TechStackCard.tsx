import { Schibsted_Grotesk as desiredFont } from "next/font/google"

interface TechStackCardProps {
  title: string
  logo: string
  description: string
  theme: string
}

const questrial = desiredFont({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-questrial",
})

export default function TechStackCard({ title, logo, description, theme }: TechStackCardProps) {
  return (
    <article
      className="content-centers flex h-full 
    transform flex-col justify-between rounded-br-2xl rounded-tl-3xl
      bg-secondary/60
     p-10
     shadow-lg transition-all 
     hover:shadow-md"
    >
      <p
        className={`${questrial.variable} font-questrial mb-4 w-full text-left text-3xl font-semibold 
        md:text-4xl lg:text-6xl`}
      >
        {title}
      </p>

      <p className="font-semibold">{description}</p>

      <div className="flex w-full items-center justify-end">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logo}
          alt={title}
          className="h-20 w-60 object-contain transition-all duration-300 hover:scale-105"
          style={{
            filter: theme === "dark" ? "invert(1) saturate(0.01)" : "none",
          }}
        />
      </div>
    </article>
  )
}
