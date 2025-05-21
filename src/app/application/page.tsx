import AppNavbar from "@components/AppNavbar"
import AppFooter from "@components/AppFooter"

export default function Application() {
  return (
    <div className="flex min-h-screen flex-col">
      <AppNavbar />
      <div className="flex-1 pt-16">
        <div className="overflow-y-auto">
          <div className="flex h-dvh flex-col items-center justify-center">
            <h1>App</h1>
            <p className="py-4 text-center font-mono">@EthSagan</p>
          </div>
          <AppFooter />
        </div>
      </div>
    </div>
  )
}
