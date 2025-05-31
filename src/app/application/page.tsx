"use client"

import { useAccount } from "wagmi"
import AppNavbar from "@components/AppNavbar"
import MintTab from "@components/tabs/MintTab"
import TransferTab from "@components/tabs/TransferTab"
import EventsTab from "@components/tabs/EventsTab"
import { useAppStore } from "@lib/store"
import { type OperationTab } from "@lib/store/uiSlice"
import { ClockIcon, DoubleArrowRightIcon, MagicWandIcon } from "@radix-ui/react-icons"

export default function Application() {
  const { isConnected } = useAccount()
  const currentTab = useAppStore((s) => s.currentTab)
  const setCurrentTab = useAppStore((s) => s.setCurrentTab)
  const tabsArray = [
    { name: "mint", icon: <MagicWandIcon /> },
    { name: "transfer", icon: <DoubleArrowRightIcon /> },
    { name: "events", icon: <ClockIcon /> },
  ]
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
                  {tabsArray.map((tab) => (
                    <button
                      key={tab.name}
                      onClick={() => setCurrentTab(tab.name as OperationTab)}
                      className={`${
                        currentTab === tab.name
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                      } flex items-center gap-2 whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium capitalize`}
                    >
                      {tab.icon}
                      {tab.name}
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
        </div>
      </div>
    </div>
  )
}
