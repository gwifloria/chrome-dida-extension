import { useContext, type Context } from 'react'

/**
 * 创建类型安全的 Context Hook 工厂函数
 * 避免重复编写相同的 Context 包装逻辑
 */
export function createContextHook<T>(
  context: Context<T | null>,
  providerName: string
): () => T {
  return function useContextHook(): T {
    const value = useContext(context)
    if (value === null) {
      throw new Error(`${providerName} is required`)
    }
    return value
  }
}
