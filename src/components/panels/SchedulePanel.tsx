import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ScheduleBlock {
  time: string;
  title: string;
  tasks: string[];
}

const normalSchedule: ScheduleBlock[] = [
  {
    time: "7:30-8:00",
    title: "🌅 起床程序",
    tasks: [
      "7:30 起床→立即出门",
      "7:35-7:55 户外散步（小区2圈，1000步）+ All Ears English",
      "7:55-8:00 冷水洗脸"
    ]
  },
  {
    time: "8:00-9:00",
    title: "🍳 早餐+准备",
    tasks: [
      "8:00-8:30 早餐",
      "  - Tvorog 250g + 蜂蜜 + 核桃",
      "  - 黑面包2片 + 花生酱",
      "  - Kefir 400ml",
      "8:30-9:00 查看邮件+LinkedIn+今日规划"
    ]
  },
  {
    time: "9:00-12:00",
    title: "🧠 深度工作",
    tasks: [
      "9:00 第一杯咖啡（起床后90分钟）",
      "9:00-10:30 LeetCode",
      "  - 20分钟复习昨天题目",
      "  - 30分钟 Medium题1道",
      "  - 40分钟 Hard题或Medium题2道",
      "10:30-10:45 站立休息+喝水",
      "10:45-12:00 求职投递",
      "  - 研究5家公司（每家5分钟）",
      "  - 定制简历（每份10分钟）",
      "  - 投递5-8份"
    ]
  },
  {
    time: "12:00-13:00",
    title: "🍱 午餐",
    tasks: [
      "Pelmeni 25个 + Smetana + 酸黄瓜"
    ]
  },
  {
    time: "13:00-13:20",
    title: "😴 NSDR/Yoga Nidra",
    tasks: [
      "20分钟深度放松"
    ]
  },
  {
    time: "13:30-16:00",
    title: "💻 Startup开发",
    tasks: [
      "具体今日模块（在今日面板选择）"
    ]
  },
  {
    time: "16:00-17:00",
    title: "🏃 运动/课程准备",
    tasks: [
      "运动或准备晚上的课程"
    ]
  },
  {
    time: "17:00-19:00",
    title: "📚 课程或继续工作",
    tasks: [
      "上课或继续深度工作"
    ]
  },
  {
    time: "19:00-20:00",
    title: "🍽️ 晚餐",
    tasks: [
      "烤肉串1串 + 蔬菜沙拉"
    ]
  },
  {
    time: "20:00-21:00",
    title: "📖 The Prodigal God + 💡灯光调节",
    tasks: [
      "20:00 开始调暗灯光（关顶灯，只开暖光台灯）",
      "20:00-20:40 阅读20-25页（台灯下阅读）",
      "20:30 手机/电脑开启Night Shift最暖模式",
      "20:40-20:50 写margin notes",
      "20:50-21:00 写reflection笔记"
    ]
  },
  {
    time: "21:00-23:00",
    title: "🌙 睡前程序（渐进调暗）",
    tasks: [
      "21:00 深度调暗（只留一盏最暗的灯）",
      "21:00 手机充电仪式（放客厅最远处）",
      "21:30 热水澡（浴室用最暗光或蜡烛）",
      "22:00 睡眠模式（卧室只开床头小灯）",
      "22:30 躺床冥想（关掉所有灯）",
      "23:00 入睡"
    ]
  }
];

const specialSchedule: ScheduleBlock[] = [
  {
    time: "6:30-7:00",
    title: "⚡ 紧急起床",
    tasks: [
      "6:30 起床（提前1小时补偿）",
      "6:35-6:55 快速户外散步",
      "6:55-7:00 冷水洗脸"
    ]
  },
  {
    time: "7:00-9:00",
    title: "🚀 高效早晨",
    tasks: [
      "7:00-7:30 快速早餐",
      "7:30-9:00 完成所有重要任务",
      "  - LeetCode 1-2题",
      "  - 投递3份简历",
      "  - 回复重要邮件"
    ]
  },
  {
    time: "9:00-12:00",
    title: "🧠 继续深度工作",
    tasks: [
      "完成其他深度任务"
    ]
  },
  {
    time: "14:00-14:30",
    title: "⚡ Power nap",
    tasks: [
      "30分钟能量补充"
    ]
  },
  {
    time: "16:20-22:00",
    title: "🎓 晚课时间",
    tasks: [
      "周二：INFO 5920",
      "周四：TECH 5900"
    ]
  },
  {
    time: "22:30-23:30",
    title: "🌙 快速睡前",
    tasks: [
      "22:30 快速洗澡",
      "23:00 手机充电",
      "23:30 直接睡觉"
    ]
  }
];

export function SchedulePanel() {
  const [viewMode, setViewMode] = useState<'normal' | 'special'>('normal');
  const dayOfWeek = new Date().getDay();
  const isSpecialDay = dayOfWeek === 2 || dayOfWeek === 4; // Tuesday or Thursday
  
  useEffect(() => {
    if (isSpecialDay) {
      setViewMode('special');
    }
  }, [isSpecialDay]);
  
  const currentWeek = Math.ceil((new Date().getDate()) / 7);
  const weekPlan = currentWeek === 1 ? '7:30起床，23:00睡觉' : '7:15起床，22:45睡觉';
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">⏰ 作息安排</h2>
        <div className="text-sm text-muted-foreground">
          第{currentWeek}周方案：{weekPlan}
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant={viewMode === 'normal' ? 'default' : 'outline'}
          onClick={() => setViewMode('normal')}
        >
          正常作息（周一/三/五/末）
        </Button>
        <Button 
          variant={viewMode === 'special' ? 'default' : 'outline'}
          onClick={() => setViewMode('special')}
        >
          晚课作息（周二/四）
        </Button>
      </div>
      
      {isSpecialDay && (
        <div className="alert-warning">
          <strong>今日提醒：</strong>今天有晚课，已自动切换到特殊作息时间轴
        </div>
      )}

      <div className="space-y-4">
        {viewMode === 'normal' ? (
          <>
            <h3 className="text-xl font-semibold text-primary">正常日作息（周一/三/五/末）</h3>
            {normalSchedule.map((block, index) => (
              <Card key={index} className="gradient-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {block.title}
                  </CardTitle>
                  <div className="text-sm text-muted-foreground">{block.time}</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {block.tasks.map((task, taskIndex) => (
                      <li key={taskIndex} className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <>
            <h3 className="text-xl font-semibold text-destructive">周二/周四晚课特殊作息</h3>
            {specialSchedule.map((block, index) => (
              <Card key={index} className="gradient-card border-destructive/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {block.title}
                  </CardTitle>
                  <div className="text-sm text-muted-foreground">{block.time}</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {block.tasks.map((task, taskIndex) => (
                      <li key={taskIndex} className="flex items-start gap-2">
                        <span className="text-destructive">•</span>
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </div>
    </div>
  );
}