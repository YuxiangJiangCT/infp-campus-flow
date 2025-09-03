import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface JobTask {
  id: string;
  task: string;
  company?: string;
  time: string;
  completed: boolean;
}

export function JobSearchModule() {
  const [tasks, setTasks] = useLocalStorage<JobTask[]>('jobSearchTasks', [
    { id: '1', task: 'LinkedIn搜索（仅看24小时内）', time: '10min', completed: false },
    { id: '2', task: '研究公司1', company: '', time: '10min', completed: false },
    { id: '3', task: '研究公司2', company: '', time: '10min', completed: false },
    { id: '4', task: '研究公司3', company: '', time: '10min', completed: false },
    { id: '5', task: '定制简历关键词', time: '15min', completed: false },
    { id: '6', task: '投递+记录到表格', time: '15min', completed: false }
  ]);
  
  const [weekProgress, setWeekProgress] = useLocalStorage('weekJobProgress', 0);
  const weekTarget = 25;
  const todayTarget = 8;
  const todayCompleted = tasks.filter(t => t.completed).length;

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const updateCompany = (id: string, company: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, company } : task
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>🎯 求职任务具体化</span>
          <div className="flex gap-2">
            <Badge variant="outline">
              今日：{todayCompleted}/{todayTarget}份
            </Badge>
            <Badge variant={weekProgress >= weekTarget ? 'default' : 'secondary'}>
              本周：{weekProgress}/{weekTarget}份
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tasks.map(task => (
            <div 
              key={task.id} 
              className="flex items-start gap-3 p-2 rounded hover:bg-muted/50"
            >
              <Checkbox 
                checked={task.completed}
                onCheckedChange={() => toggleTask(task.id)}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={task.completed ? 'line-through text-muted-foreground' : ''}>
                    {task.task}
                  </span>
                  {task.company !== undefined && (
                    <Input 
                      placeholder="公司名"
                      value={task.company}
                      onChange={(e) => updateCompany(task.id, e.target.value)}
                      className="h-6 w-32 text-xs"
                    />
                  )}
                  <span className="text-xs text-muted-foreground">⏱️ {task.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            💡 提示：专注于24小时内发布的职位，提高回复率
          </div>
        </div>
        
        <div className="mt-4">
          <div className="text-xs text-muted-foreground mb-1">周进度</div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${Math.min((weekProgress / weekTarget) * 100, 100)}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}