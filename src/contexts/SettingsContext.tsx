import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'

export interface Settings {
  defaultProjectId: string | null // null 表示使用收集箱
}

const defaultSettings: Settings = {
  defaultProjectId: null,
}

interface SettingsContextValue {
  settings: Settings
  updateSettings: (updates: Partial<Settings>) => void
  isLoading: boolean
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

const STORAGE_KEY = 'user_settings'

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 从 storage 读取设置
    chrome.storage.local.get(STORAGE_KEY).then((result) => {
      if (result[STORAGE_KEY]) {
        setSettings({ ...defaultSettings, ...result[STORAGE_KEY] })
      }
      setIsLoading(false)
    })
  }, [])

  const updateSettings = useCallback((updates: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...updates }
      chrome.storage.local.set({ [STORAGE_KEY]: next })
      return next
    })
  }, [])

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, isLoading }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
