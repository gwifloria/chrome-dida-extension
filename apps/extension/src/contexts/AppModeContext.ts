/**
 * 应用模式 Context 定义
 */
import { createContext } from 'react'
import type { AppMode } from '@/types'

export interface AppModeContextValue {
  mode: AppMode
  loading: boolean
  isGuest: boolean
  isConnected: boolean
  connect: () => Promise<void>
  disconnect: () => Promise<void>
}

export const AppModeContext = createContext<AppModeContextValue | null>(null)
