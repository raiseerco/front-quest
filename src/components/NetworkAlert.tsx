import { useAccount, useSwitchChain } from "wagmi"
import { sepolia } from "wagmi/chains"

export default function NetworkAlert() {
  const { isConnected, chainId } = useAccount()
  const { switchChain } = useSwitchChain()

  if (chainId === sepolia.id || !isConnected) {
    return null
  }

  return (
    <div className="fixed left-0 right-0 top-16 z-50 bg-yellow-100 px-4 py-3 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center">
          <svg
            className="mr-2 h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>Wrong network. Please switch to Sepolia in order to use the app!</span>
        </div>
        <button
          onClick={() => switchChain({ chainId: sepolia.id })}
          className="ml-4 rounded-md bg-yellow-200 px-4 py-2 text-sm font-medium text-yellow-900 hover:bg-yellow-300 dark:bg-yellow-800 dark:text-yellow-100 dark:hover:bg-yellow-700"
        >
          CHANGE
        </button>
      </div>
    </div>
  )
}
