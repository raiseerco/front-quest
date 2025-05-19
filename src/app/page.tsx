import Navbar from "./components/Navbar"
import LandingContent from "./components/LandingContent"
import Footer from "./components/Footer"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1 pt-16">
        <div className="overflow-y-auto">
          <LandingContent />
          <Footer />
        </div>
      </div>
    </div>
  )
}
