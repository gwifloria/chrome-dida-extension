import { Component, type ReactNode, type ErrorInfo } from 'react'
import { Button } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="h-screen flex flex-col items-center justify-center bg-[var(--bg-primary)] text-[var(--text-primary)]">
          <div className="text-center max-w-md px-6">
            <h2 className="text-xl font-medium mb-2">出错了</h2>
            <p className="text-[var(--text-secondary)] mb-4 text-sm">
              应用遇到了一个问题，请刷新页面重试。
            </p>
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={this.handleReload}
            >
              刷新页面
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
