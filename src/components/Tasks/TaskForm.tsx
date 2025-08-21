import React from 'react'
import { Form, Input, Button, DatePicker, Select } from 'antd'
import dayjs from 'dayjs'
import type { TaskFormData, TaskPriority } from '../../types/task'

const { TextArea } = Input
const { Option } = Select

interface TaskFormProps {
  initialValues?: Partial<TaskFormData>
  onSubmit: (values: TaskFormData) => Promise<void>
  loading?: boolean
}

export const TaskForm: React.FC<TaskFormProps> = ({ initialValues, onSubmit, loading = false }) => {
  const [form] = Form.useForm<TaskFormData>()

  const handleSubmit = async (values: TaskFormData) => {
    try {
      const formattedValues = {
        ...values,
        dueDate: values.dueDate ? dayjs(values.dueDate).toISOString() : dayjs().toISOString(),
      }
      await onSubmit(formattedValues)
      form.resetFields()
    } catch (error) {
      // Error handling is done in the hook
    }
  }

  const formatInitialValues = () => {
    if (!initialValues) return {}

    return {
      ...initialValues,
      dueDate: initialValues.dueDate ? dayjs(initialValues.dueDate) : undefined,
    }
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={formatInitialValues()}
    >
      <Form.Item
        name="title"
        label="Title"
        rules={[
          { required: true, message: 'Please enter a title!' },
          { min: 3, message: 'Title must be at least 3 characters!' },
          { max: 100, message: 'Title must be less than 100 characters!' },
        ]}
      >
        <Input placeholder="Enter task title" />
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
        rules={[
          { required: true, message: 'Please enter a description!' },
          { min: 10, message: 'Description must be at least 10 characters!' },
          { max: 500, message: 'Description must be less than 500 characters!' },
        ]}
      >
        <TextArea rows={4} placeholder="Enter task description" showCount maxLength={500} />
      </Form.Item>

      <Form.Item
        name="dueDate"
        label="Due Date"
        rules={[{ required: true, message: 'Please select a due date!' }]}
      >
        <DatePicker
          style={{ width: '100%' }}
          format="DD/MM/YYYY"
          placeholder="Select due date"
          disabledDate={(current) => current && current < dayjs().startOf('day')}
        />
      </Form.Item>

      <Form.Item
        name="priority"
        label="Priority"
        rules={[{ required: true, message: 'Please select a priority!' }]}
        initialValue="medium"
      >
        <Select placeholder="Select priority">
          <Option value="low">Low</Option>
          <Option value="medium">Medium</Option>
          <Option value="high">High</Option>
        </Select>
      </Form.Item>

      <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
        <Button type="primary" htmlType="submit" loading={loading}>
          {initialValues ? 'Update Task' : 'Create Task'}
        </Button>
      </Form.Item>
    </Form>
  )
}
