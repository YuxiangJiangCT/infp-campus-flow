import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { LeetCodeRecoveryPlan } from './LeetCodeRecoveryPlan';
import { LeetCodeTemplates } from './LeetCodeTemplates';
import { LeetCodeHighFrequency } from './LeetCodeHighFrequency';
import { 
  Zap, 
  BookOpen, 
  Target,
  Brain,
  AlertCircle
} from 'lucide-react';

interface LeetCodeTask {
  id: string;
  task: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  time: string;
  completed: boolean;
  tags?: string[];
}

const weekFocus = {
  1: { focus: 'Arrays + Strings', tags: ['#Array', '#String', '#TwoPointers'] },
  2: { focus: 'Trees + Graphs + DP', tags: ['#Tree', '#Graph', '#DynamicProgramming'] }
};

export function LeetCodeModule() {
  const currentWeek = Math.ceil((new Date().getDate()) / 7);
  const weekInfo = currentWeek === 1 ? weekFocus[1] : weekFocus[2];
  const [isRecoveryMode, setIsRecoveryMode] = useLocalStorage('leetcodeRecoveryMode', false);
  const [activeTab, setActiveTab] = useState<'daily' | 'recovery' | 'templates' | 'highfreq'>('recovery');
  
  const [tasks, setTasks] = useLocalStorage<LeetCodeTask[]>('leetcodeTasks', [
    { 
      id: '1', 
      task: '复习：昨天错题重做', 
      difficulty: 'Easy',
      time: '20min',
      completed: false 
    },
    { 
      id: '2', 
      task: '热身：Easy题1道', 
      difficulty: 'Easy',
      time: '15min',
      completed: false 
    },
    { 
      id: '3', 
      task: '主攻：Medium题1道', 
      difficulty: 'Medium',
      time: '30min',
      completed: false 
    },
    { 
      id: '4', 
      task: '挑战：Hard题1道 / Medium题2道', 
      difficulty: 'Hard',
      time: '40min',
      completed: false 
    },
    { 
      id: '5', 
      task: '总结：记录解题思路', 
      difficulty: 'Easy',
      time: '10min',
      completed: false 
    }
  ]);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = (completedCount / tasks.length) * 100;

  if (isRecoveryMode) {
    return (
      <div className="space-y-4">
        <Alert>
          <Zap className="h-4 w-4" />
          <AlertDescription>
            <div className="flex justify-between items-center">
              <span className="font-semibold">恢复模式已激活！专注于7天快速恢复计划</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsRecoveryMode(false)}
              >
                退出恢复模式
              </Button>
            </div>
          </AlertDescription>
        </Alert>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="recovery">
              <Zap className="w-4 h-4 mr-1" />
              恢复计划
            </TabsTrigger>
            <TabsTrigger value="templates">
              <BookOpen className="w-4 h-4 mr-1" />
              模板库
            </TabsTrigger>
            <TabsTrigger value="highfreq">
              <Target className="w-4 h-4 mr-1" />
              高频题
            </TabsTrigger>
            <TabsTrigger value="daily">
              <Brain className="w-4 h-4 mr-1" />
              日常任务
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recovery" className="mt-4">
            <LeetCodeRecoveryPlan />
          </TabsContent>

          <TabsContent value="templates" className="mt-4">
            <LeetCodeTemplates />
          </TabsContent>

          <TabsContent value="highfreq" className="mt-4">
            <LeetCodeHighFrequency />
          </TabsContent>

          <TabsContent value="daily" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>💻 今日常规任务</span>
                  <Badge variant={progress === 100 ? 'default' : 'secondary'}>
                    {completedCount}/{tasks.length}
                  </Badge>
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
                          <Badge 
                            variant={
                              task.difficulty === 'Easy' ? 'outline' : 
                              task.difficulty === 'Medium' ? 'secondary' : 
                              'destructive'
                            }
                            className="text-xs"
                          >
                            {task.difficulty}
                          </Badge>
                          <span className="text-xs text-muted-foreground">⏱️ {task.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <span>💻 LeetCode任务分解</span>
            <Badge variant={progress === 100 ? 'default' : 'secondary'}>
              {completedCount}/{tasks.length}
            </Badge>
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsRecoveryMode(true)}
            className="flex items-center gap-1"
          >
            <Zap className="w-4 h-4" />
            激活恢复模式
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          本周重点：{weekInfo.focus}
        </div>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <span className="font-semibold">提醒：</span>
            你有200道题基础，建议激活"恢复模式"使用7天快速恢复计划！
          </AlertDescription>
        </Alert>

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
                  <Badge 
                    variant={
                      task.difficulty === 'Easy' ? 'outline' : 
                      task.difficulty === 'Medium' ? 'secondary' : 
                      'destructive'
                    }
                    className="text-xs"
                  >
                    {task.difficulty}
                  </Badge>
                  <span className="text-xs text-muted-foreground">⏱️ {task.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <div className="flex flex-wrap gap-1">
            {weekInfo.tags.map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="mt-4">
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}