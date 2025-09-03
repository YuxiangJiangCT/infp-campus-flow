import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LeetCodeModule } from '../modules/LeetCodeModule';
import { JobSearchModule } from '../modules/JobSearchModule';
import { StartupModule } from '../modules/StartupModule';
import { PastorBookModule } from '../modules/PastorBookModule';
import { TaskManager } from '../TaskManager';

interface TimeBlock {
  time: string;
  title: string;
  description: string;
  isCurrent?: boolean;
  isCompleted?: boolean;
}

const normalTimeBlocks: TimeBlock[] = [
  {
    time: "7:30-8:00",
    title: "起床程序",
    description: "起床→立即出门→户外散步(小区2圈)+All Ears English"
  },
  {
    time: "8:00-9:00",
    title: "早餐+准备",
    description: "Tvorog 250g + 蜂蜜核桃 + 黑面包 + Kefir 400ml"
  },
  {
    time: "9:00-12:00",
    title: "深度工作",
    description: "☕第一杯咖啡 → LeetCode → 求职投递"
  },
  {
    time: "12:00-13:00",
    title: "午餐",
    description: "Pelmeni 25个 + Smetana + 酸黄瓜"
  },
  {
    time: "13:00-13:20",
    title: "NSDR",
    description: "Yoga Nidra 深度放松"
  },
  {
    time: "13:30-16:00",
    title: "Startup开发",
    description: "今日模块开发（见下方选择）"
  },
  {
    time: "16:00-17:00",
    title: "运动/准备",
    description: "运动或课程准备"
  },
  {
    time: "17:00-19:00",
    title: "继续工作",
    description: "深度工作或上课"
  },
  {
    time: "19:00-20:00",
    title: "晚餐",
    description: "烤肉串1串 + 蔬菜沙拉"
  },
  {
    time: "20:00-21:00",
    title: "📖 Pastor书",
    description: "The Prodigal God 阅读+笔记"
  },
  {
    time: "21:00",
    title: "🔴 手机充电",
    description: "手机充电仪式→放客厅最远插座"
  },
  {
    time: "21:30-23:00",
    title: "睡前程序",
    description: "热水澡→调暗灯光→冥想→23:00入睡"
  }
];

const specialTimeBlocks: TimeBlock[] = [
  {
    time: "6:30-7:00",
    title: "⚡紧急起床",
    description: "起床→快速户外散步→冷水洗脸"
  },
  {
    time: "7:00-9:00",
    title: "高效早晨",
    description: "快速早餐→完成所有重要任务"
  },
  {
    time: "9:00-12:00",
    title: "深度工作",
    description: "LeetCode + 投简历 + 重要事项"
  },
  {
    time: "12:00-13:00",
    title: "午餐",
    description: "正常午餐"
  },
  {
    time: "14:00-14:30",
    title: "Power Nap",
    description: "30分钟能量补充"
  },
  {
    time: "16:20-22:00",
    title: "🎓 晚课",
    description: "周二:INFO 5920 / 周四:TECH 5900"
  },
  {
    time: "22:30-23:30",
    title: "快速睡前",
    description: "快速洗澡→手机充电→23:30睡觉"
  }
];

export function TodayPanel() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const dayOfWeek = currentTime.getDay();
  const isSpecialDay = dayOfWeek === 2 || dayOfWeek === 4;
  
  const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const dayName = dayNames[dayOfWeek];
  const wakeUpTime = isSpecialDay ? '6:30' : '7:30';
  const scheduleType = isSpecialDay ? '晚课日' : '正常日';
  
  const timeBlocks = isSpecialDay ? specialTimeBlocks : normalTimeBlocks;
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const getCurrentBlockIndex = () => {
    const now = currentTime.getHours() * 60 + currentTime.getMinutes();
    for (let i = 0; i < timeBlocks.length; i++) {
      const timeStr = timeBlocks[i].time.split('-')[0];
      const [hours, minutes] = timeStr.split(':').map(Number);
      const blockTime = hours * 60 + (minutes || 0);
      if (now < blockTime) {
        return Math.max(0, i - 1);
      }
    }
    return timeBlocks.length - 1;
  };

  const currentBlockIndex = getCurrentBlockIndex();

  return (
    <div className="space-y-6">
      {/* Header with day detection */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">📍 今日安排</h2>
        <div className="flex gap-2">
          <Badge variant="outline">
            今天是：{dayName}
          </Badge>
          <Badge variant={isSpecialDay ? "destructive" : "default"}>
            {scheduleType}
          </Badge>
          <Badge variant="secondary">
            起床：{wakeUpTime}
          </Badge>
        </div>
      </div>

      {/* Special day alert */}
      {isSpecialDay && (
        <div className="alert-warning">
          <strong>⚠️ 今晚有课：</strong>
          {dayOfWeek === 2 ? 'INFO 5920 到21:00+' : 'TECH 5900 到22:00'}
          <br />
          已切换到晚课特殊时间轴，记得6:30起床！
        </div>
      )}

      <div className="alert-urgent">
        <strong>🔴 今日最重要：</strong>
        晚上9点把手机充电在客厅！这是改变的第一步。
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timeline */}
        <Card className="gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ⏰ 今日时间轴
              {isSpecialDay && <Badge variant="destructive">晚课日</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {timeBlocks.map((block, index) => (
              <div 
                key={index} 
                className={`
                  p-3 rounded-lg border transition-all
                  ${index === currentBlockIndex 
                    ? 'bg-primary/10 border-primary' 
                    : index < currentBlockIndex 
                    ? 'opacity-50' 
                    : 'hover:bg-muted/50'
                  }
                `}
              >
                <div className="flex gap-4">
                  <span className="font-bold text-primary min-w-[100px]">
                    {block.time}
                  </span>
                  <div className="flex-1">
                    <div className="font-medium">{block.title}</div>
                    <div className="text-sm text-muted-foreground">{block.description}</div>
                  </div>
                  {index === currentBlockIndex && (
                    <Badge variant="default" className="animate-pulse">当前</Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Daily Tasks */}
        <div className="space-y-6">
          <TaskManager />
          
          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <div className="action-card">
              <div className="text-2xl mb-2">⏰</div>
              <div className="text-sm font-medium">设置21:00提醒</div>
            </div>
            <div className="action-card">
              <div className="text-2xl mb-2">⏱️</div>
              <div className="text-sm font-medium">开始深度工作</div>
            </div>
            <div className="action-card">
              <div className="text-2xl mb-2">🆘</div>
              <div className="text-sm font-medium">查看应急方案</div>
            </div>
            <div className="action-card">
              <div className="text-2xl mb-2">🍱</div>
              <div className="text-sm font-medium">今天吃什么</div>
            </div>
          </div>
        </div>
      </div>

      {/* Task Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <LeetCodeModule />
        <JobSearchModule />
        <StartupModule />
      </div>
      
      {/* Pastor Book Module */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PastorBookModule />
      </div>
    </div>
  );
}