import { Questrial } from "next/font/google"

const questrial = Questrial({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-questrial",
})

export default function LandingContent() {
  const techStackCards = [
    {
      title: "NextJS 15 + TypeScript",
      description:
        "Production-ready React framework for server-rendered applications with built-in TypeScript support for type safety and better developer experience.",
    },
    {
      title: "RainbowKit + Wagmi",
      description:
        "Beautiful wallet connection UI and powerful Ethereum hooks for seamless Web3 integration in your React applications.",
    },
    {
      title: "Zustand",
      description:
        "A small, fast and scalable state-management solution with a comfy API based on hooks and minimal boilerplate.",
    },
    {
      title: "TailwindCSS + shadcn/ui",
      description:
        "Utility-first CSS framework combined with beautiful, accessible UI components built with Radix UI and Tailwind.",
    },
    {
      title: "Framer Motion",
      description:
        "Production-ready animation library for React that makes creating fluid, interactive animations simple.",
    },
    {
      title: "Vitest + Cypress",
      description:
        "Blazing fast unit testing with Vitest and reliable end-to-end testing with Cypress for maximum code confidence.",
    },
  ]

  return (
    <main className="flex-1">
      {/* Hero */}
      <header className="flex h-dvh items-center justify-center  px-4 py-20 text-center ">
        <div className="mx-auto max-w-4xl">
          <h1
            className={`${questrial.variable} font-questrial mb-6 text-4xl font-light tracking-tight
          dark:text-stone-400 md:text-6xl`}
          >
            The Quest of the Wonderland
          </h1>
          <p className="mb-8 text-xl opacity-90 md:text-2xl">From zero to 0x1</p>
          <button className="rounded-lg bg-white px-8 py-4 text-lg font-semibold text-stone-600 transition-all hover:scale-105 hover:shadow-xl">
            Step into the app
          </button>
        </div>
      </header>

      {/* Tech stack */}
      <section className="h-vh mx-auto max-w-7xl px-4 py-16 md:px-8">
        <h2 className="mb-12 text-center text-3xl font-bold text-stone-900 dark:text-stone-500">
          About the stack
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {techStackCards.map((card, index) => (
            <article
              key={index}
              className="border-stone-1s00 transform rounded-xl 
               bg-stone-200/50 p-6 shadow-lg transition-all hover:scale-105 hover:shadow-md"
            >
              <h3 className="mb-4 text-xl font-semibold text-stone-900">{card.title}</h3>
              <p className="text-stone-800">{card.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
