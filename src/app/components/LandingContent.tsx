export default function LandingContent() {
  return (
    <main className="flex-1 p-4 md:p-8">
      <section className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            Welcome to the quest of the Wonderland
          </h1>
          <p className="mb-8 text-xl text-gray-600">
            Discover amazing features and possibilities with our innovative solution
          </p>
          <button className="rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700">
            Get Started
          </button>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold">Feature One</h2>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore.
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold">Feature Two</h2>
            <p className="text-gray-600">
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo.
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold">Feature Three</h2>
            <p className="text-gray-600">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla.
            </p>
          </div>
        </div>

        <section className="mb-12 rounded-xl bg-gray-50 p-8">
          <h2 className="mb-8 text-center text-3xl font-bold">Why Choose Us?</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold">Quality Service</h3>
                <p className="text-gray-600">
                  We provide top-notch service with attention to every detail.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold">24/7 Support</h3>
                <p className="text-gray-600">
                  Our team is always available to help you with any questions.
                </p>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  )
}
