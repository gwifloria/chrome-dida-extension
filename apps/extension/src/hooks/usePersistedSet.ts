import { useState, useCallback, useEffect } from 'react'

/**
 * 持久化 Set 状态的 Hook
 * 使用 chrome.storage.local 存储，支持跨 tab 同步
 */
export function usePersistedSet(
  storageKey: string
): [Set<string>, (id: string) => void] {
  const [items, setItems] = useState<Set<string>>(new Set())

  // 初始化时从 storage 读取
  useEffect(() => {
    chrome.storage.local
      .get(storageKey)
      .then((result) => {
        if (result[storageKey]) {
          setItems(new Set(result[storageKey]))
        }
      })
      .catch(() => {
        // storage 读取失败时保持空集合
      })
  }, [storageKey])

  const toggle = useCallback(
    (id: string) => {
      setItems((prev) => {
        const next = new Set(prev)
        if (next.has(id)) {
          next.delete(id)
        } else {
          next.add(id)
        }
        chrome.storage.local.set({ [storageKey]: [...next] }).catch((err) => {
          console.error(`[usePersistedSet] 保存失败 (${storageKey}):`, err)
        })
        return next
      })
    },
    [storageKey]
  )

  return [items, toggle]
}
