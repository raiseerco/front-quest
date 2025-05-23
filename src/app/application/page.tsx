"use client"

import { useAccount } from "wagmi"
import AppNavbar from "@components/AppNavbar"
import AppFooter from "@components/AppFooter"
import MintTab from "@components/tabs/MintTab"
import TransferTab from "@components/tabs/TransferTab"
import EventsTab from "@components/tabs/EventsTab"
import { useAppStore } from "@lib/store"
import { type OperationTab } from "@lib/store/uiSlice"
import { Spinner } from "@components/Ui/spinner"

export default function Application() {
  const { isConnected } = useAccount()
  const currentTab = useAppStore((s) => s.currentTab)
  const setCurrentTab = useAppStore((s) => s.setCurrentTab)
  const pendingTransactions = useAppStore((s) => s.pendingTransactions)

  return (
    <div className="flex min-h-screen flex-col">
      <AppNavbar />
      <div className="flex-1 pt-16 ">
        <div className="overflow-y-auto">
          {!isConnected ? (
            <div className="flex h-dvh flex-col items-center justify-center">
              <h1 className="text-2xl font-bold">Disconnected?</h1>
              <p className="mt-4 text-gray-600">
                Connect your wallet to access the application features
              </p>
            </div>
          ) : (
            <div className="container  mx-auto max-w-7xl px-4 py-16 md:px-8">
              <div className="mb-4 border-b border-stone-200">
                <nav className="-mb-px flex justify-center space-x-8" aria-label="Tabs">
                  {["mint", "transfer", "events"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setCurrentTab(tab as OperationTab)}
                      className={`${
                        currentTab === tab
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                      } whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium capitalize`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="rounded-lg ">
                {currentTab === "mint" && <MintTab />}
                {currentTab === "transfer" && <TransferTab />}
                {currentTab === "events" && <EventsTab />}
              </div>
            </div>
          )}
          <AppFooter>
            {pendingTransactions.length > 0 && (
              <div className="flex items-center justify-center space-x-2 bg-blue-50 py-2 text-sm text-amber-500">
                <Spinner sizeInPx={16} />
                <span>
                  {pendingTransactions.length} pending transaction
                  {pendingTransactions.length > 1 ? "s" : ""}
                </span>
              </div>
            )}
          </AppFooter>
        </div>
      </div>
    </div>
  )
}
