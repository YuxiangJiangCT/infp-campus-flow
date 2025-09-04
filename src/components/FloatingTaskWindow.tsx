import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { X, Minimize2, Clock, Target, Coffee, BookOpen } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useFlexibleSchedule } from '@/hooks/useFlexibleSchedule';

interface TimeBlock {
  time: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
}

const normalTimeBlocks: TimeBlock[] = [
  { time: "7:30-8:00", title: "起床程序", description: "起床→户外散步", icon: <Clock className="h-4 w-4" /> },
  { time: "8:00-9:00", title: "早餐+准备", description: "Tvorog+蜂蜜核桃", icon: <Coffee className="h-4 w-4" /> },
  { time: "9:00-12:00", title: "深度工作", description: "LeetCode→求职", icon: <Target className="h-4 w-4" /> },
  { time: "12:00-13:00", title: "午餐", description: "Pelmeni 25个", icon: <Coffee className="h-4 w-4" /> },
  { time: "13:00-13:20", title: "NSDR", description: "Yoga Nidra", icon: <Clock className="h-4 w-4" /> },
  { time: "13:30-16:00", title: "Startup开发", description: "今日模块开发", icon: <Target className="h-4 w-4" /> },
  { time: "16:00-17:00", title: "运动/准备", description: "运动或课程准备", icon: <Clock className="h-4 w-4" /> },
  { time: "17:00-19:00", title: "继续工作", description: "深度工作或上课", icon: <Target className="h-4 w-4" /> },
  { time: "19:00-20:00", title: "晚餐", description: "烤肉串+沙拉", icon: <Coffee className="h-4 w-4" /> },
  { time: "20:00-21:00", title: "Pastor书", description: "Prodigal God", icon: <BookOpen className="h-4 w-4" /> },
  { time: "21:00", title: "手机充电", description: "放客厅最远插座", icon: <Clock className="h-4 w-4" /> },
  { time: "21:30-23:00", title: "睡前程序", description: "热水澡→冥想", icon: <Clock className="h-4 w-4" /> }
];

const specialTimeBlocks: TimeBlock[] = [
  { time: "6:30-7:00", title: "紧急起床", description: "起床→快速散步", icon: <Clock className="h-4 w-4" /> },
  { time: "7:00-9:00", title: "高效早晨", description: "快速早餐→重要任务", icon: <Target className="h-4 w-4" /> },
  { time: "9:00-12:00", title: "深度工作", description: "LeetCode+投简历", icon: <Target className="h-4 w-4" /> },
  { time: "12:00-13:00", title: "午餐", description: "正常午餐", icon: <Coffee className="h-4 w-4" /> },
  { time: "14:00-14:30", title: "Power Nap", description: "30分钟能量补充", icon: <Clock className="h-4 w-4" /> },
  { time: "16:20-22:00", title: "晚课", description: "INFO 5920/TECH 5900", icon: <BookOpen className="h-4 w-4" /> },
  { time: "22:30-23:30", title: "快速睡前", description: "快速洗澡→睡觉", icon: <Clock className="h-4 w-4" /> }
];

export function FloatingTaskWindow() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [scheduleMode] = useLocalStorage<'template' | 'flexible'>('scheduleMode', 'template');
  const [opacity, setOpacity] = useState(0.9);
  const [isMinimized, setIsMinimized] = useState(false);
  
  const { 
    getTodaySchedule,
    timeBlocks: flexibleTimeBlocks 
  } = useFlexibleSchedule();

  const dayOfWeek = currentTime.getDay();
  const isSpecialDay = dayOfWeek === 2 || dayOfWeek === 4;
  
  // Use template blocks or flexible blocks based on mode
  let timeBlocks = isSpecialDay ? specialTimeBlocks : normalTimeBlocks;
  
  if (scheduleMode === 'flexible') {
    const todaySchedule = getTodaySchedule();
    if (todaySchedule) {
      // Convert flexible schedule to display format
      timeBlocks = flexibleTimeBlocks.map((block, index) => {
        const tasks = todaySchedule.timeBlocks[block.time]?.assignedTasks || [];
        const defaultTask = todaySchedule.timeBlocks[block.time]?.defaultTask;
        
        if (tasks.length > 0) {
          return {
            time: block.time,
            title: tasks[0].title,
            description: tasks.slice(1).map(t => t.title).join(', ') || tasks[0].description,
            icon: <Target className="h-4 w-4" />
          };
        } else if (defaultTask) {
          return {
            time: block.time,
            title: defaultTask.title,
            description: defaultTask.description,
            icon: <Clock className="h-4 w-4" />
          };
        } else {
          return {
            time: block.time,
            title: block.title,
            description: block.description,
            icon: <Clock className="h-4 w-4" />
          };
        }
      });
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const getCurrentBlock = () => {
    const now = currentTime.getHours() * 60 + currentTime.getMinutes();
    
    for (let i = 0; i < timeBlocks.length; i++) {
      const [startTime, endTime] = timeBlocks[i].time.split('-');
      const [startHour, startMin] = startTime.split(':').map(Number);
      const startMinutes = startHour * 60 + (startMin || 0);
      
      if (endTime) {
        const [endHour, endMin] = endTime.split(':').map(Number);
        const endMinutes = endHour * 60 + (endMin || 0);
        
        if (now >= startMinutes && now < endMinutes) {
          return timeBlocks[i];
        }
      } else {
        // Single time point (like 21:00 手机充电)
        if (i < timeBlocks.length - 1) {
          const nextBlock = timeBlocks[i + 1];
          const [nextStartTime] = nextBlock.time.split('-');
          const [nextHour, nextMin] = nextStartTime.split(':').map(Number);
          const nextMinutes = nextHour * 60 + (nextMin || 0);
          
          if (now >= startMinutes && now < nextMinutes) {
            return timeBlocks[i];
          }
        } else if (now >= startMinutes) {
          return timeBlocks[i];
        }
      }
    }
    
    // Return next block if no current block
    for (let i = 0; i < timeBlocks.length; i++) {
      const [startTime] = timeBlocks[i].time.split('-');
      const [startHour, startMin] = startTime.split(':').map(Number);
      const startMinutes = startHour * 60 + (startMin || 0);
      
      if (now < startMinutes) {
        return timeBlocks[i];
      }
    }
    
    return timeBlocks[0]; // Default to first block
  };

  const currentBlock = getCurrentBlock();
  
  // Get next block
  const currentIndex = timeBlocks.findIndex(b => b.time === currentBlock.time);
  const nextBlock = timeBlocks[currentIndex + 1] || timeBlocks[0];

  const handleClose = () => {
    if ((window as any).electronAPI) {
      (window as any).electronAPI.closeFloatingWindow();
    }
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
    if ((window as any).electronAPI) {
      (window as any).electronAPI.minimizeFloatingWindow();
    }
  };

  if (isMinimized) {
    return (
      <div 
        className="floating-window-mini"
        onClick={() => setIsMinimized(false)}
        style={{ opacity }}
      >
        <div className="flex items-center gap-2 p-2">
          <Clock className="h-4 w-4" />
          <span className="text-xs font-bold">
            {format(currentTime, 'HH:mm')}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="floating-window"
      style={{ opacity }}
    >
      {/* Header */}
      <div className="floating-header">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span className="text-xs font-bold">
            {format(currentTime, 'HH:mm')}
          </span>
          <span className="text-xs text-muted-foreground">
            {format(currentTime, 'EEE', { locale: zhCN })}
          </span>
        </div>
        <div className="flex gap-1">
          <button 
            onClick={handleMinimize}
            className="floating-btn"
          >
            <Minimize2 className="h-3 w-3" />
          </button>
          <button 
            onClick={handleClose}
            className="floating-btn"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Current Task */}
      <div className="floating-content">
        <div className="current-task">
          <div className="flex items-start gap-2">
            {currentBlock.icon}
            <div className="flex-1">
              <div className="task-time">{currentBlock.time}</div>
              <div className="task-title">{currentBlock.title}</div>
              <div className="task-desc">{currentBlock.description}</div>
            </div>
          </div>
        </div>

        {/* Next Task */}
        <div className="next-task">
          <div className="text-xs text-muted-foreground mb-1">下一个：</div>
          <div className="flex items-center gap-2">
            {nextBlock.icon}
            <div className="flex-1">
              <span className="text-xs font-medium">{nextBlock.time}</span>
              <span className="text-xs text-muted-foreground ml-2">{nextBlock.title}</span>
            </div>
          </div>
        </div>

        {/* Special Day Alert */}
        {isSpecialDay && (
          <div className="special-alert">
            <span className="text-xs">
              ⚠️ {dayOfWeek === 2 ? 'INFO 5920' : 'TECH 5900'} 晚课日
            </span>
          </div>
        )}
      </div>

      {/* Opacity Control */}
      <div className="opacity-control">
        <input
          type="range"
          min="30"
          max="100"
          value={opacity * 100}
          onChange={(e) => setOpacity(Number(e.target.value) / 100)}
          className="opacity-slider"
        />
      </div>
    </div>
  );
}