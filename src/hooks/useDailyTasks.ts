import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface DailyTask {
  id: string
  task: string
  completed: boolean
  created_at?: string
  user_id?: string
}

const initialTasks: DailyTask[] = [
  { id: '1', task: '早晨日光暴露 5-10分钟', completed: false },
  { id: '2', task: 'All Ears English 影子跟读', completed: false },
  { id: '3', task: 'LeetCode 至少1题', completed: false },
  { id: '4', task: '投递 3-5 份简历', completed: false },
  { id: '5', task: 'Startup 90分钟', completed: false },
  { id: '6', task: 'YouTube无字幕 15分钟', completed: false },
  { id: '7', task: '21:00 手机充电在客厅', completed: false },
  { id: '8', task: 'Pastor书籍 30分钟', completed: false },
]

export function useDailyTasks() {
  const [tasks, setTasks] = useState<DailyTask[]>(initialTasks)
  const [loading, setLoading] = useState(true)

  // Load tasks from Supabase
  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('daily_tasks')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error loading tasks:', error)
        // Use initial tasks as fallback
        setTasks(initialTasks)
      } else if (data && data.length > 0) {
        setTasks(data)
      } else {
        // No custom tasks found, insert initial tasks
        await initializeDefaultTasks()
      }
    } catch (error) {
      console.error('Error loading tasks:', error)
      setTasks(initialTasks)
    } finally {
      setLoading(false)
    }
  }

  const initializeDefaultTasks = async () => {
    try {
      const { error } = await supabase
        .from('daily_tasks')
        .insert(initialTasks)

      if (!error) {
        setTasks(initialTasks)
      }
    } catch (error) {
      console.error('Error initializing tasks:', error)
    }
  }

  const addTask = async (taskText: string) => {
    const newTask: DailyTask = {
      id: crypto.randomUUID(),
      task: taskText,
      completed: false,
    }

    try {
      const { error } = await supabase
        .from('daily_tasks')
        .insert([newTask])

      if (error) {
        console.error('Error adding task:', error)
        // Add locally as fallback
        setTasks(prev => [...prev, newTask])
      } else {
        setTasks(prev => [...prev, newTask])
      }
    } catch (error) {
      console.error('Error adding task:', error)
      setTasks(prev => [...prev, newTask])
    }
  }

  const updateTask = async (taskId: string, updates: Partial<DailyTask>) => {
    try {
      const { error } = await supabase
        .from('daily_tasks')
        .update(updates)
        .eq('id', taskId)

      if (error) {
        console.error('Error updating task:', error)
      }
      
      // Update locally regardless
      setTasks(prev =>
        prev.map(task =>
          task.id === taskId ? { ...task, ...updates } : task
        )
      )
    } catch (error) {
      console.error('Error updating task:', error)
      setTasks(prev =>
        prev.map(task =>
          task.id === taskId ? { ...task, ...updates } : task
        )
      )
    }
  }

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('daily_tasks')
        .delete()
        .eq('id', taskId)

      if (error) {
        console.error('Error deleting task:', error)
      }

      // Remove locally regardless
      setTasks(prev => prev.filter(task => task.id !== taskId))
    } catch (error) {
      console.error('Error deleting task:', error)
      setTasks(prev => prev.filter(task => task.id !== taskId))
    }
  }

  const toggleTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (task) {
      updateTask(taskId, { completed: !task.completed })
    }
  }

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    refreshTasks: loadTasks
  }
}