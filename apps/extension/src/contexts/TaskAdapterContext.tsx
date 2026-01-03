/**
 * 任务适配器 Context
 * 提供统一的任务 API 访问
 */
import { createContext, useContext, useMemo, type ReactNode } from 'react'
import {
  createTaskAdapter,
  getDefaultAdapter,
  type ITaskAdapter,
  type AdapterType,
} from '@/api/adapters'

interface TaskAdapterContextValue {
  adapter: ITaskAdapter
  adapterType: AdapterType
}

const TaskAdapterContext = createContext<TaskAdapterContextValue | null>(null)

interface TaskAdapterProviderProps {
  children: ReactNode
  adapterType?: AdapterType
}

export function TaskAdapterProvider({
  children,
  adapterType = 'didaList',
}: TaskAdapterProviderProps) {
  const value = useMemo<TaskAdapterContextValue>(
    () => ({
      adapter: createTaskAdapter(adapterType),
      adapterType,
    }),
    [adapterType]
  )

  return (
    <TaskAdapterContext.Provider value={value}>
      {children}
    </TaskAdapterContext.Provider>
  )
}

/**
 * 获取当前任务适配器
 */
export function useTaskAdapter(): ITaskAdapter {
  const context = useContext(TaskAdapterContext)

  // 如果没有 Provider，返回默认适配器
  if (!context) {
    return getDefaultAdapter()
  }

  return context.adapter
}

/**
 * 获取当前适配器类型
 */
export function useAdapterType(): AdapterType {
  const context = useContext(TaskAdapterContext)
  return context?.adapterType ?? 'didaList'
}

export { TaskAdapterContext }
