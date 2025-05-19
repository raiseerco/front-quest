export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-lg font-semibold">About</h3>
            <p className="text-gray-300">
              I am a software engineer with a passion for building products that help people live
              better lives.
            </p>
          </div>
          <div></div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Contact</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <span className="sr-only">LinkedIn</span>
                <div className="h-6 w-6 bg-gray-300"></div>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <span className="sr-only">X</span>
                <div className="h-6 w-6 bg-gray-300"></div>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} Leo Sagan. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
