import { useContext } from 'react'
import { AppModeContext } from './AppModeContext'

export function useAppMode() {
  const context = useContext(AppModeContext)
  if (!context) {
    throw new Error('useAppMode must be used within AppModeProvider')
  }
  return context
}

export type { AppModeContextValue } from './AppModeContext'
