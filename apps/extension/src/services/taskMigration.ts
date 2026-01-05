import { api } from './api'
import { localTaskStorage } from './localTaskStorage'
import type { LocalTask } from '@/types'

export interface MigrationResult {
  success: number
  failed: number
  tasks: LocalTask[]
}

/**
 * Migrate local tasks to DidaList inbox
 * @returns Migration result with success/failed counts
 */
export async function migrateLocalTasksToDidaList(): Promise<MigrationResult> {
  const localTasks = await localTaskStorage.getPendingTasks()

  if (localTasks.length === 0) {
    return { success: 0, failed: 0, tasks: [] }
  }

  let success = 0
  let failed = 0
  const migratedTasks: LocalTask[] = []

  // 第一阶段：创建远程任务，记录成功的本地任务 ID
  const migratedIds: string[] = []

  for (const task of localTasks) {
    try {
      await api.createTask({
        title: task.title,
        priority: task.priority,
        dueDate: task.dueDate,
      })
      migratedIds.push(task.id)
      migratedTasks.push(task)
      success++
    } catch (err) {
      console.error(
        `[TaskMigration] Failed to migrate task: ${task.title}`,
        err
      )
      failed++
    }
  }

  // 第二阶段：批量删除已成功迁移的本地任务
  // 即使删除失败，任务已在远程创建，下次迁移时会跳过（因为 ID 不同）
  for (const id of migratedIds) {
    try {
      await localTaskStorage.deleteTask(id)
    } catch (err) {
      // 删除失败不影响迁移结果，仅记录日志
      console.warn(`[TaskMigration] 删除本地任务失败 (id: ${id}):`, err)
    }
  }

  return { success, failed, tasks: migratedTasks }
}

/**
 * Clear all local tasks without migrating
 */
export async function clearLocalTasks(): Promise<void> {
  await localTaskStorage.clearAll()
}
