import { Checkbox, Button, Space, Tag, Popconfirm, Typography } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import type { Task, Project } from '@/types'

const { Text } = Typography

interface TaskItemProps {
  task: Task
  project?: Project
  onComplete: (task: Task) => void
  onDelete: (task: Task) => void
  onEdit: (task: Task) => void
}

const priorityColors: Record<number, string> = {
  5: '#ff4d4f', // high
  3: '#faad14', // medium
  1: '#52c41a', // low
  0: 'transparent',
}

export function TaskItem({
  task,
  project,
  onComplete,
  onDelete,
  onEdit,
}: TaskItemProps) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null
    const date = new Date(dateStr)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return '今天'
    }
    if (date.toDateString() === tomorrow.toDateString()) {
      return '明天'
    }
    return `${date.getMonth() + 1}/${date.getDate()}`
  }

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date()

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 16px',
        borderBottom: '1px solid #f0f0f0',
        borderLeft: `3px solid ${priorityColors[task.priority] || 'transparent'}`,
      }}
    >
      <Checkbox onChange={() => onComplete(task)} style={{ marginRight: 12 }} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Text
            style={{
              fontSize: 14,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {task.title}
          </Text>
          {task.dueDate && (
            <Tag
              color={isOverdue ? 'error' : 'default'}
              style={{ marginLeft: 'auto' }}
            >
              {formatDate(task.dueDate)}
            </Tag>
          )}
        </div>
        {project && (
          <Text type="secondary" style={{ fontSize: 12 }}>
            {project.name}
          </Text>
        )}
      </div>

      <Space size="small">
        <Button
          type="text"
          size="small"
          icon={<EditOutlined />}
          onClick={() => onEdit(task)}
        />
        <Popconfirm
          title="确定删除此任务？"
          onConfirm={() => onDelete(task)}
          okText="删除"
          cancelText="取消"
        >
          <Button type="text" size="small" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      </Space>
    </div>
  )
}
