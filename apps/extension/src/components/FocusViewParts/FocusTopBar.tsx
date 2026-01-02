import { Button } from 'antd'
import { LinkOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { ThemeToggle } from '../common/ThemeToggle'

interface FocusTopBarProps {
  isGuestMode: boolean
  onConnect?: () => void
}

export function FocusTopBar({ isGuestMode, onConnect }: FocusTopBarProps) {
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
        <ThemeToggle variant="minimal" size="sm" />
      </div>
    </div>
  )
}
