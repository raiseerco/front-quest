import { StateCreator } from "zustand"

export type Theme = "light" | "dark" | "reading"

export type OperationTab = "mint" | "transfer" | "events"

export interface UIState {
  theme: Theme
  currentTab: OperationTab
  isApproving: boolean
  isMinting: boolean
  isTransferring: boolean
  setTheme: (theme: Theme) => void
  setCurrentTab: (tab: OperationTab) => void
  setApproving: (status: boolean) => void
  setMinting: (status: boolean) => void
  setTransferring: (status: boolean) => void
}

export const createUISlice: StateCreator<UIState> = (set) => ({
  theme: "light",
  currentTab: "mint",
  isApproving: false,
  isMinting: false,
  isTransferring: false,
  setTheme: (theme) => set({ theme }),
  setCurrentTab: (tab) => set({ currentTab: tab }),
  setApproving: (status) => set({ isApproving: status }),
  setMinting: (status) => set({ isMinting: status }),
  setTransferring: (status) => set({ isTransferring: status }),
})
