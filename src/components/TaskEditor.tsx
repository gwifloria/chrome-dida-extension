import { Modal, Form, Input, Select, DatePicker } from 'antd'
import { FlagOutlined } from '@ant-design/icons'
import { PRIORITY_OPTIONS } from '@/constants/task'
import type { Task, Project } from '@/types'
import dayjs from 'dayjs'

interface TaskEditorProps {
  task: Task | null
  projects: Project[]
  open: boolean
  onCancel: () => void
  onSave: (taskId: string | null, values: Partial<Task>) => void
}

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

  // 输入框通用样式
  const inputClassName =
    '!bg-[var(--bg-secondary)] !rounded-xl !border-0 !py-2.5 !px-4 !text-sm [&_.ant-input]:!bg-transparent [&_.ant-input]:!text-[var(--text-primary)] [&_.ant-input::placeholder]:!text-[var(--text-secondary)] hover:!bg-[var(--bg-secondary)]/80 focus:!bg-[var(--bg-secondary)]/80 focus-within:!bg-[var(--bg-secondary)]/80 !shadow-none'

  const selectClassName =
    '[&_.ant-select-selector]:!bg-[var(--bg-secondary)] [&_.ant-select-selector]:!rounded-xl [&_.ant-select-selector]:!border-0 [&_.ant-select-selector]:!py-2 [&_.ant-select-selector]:!px-4 [&_.ant-select-selector]:!h-auto [&_.ant-select-selector]:!shadow-none [&_.ant-select-selection-item]:!text-sm [&_.ant-select-selection-item]:!text-[var(--text-primary)] [&_.ant-select-arrow]:!text-[var(--text-secondary)]'

  const datePickerClassName =
    '!bg-[var(--bg-secondary)] !rounded-xl !border-0 !py-2.5 !px-4 !shadow-none [&_.ant-picker-input>input]:!text-sm [&_.ant-picker-input>input]:!text-[var(--text-primary)] [&_.ant-picker-input>input::placeholder]:!text-[var(--text-secondary)] [&_.ant-picker-suffix]:!text-[var(--text-secondary)]'

  return (
    <Modal
      title={
        <span className="text-lg font-medium text-[var(--text-primary)]">
          {isNew ? '新建任务' : '编辑任务'}
        </span>
      }
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="保存"
      cancelText="取消"
      destroyOnClose
      width={480}
      className="[&_.ant-modal-content]:!bg-[var(--bg-card)] [&_.ant-modal-content]:!rounded-2xl [&_.ant-modal-header]:!bg-transparent [&_.ant-modal-header]:!border-0 [&_.ant-modal-header]:!pb-0 [&_.ant-modal-body]:!pt-4 [&_.ant-modal-footer]:!border-t [&_.ant-modal-footer]:!border-dashed [&_.ant-modal-footer]:!border-[var(--border)] [&_.ant-modal-footer]:!mt-2 [&_.ant-modal-footer]:!pt-4"
      okButtonProps={{
        className:
          '!bg-[var(--accent)] !border-0 !rounded-lg !px-5 !h-9 !text-sm !font-medium hover:!bg-[var(--accent)]/80 !shadow-none',
      }}
      cancelButtonProps={{
        className:
          '!bg-transparent !border !border-[var(--border)] !rounded-lg !px-5 !h-9 !text-sm !text-[var(--text-secondary)] hover:!text-[var(--text-primary)] hover:!border-[var(--text-secondary)] !shadow-none',
      }}
    >
      <Form
        form={form}
        layout="vertical"
        className="[&_.ant-form-item]:!mb-4 [&_.ant-form-item-label>label]:!text-xs [&_.ant-form-item-label>label]:!text-[var(--text-secondary)] [&_.ant-form-item-label>label]:!font-normal [&_.ant-form-item-label]:!pb-1.5"
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
          <Input placeholder="任务标题" className={inputClassName} />
        </Form.Item>

        <Form.Item name="content" label="描述">
          <Input.TextArea
            rows={3}
            placeholder="任务描述（可选）"
            className={`${inputClassName} !py-3 [&_.ant-input]:!min-h-[72px]`}
          />
        </Form.Item>

        {/* 所属项目和截止日期并排 */}
        <div className="flex gap-3">
          <Form.Item
            name="projectId"
            label="所属项目"
            className="!flex-1 !mb-4"
          >
            <Select className={selectClassName}>
              {projects
                .filter((p) => !p.closed)
                .map((project) => (
                  <Select.Option key={project.id} value={project.id}>
                    <span className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ background: project.color || 'var(--accent)' }}
                      />
                      {project.name}
                    </span>
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item name="dueDate" label="截止日期" className="!flex-1 !mb-4">
            <DatePicker
              className={datePickerClassName}
              style={{ width: '100%' }}
              placeholder="选择日期"
            />
          </Form.Item>
        </div>

        <Form.Item name="priority" label="优先级" className="!mb-0">
          <Select
            className={selectClassName}
            optionLabelProp="label"
            options={PRIORITY_OPTIONS.map((opt) => ({
              value: opt.value,
              label: (
                <span className="flex items-center gap-2">
                  <FlagOutlined style={{ color: opt.color }} />
                  {opt.label}
                </span>
              ),
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
