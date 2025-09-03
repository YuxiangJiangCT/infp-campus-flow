import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReferralTrackingModule } from '../modules/ReferralTrackingModule';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface StatCard {
  value: string;
  label: string;
  color?: string;
}

const weeklyStats: StatCard[] = [
  { value: '20-25', label: '简历投递/周' },
  { value: '10-15', label: 'LeetCode题/周' },
  { value: '10-12h', label: 'Startup开发' },
  { value: '7h', label: '英语学习' },
  { value: '5h', label: '运动时间' },
  { value: '49-56h', label: '睡眠时间' },
];

interface WeeklyProgress {
  resumes: number;
  leetcode: number;
  phoneManagement: number;
}

export function StatsPanel() {
  const [weeklyProgress] = useLocalStorage<WeeklyProgress>('weeklyProgress', {
    resumes: 5,
    leetcode: 3,
    phoneManagement: 5
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">📊 每周目标统计</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {weeklyStats.map((stat, index) => (
          <Card key={index} className="gradient-card text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Referral Tracking Module */}
      <ReferralTrackingModule />

      <Card className="gradient-card">
        <CardHeader>
          <CardTitle>本周进度追踪</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <strong>简历投递：</strong>
              <span>{weeklyProgress.resumes}/25</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ 
                  width: `${(weeklyProgress.resumes / 25) * 100}%`,
                  background: 'linear-gradient(90deg, #3b82f6, #1d4ed8)'
                }}
              >
                {weeklyProgress.resumes}/25
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <strong>LeetCode：</strong>
              <span>{weeklyProgress.leetcode}/10</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ 
                  width: `${(weeklyProgress.leetcode / 10) * 100}%`,
                  background: 'var(--gradient-success)'
                }}
              >
                {weeklyProgress.leetcode}/10
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <strong>手机管理：</strong>
              <span>{weeklyProgress.phoneManagement}/7天成功</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ 
                  width: `${(weeklyProgress.phoneManagement / 7) * 100}%`,
                  background: 'var(--gradient-warning)'
                }}
              >
                {weeklyProgress.phoneManagement}/7天
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="alert-success">
        <strong>💪 记住：</strong>进步比完美更重要。即使只完成70%，也比0%好很多！
      </div>
    </div>
  );
}