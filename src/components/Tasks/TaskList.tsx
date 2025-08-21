import React from 'react'
import { Table, Button, Popconfirm, Space, Tag, Checkbox } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import type { Task, TaskPriority, TaskStatus } from '../../types/task'

interface TaskListProps {
  data: Task[]
  loading?: boolean
  onEdit: (record: Task) => void
  onDelete: (id: string) => void
  onToggleComplete: (id: string, currentStatus: TaskStatus) => void
}

const priorityColors: Record<TaskPriority, string> = {
  low: 'green',
  medium: 'orange',
  high: 'red',
}

const statusColors: Record<TaskStatus, string> = {
  pending: 'blue',
  completed: 'green',
}

export const TaskList: React.FC<TaskListProps> = ({
  data,
  loading = false,
  onEdit,
  onDelete,
  onToggleComplete,
}) => {
  const columns: ColumnsType<Task> = [
    {
      title: 'Complete',
      key: 'complete',
      width: 80,
      render: (_, record) => (
        <Checkbox
          checked={record.status === 'completed'}
          onChange={() => onToggleComplete(record.id, record.status)}
        />
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (text, record) => (
        <span
          style={{
            textDecoration: record.status === 'completed' ? 'line-through' : 'none',
            opacity: record.status === 'completed' ? 0.6 : 1,
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text, record) => (
        <span
          style={{
            opacity: record.status === 'completed' ? 0.6 : 1,
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      sorter: (a, b) => dayjs(a.dueDate).unix() - dayjs(b.dueDate).unix(),
      render: (date, record) => {
        const formattedDate = dayjs(date).format('DD/MM/YYYY')
        const isOverdue = dayjs(date).isBefore(dayjs(), 'day') && record.status === 'pending'

        return (
          <span
            style={{
              color: isOverdue ? '#ff4d4f' : undefined,
              fontWeight: isOverdue ? 'bold' : 'normal',
              opacity: record.status === 'completed' ? 0.6 : 1,
            }}
          >
            {formattedDate}
          </span>
        )
      },
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      filters: [
        { text: 'Low', value: 'low' },
        { text: 'Medium', value: 'medium' },
        { text: 'High', value: 'high' },
      ],
      onFilter: (value, record) => record.priority === value,
      sorter: (a, b) => {
        const priorityOrder = { low: 1, medium: 2, high: 3 }
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      },
      render: (priority: TaskPriority, record) => (
        <Tag
          color={priorityColors[priority]}
          style={{ opacity: record.status === 'completed' ? 0.6 : 1 }}
        >
          {priority.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Completed', value: 'completed' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status: TaskStatus) => (
        <Tag color={statusColors[status]}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => onEdit(record)} size="small">
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this task?"
            onConfirm={() => onDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />} size="small">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey="id"
      pagination={{
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} tasks`,
        pageSize: 10,
        showLessItems: true,
      }}
      scroll={{ x: 800 }}
      size="middle"
    />
  )
}
