"use client"

import { useAppStore } from "@lib/store"
import { TOKEN_ADDRESSES } from "@lib/contracts"
import { tokensMetadata } from "@lib/contracts/erc20"
import { useEffect, useState } from "react"
import { formatUnits } from "viem"

export default function EventsTab() {
  const transactionHistory = useAppStore((s) => s.transactionHistory)
  const [tokenDecimals, setTokenDecimals] = useState<Record<string, number>>({})

  useEffect(() => {
    const fetchTokensMetadata = async () => {
      const tokens = await tokensMetadata()
      const decimalsMap = tokens.reduce(
        (acc, token) => {
          acc[token.address] = token.decimals
          return acc
        },
        {} as Record<string, number>
      )
      setTokenDecimals(decimalsMap)
    }
    fetchTokensMetadata()
  }, [])

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

  const formatAddress = (address?: string) => {
    if (!address) return "-"
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatAmount = (amount: bigint, tokenAddress: string) => {
    const decimals = tokenDecimals[tokenAddress] || 18 // fallback to 18, just in case
    return formatUnits(amount, decimals)
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  const getStatusStyles = (status: string) => {
    const base = "inline-flex rounded-full px-2 text-xs font-mono leading-5"
    switch (status) {
      case "success":
        return `${base} bg-green-100 text-green-800`
      case "error":
        return `${base} bg-red-100 text-red-800`
      case "rejected":
        return `${base} bg-gray-100 text-gray-800`
      default:
        return `${base} bg-yellow-100 text-yellow-800`
    }
  }

  const columns = [
    { header: "Date", accessor: (tx) => formatDate(tx.timestamp) },
    { header: "Type", accessor: (tx) => tx.type },
    { header: "Token", accessor: (tx) => getTokenSymbol(tx.token) },
    { header: "Amount", accessor: (tx) => formatAmount(tx.amount, tx.token) },
    { header: "From", accessor: (tx) => formatAddress(tx.from) },
    { header: "To", accessor: (tx) => formatAddress(tx.to) },
    {
      header: "Status",
      accessor: (tx) => <span className={getStatusStyles(tx.status)}>{tx.status}</span>,
    },
    {
      header: "TxId",
      accessor: (tx) => {
        if (!tx.hash) return "-"
        return (
          <a
            href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-900"
          >
            {formatAddress(tx.hash)}
          </a>
        )
      },
    },
  ]

  // Sorting
  const sortedTransactions = [...transactionHistory].sort((a, b) => b.timestamp - a.timestamp)

  return (
    <div className="p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.header}
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {sortedTransactions.map((tx) => {
              const txKey = crypto.randomUUID()
              return (
                <tr key={txKey}>
                  {columns.map((column) => (
                    <td
                      key={`${txKey}-${column.header}`}
                      className="whitespace-nowrap px-6 py-4 text-sm text-gray-900"
                    >
                      {column.accessor(tx)}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
