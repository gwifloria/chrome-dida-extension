import { useContext } from 'react'
import { ConnectPromptContext } from './ConnectPromptContext'

export function useConnectPrompt() {
  const context = useContext(ConnectPromptContext)
  if (!context) {
    throw new Error(
      'useConnectPrompt must be used within ConnectPromptProvider'
    )
  }
  return context
}

export type { ConnectPromptContextValue } from './ConnectPromptContext'
