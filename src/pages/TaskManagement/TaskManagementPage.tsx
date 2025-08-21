import React, { useState } from 'react'
import { Button, Space, Typography, Row, Col, Statistic, Card } from 'antd'
import {
  PlusOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import { useTasks } from '../../hooks/useTasks'
import { useTaskOperations } from '../../hooks/useTaskOperations'
import { TaskList, TaskFormModal } from '../../components/Tasks'
import type { Task, TaskFormData } from '../../types/task'

const { Title } = Typography

export const TaskManagementPage: React.FC = () => {
  const { data, loading, error, refetch } = useTasks()
  const {
    createItem,
    updateItem,
    deleteItem,
    toggleComplete,
    loading: operationLoading,
  } = useTaskOperations()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const handleCreate = () => {
    setSelectedTask(null)
    setIsModalOpen(true)
  }

  const handleEdit = (task: Task) => {
    setSelectedTask(task)
    setIsModalOpen(true)
  }

  const handleSubmit = async (values: TaskFormData) => {
    if (selectedTask) {
      await updateItem(selectedTask.id, values)
    } else {
      await createItem(values)
    }
    refetch()
  }

  const handleDelete = async (id: string) => {
    await deleteItem(id)
    refetch()
  }

  const handleToggleComplete = async (id: string, currentStatus: Task['status']) => {
    await toggleComplete(id, currentStatus)
    refetch()
  }

  const formatTaskFormData = (task: Task): TaskFormData => ({
    title: task.title,
    description: task.description,
    dueDate: task.dueDate,
    priority: task.priority,
  })

  // Calculate statistics
  const tasks = data || []
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.status === 'completed').length
  const pendingTasks = tasks.filter((task) => task.status === 'pending').length
  const overdueTasks = tasks.filter(
    (task) => task.status === 'pending' && new Date(task.dueDate) < new Date()
  ).length

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <Typography.Text type="danger">Error: {error}</Typography.Text>
        <br />
        <Button onClick={refetch} style={{ marginTop: '10px' }}>
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={2} style={{ margin: 0 }}>
              Task Management
            </Title>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate} size="large">
              Add New Task
            </Button>
          </div>
        </Col>

        <Col span={24}>
          <Row gutter={16}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Tasks"
                  value={totalTasks}
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Completed"
                  value={completedTasks}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Pending"
                  value={pendingTasks}
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Overdue"
                  value={overdueTasks}
                  prefix={<ExclamationCircleOutlined />}
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Card>
            </Col>
          </Row>
        </Col>

        <Col span={24}>
          <TaskList
            data={tasks}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleComplete={handleToggleComplete}
          />
        </Col>
      </Row>

      <TaskFormModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialValues={selectedTask ? formatTaskFormData(selectedTask) : undefined}
        title={selectedTask ? 'Edit Task' : 'Create New Task'}
        loading={operationLoading}
      />
    </div>
  )
}
