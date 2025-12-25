import { Layout, Button, Typography, Space } from 'antd'
import { LogoutOutlined } from '@ant-design/icons'
import { useAuth } from '@/hooks/useAuth'
import { useTasks } from '@/hooks/useTasks'
import { TaskList } from '@/components/TaskList'
import { LoginButton } from '@/components/LoginButton'

const { Header, Content } = Layout
const { Title } = Typography

function App() {
  const { isLoggedIn, loading: authLoading, login, logout } = useAuth()
  const {
    tasks,
    projects,
    loading: tasksLoading,
    error,
    refresh,
    completeTask,
    deleteTask,
    updateTask,
    createTask,
  } = useTasks(isLoggedIn)

  if (!isLoggedIn) {
    return <LoginButton loading={authLoading} onLogin={login} />
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          background: '#fff',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          滴答清单
        </Title>
        <Space>
          <Button type="text" icon={<LogoutOutlined />} onClick={logout}>
            退出
          </Button>
        </Space>
      </Header>
      <Content
        style={{
          background: '#fff',
          maxWidth: 800,
          margin: '0 auto',
          width: '100%',
        }}
      >
        <TaskList
          tasks={tasks}
          projects={projects}
          loading={tasksLoading}
          error={error}
          onComplete={completeTask}
          onDelete={deleteTask}
          onUpdate={updateTask}
          onCreate={createTask}
          onRefresh={refresh}
        />
      </Content>
    </Layout>
  )
}

export default App
