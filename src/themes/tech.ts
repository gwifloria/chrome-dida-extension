import type { Theme } from './index'

export const techTheme: Theme = {
  name: '暗黑模式',
  colors: {
    bgPrimary: '#1C1C1E', // 外层背景 - 深灰黑
    bgSecondary: '#2C2C2E', // 中灰
    bgSidebar: '#1C1C1E', // 侧边栏背景
    bgContent: '#2C2C2E', // 内容区背景 - 稍浅灰
    bgCard: '#3A3A3C', // 卡片背景
    textPrimary: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.55)',
    accent: '#0A84FF', // iOS 蓝
    accentLight: 'rgba(10, 132, 255, 0.15)',
    border: 'rgba(255, 255, 255, 0.12)',
    success: '#30D158', // iOS 绿
    warning: '#FFD60A', // iOS 黄
    danger: '#FF453A', // iOS 红
    priorityHigh: '#FF453A',
    priorityMedium: '#FFD60A',
    priorityLow: '#30D158',
  },
  borderRadius: {
    small: '8px',
    medium: '12px',
    large: '16px',
  },
  shadow: {
    small: '0 2px 8px rgba(0, 0, 0, 0.3)',
    medium: '0 4px 16px rgba(0, 0, 0, 0.4)',
    large: '0 8px 32px rgba(0, 0, 0, 0.5)',
  },
  font: {
    primary: '"SF Pro Display", "Noto Sans SC", -apple-system, sans-serif',
    secondary: '"SF Pro Display", "Noto Serif SC", -apple-system, serif',
  },
}
