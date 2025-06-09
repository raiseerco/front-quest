import Navbar from "@components/LandingNavbar"
import LandingContent from "@components/LandingContent"
import LandingFooter from "@components/LandingFooter"

export default function Home() {
  return (
    <div className="flex h-dvh flex-col">
      <Navbar />
      <div className="flex-1">
        <div className="overflow-y-auto">
          <LandingContent />
          <LandingFooter />
        </div>
      </div>
    </div>
  )
}
