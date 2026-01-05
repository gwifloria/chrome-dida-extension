import { useState, useCallback, useEffect } from 'react'

/**
 * 持久化布尔值状态的 Hook
 * 使用 chrome.storage.local 存储，支持跨 tab 同步
 */
export function usePersistedBoolean(
  storageKey: string,
  defaultValue = false
): [boolean, () => void] {
  const [value, setValue] = useState<boolean>(defaultValue)

  // 初始化时从 storage 读取
  useEffect(() => {
    chrome.storage.local
      .get(storageKey)
      .then((result) => {
        if (result[storageKey] !== undefined) {
          setValue(result[storageKey])
        }
      })
      .catch(() => {
        // storage 读取失败时保持默认值
      })
  }, [storageKey])

  const toggle = useCallback(() => {
    setValue((prev) => {
      const next = !prev
      chrome.storage.local.set({ [storageKey]: next }).catch((err) => {
        console.error(`[usePersistedBoolean] 保存失败 (${storageKey}):`, err)
      })
      return next
    })
  }, [storageKey])

  return [value, toggle]
}
