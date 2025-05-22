import type {} from "vitest"

import "@testing-library/jest-dom"
import { expect, afterEach, vi } from "vitest"
import { cleanup } from "@testing-library/react"
import * as matchers from "@testing-library/jest-dom/matchers"

// Extend Vitest expect method with methods from react-testing-library
expect.extend(matchers)

afterEach(() => {
  cleanup()
})

// Mock
process.env.NEXT_PUBLIC_RAINBOW_PROJECT_ID = "test-project-id"

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

beforeEach(() => {
  vi.clearAllMocks()
})
