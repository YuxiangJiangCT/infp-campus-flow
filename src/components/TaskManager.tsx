import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Trash2, Edit2, Plus, X } from 'lucide-react'
import { useDailyTasks, DailyTask } from '@/hooks/useDailyTasks'

export function TaskManager() {
  const { tasks, loading, addTask, updateTask, deleteTask, toggleTask } = useDailyTasks()
  const [newTaskText, setNewTaskText] = useState('')
  const [editingTask, setEditingTask] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newTaskText.trim()) {
      await addTask(newTaskText.trim())
      setNewTaskText('')
      setShowAddForm(false)
    }
  }

  const handleEditTask = async (taskId: string) => {
    if (editText.trim()) {
      await updateTask(taskId, { task: editText.trim() })
      setEditingTask(null)
      setEditText('')
    }
  }

  const startEditing = (task: DailyTask) => {
    setEditingTask(task.id)
    setEditText(task.task)
  }

  const cancelEditing = () => {
    setEditingTask(null)
    setEditText('')
  }

  if (loading) {
    return (
      <Card className="gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            ✅ 今日必做
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">加载中...</div>
        </CardContent>
      </Card>
    )
  }

  const completedCount = tasks.filter(task => task.completed).length
  const progressPercentage = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0

  return (
    <Card className="gradient-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            ✅ 今日必做
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-normal text-muted-foreground">
              {completedCount}/{tasks.length} ({Math.round(progressPercentage)}%)
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowAddForm(!showAddForm)}
              className="hover:bg-primary hover:text-primary-foreground"
            >
              {showAddForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {showAddForm && (
          <form onSubmit={handleAddTask} className="flex gap-2">
            <Input
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              placeholder="添加新任务..."
              className="flex-1"
              autoFocus
            />
            <Button type="submit" size="sm" disabled={!newTaskText.trim()}>
              添加
            </Button>
          </form>
        )}

        {tasks.map((task) => (
          <div 
            key={task.id} 
            className="flex items-center gap-3 p-3 bg-background rounded-lg hover:bg-muted/50 transition-colors group"
          >
            <Checkbox 
              checked={task.completed}
              onCheckedChange={() => toggleTask(task.id)}
            />
            
            {editingTask === task.id ? (
              <div className="flex-1 flex gap-2">
                <Input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleEditTask(task.id)
                    } else if (e.key === 'Escape') {
                      cancelEditing()
                    }
                  }}
                  autoFocus
                />
                <Button
                  size="sm"
                  onClick={() => handleEditTask(task.id)}
                  disabled={!editText.trim()}
                >
                  保存
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={cancelEditing}
                >
                  取消
                </Button>
              </div>
            ) : (
              <>
                <span 
                  className={`flex-1 cursor-pointer ${
                    task.completed ? 'line-through text-muted-foreground' : ''
                  }`}
                  onClick={() => toggleTask(task.id)}
                >
                  {task.task}
                </span>
                
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => startEditing(task)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteTask(task.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}

        {tasks.length === 0 && (
          <div className="text-center text-muted-foreground py-4">
            还没有任务，点击 + 添加第一个任务
          </div>
        )}
      </CardContent>
    </Card>
  )
}