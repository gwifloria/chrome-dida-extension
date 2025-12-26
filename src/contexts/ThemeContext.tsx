import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react'
import {
  type Theme,
  type ThemeType,
  journalTheme,
  oceanTheme,
  techTheme,
  roseTheme,
} from '@/themes'
import { useSettings } from './SettingsContext'

const themes: Record<ThemeType, Theme> = {
  journal: journalTheme,
  ocean: oceanTheme,
  tech: techTheme,
  rose: roseTheme,
}

interface ThemeContextValue {
  theme: Theme
  themeType: ThemeType
  setThemeType: (type: ThemeType) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { settings, updateSettings } = useSettings()
  const themeType = settings.theme

  const setThemeType = useCallback(
    (type: ThemeType) => {
      updateSettings({ theme: type })
    },
    [updateSettings]
  )

  const toggleTheme = useCallback(() => {
    setThemeType(themeType === 'journal' ? 'tech' : 'journal')
  }, [themeType, setThemeType])

  const theme = themes[themeType]

  // 应用 CSS 变量
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--bg-primary', theme.colors.bgPrimary)
    root.style.setProperty('--bg-secondary', theme.colors.bgSecondary)
    root.style.setProperty('--bg-sidebar', theme.colors.bgSidebar)
    root.style.setProperty('--bg-content', theme.colors.bgContent)
    root.style.setProperty('--bg-card', theme.colors.bgCard)
    root.style.setProperty('--text-primary', theme.colors.textPrimary)
    root.style.setProperty('--text-secondary', theme.colors.textSecondary)
    root.style.setProperty('--accent', theme.colors.accent)
    root.style.setProperty('--accent-light', theme.colors.accentLight)
    root.style.setProperty('--border', theme.colors.border)
    root.style.setProperty('--success', theme.colors.success)
    root.style.setProperty('--warning', theme.colors.warning)
    root.style.setProperty('--danger', theme.colors.danger)
    root.style.setProperty('--priority-high', theme.colors.priorityHigh)
    root.style.setProperty('--priority-medium', theme.colors.priorityMedium)
    root.style.setProperty('--priority-low', theme.colors.priorityLow)
    root.style.setProperty('--radius-small', theme.borderRadius.small)
    root.style.setProperty('--radius-medium', theme.borderRadius.medium)
    root.style.setProperty('--radius-large', theme.borderRadius.large)
    root.style.setProperty('--shadow-small', theme.shadow.small)
    root.style.setProperty('--shadow-medium', theme.shadow.medium)
    root.style.setProperty('--shadow-large', theme.shadow.large)
    root.style.setProperty('--font-primary', theme.font.primary)
    root.style.setProperty('--font-secondary', theme.font.secondary)
  }, [theme])

  return (
    <ThemeContext.Provider
      value={{ theme, themeType, setThemeType, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
