import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

// Simple global app context example (expand later to auth, settings, etc.)
export type AppState = {
  theme: 'light' | 'dark'
}

export type AppContextValue = {
  state: AppState
  setTheme: (theme: AppState['theme']) => void
}

const AppContext = createContext<AppContextValue | undefined>(undefined)

function getInitialTheme(): AppState['theme'] {
  if (typeof window === 'undefined') return 'light'
  const stored = (localStorage.getItem('theme') as AppState['theme'] | null)
  if (stored === 'light' || stored === 'dark') return stored
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<AppState['theme']>(getInitialTheme)

  // Sync theme to <html> class and persist
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  const value = useMemo(() => ({ state: { theme }, setTheme }), [theme])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
