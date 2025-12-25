import type { Theme } from './index'

export const oceanTheme: Theme = {
  name: '清新海洋',
  colors: {
    bgPrimary: '#D8E3E8', // 外层背景 - 浅灰蓝
    bgSecondary: '#E8EFF3', // 浅蓝灰
    bgSidebar: '#D8E3E8', // 侧边栏背景
    bgContent: '#EEF3F6', // 内容区背景 - 淡蓝白
    bgCard: '#FFFFFF',
    textPrimary: '#3D4F5F', // 深蓝灰
    textSecondary: '#8A9BA8', // 中灰蓝
    accent: '#5B9BD5', // 天蓝
    accentLight: '#E3F0FA',
    border: '#C5D5E0',
    success: '#52C41A', // 绿色
    warning: '#FAAD14', // 金色
    danger: '#FF6B6B', // 珊瑚红
    priorityHigh: '#FF6B6B',
    priorityMedium: '#FAAD14',
    priorityLow: '#52C41A',
  },
  borderRadius: {
    small: '8px',
    medium: '16px',
    large: '24px',
  },
  shadow: {
    small: '0 2px 8px rgba(61, 79, 95, 0.08)',
    medium: '0 4px 16px rgba(61, 79, 95, 0.1)',
    large: '0 8px 32px rgba(61, 79, 95, 0.12)',
  },
  font: {
    primary: '"Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif',
    secondary: '"Noto Serif SC", "STSong", serif',
  },
}
