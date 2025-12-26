import type { Theme } from './index'

export const roseTheme: Theme = {
  name: '玫瑰粉',
  colors: {
    bgPrimary: '#F5F0ED', // 浅灰粉
    bgSecondary: '#F0E8E5', // 浅玫瑰灰
    bgSidebar: '#F5F0ED', // 侧边栏
    bgContent: '#FBF9F8', // 内容区 - 近白色
    bgCard: '#FFFFFF',
    textPrimary: '#3D3D3D', // 深灰
    textSecondary: '#9A9A9A', // 中灰
    accent: '#D4A5A5', // 柔和玫瑰 - 降低饱和度
    accentLight: '#F5EAEA', // 极淡玫瑰 - 更柔和
    border: '#E8E0DC',
    success: '#7EC699', // 薄荷绿
    warning: '#F0C78A', // 杏黄
    danger: '#E88A8A',
    priorityHigh: '#E88A8A', // 珊瑚粉
    priorityMedium: '#F0C78A', // 杏黄
    priorityLow: '#7EC699', // 薄荷绿
  },
  borderRadius: {
    small: '8px',
    medium: '16px',
    large: '24px',
  },
  shadow: {
    small: '0 2px 8px rgba(0, 0, 0, 0.04)',
    medium: '0 4px 16px rgba(0, 0, 0, 0.06)',
    large: '0 8px 32px rgba(0, 0, 0, 0.08)',
  },
  font: {
    primary: '"Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif',
    secondary: '"Noto Serif SC", "STSong", serif',
  },
}
