import { createContext, useContext, useEffect, useMemo, useState } from 'react'

type ThemeState = {
  lightsOff: boolean
  toggleLights: () => void
  setLightsOff: (value: boolean) => void
}

const ThemeContext = createContext<ThemeState | null>(null)

const STORAGE_KEY = 'lightsOff'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [lightsOff, setLightsOff] = useState<boolean>(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw === '1'
  })

  useEffect(() => {
    document.documentElement.dataset.lights = lightsOff ? 'off' : 'on'
    localStorage.setItem(STORAGE_KEY, lightsOff ? '1' : '0')
  }, [lightsOff])

  const value = useMemo<ThemeState>(
    () => ({
      lightsOff,
      toggleLights: () => setLightsOff((v) => !v),
      setLightsOff,
    }),
    [lightsOff],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
