import type { Project } from '@/types'

/**
 * 查找收集箱项目
 * 使用泛型以支持 ProjectWithCount 等扩展类型
 */
export function findInboxProject<T extends Project>(
  projects: T[]
): T | undefined {
  return projects.find((p) => p.kind === 'INBOX' || p.name === '收集箱')
}

/**
 * 过滤未关闭的项目
 */
export function filterActiveProjects(projects: Project[]): Project[] {
  return projects.filter((p) => !p.closed)
}
