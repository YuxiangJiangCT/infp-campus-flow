import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface PhoneTask {
  id: string;
  time: string;
  task: string;
  isEssential: boolean;
  completed: boolean;
}

const eveningTasks: PhoneTask[] = [
  { id: 'e1', time: '20:30', task: '最后查看所有消息', isEssential: true, completed: false },
  { id: 'e2', time: '20:45', task: '清理通知红点', isEssential: true, completed: false },
  { id: 'e3', time: '20:50', task: '截图明日任务', isEssential: false, completed: false },
  { id: 'e4', time: '21:00', task: '对手机说"See you tomorrow"', isEssential: false, completed: false },
  { id: 'e5', time: '21:01', task: '充电在客厅最远插座', isEssential: true, completed: false },
  { id: 'e6', time: '21:02', task: '确认飞行模式', isEssential: true, completed: false }
];

const morningTasks: PhoneTask[] = [
  { id: 'm1', time: '7:30', task: '起床后不碰手机', isEssential: true, completed: false },
  { id: 'm2', time: '7:55', task: '完成户外散步', isEssential: true, completed: false },
  { id: 'm3', time: '8:30', task: '吃完早餐', isEssential: true, completed: false },
  { id: 'm4', time: '9:00', task: '9:00后才第一次查看', isEssential: true, completed: false }
];

export function PhoneManagementPanel() {
  const [eveningChecklist, setEveningChecklist] = useLocalStorage<PhoneTask[]>('phoneEvening', eveningTasks);
  const [morningChecklist, setMorningChecklist] = useLocalStorage<PhoneTask[]>('phoneMorning', morningTasks);
  const [consecutiveDays, setConsecutiveDays] = useLocalStorage('phoneConsecutiveDays', 0);
  const [screenTime, setScreenTime] = useLocalStorage('dailyScreenTime', 4.5);
  
  const toggleEveningTask = (id: string) => {
    setEveningChecklist(eveningChecklist.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };
  
  const toggleMorningTask = (id: string) => {
    setMorningChecklist(morningChecklist.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };
  
  const eveningProgress = eveningChecklist.filter(t => t.completed).length;
  const morningProgress = morningChecklist.filter(t => t.completed).length;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">📱 手机管理程序</h2>
        <div className="flex gap-2">
          <Badge variant={consecutiveDays > 7 ? "default" : "secondary"}>
            连续{consecutiveDays}天 🔥
          </Badge>
          <Badge variant={screenTime < 3 ? "default" : "destructive"}>
            日均屏幕{screenTime}小时
          </Badge>
        </div>
      </div>
      
      <div className="alert-warning">
        <strong>🎯 核心目标：</strong>
        晚9点手机充电在客厅，早9点前不碰手机。这是重夺生活控制权的关键！
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Evening Phone Detox */}
        <Card className="gradient-card">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              🌙 晚间手机断舍离
              <Badge variant="outline">{eveningProgress}/{eveningChecklist.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {eveningChecklist.map(task => (
                <div 
                  key={task.id}
                  className="flex items-start gap-3 p-2 rounded hover:bg-muted/50"
                >
                  <Checkbox 
                    checked={task.completed}
                    onCheckedChange={() => toggleEveningTask(task.id)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-primary">{task.time}</span>
                      <span className={task.completed ? 'line-through text-muted-foreground' : ''}>
                        {task.task}
                      </span>
                      {task.isEssential && (
                        <Badge variant="destructive" className="text-xs">必做</Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                💡 把充电器放在客厅最远的插座，增加取手机的难度
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Morning Phone Delay */}
        <Card className="gradient-card">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              🌅 早晨手机延迟
              <Badge variant="outline">{morningProgress}/{morningChecklist.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {morningChecklist.map(task => (
                <div 
                  key={task.id}
                  className="flex items-start gap-3 p-2 rounded hover:bg-muted/50"
                >
                  <Checkbox 
                    checked={task.completed}
                    onCheckedChange={() => toggleMorningTask(task.id)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-primary">{task.time}</span>
                      <span className={task.completed ? 'line-through text-muted-foreground' : ''}>
                        {task.task}
                      </span>
                      {task.isEssential && (
                        <Badge variant="destructive" className="text-xs">必做</Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                💡 早晨第一件事是出门，不是看手机
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Phone Usage Stats */}
      <Card>
        <CardHeader>
          <CardTitle>📊 手机使用统计</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="stat-card">
              <div className="text-3xl font-bold text-primary">{consecutiveDays}天</div>
              <div className="text-sm text-muted-foreground">连续21:00充电</div>
              <div className="w-full bg-secondary rounded-full h-2 mt-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${Math.min((consecutiveDays / 21) * 100, 100)}%` }}
                />
              </div>
            </div>
            
            <div className="stat-card">
              <div className="text-3xl font-bold text-primary">{screenTime}h</div>
              <div className="text-sm text-muted-foreground">今日屏幕时间</div>
              <div className={`text-xs mt-1 ${screenTime < 3 ? 'text-green-600' : 'text-destructive'}`}>
                目标：&lt;3小时
              </div>
            </div>
            
            <div className="stat-card">
              <div className="text-3xl font-bold text-primary">9:00</div>
              <div className="text-sm text-muted-foreground">首次查看时间</div>
              <div className="text-xs text-green-600 mt-1">保持良好！</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Tips */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>🚀 进阶技巧</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>把社交媒体app移到最后一屏，增加打开难度</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>关闭所有非必要通知，只保留电话和重要联系人</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>设置屏幕时间限制，每个app不超过30分钟</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>买一个传统闹钟，不用手机当闹钟</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}