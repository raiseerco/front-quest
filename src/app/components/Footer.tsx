export default function Footer() {
  return (
    <footer className="bg-primary text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-lg font-semibold">About</h3>
            <p className="text-foreground/80">
              I am a software engineer with a passion for building products that help people live
              better lives.
            </p>
          </div>
          <div></div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Contact</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-foreground/80 hover:text-foreground">
                <span className="sr-only">LinkedIn</span>
                <div className="h-6 w-6 bg-foreground/80"></div>
              </a>
              <a href="#" className="text-foreground/80 hover:text-foreground">
                <span className="sr-only">X</span>
                <div className="h-6 w-6 bg-foreground/80"></div>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-foreground/20 pt-8 text-center text-foreground/80">
          <p>&copy; {new Date().getFullYear()} Leo Sagan. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
