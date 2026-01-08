/**
 * 应用模式 Provider
 */
import { useState, useEffect, useCallback, type ReactNode } from 'react'
import { auth } from '@/services/auth'
import { storage } from '@/services/storage'
import type { AppMode } from '@/types'
import { AppModeContext } from './AppModeContext'

export function AppModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<AppMode>('guest')
  const [loading, setLoading] = useState(true)

  // 检查连接状态
  useEffect(() => {
    const checkMode = async () => {
      try {
        const token = await storage.getToken()
        setMode(token ? 'connected' : 'guest')
      } catch {
        setMode('guest')
      } finally {
        setLoading(false)
      }
    }
    checkMode()
  }, [])

  const connect = useCallback(async () => {
    setLoading(true)
    try {
      await auth.login()
      setMode('connected')
    } finally {
      setLoading(false)
    }
  }, [])

  const disconnect = useCallback(async () => {
    await auth.logout()
    setMode('guest')
  }, [])

  return (
    <AppModeContext.Provider
      value={{
        mode,
        loading,
        isGuest: mode === 'guest',
        isConnected: mode === 'connected',
        connect,
        disconnect,
      }}
    >
      {children}
    </AppModeContext.Provider>
  )
}
