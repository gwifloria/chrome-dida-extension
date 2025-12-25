/**
 * 任务状态常量
 */
export const TASK_STATUS = {
  NORMAL: 0,
  COMPLETED: 2,
} as const

/**
 * 任务优先级常量
 */
export const TASK_PRIORITY = {
  NONE: 0,
  LOW: 1,
  MEDIUM: 3,
  HIGH: 5,
} as const

export type TaskStatus = (typeof TASK_STATUS)[keyof typeof TASK_STATUS]
export type TaskPriority = (typeof TASK_PRIORITY)[keyof typeof TASK_PRIORITY]

/**
 * 优先级配置（用于 UI 渲染）
 */
export const PRIORITY_CONFIG = {
  [TASK_PRIORITY.HIGH]: { label: '高', color: '#FF6B6B' },
  [TASK_PRIORITY.MEDIUM]: { label: '中', color: '#FFB347' },
  [TASK_PRIORITY.LOW]: { label: '低', color: '#87CEEB' },
  [TASK_PRIORITY.NONE]: { label: '无', color: 'transparent' },
} as const
