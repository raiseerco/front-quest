import { create } from "zustand"
import { createUISlice, UIState } from "./uiSlice"
import { createNetworkSlice, NetworkState } from "./networkSlice"
import { createTokenSlice, TokenState } from "./tokenSlice"

type AppState = UIState & NetworkState & TokenState

export const useAppStore = create<AppState>()((...a) => ({
  ...createUISlice(...a),
  ...createNetworkSlice(...a),
  ...createTokenSlice(...a),
}))
