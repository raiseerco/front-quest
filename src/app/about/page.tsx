import Navbar from "@components/LandingNavbar"
import Footer from "@components/LandingFooter"
import TechStackCard from "@components/TechStackCard"
import MotionColorTransition from "@components/MotionTransition"

export default function About() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1 pt-16">
        <div className="overflow-y-auto">
          <MotionColorTransition>
            <div className="flex h-dvh flex-col items-center justify-center py-40">
              <TechStackCard
                title="About me"
                logo="/logos/logo-meent.svg"
                theme="dark"
                description="Footer disclosure: I engineer software, but what I really build are bridges between
              people and better versions of their daily lives."
              />
            </div>
          </MotionColorTransition>

          <Footer />
        </div>
      </div>
    </div>
  )
}
