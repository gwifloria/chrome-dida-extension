export interface Theme {
  name: string
  colors: {
    bgPrimary: string
    bgSecondary: string
    bgSidebar: string
    bgContent: string
    bgCard: string
    textPrimary: string
    textSecondary: string
    accent: string
    accentLight: string
    border: string
    success: string
    warning: string
    danger: string
    priorityHigh: string
    priorityMedium: string
    priorityLow: string
  }
  borderRadius: {
    small: string
    medium: string
    large: string
  }
  shadow: {
    small: string
    medium: string
    large: string
  }
  font: {
    primary: string
    secondary: string
  }
}

export type ThemeType = 'journal' | 'ocean' | 'tech' | 'rose'

export { journalTheme } from './journal'
export { oceanTheme } from './ocean'
export { techTheme } from './tech'
export { roseTheme } from './rose'
