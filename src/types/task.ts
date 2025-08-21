export type TaskStatus = 'pending' | 'completed'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  title: string
  description: string
  dueDate: string // ISO string for storage
  status: TaskStatus
  priority: TaskPriority
  createdAt: string
  updatedAt: string
}

export interface CreateTaskRequest {
  title: string
  description: string
  dueDate: string
  priority: TaskPriority
}

export interface UpdateTaskRequest {
  title?: string
  description?: string
  dueDate?: string
  status?: TaskStatus
  priority?: TaskPriority
}

export interface TaskFormData {
  title: string
  description: string
  dueDate: string
  priority: TaskPriority
}
