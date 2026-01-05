/**
 * API 层统一导出
 */

// Adapters（推荐使用）
export * from './adapters'

// 兼容旧 API 接口（供 services/api.ts 使用）
import { tasksApi } from './adapters/dida/tasks'
import { projectsApi } from './adapters/dida/projects'

export const api = {
  // 项目
  getProjects: projectsApi.getAll.bind(projectsApi),
  getProjectData: projectsApi.getData.bind(projectsApi),
  getInboxTasks: projectsApi.getInboxTasks.bind(projectsApi),
  getAllTasks: projectsApi.getAllTasks.bind(projectsApi),

  // 任务
  createTask: tasksApi.create,
  updateTask: tasksApi.update,
  completeTask: tasksApi.complete,
  deleteTask: tasksApi.delete,
}
