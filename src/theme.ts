import { createContext, useContext } from 'react'

export const ThemeContext = createContext<{
  theme: 'light' | 'dark'
  toggle: () => void
}>({
  theme: 'light',
  toggle: () => {},
})

export function useTheme() {
  return useContext(ThemeContext)
}
