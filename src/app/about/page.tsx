import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

export default function About() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1 pt-16">
        <div className="overflow-y-auto">
          <div className="flex h-dvh flex-col items-center justify-center">
            <h1>About me</h1>
            <p className="py-4 text-center font-mono">
              As the footer says, I am a software engineer with a passion for building products that
              help people live better lives.
            </p>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  )
}
