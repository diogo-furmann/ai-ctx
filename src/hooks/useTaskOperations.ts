import { useState } from 'react'
import { message } from 'antd'
import { taskService } from '../services/taskService'
import type { CreateTaskRequest, UpdateTaskRequest } from '../types/task'

export const useTaskOperations = () => {
  const [loading, setLoading] = useState(false)

  const createItem = async (data: CreateTaskRequest) => {
    setLoading(true)
    try {
      const result = await taskService.create(data)
      message.success('Task created successfully!')
      return result
    } catch (error) {
      message.error('Failed to create task')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateItem = async (id: string, data: UpdateTaskRequest) => {
    setLoading(true)
    try {
      const result = await taskService.update(id, data)
      message.success('Task updated successfully!')
      return result
    } catch (error) {
      message.error('Failed to update task')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const deleteItem = async (id: string) => {
    setLoading(true)
    try {
      await taskService.delete(id)
      message.success('Task deleted successfully!')
    } catch (error) {
      message.error('Failed to delete task')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const toggleComplete = async (id: string, currentStatus: 'pending' | 'completed') => {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending'
    return updateItem(id, { status: newStatus })
  }

  return { createItem, updateItem, deleteItem, toggleComplete, loading }
}
