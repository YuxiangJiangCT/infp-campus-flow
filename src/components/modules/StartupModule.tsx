import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface StartupTask {
  id: string;
  label: string;
  icon: string;
}

const taskOptions: StartupTask[] = [
  { id: 'frontend', label: '前端开发（React组件）', icon: '⚛️' },
  { id: 'backend', label: '后端API（Node.js）', icon: '🔧' },
  { id: 'database', label: '数据库设计', icon: '🗄️' },
  { id: 'bugfix', label: 'Bug修复', icon: '🐛' },
  { id: 'testing', label: '用户测试', icon: '🧪' },
  { id: 'docs', label: '文档撰写', icon: '📝' }
];

export function StartupModule() {
  const [selectedTask, setSelectedTask] = useLocalStorage('startupTask', 'frontend');
  const [specificTask, setSpecificTask] = useLocalStorage('startupSpecific', '');
  const [weekHours, setWeekHours] = useLocalStorage('startupWeekHours', 0);
  const weekTarget = 12;
  
  const selectedOption = taskOptions.find(t => t.id === selectedTask);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>🚀 Startup任务选择</span>
          <Badge variant={weekHours >= weekTarget ? 'default' : 'secondary'}>
            本周：{weekHours}/{weekTarget}小时
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedTask} onValueChange={setSelectedTask}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {taskOptions.map(option => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id} id={option.id} />
                <Label 
                  htmlFor={option.id} 
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <span>{option.icon}</span>
                  <span>{option.label}</span>
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
        
        <div className="mt-4 pt-4 border-t space-y-3">
          <div>
            <Label htmlFor="specific-task">今日具体任务</Label>
            <Input 
              id="specific-task"
              placeholder={`描述你要${selectedOption?.label}的具体内容...`}
              value={specificTask}
              onChange={(e) => setSpecificTask(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="outline">预计时间：2小时</Badge>
            {specificTask && (
              <span className="text-sm text-muted-foreground">
                当前任务：{specificTask}
              </span>
            )}
          </div>
        </div>
        
        <div className="mt-4">
          <div className="text-xs text-muted-foreground mb-1">周进度</div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${Math.min((weekHours / weekTarget) * 100, 100)}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}