import type { ThemeConfig } from 'antd'

/**
 * Ant Design 主题配置
 * 使用 CSS 变量，随应用主题自动切换
 */
export const antdTheme: ThemeConfig = {
  // 使用 CSS 变量模式
  cssVar: true,
  // 全局 token
  token: {
    // 颜色
    colorPrimary: 'var(--accent)',
    colorBgContainer: 'var(--bg-card)',
    colorBgElevated: 'var(--bg-card)',
    colorBgLayout: 'var(--bg-primary)',
    colorText: 'var(--text-primary)',
    colorTextSecondary: 'var(--text-secondary)',
    colorBorder: 'var(--border)',
    colorBorderSecondary: 'var(--border)',
    colorError: 'var(--danger)',
    colorSuccess: 'var(--success)',
    colorWarning: 'var(--warning)',
    // 圆角
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,
    // 字体
    fontFamily: 'var(--font-primary)',
  },
  components: {
    Button: {
      // 默认按钮
      defaultBg: 'transparent',
      defaultBorderColor: 'var(--border)',
      defaultColor: 'var(--text-primary)',
      defaultHoverBg: 'var(--accent-light)',
      defaultHoverBorderColor: 'var(--accent)',
      defaultHoverColor: 'var(--text-primary)',
      // 主按钮
      primaryColor: '#fff',
      // 文本按钮
      textHoverBg: 'rgba(0, 0, 0, 0.04)',
      // 通用
      fontWeight: 500,
      paddingInline: 16,
      paddingBlock: 6,
    },
    Modal: {
      contentBg: 'var(--bg-card)',
      headerBg: 'var(--bg-card)',
      titleColor: 'var(--text-primary)',
      borderRadiusLG: 16,
    },
    Input: {
      activeBg: 'transparent',
      hoverBg: 'transparent',
      colorBgContainer: 'var(--bg-secondary)',
      colorText: 'var(--text-primary)',
      colorTextPlaceholder: 'var(--text-secondary)',
      activeBorderColor: 'var(--accent)',
      hoverBorderColor: 'var(--border)',
    },
    Select: {
      colorBgContainer: 'var(--bg-card)',
      colorBgElevated: 'var(--bg-card)',
      optionSelectedBg: 'var(--accent-light)',
      optionActiveBg: 'rgba(0, 0, 0, 0.04)',
    },
    Form: {
      labelColor: 'var(--text-primary)',
      itemMarginBottom: 16,
    },
    Empty: {
      colorText: 'var(--text-secondary)',
      colorTextDescription: 'var(--text-secondary)',
    },
    Skeleton: {
      gradientFromColor: 'var(--bg-secondary)',
      gradientToColor: 'var(--bg-card)',
    },
  },
}
