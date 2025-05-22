import { renderHook } from "@testing-library/react"
import { act } from "react"

import { describe, it, expect } from "vitest"
import { useAppStore } from "@lib/store"

describe("Store", () => {
  describe("UI Slice", () => {
    it("should initialize with light theme", () => {
      const { result } = renderHook(() => useAppStore())
      expect(result.current.theme).toBe("light")
    })

    it("should update theme", () => {
      const { result } = renderHook(() => useAppStore())

      act(() => {
        result.current.setTheme("dark")
      })

      expect(result.current.theme).toBe("dark")
    })
  })

  describe("Network Slice", () => {
    it("should initialize with disconnected state", () => {
      const { result } = renderHook(() => useAppStore())

      expect(result.current.address).toBeUndefined()
      expect(result.current.chainId).toBeUndefined()
      expect(result.current.isConnected).toBe(false)
      expect(result.current.isConnecting).toBe(false)
      expect(result.current.isDisconnected).toBe(true)
    })

    it("should update address", () => {
      const { result } = renderHook(() => useAppStore())
      const testAddress = "0x123"

      act(() => {
        result.current.setAddress(testAddress)
      })

      expect(result.current.address).toBe(testAddress)
    })

    it("should update chain id", () => {
      const { result } = renderHook(() => useAppStore())
      const testChainId = 1

      act(() => {
        result.current.setChainId(testChainId)
      })

      expect(result.current.chainId).toBe(testChainId)
    })

    it("should update connection status", () => {
      const { result } = renderHook(() => useAppStore())

      act(() => {
        result.current.setConnectionStatus({
          isConnected: true,
          isConnecting: false,
          isDisconnected: false,
        })
      })

      expect(result.current.isConnected).toBe(true)
      expect(result.current.isConnecting).toBe(false)
      expect(result.current.isDisconnected).toBe(false)
    })
  })

  describe("Slices composition", () => {
    it("should update UI and Network states independently", () => {
      const { result } = renderHook(() => useAppStore())

      act(() => {
        result.current.setTheme("dark")
      })
      expect(result.current.theme).toBe("dark")

      // address +id
      act(() => {
        result.current.setAddress("0xabc")
        result.current.setChainId(42)
      })
      expect(result.current.address).toBe("0xabc")
      expect(result.current.chainId).toBe(42)

      // theme is not affected?
      expect(result.current.theme).toBe("dark")

      // changes theme again and verifies
      //  that network values are not affected
      act(() => {
        result.current.setTheme("reading")
      })
      expect(result.current.theme).toBe("reading")
      expect(result.current.address).toBe("0xabc")
      expect(result.current.chainId).toBe(42)
    })
  })
})
