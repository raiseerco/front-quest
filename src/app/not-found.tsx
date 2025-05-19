import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-amber-300">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-gray-800">404</h1>
        <p className="mb-8 text-2xl text-gray-700">Oops, missing route</p>
        <Link
          href="/"
          className="rounded-lg bg-gray-800 px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-gray-700"
        >
          Back to home
        </Link>
      </div>
    </div>
  )
}
