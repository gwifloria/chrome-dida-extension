import { memo } from 'react'
import { CloseOutlined, LinkOutlined } from '@ant-design/icons'
import { Button, Modal } from 'antd'
import { useTranslation } from 'react-i18next'

interface ConnectPromptProps {
  open: boolean
  loading?: boolean
  onConnect: () => void
  onCancel: () => void
}

export const ConnectPrompt = memo(function ConnectPrompt({
  open,
  loading = false,
  onConnect,
  onCancel,
}: ConnectPromptProps) {
  const { t } = useTranslation('common')

  return (
    <Modal
      open={open}
      centered
      closable={false}
      footer={null}
      width={400}
      className="connect-prompt-modal"
    >
      <div className="p-6 text-center">
        <div className="text-5xl mb-4">
          <LinkOutlined className="text-[var(--accent)]" />
        </div>

        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
          {t('connectPrompt.title')}
        </h2>

        <p className="text-[var(--text-secondary)] mb-6">
          {t('connectPrompt.description')}
        </p>

        <div className="flex flex-col gap-3">
          <Button
            type="primary"
            size="large"
            block
            onClick={onConnect}
            loading={loading}
            icon={<LinkOutlined />}
            className="!h-12 !rounded-lg"
          >
            {t('connectPrompt.connect')}
          </Button>

          <Button
            type="text"
            size="large"
            block
            onClick={onCancel}
            disabled={loading}
            icon={<CloseOutlined />}
            className="!h-12 !text-[var(--text-secondary)] hover:!text-[var(--text-primary)]"
          >
            {t('button.maybeLater')}
          </Button>
        </div>
      </div>
    </Modal>
  )
})
