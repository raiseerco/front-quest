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
          <h1 className="mb-6 text-4xl font-bold md:text-6xl">The Quest of the Wonderland</h1>
          <p className="mb-8 text-xl opacity-90 md:text-2xl">From zero to 0x1</p>
          <button className="rounded-lg bg-white px-8 py-4 text-lg font-semibold text-blue-600 transition-all hover:scale-105 hover:shadow-xl">
            step into the wonderapp
          </button>
        </div>
      </header>

      {/* Tech stack */}
      <section className="h-vh mx-auto max-w-7xl px-4 py-16 md:px-8">
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">About the stack</h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {techStackCards.map((card, index) => (
            <article
              key={index}
              className="transform rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:scale-105 hover:shadow-md"
            >
              <h3 className="mb-4 text-xl font-semibold text-gray-900">{card.title}</h3>
              <p className="text-gray-600">{card.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
