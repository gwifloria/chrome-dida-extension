import { useState, useCallback, useRef, useEffect } from 'react'
import { Button, message } from 'antd'
import { LinkOutlined, DisconnectOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useAppMode } from '@/contexts/AppModeContext'
import { useTasks } from '@/hooks/useTasks'
import { ConnectPrompt } from '@/components/ConnectPrompt'
import { ThemeToggle } from '../common/ThemeToggle'
import {
  migrateLocalTasksToDidaList,
  clearLocalTasks,
} from '@/services/taskMigration'

export function FocusTopBar() {
  const { t } = useTranslation('common')
  const { isGuest, connect, disconnect } = useAppMode()
  const { data } = useTasks()

  const [showConnectPrompt, setShowConnectPrompt] = useState(false)
  const [connectLoading, setConnectLoading] = useState(false)

  const mountedRef = useRef(true)
  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  const handleConnectClick = useCallback(() => {
    setShowConnectPrompt(true)
  }, [])

  const handleConnectAndMigrate = useCallback(async () => {
    setConnectLoading(true)
    try {
      await connect()
      const result = await migrateLocalTasksToDidaList()
      if (!mountedRef.current) return
      if (result.success > 0) {
        message.success(t('message.syncSuccess', { count: result.success }))
      }
      if (result.failed > 0) {
        message.warning(t('message.syncFailed', { count: result.failed }))
      }
      setShowConnectPrompt(false)
    } catch {
      if (!mountedRef.current) return
      message.error(t('message.failedToConnect'))
    } finally {
      if (mountedRef.current) {
        setConnectLoading(false)
      }
    }
  }, [connect, t])

  const handleConnectWithoutMigrate = useCallback(async () => {
    setConnectLoading(true)
    try {
      await connect()
      await clearLocalTasks()
      if (!mountedRef.current) return
      setShowConnectPrompt(false)
    } catch {
      if (!mountedRef.current) return
      message.error(t('message.failedToConnect'))
    } finally {
      if (mountedRef.current) {
        setConnectLoading(false)
      }
    }
  }, [connect, t])

  const handleCancelConnect = useCallback(() => {
    setShowConnectPrompt(false)
  }, [])

  return (
    <>
      <div className="flex justify-between items-center p-6 relative z-10">
        <div /> {/* 保持布局平衡 */}
        <div className="flex items-center gap-3">
          {isGuest ? (
            <Button
              type="primary"
              shape="round"
              size="small"
              onClick={handleConnectClick}
              icon={<LinkOutlined />}
            >
              {t('button.connect')}
            </Button>
          ) : (
            <Button
              type="text"
              size="small"
              onClick={disconnect}
              icon={<DisconnectOutlined />}
              className="!text-[var(--text-secondary)] hover:!text-[var(--text-primary)]"
            >
              {t('button.disconnect')}
            </Button>
          )}
          <ThemeToggle variant="minimal" size="sm" />
        </div>
      </div>

      <ConnectPrompt
        open={showConnectPrompt}
        localTaskCount={data.tasks.length}
        loading={connectLoading}
        onConnectAndMigrate={handleConnectAndMigrate}
        onConnectWithoutMigrate={handleConnectWithoutMigrate}
        onCancel={handleCancelConnect}
      />
    </>
  )
}
