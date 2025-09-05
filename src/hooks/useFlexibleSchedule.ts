import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { getNYDateString, getNYDayOfWeek } from '@/utils/timezone';

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
    "7:00-7:30": { title: "温柔唤醒期", description: "自然醒→床上冥想→感恩练习" },
    "7:30-8:00": { title: "晨间仪式", description: "户外散步→拉伸运动→激活身体" },
    "8:00-9:00": { title: "营养早餐&意图设定", description: "健康早餐→Pastor晨读→设定今日意图" },
    "9:00-10:30": { title: "创造力黄金时段", description: "最重要创造性工作→算法/系统设计" },
    "10:30-10:45": { title: "能量补充", description: "站立休息→补水→远眺放松" },
    "10:45-12:30": { title: "深度执行期", description: "编码实现→刷题练习→保持Flow" },
    "12:30-13:30": { title: "午餐&充电", description: "健康午餐→独处/轻社交→散步消化" },
    "13:30-14:00": { title: "NSDR深度放松", description: "20分钟意识放松→储备下午能量" },
    "14:00-16:00": { title: "结构化学习", description: "面试准备→技术学习→知识整理" },
    "16:00-16:30": { title: "运动激活", description: "中等强度运动→释放压力→重置大脑" },
    "16:30-18:00": { title: "项目开发/创作", description: "个人项目→创意实现→协作任务" },
    "18:00-19:00": { title: "灵活缓冲时间", description: "处理杂事→轻松学习→或纯放松" },
    "19:00-20:00": { title: "晚餐时光", description: "用心晚餐→完全放松→不想工作" },
    "20:00-21:00": { title: "Pastor深度阅读", description: "专注阅读→做笔记→写下感悟祷告" },
    "21:00-22:00": { title: "个人成长时间", description: "技术学习→创意写作→跟随兴趣" },
    "22:00-22:30": { title: "睡前仪式", description: "回顾计划→轻柔拉伸→准备睡眠" },
  },
  special: {
    "6:30-7:00": { title: "快速启动", description: "简化晨间例行→快速准备" },
    "7:00-9:00": { title: "高效早晨", description: "处理1-2件要事→预习课程" },
    "9:00-12:00": { title: "灵活工作块A", description: "根据精力安排→深度/浅层任务" },
    "12:00-13:00": { title: "午餐调整", description: "营养午餐→快速充电" },
    "13:00-16:00": { title: "灵活工作块B", description: "继续推进任务→保持节奏" },
    "16:00-16:20": { title: "转换准备", description: "快速晚餐→心理转换到学习模式" },
    "16:20-22:00": { title: "晚课专注", description: "专心听课→积极参与→做好笔记" },
    "22:00-23:00": { title: "快速恢复", description: "简单复盘→快速洗漱→放松入睡" },
  }
};

const getDefaultTimeBlocks = (isSpecialDay: boolean = false): FlexibleTimeBlock[] => {
  const templates = isSpecialDay ? defaultTaskTemplates.special : defaultTaskTemplates.normal;
  
  const normalBlocks = [
    { time: "7:00-7:30", defaultTask: templates["7:00-7:30"], assignedTasks: [] },
    { time: "7:30-8:00", defaultTask: templates["7:30-8:00"], assignedTasks: [] },
    { time: "8:00-9:00", defaultTask: templates["8:00-9:00"], assignedTasks: [] },
    { time: "9:00-10:30", defaultTask: templates["9:00-10:30"], assignedTasks: [] },
    { time: "10:30-10:45", defaultTask: templates["10:30-10:45"], assignedTasks: [] },
    { time: "10:45-12:30", defaultTask: templates["10:45-12:30"], assignedTasks: [] },
    { time: "12:30-13:30", defaultTask: templates["12:30-13:30"], assignedTasks: [] },
    { time: "13:30-14:00", defaultTask: templates["13:30-14:00"], assignedTasks: [] },
    { time: "14:00-16:00", defaultTask: templates["14:00-16:00"], assignedTasks: [] },
    { time: "16:00-16:30", defaultTask: templates["16:00-16:30"], assignedTasks: [] },
    { time: "16:30-18:00", defaultTask: templates["16:30-18:00"], assignedTasks: [] },
    { time: "18:00-19:00", defaultTask: templates["18:00-19:00"], assignedTasks: [] },
    { time: "19:00-20:00", defaultTask: templates["19:00-20:00"], assignedTasks: [] },
    { time: "20:00-21:00", defaultTask: templates["20:00-21:00"], assignedTasks: [] },
    { time: "21:00-22:00", defaultTask: templates["21:00-22:00"], assignedTasks: [] },
    { time: "22:00-22:30", defaultTask: templates["22:00-22:30"], assignedTasks: [] },
  ];

  const specialBlocks = [
    { time: "6:30-7:00", defaultTask: templates["6:30-7:00"], assignedTasks: [] },
    { time: "7:00-9:00", defaultTask: templates["7:00-9:00"], assignedTasks: [] },
    { time: "9:00-12:00", defaultTask: templates["9:00-12:00"], assignedTasks: [] },
    { time: "12:00-13:00", defaultTask: templates["12:00-13:00"], assignedTasks: [] },
    { time: "13:00-16:00", defaultTask: templates["13:00-16:00"], assignedTasks: [] },
    { time: "16:00-16:20", defaultTask: templates["16:00-16:20"], assignedTasks: [] },
    { time: "16:20-22:00", defaultTask: templates["16:20-22:00"], assignedTasks: [] },
    { time: "22:00-23:00", defaultTask: templates["22:00-23:00"], assignedTasks: [] },
  ];

  return isSpecialDay ? specialBlocks : normalBlocks;
};

const getTodayString = () => {
  return getNYDateString();
};

export function useFlexibleSchedule() {
  const today = getTodayString();
  const dayOfWeek = getNYDayOfWeek();
  const isSpecialDay = dayOfWeek === 2 || dayOfWeek === 4; // Tuesday or Thursday
  
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