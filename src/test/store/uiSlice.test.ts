import { describe, it, expect, beforeEach } from "vitest"
import { create, type UseBoundStore, type StoreApi } from "zustand"
import { createUISlice, type UIState } from "@lib/store/uiSlice"

describe("UISlice", () => {
  let store: UseBoundStore<StoreApi<UIState>>

  beforeEach(() => {
    store = create<UIState>(createUISlice)
  })

  it("starts with default values", () => {
    const state = store.getState()

    expect(state.theme).toBe("light")
    expect(state.currentTab).toBe("mint")
    expect(state.isApproving).toBe(false)
    expect(state.isMinting).toBe(false)
    expect(state.isTransferring).toBe(false)
  })

  describe("Theme switching", () => {
    it("can switch to dark mode", () => {
      store.getState().setTheme("dark")
      expect(store.getState().theme).toBe("dark")
    })

    it("can switch to reading mode", () => {
      store.getState().setTheme("reading")
      expect(store.getState().theme).toBe("reading")
    })

    it("preserves other state when changing theme", () => {
      store.getState().setCurrentTab("transfer")
      store.getState().setMinting(true)

      store.getState().setTheme("dark")

      expect(store.getState().theme).toBe("dark")
      expect(store.getState().currentTab).toBe("transfer")
      expect(store.getState().isMinting).toBe(true)
    })
  })

  describe("Tab navigation", () => {
    it("switches between tabs", () => {
      store.getState().setCurrentTab("transfer")
      expect(store.getState().currentTab).toBe("transfer")

      store.getState().setCurrentTab("events")
      expect(store.getState().currentTab).toBe("events")
    })
  })

  describe("Operation states", () => {
    it("tracks approving state", () => {
      store.getState().setApproving(true)
      expect(store.getState().isApproving).toBe(true)

      store.getState().setApproving(false)
      expect(store.getState().isApproving).toBe(false)
    })

    it("tracks minting state", () => {
      store.getState().setMinting(true)
      expect(store.getState().isMinting).toBe(true)
    })

    it("can have multiple operations active", () => {
      store.getState().setApproving(true)
      store.getState().setMinting(true)

      const state = store.getState()
      expect(state.isApproving).toBe(true)
      expect(state.isMinting).toBe(true)
      expect(state.isTransferring).toBe(false)
    })
  })

  // Realistic user workflow
  it("handles typical user journey", () => {
    // User starts on mint tab in light mode
    expect(store.getState().currentTab).toBe("mint")
    expect(store.getState().theme).toBe("light")

    // User switches to dark mode
    store.getState().setTheme("dark")

    // User approves tokens for minting
    store.getState().setApproving(true)
    expect(store.getState().isApproving).toBe(true)

    // Approval completes, user starts minting
    store.getState().setApproving(false)
    store.getState().setMinting(true)

    expect(store.getState().isApproving).toBe(false)
    expect(store.getState().isMinting).toBe(true)

    // Minting completes, user checks events
    store.getState().setMinting(false)
    store.getState().setCurrentTab("events")

    expect(store.getState().isMinting).toBe(false)
    expect(store.getState().currentTab).toBe("events")
    expect(store.getState().theme).toBe("dark") // still dark
  })
})
