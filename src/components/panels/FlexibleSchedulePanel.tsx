import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  DndContext, 
  DragEndEvent, 
  DragOverlay,
  DragStartEvent,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, Trash2, Edit2, GripVertical, Clock, CheckCircle2, Circle, X } from 'lucide-react';
import { useFlexibleSchedule, FlexibleTask } from '@/hooks/useFlexibleSchedule';

interface DraggableTaskProps {
  task: FlexibleTask;
  onToggle: () => void;
  onEdit: (content: string) => void;
  onDelete: () => void;
  isDragging?: boolean;
}

function DraggableTask({ task, onToggle, onEdit, onDelete, isDragging }: DraggableTaskProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(task.content);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  const handleSave = () => {
    if (editContent.trim()) {
      onEdit(editContent.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditContent(task.content);
    setIsEditing(false);
  };

  if (isDragging) {
    return (
      <div className="p-3 bg-primary/10 border-2 border-primary rounded-lg">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
          <span className="flex-1 text-sm">{task.content}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group p-3 bg-background rounded-lg border hover:shadow-md transition-all ${
        task.status === 'completed' ? 'opacity-60' : ''
      }`}
    >
      {isEditing ? (
        <div className="flex items-center gap-2">
          <Input
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="flex-1 h-8"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') handleCancel();
            }}
            autoFocus
          />
          <Button size="sm" variant="ghost" onClick={handleSave}>
            <CheckCircle2 className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={handleCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab touch-none"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
          <Checkbox
            checked={task.status === 'completed'}
            onCheckedChange={onToggle}
          />
          <span 
            className={`flex-1 text-sm ${
              task.status === 'completed' ? 'line-through text-muted-foreground' : ''
            }`}
          >
            {task.content}
          </span>
          <div className="opacity-0 group-hover:opacity-100 flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 text-destructive"
              onClick={onDelete}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

interface TimeBlockDropZoneProps {
  timeBlock: {
    time: string;
    assignedTasks: FlexibleTask[];
  };
  onTasksReorder: (taskIds: string[]) => void;
  onUnassignTask: (taskId: string) => void;
  onToggleTask: (taskId: string) => void;
  onEditTask: (taskId: string, content: string) => void;
  onDeleteTask: (taskId: string) => void;
}

function TimeBlockDropZone({
  timeBlock,
  onTasksReorder,
  onUnassignTask,
  onToggleTask,
  onEditTask,
  onDeleteTask,
}: TimeBlockDropZoneProps) {
  const { setNodeRef } = useSortable({
    id: `timeblock-${timeBlock.time}`,
    data: { type: 'timeblock', time: timeBlock.time }
  });

  return (
    <div
      ref={setNodeRef}
      className="p-4 rounded-lg border bg-muted/20 hover:bg-muted/30 transition-colors min-h-[100px]"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <span className="font-semibold text-primary">{timeBlock.time}</span>
        </div>
        <Badge variant="secondary">
          {timeBlock.assignedTasks.length} 任务
        </Badge>
      </div>
      
      <div className="space-y-2">
        {timeBlock.assignedTasks.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center py-4">
            拖拽任务到这里
          </div>
        ) : (
          <SortableContext
            items={timeBlock.assignedTasks.map(t => t.id)}
            strategy={verticalListSortingStrategy}
          >
            {timeBlock.assignedTasks.map((task) => (
              <DraggableTask
                key={task.id}
                task={task}
                onToggle={() => onToggleTask(task.id)}
                onEdit={(content) => onEditTask(task.id, content)}
                onDelete={() => onDeleteTask(task.id)}
              />
            ))}
          </SortableContext>
        )}
      </div>
    </div>
  );
}

export function FlexibleSchedulePanel() {
  const {
    currentSchedule,
    addTask,
    assignTaskToTimeBlock,
    unassignTask,
    toggleTaskComplete,
    deleteTask,
    editTask,
    reorderTasksInBlock,
    clearTodaySchedule,
  } = useFlexibleSchedule();

  const [newTaskContent, setNewTaskContent] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showAddTask, setShowAddTask] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Check if dropping on a time block
    if (overId.startsWith('timeblock-')) {
      const timeBlock = overId.replace('timeblock-', '');
      assignTaskToTimeBlock(activeId, timeBlock);
    } else if (overId === 'unassigned-tasks') {
      // Find which timeblock the task is in and unassign it
      const sourceBlock = currentSchedule.timeBlocks.find(block =>
        block.assignedTasks.some(task => task.id === activeId)
      );
      if (sourceBlock) {
        unassignTask(activeId, sourceBlock.time);
      }
    } else {
      // Reordering within the same container
      const sourceBlock = currentSchedule.timeBlocks.find(block =>
        block.assignedTasks.some(task => task.id === activeId)
      );
      
      if (sourceBlock) {
        const taskIndex = sourceBlock.assignedTasks.findIndex(t => t.id === activeId);
        const overIndex = sourceBlock.assignedTasks.findIndex(t => t.id === overId);
        
        if (taskIndex !== overIndex) {
          const newOrder = arrayMove(
            sourceBlock.assignedTasks.map(t => t.id),
            taskIndex,
            overIndex
          );
          reorderTasksInBlock(sourceBlock.time, newOrder);
        }
      }
    }

    setActiveId(null);
  };

  const handleAddTask = () => {
    if (newTaskContent.trim()) {
      addTask(newTaskContent.trim());
      setNewTaskContent('');
      setShowAddTask(false);
    }
  };

  const activeTask = activeId
    ? currentSchedule.unassignedTasks.find(t => t.id === activeId) ||
      currentSchedule.timeBlocks.flatMap(b => b.assignedTasks).find(t => t.id === activeId)
    : null;

  const completedCount = [
    ...currentSchedule.unassignedTasks,
    ...currentSchedule.timeBlocks.flatMap(b => b.assignedTasks)
  ].filter(t => t.status === 'completed').length;

  const totalCount = currentSchedule.unassignedTasks.length + 
    currentSchedule.timeBlocks.reduce((sum, block) => sum + block.assignedTasks.length, 0);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">🎯 灵活计划模式</h2>
            <p className="text-sm text-muted-foreground mt-1">
              拖拽任务到时间段，自由安排你的一天
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-3 py-1">
              完成进度: {completedCount}/{totalCount} ({Math.round((completedCount/totalCount || 0) * 100)}%)
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={clearTodaySchedule}
            >
              清空计划
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Unassigned Tasks */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Circle className="h-5 w-5" />
                    待安排任务
                  </span>
                  <Button
                    size="sm"
                    onClick={() => setShowAddTask(!showAddTask)}
                  >
                    {showAddTask ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {showAddTask && (
                  <div className="flex gap-2 mb-4">
                    <Input
                      placeholder="输入任务内容..."
                      value={newTaskContent}
                      onChange={(e) => setNewTaskContent(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddTask();
                        if (e.key === 'Escape') {
                          setNewTaskContent('');
                          setShowAddTask(false);
                        }
                      }}
                      autoFocus
                    />
                    <Button onClick={handleAddTask} disabled={!newTaskContent.trim()}>
                      添加
                    </Button>
                  </div>
                )}
                
                <ScrollArea className="h-[400px]">
                  <div
                    id="unassigned-tasks"
                    className="space-y-2 min-h-[100px]"
                  >
                    {currentSchedule.unassignedTasks.length === 0 ? (
                      <div className="text-sm text-muted-foreground text-center py-8">
                        还没有任务，点击 + 添加
                      </div>
                    ) : (
                      <SortableContext
                        items={currentSchedule.unassignedTasks.map(t => t.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        {currentSchedule.unassignedTasks.map((task) => (
                          <DraggableTask
                            key={task.id}
                            task={task}
                            onToggle={() => toggleTaskComplete(task.id)}
                            onEdit={(content) => editTask(task.id, content)}
                            onDelete={() => deleteTask(task.id)}
                          />
                        ))}
                      </SortableContext>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Time Blocks */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  时间安排
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <div className="space-y-3">
                    {currentSchedule.timeBlocks.map((block) => (
                      <TimeBlockDropZone
                        key={block.time}
                        timeBlock={block}
                        onTasksReorder={(taskIds) => reorderTasksInBlock(block.time, taskIds)}
                        onUnassignTask={(taskId) => unassignTask(taskId, block.time)}
                        onToggleTask={toggleTaskComplete}
                        onEditTask={editTask}
                        onDeleteTask={deleteTask}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeId && activeTask ? (
          <DraggableTask
            task={activeTask}
            onToggle={() => {}}
            onEdit={() => {}}
            onDelete={() => {}}
            isDragging
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}