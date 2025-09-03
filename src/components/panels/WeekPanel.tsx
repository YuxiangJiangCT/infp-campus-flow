import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WeekPlan {
  week: number;
  title: string;
  wakeTime: string;
  sleepTime: string;
  goals: string[];
  isCurrent?: boolean;
  isCompleted?: boolean;
  highlight?: string;
}

const weekPlans: WeekPlan[] = [
  {
    week: 1,
    title: "建立基础",
    wakeTime: "9:30（固定）",
    sleepTime: "00:00",
    goals: [
      "21:00手机放客厅",
      "固定作息时间",
      "每日All Ears English",
      "投递5份简历/天"
    ],
    isCurrent: true,
    highlight: "本周重点：建立习惯，不求完美"
  },
  {
    week: 2,
    title: "小步前移",
    wakeTime: "9:15（-15分钟）",
    sleepTime: "23:45",
    goals: [
      "必须出门10分钟",
      "14:00后禁咖啡",
      "Focus模式设置",
      "晨间页面替代手机"
    ]
  },
  {
    week: 3,
    title: "关键跳跃",
    wakeTime: "8:30（-45分钟）",
    sleepTime: "23:15",
    goals: [
      "使用光疗灯",
      "9:30开始深度工作",
      "16:30固定运动",
      "LeetCode 2题/天"
    ]
  },
  {
    week: 4,
    title: "稳定目标",
    wakeTime: "7:00-7:30（目标）",
    sleepTime: "22:30-23:00",
    goals: [
      "自然醒来",
      "3小时深度工作",
      "每日5份简历",
      "完全掌控节奏"
    ]
  }
];

export function WeekPanel() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">📈 4周渐进计划</h2>
      
      <Card className="gradient-card">
        <CardHeader>
          <CardTitle>整体进度</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '25%' }}>
              第1周进行中
            </div>
          </div>
          <p className="text-muted-foreground mt-2">
            目标：从12点睡9:30起 → 11点睡7点起
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {weekPlans.map((plan) => (
          <Card 
            key={plan.week} 
            className={`gradient-card ${plan.isCurrent ? 'current' : ''} ${plan.isCompleted ? 'completed' : ''}`}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📅 第{plan.week}周：{plan.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p><strong>起床：</strong>{plan.wakeTime}</p>
                <p><strong>睡觉：</strong>{plan.sleepTime}</p>
              </div>
              
              <hr className="border-border" />
              
              <ul className="space-y-2">
                {plan.goals.map((goal, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="text-lg">
                      {plan.isCurrent ? '✅' : plan.isCompleted ? '✅' : '⭕'}
                    </span>
                    {goal}
                  </li>
                ))}
              </ul>
              
              {plan.highlight && (
                <div className="alert-warning">
                  <strong>注意：</strong>{plan.highlight}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}