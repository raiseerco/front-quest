"use client"

import { useAppStore } from "@lib/store"
import { TOKEN_ADDRESSES } from "@lib/contracts"

export default function EventsTab() {
  const transactionHistory = useAppStore((s) => s.transactionHistory)

  const getTokenSymbol = (address: string) => {
    for (const [network, tokens] of Object.entries(TOKEN_ADDRESSES)) {
      for (const [symbol, tokenAddress] of Object.entries(tokens)) {
        if (tokenAddress.toLowerCase() === address.toLowerCase()) {
          return symbol
        }
      }
    }
    return "Unknown"
  }

  return (
    <div className="p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Token
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                From
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                To
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Hash
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {transactionHistory.map((tx) => (
              <tr key={tx.hash}>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{tx.type}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  {getTokenSymbol(tx.token)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  {Number(tx.amount) / 1e6}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  {tx.from.slice(0, 6)}...{tx.from.slice(-4)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  {tx.to ? `${tx.to.slice(0, 6)}...${tx.to.slice(-4)}` : "-"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      tx.status === "success"
                        ? "bg-green-100 text-green-800"
                        : tx.status === "error"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {tx.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  <a
                    href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-900"
                  >
                    {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
