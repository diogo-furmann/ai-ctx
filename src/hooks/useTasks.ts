import { useState, useEffect, useCallback } from 'react'
import { taskService } from '../services/taskService'
import type { Task } from '../types/task'

interface UseApiDataOptions {
  enabled?: boolean
  refetchInterval?: number
}

export const useTasks = (options: UseApiDataOptions = { enabled: true }) => {
  const [data, setData] = useState<Task[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    if (!options.enabled) return

    setLoading(true)
    setError(null)

    try {
      const response = await taskService.getAll()
      setData(response.data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tasks'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [options.enabled])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (options.refetchInterval) {
      const interval = setInterval(fetchData, options.refetchInterval)
      return () => clearInterval(interval)
    }
  }, [fetchData, options.refetchInterval])

  return { data, loading, error, refetch: fetchData }
}
