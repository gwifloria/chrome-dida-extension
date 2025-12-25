/**
 * 日期工具函数
 * 统一处理日期格式化，避免时区问题
 */

/**
 * 将 Date 对象格式化为 YYYY-MM-DD 字符串
 */
export function formatDateStr(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * 从 ISO 日期字符串中提取 YYYY-MM-DD 部分
 */
export function extractDateStr(dueDate: string): string {
  return dueDate.slice(0, 10)
}

/**
 * 格式化显示日期（如：12月25日 星期三）
 */
export function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString('zh-CN', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })
}

/**
 * 格式化时间（如：14:30）
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

/**
 * 格式化简短日期（如：12/25）
 */
export function formatShortDate(dateStr: string): string {
  const [, month, day] = dateStr.slice(0, 10).split('-')
  return `${parseInt(month)}/${parseInt(day)}`
}
