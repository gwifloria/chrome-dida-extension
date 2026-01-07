/**
 * 连接弹窗 Context 定义
 */
import { createContext } from 'react'

export interface ConnectPromptContextValue {
  openConnectPrompt: () => void
}

export const ConnectPromptContext =
  createContext<ConnectPromptContextValue | null>(null)
