import { Button, Typography, Space } from 'antd'
import { LoginOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

interface LoginButtonProps {
  loading: boolean
  onLogin: () => void
}

export function LoginButton({ loading, onLogin }: LoginButtonProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Space direction="vertical" align="center" size="large">
        <Title level={2} style={{ color: '#fff', margin: 0 }}>
          滴答清单 New Tab
        </Title>
        <Text style={{ color: 'rgba(255,255,255,0.8)' }}>
          登录后查看您的任务
        </Text>
        <Button
          type="primary"
          size="large"
          icon={<LoginOutlined />}
          loading={loading}
          onClick={onLogin}
          style={{
            height: 48,
            paddingInline: 32,
            fontSize: 16,
            background: '#fff',
            color: '#667eea',
            border: 'none',
          }}
        >
          登录滴答清单
        </Button>
      </Space>
    </div>
  )
}
