import { memo } from 'react'
import { Button } from 'antd'
import { LinkOutlined, DisconnectOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { ThemeToggle } from '../common/ThemeToggle'

interface FocusTopBarProps {
  isGuestMode: boolean
  onConnect?: () => void
  onDisconnect?: () => void
}

export const FocusTopBar = memo(function FocusTopBar({
  isGuestMode,
  onConnect,
  onDisconnect,
}: FocusTopBarProps) {
  const { t } = useTranslation('common')

  return (
    <div className="flex justify-between items-center p-6 relative z-10">
      <div /> {/* 保持布局平衡 */}
      {/* 右上角 */}
      <div className="flex items-center gap-3">
        {/* 访客模式显示连接按钮 */}
        {isGuestMode && onConnect && (
          <Button
            type="primary"
            shape="round"
            size="small"
            onClick={onConnect}
            icon={<LinkOutlined />}
          >
            {t('button.connect')}
          </Button>
        )}
        {/* 已连接模式显示断开按钮 */}
        {!isGuestMode && onDisconnect && (
          <Button
            type="text"
            size="small"
            onClick={onDisconnect}
            icon={<DisconnectOutlined />}
            className="!text-[var(--text-secondary)] hover:!text-[var(--text-primary)]"
          >
            {t('button.disconnect')}
          </Button>
        )}
        <ThemeToggle variant="minimal" size="sm" />
      </div>
    </div>
  )
})
