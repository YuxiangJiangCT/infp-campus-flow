import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ScheduleBlock {
  time: string;
  title: string;
  tasks: string[];
}

const normalSchedule: ScheduleBlock[] = [
  {
    time: "7:00-9:00",
    title: "🌅 早晨启动",
    tasks: [
      "7:00 起床 → 立即喝水500ml",
      "7:05-7:15 户外日光（最重要！）",
      "7:15-7:30 All Ears English影子跟读",
      "7:30-8:30 早餐（不喝咖啡）",
      "8:30-9:00 研究目标公司+定制简历"
    ]
  },
  {
    time: "9:00-12:00",
    title: "🧠 深度工作",
    tasks: [
      "9:00 第一杯咖啡",
      "9:00-10:30 LeetCode 2-3题",
      "10:30-10:45 休息（站立/走动）",
      "10:45-11:30 投递3-5份精选简历",
      "11:30-12:00 Startup核心开发"
    ]
  },
  {
    time: "21:00-23:00",
    title: "🌙 睡前程序",
    tasks: [
      "21:00 手机充电在客厅（最关键！）",
      "21:00-21:30 INFP创意时光",
      "21:30 热水澡/泡脚",
      "22:00 调暗灯光，远离屏幕",
      "22:30 床上祷告/冥想",
      "23:00 熄灯入睡"
    ]
  }
];

export function SchedulePanel() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">⏰ 作息安排</h2>
      
      <div className="alert-warning">
        <strong>注意：</strong>周二、周四有晚课，作息会有调整
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-primary">周一/周三/周五（正常作息）</h3>
        
        <div className="space-y-4">
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
        </div>

        <h3 className="text-xl font-semibold text-destructive mt-8">周二/周四（晚课调整）</h3>
        <div className="alert-urgent">
          <strong>周二：</strong>INFO 5920 到21:00+<br />
          <strong>周四：</strong>TECH 5900 到22:00<br />
          <strong>对策：</strong>这两天接受晚睡，其他天补偿
        </div>
      </div>
    </div>
  );
}