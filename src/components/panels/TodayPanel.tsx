import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { JobApplicationModule } from '../modules/JobApplicationModule';
import { TaskManager } from '../TaskManager';

interface TimeBlock {
  time: string;
  title: string;
  description: string;
  isCurrent?: boolean;
  isCompleted?: boolean;
}


const timeBlocks: TimeBlock[] = [
  {
    time: "9:30",
    title: "起床程序",
    description: "不看手机 → 拉窗帘 → 喝水500ml"
  },
  {
    time: "9:45-10:00",
    title: "All Ears English",
    description: "影子跟读10-15分钟",
    isCurrent: true
  },
  {
    time: "11:00-14:00",
    title: "深度工作",
    description: "LeetCode 2题 + 投简历3份 + Startup"
  },
  {
    time: "12:00",
    title: "破禁食餐",
    description: "Tvorog 250g + 黑面包 + Kefir"
  },
  {
    time: "15:00",
    title: "午餐",
    description: "Pelmeni 25个 + Smetana"
  },
  {
    time: "16:30-17:30",
    title: "运动/课程",
    description: "根据今天课表调整"
  },
  {
    time: "21:00",
    title: "🔴 手机充电",
    description: "放客厅，开始无屏幕时间"
  },
  {
    time: "23:30",
    title: "睡眠准备",
    description: "热水澡 → 冥想 → 00:00躺床"
  }
];

export function TodayPanel() {

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">📍 今日安排</h2>
      </div>

      <div className="alert-urgent">
        <strong>🔴 今日最重要：</strong>
        晚上9点把手机充电在客厅！这是改变的第一步。
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline */}
        <div className="lg:col-span-2">
          <Card className="gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                ⏰ 时间轴（根据今天是周几自动调整）
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {timeBlocks.map((block, index) => (
                <div 
                  key={index} 
                  className={`time-block ${block.isCurrent ? 'current' : ''} ${block.isCompleted ? 'completed' : ''}`}
                >
                  <div className="flex gap-4">
                    <span className="font-bold text-primary min-w-[80px]">{block.time}</span>
                    <div>
                      <strong>{block.title}</strong>
                      <br />
                      <span className="text-muted-foreground">{block.description}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Tasks */}
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

      {/* Job Application Module */}
      <JobApplicationModule />
    </div>
  );
}