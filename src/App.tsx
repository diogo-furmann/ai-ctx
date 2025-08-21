import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import { CheckSquareOutlined } from '@ant-design/icons'
import { TaskManagementPage } from './pages/TaskManagement'
import { ErrorBoundary } from 'react-error-boundary'
import './index.css'

const { Header, Content } = Layout

const ErrorFallback: React.FC<{ error: Error; resetErrorBoundary: () => void }> = ({
  error,
  resetErrorBoundary,
}) => (
  <div
    style={{
      padding: '20px',
      textAlign: 'center',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    }}
  >
    <h2>Something went wrong</h2>
    <p>{error.message}</p>
    <button onClick={resetErrorBoundary}>Try again</button>
  </div>
)

function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Error caught by boundary:', error, errorInfo)
      }}
    >
      <Router>
        <Layout style={{ minHeight: '100vh' }}>
          <Header style={{ display: 'flex', alignItems: 'center', backgroundColor: '#001529' }}>
            <div
              style={{
                color: 'white',
                fontSize: '20px',
                fontWeight: 'bold',
                marginRight: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <CheckSquareOutlined />
              Task Manager
            </div>
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={['tasks']}
              items={[
                {
                  key: 'tasks',
                  label: 'Tasks',
                  icon: <CheckSquareOutlined />,
                },
              ]}
              style={{ flex: 1, minWidth: 0 }}
            />
          </Header>
          <Content style={{ padding: '0' }}>
            <Routes>
              <Route path="/tasks" element={<TaskManagementPage />} />
              <Route path="/" element={<Navigate to="/tasks" replace />} />
              <Route path="*" element={<Navigate to="/tasks" replace />} />
            </Routes>
          </Content>
        </Layout>
      </Router>
    </ErrorBoundary>
  )
}

export default App
