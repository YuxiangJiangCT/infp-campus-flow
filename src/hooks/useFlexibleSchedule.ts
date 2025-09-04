import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

export interface FlexibleTask {
  id: string;
  content: string;
  timeBlock?: string;
  status: 'pending' | 'assigned' | 'completed';
  createdAt: string;
  order?: number;
}

export interface DefaultTask {
  title: string;
  description: string;
}

export interface FlexibleTimeBlock {
  time: string;
  defaultTask?: DefaultTask;
  assignedTasks: FlexibleTask[];
  isCompleted?: boolean;
}

export interface DailySchedule {
  date: string;
  timeBlocks: FlexibleTimeBlock[];
  unassignedTasks: FlexibleTask[];
}

// Default task templates for each time block
const defaultTaskTemplates = {
  normal: {
    "7:30-8:00": { title: "起床程序", description: "起床→户外散步→晨间例行" },
    "8:00-9:00": { title: "早餐+准备", description: "营养早餐→查看邮件→今日规划" },
    "9:00-12:00": { title: "深度工作", description: "重要任务→专注时间" },
    "12:00-13:00": { title: "午餐", description: "健康午餐+休息" },
    "13:00-13:20": { title: "NSDR", description: "午间深度放松" },
    "13:30-16:00": { title: "项目开发", description: "创造性工作时间" },
    "16:00-17:00": { title: "运动/活动", description: "身体锻炼或活动" },
    "17:00-19:00": { title: "继续工作", description: "次要任务处理" },
    "19:00-20:00": { title: "晚餐", description: "晚餐时间" },
    "20:00-21:00": { title: "学习阅读", description: "个人提升时间" },
    "21:00-23:00": { title: "睡前程序", description: "放松→准备休息" },
  },
  special: {
    "6:30-7:00": { title: "紧急起床", description: "快速起床→准备" },
    "7:00-9:00": { title: "高效早晨", description: "快速早餐→重要任务" },
    "9:00-12:00": { title: "深度工作", description: "集中处理重要事项" },
    "12:00-13:00": { title: "午餐", description: "快速午餐" },
    "14:00-14:30": { title: "Power Nap", description: "能量补充" },
    "16:20-22:00": { title: "晚课", description: "课程学习时间" },
    "22:30-23:30": { title: "快速睡前", description: "快速洗漱→休息" },
  }
};

const getDefaultTimeBlocks = (isSpecialDay: boolean = false): FlexibleTimeBlock[] => {
  const templates = isSpecialDay ? defaultTaskTemplates.special : defaultTaskTemplates.normal;
  
  const normalBlocks = [
    { time: "7:30-8:00", defaultTask: templates["7:30-8:00"], assignedTasks: [] },
    { time: "8:00-9:00", defaultTask: templates["8:00-9:00"], assignedTasks: [] },
    { time: "9:00-12:00", defaultTask: templates["9:00-12:00"], assignedTasks: [] },
    { time: "12:00-13:00", defaultTask: templates["12:00-13:00"], assignedTasks: [] },
    { time: "13:00-13:20", defaultTask: templates["13:00-13:20"], assignedTasks: [] },
    { time: "13:30-16:00", defaultTask: templates["13:30-16:00"], assignedTasks: [] },
    { time: "16:00-17:00", defaultTask: templates["16:00-17:00"], assignedTasks: [] },
    { time: "17:00-19:00", defaultTask: templates["17:00-19:00"], assignedTasks: [] },
    { time: "19:00-20:00", defaultTask: templates["19:00-20:00"], assignedTasks: [] },
    { time: "20:00-21:00", defaultTask: templates["20:00-21:00"], assignedTasks: [] },
    { time: "21:00-23:00", defaultTask: templates["21:00-23:00"], assignedTasks: [] },
  ];

  const specialBlocks = [
    { time: "6:30-7:00", defaultTask: templates["6:30-7:00"], assignedTasks: [] },
    { time: "7:00-9:00", defaultTask: templates["7:00-9:00"], assignedTasks: [] },
    { time: "9:00-12:00", defaultTask: templates["9:00-12:00"], assignedTasks: [] },
    { time: "12:00-13:00", defaultTask: templates["12:00-13:00"], assignedTasks: [] },
    { time: "14:00-14:30", defaultTask: templates["14:00-14:30"], assignedTasks: [] },
    { time: "16:20-22:00", defaultTask: templates["16:20-22:00"], assignedTasks: [] },
    { time: "22:30-23:30", defaultTask: templates["22:30-23:30"], assignedTasks: [] },
  ];

  return isSpecialDay ? specialBlocks : normalBlocks;
};

const getTodayString = () => {
  return new Date().toISOString().split('T')[0];
};

export function useFlexibleSchedule() {
  const today = getTodayString();
  const dayOfWeek = new Date().getDay();
  const isSpecialDay = dayOfWeek === 2 || dayOfWeek === 4;
  
  const [schedules, setSchedules] = useLocalStorage<Record<string, DailySchedule>>(
    'flexibleSchedules', 
    {}
  );

  const [currentSchedule, setCurrentSchedule] = useState<DailySchedule>(() => {
    if (schedules[today]) {
      return schedules[today];
    }
    return {
      date: today,
      timeBlocks: getDefaultTimeBlocks(isSpecialDay),
      unassignedTasks: []
    };
  });

  // Save current schedule to storage when it changes
  useEffect(() => {
    setSchedules(prev => ({
      ...prev,
      [today]: currentSchedule
    }));
  }, [currentSchedule, today, setSchedules]);

  // Add a new task to unassigned tasks
  const addTask = useCallback((content: string) => {
    const newTask: FlexibleTask = {
      id: crypto.randomUUID(),
      content,
      status: 'pending',
      createdAt: new Date().toISOString(),
      order: currentSchedule.unassignedTasks.length
    };

    setCurrentSchedule(prev => ({
      ...prev,
      unassignedTasks: [...prev.unassignedTasks, newTask]
    }));

    return newTask;
  }, [currentSchedule.unassignedTasks]);

  // Assign a task to a time block
  const assignTaskToTimeBlock = useCallback((taskId: string, timeBlock: string) => {
    setCurrentSchedule(prev => {
      const task = prev.unassignedTasks.find(t => t.id === taskId);
      if (!task) {
        // Check if task is already assigned to another block
        for (const block of prev.timeBlocks) {
          const existingTask = block.assignedTasks.find(t => t.id === taskId);
          if (existingTask) {
            // Remove from current block
            const updatedBlocks = prev.timeBlocks.map(b => {
              if (b.time === block.time) {
                return {
                  ...b,
                  assignedTasks: b.assignedTasks.filter(t => t.id !== taskId)
                };
              }
              if (b.time === timeBlock) {
                return {
                  ...b,
                  assignedTasks: [...b.assignedTasks, { ...existingTask, timeBlock, status: 'assigned' as const }]
                };
              }
              return b;
            });
            return { ...prev, timeBlocks: updatedBlocks };
          }
        }
        return prev;
      }

      // Remove from unassigned and add to time block
      const updatedTask: FlexibleTask = { ...task, timeBlock, status: 'assigned' };
      const updatedUnassigned = prev.unassignedTasks.filter(t => t.id !== taskId);
      const updatedBlocks = prev.timeBlocks.map(block => {
        if (block.time === timeBlock) {
          return {
            ...block,
            assignedTasks: [...block.assignedTasks, updatedTask]
          };
        }
        return block;
      });

      return {
        ...prev,
        unassignedTasks: updatedUnassigned,
        timeBlocks: updatedBlocks
      };
    });
  }, []);

  // Move task back to unassigned
  const unassignTask = useCallback((taskId: string, timeBlock: string) => {
    setCurrentSchedule(prev => {
      const block = prev.timeBlocks.find(b => b.time === timeBlock);
      if (!block) return prev;

      const task = block.assignedTasks.find(t => t.id === taskId);
      if (!task) return prev;

      const updatedTask: FlexibleTask = { ...task, timeBlock: undefined, status: 'pending' };
      const updatedBlocks = prev.timeBlocks.map(b => {
        if (b.time === timeBlock) {
          return {
            ...b,
            assignedTasks: b.assignedTasks.filter(t => t.id !== taskId)
          };
        }
        return b;
      });

      return {
        ...prev,
        unassignedTasks: [...prev.unassignedTasks, updatedTask],
        timeBlocks: updatedBlocks
      };
    });
  }, []);

  // Toggle task completion
  const toggleTaskComplete = useCallback((taskId: string) => {
    setCurrentSchedule(prev => {
      // Check in unassigned tasks
      const unassignedIndex = prev.unassignedTasks.findIndex(t => t.id === taskId);
      if (unassignedIndex !== -1) {
        const updatedTasks = [...prev.unassignedTasks];
        updatedTasks[unassignedIndex] = {
          ...updatedTasks[unassignedIndex],
          status: updatedTasks[unassignedIndex].status === 'completed' ? 'pending' : 'completed'
        };
        return { ...prev, unassignedTasks: updatedTasks };
      }

      // Check in time blocks
      const updatedBlocks = prev.timeBlocks.map(block => {
        const taskIndex = block.assignedTasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
          const updatedTasks = [...block.assignedTasks];
          updatedTasks[taskIndex] = {
            ...updatedTasks[taskIndex],
            status: updatedTasks[taskIndex].status === 'completed' ? 'assigned' : 'completed'
          };
          return { ...block, assignedTasks: updatedTasks };
        }
        return block;
      });

      return { ...prev, timeBlocks: updatedBlocks };
    });
  }, []);

  // Delete task
  const deleteTask = useCallback((taskId: string) => {
    setCurrentSchedule(prev => ({
      ...prev,
      unassignedTasks: prev.unassignedTasks.filter(t => t.id !== taskId),
      timeBlocks: prev.timeBlocks.map(block => ({
        ...block,
        assignedTasks: block.assignedTasks.filter(t => t.id !== taskId)
      }))
    }));
  }, []);

  // Edit task content
  const editTask = useCallback((taskId: string, newContent: string) => {
    setCurrentSchedule(prev => {
      // Check in unassigned tasks
      const updatedUnassigned = prev.unassignedTasks.map(t => 
        t.id === taskId ? { ...t, content: newContent } : t
      );

      // Check in time blocks
      const updatedBlocks = prev.timeBlocks.map(block => ({
        ...block,
        assignedTasks: block.assignedTasks.map(t => 
          t.id === taskId ? { ...t, content: newContent } : t
        )
      }));

      return {
        ...prev,
        unassignedTasks: updatedUnassigned,
        timeBlocks: updatedBlocks
      };
    });
  }, []);

  // Reorder tasks within a time block
  const reorderTasksInBlock = useCallback((timeBlock: string, taskIds: string[]) => {
    setCurrentSchedule(prev => {
      const updatedBlocks = prev.timeBlocks.map(block => {
        if (block.time === timeBlock) {
          const reorderedTasks = taskIds
            .map(id => block.assignedTasks.find(t => t.id === id))
            .filter(Boolean) as FlexibleTask[];
          return { ...block, assignedTasks: reorderedTasks };
        }
        return block;
      });
      return { ...prev, timeBlocks: updatedBlocks };
    });
  }, []);

  // Activate a default task (convert it to a real task)
  const activateDefaultTask = useCallback((timeBlock: string) => {
    setCurrentSchedule(prev => {
      const block = prev.timeBlocks.find(b => b.time === timeBlock);
      if (!block || !block.defaultTask) return prev;

      const newTask: FlexibleTask = {
        id: crypto.randomUUID(),
        content: `${block.defaultTask.title} - ${block.defaultTask.description}`,
        timeBlock,
        status: 'assigned',
        createdAt: new Date().toISOString(),
      };

      const updatedBlocks = prev.timeBlocks.map(b => {
        if (b.time === timeBlock) {
          return {
            ...b,
            assignedTasks: [...b.assignedTasks, newTask]
          };
        }
        return b;
      });

      return { ...prev, timeBlocks: updatedBlocks };
    });
  }, []);

  // Get schedule for a specific date
  const getScheduleForDate = useCallback((date: string) => {
    return schedules[date] || null;
  }, [schedules]);

  // Get all schedules (for history viewing)
  const getAllSchedules = useCallback(() => {
    return schedules;
  }, [schedules]);

  // Get schedules within a date range
  const getSchedulesInRange = useCallback((startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const result: Record<string, DailySchedule> = {};
    
    Object.entries(schedules).forEach(([date, schedule]) => {
      const scheduleDate = new Date(date);
      if (scheduleDate >= start && scheduleDate <= end) {
        result[date] = schedule;
      }
    });
    
    return result;
  }, [schedules]);

  // Get statistics for a schedule
  const getScheduleStats = useCallback((schedule: DailySchedule) => {
    const allTasks = [
      ...schedule.unassignedTasks,
      ...schedule.timeBlocks.flatMap(b => b.assignedTasks)
    ];
    const completedCount = allTasks.filter(t => t.status === 'completed').length;
    const totalCount = allTasks.length;
    const assignedCount = schedule.timeBlocks.reduce((sum, block) => sum + block.assignedTasks.length, 0);
    
    return {
      totalTasks: totalCount,
      completedTasks: completedCount,
      assignedTasks: assignedCount,
      unassignedTasks: schedule.unassignedTasks.length,
      completionRate: totalCount > 0 ? (completedCount / totalCount) * 100 : 0
    };
  }, []);

  // Clear all tasks for today
  const clearTodaySchedule = useCallback(() => {
    setCurrentSchedule({
      date: today,
      timeBlocks: getDefaultTimeBlocks(isSpecialDay),
      unassignedTasks: []
    });
  }, [today, isSpecialDay]);

  // Copy schedule from another date
  const copyScheduleFromDate = useCallback((fromDate: string) => {
    const sourceSchedule = schedules[fromDate];
    if (sourceSchedule) {
      const newSchedule = {
        date: today,
        timeBlocks: sourceSchedule.timeBlocks.map(block => ({
          ...block,
          assignedTasks: block.assignedTasks.map(task => ({
            ...task,
            id: crypto.randomUUID(),
            status: 'assigned' as const,
            createdAt: new Date().toISOString()
          }))
        })),
        unassignedTasks: sourceSchedule.unassignedTasks.map(task => ({
          ...task,
          id: crypto.randomUUID(),
          status: 'pending' as const,
          createdAt: new Date().toISOString()
        }))
      };
      setCurrentSchedule(newSchedule);
      // Also save to schedules immediately
      setSchedules(prev => ({
        ...prev,
        [today]: newSchedule
      }));
      return true;
    }
    return false;
  }, [schedules, today, setSchedules]);

  // Load schedule for a specific date (switch to viewing another date)
  const loadScheduleForDate = useCallback((date: string) => {
    const schedule = schedules[date];
    if (schedule) {
      return schedule;
    }
    // Return empty schedule for that date
    const dateObj = new Date(date);
    const dayOfWeek = dateObj.getDay();
    const isSpecialDayForDate = dayOfWeek === 2 || dayOfWeek === 4;
    return {
      date,
      timeBlocks: getDefaultTimeBlocks(isSpecialDayForDate),
      unassignedTasks: []
    };
  }, [schedules]);

  return {
    currentSchedule,
    addTask,
    assignTaskToTimeBlock,
    unassignTask,
    toggleTaskComplete,
    deleteTask,
    editTask,
    reorderTasksInBlock,
    activateDefaultTask,
    getScheduleForDate,
    getAllSchedules,
    getSchedulesInRange,
    getScheduleStats,
    loadScheduleForDate,
    clearTodaySchedule,
    copyScheduleFromDate,
    schedules,
    isSpecialDay,
    today
  };
}