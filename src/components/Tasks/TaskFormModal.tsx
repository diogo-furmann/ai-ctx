import React from 'react'
import { Modal } from 'antd'
import { TaskForm } from './TaskForm'
import type { TaskFormData } from '../../types/task'

interface TaskFormModalProps {
  open: boolean
  onCancel: () => void
  onSubmit: (values: TaskFormData) => Promise<void>
  initialValues?: Partial<TaskFormData>
  title: string
  loading?: boolean
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  open,
  onCancel,
  onSubmit,
  initialValues,
  title,
  loading = false,
}) => {
  const handleSubmit = async (values: TaskFormData) => {
    await onSubmit(values)
    onCancel() // Close modal on successful submit
  }

  return (
    <Modal
      title={title}
      open={open}
      onCancel={onCancel}
      footer={null} // Form handles its own submit button
      width={600}
      destroyOnClose // Reset form when modal closes
    >
      <TaskForm initialValues={initialValues} onSubmit={handleSubmit} loading={loading} />
    </Modal>
  )
}
