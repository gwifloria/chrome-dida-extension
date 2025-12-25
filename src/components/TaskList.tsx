import { useState } from 'react'
import { Spin, Empty, Alert, Button, Select, Space } from 'antd'
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import { TaskItem } from './TaskItem'
import { TaskEditor } from './TaskEditor'
import type { Task, Project } from '@/types'

interface TaskListProps {
  tasks: Task[]
  projects: Project[]
  loading: boolean
  error: string | null
  onComplete: (task: Task) => void
  onDelete: (task: Task) => void
  onUpdate: (taskId: string, updates: Partial<Task>) => void
  onCreate: (task: Partial<Task>) => Promise<Task>
  onRefresh: () => void
}

export function TaskList({
  tasks,
  projects,
  loading,
  error,
  onComplete,
  onDelete,
  onUpdate,
  onCreate,
  onRefresh,
}: TaskListProps) {
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  )

  const filteredTasks = selectedProjectId
    ? tasks.filter((t) => t.projectId === selectedProjectId)
    : tasks

  // 按优先级和日期排序
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // 先按优先级排序（高优先级在前）
    if (b.priority !== a.priority) {
      return b.priority - a.priority
    }
    // 再按截止日期排序
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    }
    if (a.dueDate) return -1
    if (b.dueDate) return 1
    return 0
  })

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setIsEditorOpen(true)
  }

  const handleNew = () => {
    setEditingTask(null)
    setIsEditorOpen(true)
  }

  const handleSave = async (taskId: string | null, values: Partial<Task>) => {
    if (taskId) {
      onUpdate(taskId, values)
    } else {
      await onCreate(values)
    }
    setIsEditorOpen(false)
    setEditingTask(null)
  }

  const getProjectById = (projectId: string) =>
    projects.find((p) => p.id === projectId)

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          padding: '16px',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Space>
          <Select
            placeholder="所有项目"
            allowClear
            style={{ width: 150 }}
            value={selectedProjectId}
            onChange={setSelectedProjectId}
          >
            {projects
              .filter((p) => !p.closed)
              .map((project) => (
                <Select.Option key={project.id} value={project.id}>
                  {project.name}
                </Select.Option>
              ))}
          </Select>
          <span style={{ color: '#999' }}>{sortedTasks.length} 个任务</span>
        </Space>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={onRefresh}>
            刷新
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleNew}>
            新建
          </Button>
        </Space>
      </div>

      {error && (
        <Alert message={error} type="error" showIcon style={{ margin: 16 }} />
      )}

      <div style={{ flex: 1, overflow: 'auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Spin size="large" />
          </div>
        ) : sortedTasks.length === 0 ? (
          <Empty description="暂无任务" style={{ marginTop: 60 }} />
        ) : (
          sortedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              project={getProjectById(task.projectId)}
              onComplete={onComplete}
              onDelete={onDelete}
              onEdit={handleEdit}
            />
          ))
        )}
      </div>

      <TaskEditor
        task={editingTask}
        projects={projects}
        open={isEditorOpen}
        onCancel={() => {
          setIsEditorOpen(false)
          setEditingTask(null)
        }}
        onSave={handleSave}
      />
    </div>
  )
}
