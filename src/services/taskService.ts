import type { Task, CreateTaskRequest, UpdateTaskRequest } from '../types/task'
import dayjs from 'dayjs'

const STORAGE_KEY = 'tasks'

// Generate unique ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

// Get all tasks from localStorage
const getAllTasks = (): Task[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.warn('Failed to read tasks from localStorage:', error)
    return []
  }
}

// Save tasks to localStorage
const saveTasks = (tasks: Task[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch (error) {
    console.warn('Failed to save tasks to localStorage:', error)
  }
}

export const taskService = {
  async getAll(): Promise<{ data: Task[] }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100))
    return { data: getAllTasks() }
  },

  async getById(id: string): Promise<{ data: Task }> {
    await new Promise((resolve) => setTimeout(resolve, 100))
    const tasks = getAllTasks()
    const task = tasks.find((t) => t.id === id)
    if (!task) {
      throw new Error('Task not found')
    }
    return { data: task }
  },

  async create(data: CreateTaskRequest): Promise<{ data: Task }> {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const tasks = getAllTasks()
    const now = dayjs().toISOString()

    const newTask: Task = {
      id: generateId(),
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      priority: data.priority,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    }

    const updatedTasks = [...tasks, newTask]
    saveTasks(updatedTasks)

    return { data: newTask }
  },

  async update(id: string, data: UpdateTaskRequest): Promise<{ data: Task }> {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const tasks = getAllTasks()
    const taskIndex = tasks.findIndex((t) => t.id === id)

    if (taskIndex === -1) {
      throw new Error('Task not found')
    }

    const updatedTask: Task = {
      ...tasks[taskIndex],
      ...data,
      updatedAt: dayjs().toISOString(),
    }

    tasks[taskIndex] = updatedTask
    saveTasks(tasks)

    return { data: updatedTask }
  },

  async delete(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const tasks = getAllTasks()
    const filteredTasks = tasks.filter((t) => t.id !== id)
    saveTasks(filteredTasks)
  },
}
