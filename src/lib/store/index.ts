import { create } from "zustand"
import { createUISlice, UIState } from "./uiSlice"
import { createNetworkSlice, NetworkState } from "./networkSlice"

type AppState = UIState & NetworkState

export const useAppStore = create<AppState>()((...a) => ({
  ...createUISlice(...a),
  ...createNetworkSlice(...a),
}))
