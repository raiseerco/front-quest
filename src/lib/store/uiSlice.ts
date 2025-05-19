import { StateCreator } from "zustand"

export type Theme = "light" | "dark" | "reading"

export interface UIState {
  theme: Theme
  setTheme: (theme: Theme) => void
}

export const createUISlice: StateCreator<UIState> = (set) => ({
  theme: "light",
  setTheme: (theme) => set({ theme }),
})
