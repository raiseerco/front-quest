"use client"

import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error) // TODO: log the error to sentry
  }, [error])

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-amber-300">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-800">Something went wrong!</h1>
        <p className="mb-8 text-xl text-gray-700">
          {error.message || "An unexpected error occurred"}
        </p>
        <button
          onClick={reset}
          className="rounded-lg bg-gray-800 px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-gray-700"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
