import { Modal, Form, Input, Select, DatePicker } from 'antd'
import type { Task, Project } from '@/types'
import dayjs from 'dayjs'

interface TaskEditorProps {
  task: Task | null
  projects: Project[]
  open: boolean
  onCancel: () => void
  onSave: (taskId: string | null, values: Partial<Task>) => void
}

const priorityOptions = [
  { value: 0, label: '无' },
  { value: 1, label: '低' },
  { value: 3, label: '中' },
  { value: 5, label: '高' },
]

export function TaskEditor({
  task,
  projects,
  open,
  onCancel,
  onSave,
}: TaskEditorProps) {
  const [form] = Form.useForm()
  const isNew = !task

  const handleOk = async () => {
    const values = await form.validateFields()
    const formattedValues: Partial<Task> = {
      title: values.title,
      content: values.content,
      priority: values.priority,
      projectId: values.projectId,
      dueDate: values.dueDate ? values.dueDate.toISOString() : undefined,
    }
    onSave(task?.id || null, formattedValues)
    form.resetFields()
  }

  const handleCancel = () => {
    form.resetFields()
    onCancel()
  }

  return (
    <Modal
      title={isNew ? '新建任务' : '编辑任务'}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="保存"
      cancelText="取消"
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          title: task?.title || '',
          content: task?.content || '',
          priority: task?.priority || 0,
          projectId: task?.projectId || projects[0]?.id,
          dueDate: task?.dueDate ? dayjs(task.dueDate) : null,
        }}
      >
        <Form.Item
          name="title"
          label="标题"
          rules={[{ required: true, message: '请输入任务标题' }]}
        >
          <Input placeholder="任务标题" />
        </Form.Item>

        <Form.Item name="content" label="描述">
          <Input.TextArea rows={3} placeholder="任务描述（可选）" />
        </Form.Item>

        <Form.Item name="projectId" label="所属项目">
          <Select>
            {projects
              .filter((p) => !p.closed)
              .map((project) => (
                <Select.Option key={project.id} value={project.id}>
                  {project.name}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item name="dueDate" label="截止日期">
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="priority" label="优先级">
          <Select options={priorityOptions} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
