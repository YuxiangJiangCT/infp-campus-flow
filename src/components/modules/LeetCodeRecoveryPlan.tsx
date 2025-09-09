import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { 
  Calendar, 
  Clock, 
  Target, 
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Zap,
  Brain
} from 'lucide-react';
import { getNYDate } from '@/utils/timezone';

interface DayTask {
  id: string;
  description: string;
  time: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  completed: boolean;
  leetcodeNumber?: string;
}

interface RecoveryDay {
  day: number;
  title: string;
  focus: string;
  duration: string;
  tasks: DayTask[];
  tips: string[];
}

const recoveryPlan: RecoveryDay[] = [
  {
    day: 1,
    title: "评估日",
    focus: "测试当前水平",
    duration: "2小时集中",
    tasks: [
      { 
        id: '1-1', 
        description: 'Easy热身: Two Sum #1', 
        time: '20min',
        difficulty: 'Easy',
        completed: false,
        leetcodeNumber: '1'
      },
      { 
        id: '1-2', 
        description: 'Medium测试: 3Sum #15', 
        time: '40min',
        difficulty: 'Medium',
        completed: false,
        leetcodeNumber: '15'
      },
      { 
        id: '1-3', 
        description: 'Medium测试: Number of Islands #200', 
        time: '40min',
        difficulty: 'Medium',
        completed: false,
        leetcodeNumber: '200'
      },
      { 
        id: '1-4', 
        description: '记录薄弱环节', 
        time: '20min',
        completed: false
      }
    ],
    tips: [
      "不要看答案，先自己做",
      "20分钟没思路就看提示",
      "30分钟还不会就看答案",
      "预期只做出1-2道是正常的！"
    ]
  },
  {
    day: 2,
    title: "基础复习 I",
    focus: "Array & HashMap",
    duration: "2小时",
    tasks: [
      { 
        id: '2-1', 
        description: 'Array经典: Container With Most Water #11', 
        time: '30min',
        difficulty: 'Medium',
        completed: false,
        leetcodeNumber: '11'
      },
      { 
        id: '2-2', 
        description: 'HashMap基础: Group Anagrams #49', 
        time: '30min',
        difficulty: 'Medium',
        completed: false,
        leetcodeNumber: '49'
      },
      { 
        id: '2-3', 
        description: '看以前的代码笔记', 
        time: '30min',
        completed: false
      },
      { 
        id: '2-4', 
        description: '1.5倍速看DFS recording', 
        time: '30min',
        completed: false
      }
    ],
    tips: [
      "重点是找回感觉",
      "看自己以前的代码很重要",
      "1.5倍速看视频，只看核心概念"
    ]
  },
  {
    day: 3,
    title: "基础复习 II",
    focus: "LinkedList & Stack/Queue",
    duration: "2小时",
    tasks: [
      { 
        id: '3-1', 
        description: 'LinkedList: Reverse Linked List #206', 
        time: '30min',
        difficulty: 'Easy',
        completed: false,
        leetcodeNumber: '206'
      },
      { 
        id: '3-2', 
        description: 'Stack: Valid Parentheses #20', 
        time: '30min',
        difficulty: 'Easy',
        completed: false,
        leetcodeNumber: '20'
      },
      { 
        id: '3-3', 
        description: 'Queue: Implement Stack using Queues #225', 
        time: '30min',
        difficulty: 'Easy',
        completed: false,
        leetcodeNumber: '225'
      },
      { 
        id: '3-4', 
        description: '继续看DFS recording', 
        time: '30min',
        completed: false
      }
    ],
    tips: [
      "这些都是基础中的基础",
      "必须100%掌握",
      "为后面的DFS打基础"
    ]
  },
  {
    day: 4,
    title: "Tree DFS - Day 1",
    focus: "二叉树DFS基础",
    duration: "2-3小时",
    tasks: [
      { 
        id: '4-1', 
        description: '背诵Tree DFS模板', 
        time: '15min',
        completed: false
      },
      { 
        id: '4-2', 
        description: 'Maximum Depth #104', 
        time: '30min',
        difficulty: 'Easy',
        completed: false,
        leetcodeNumber: '104'
      },
      { 
        id: '4-3', 
        description: 'Path Sum #112', 
        time: '30min',
        difficulty: 'Easy',
        completed: false,
        leetcodeNumber: '112'
      },
      { 
        id: '4-4', 
        description: 'Invert Binary Tree #226', 
        time: '30min',
        difficulty: 'Easy',
        completed: false,
        leetcodeNumber: '226'
      }
    ],
    tips: [
      "先背模板，再理解！",
      "这三道题必须熟练掌握",
      "Tree DFS是面试最常考的"
    ]
  },
  {
    day: 5,
    title: "Tree DFS - Day 2",
    focus: "二叉树DFS进阶",
    duration: "2-3小时",
    tasks: [
      { 
        id: '5-1', 
        description: 'Binary Tree Level Order #102', 
        time: '40min',
        difficulty: 'Medium',
        completed: false,
        leetcodeNumber: '102'
      },
      { 
        id: '5-2', 
        description: 'Validate BST #98', 
        time: '40min',
        difficulty: 'Medium',
        completed: false,
        leetcodeNumber: '98'
      },
      { 
        id: '5-3', 
        description: 'Lowest Common Ancestor #236', 
        time: '40min',
        difficulty: 'Medium',
        completed: false,
        leetcodeNumber: '236'
      }
    ],
    tips: [
      "Medium难度开始了",
      "不会就看答案，理解后重写",
      "重点是理解递归思路"
    ]
  },
  {
    day: 6,
    title: "Graph DFS - Day 1",
    focus: "图DFS基础",
    duration: "2-3小时",
    tasks: [
      { 
        id: '6-1', 
        description: '背诵Graph DFS模板', 
        time: '15min',
        completed: false
      },
      { 
        id: '6-2', 
        description: 'Number of Islands #200 (重做)', 
        time: '40min',
        difficulty: 'Medium',
        completed: false,
        leetcodeNumber: '200'
      },
      { 
        id: '6-3', 
        description: 'Clone Graph #133', 
        time: '40min',
        difficulty: 'Medium',
        completed: false,
        leetcodeNumber: '133'
      },
      { 
        id: '6-4', 
        description: 'Pacific Atlantic Water #417', 
        time: '45min',
        difficulty: 'Medium',
        completed: false,
        leetcodeNumber: '417'
      }
    ],
    tips: [
      "Graph比Tree稍难",
      "重点是visited数组的使用",
      "画图理解很重要"
    ]
  },
  {
    day: 7,
    title: "Graph DFS - Day 2 & 综合",
    focus: "图DFS进阶+总结",
    duration: "3小时",
    tasks: [
      { 
        id: '7-1', 
        description: 'Course Schedule #207', 
        time: '45min',
        difficulty: 'Medium',
        completed: false,
        leetcodeNumber: '207'
      },
      { 
        id: '7-2', 
        description: 'Word Search #79', 
        time: '45min',
        difficulty: 'Medium',
        completed: false,
        leetcodeNumber: '79'
      },
      { 
        id: '7-3', 
        description: '复习本周所有错题', 
        time: '60min',
        completed: false
      },
      { 
        id: '7-4', 
        description: '制定下周计划', 
        time: '30min',
        completed: false
      }
    ],
    tips: [
      "恭喜完成第一周！",
      "应该能做出50% Medium了",
      "下周开始可以加入DP和Hard"
    ]
  }
];

export function LeetCodeRecoveryPlan() {
  const [recoveryStartDate, setRecoveryStartDate] = useLocalStorage<string | null>('leetcodeRecoveryStartDate', null);
  const [dayProgress, setDayProgress] = useLocalStorage<Record<string, boolean>>('leetcodeRecoveryProgress', {});
  const [currentRecoveryDay, setCurrentRecoveryDay] = useState(1);
  const [showEmergencyHelp, setShowEmergencyHelp] = useState(false);

  useEffect(() => {
    if (recoveryStartDate) {
      const start = new Date(recoveryStartDate);
      const today = getNYDate();
      const daysPassed = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      setCurrentRecoveryDay(Math.min(daysPassed + 1, 7));
    }
  }, [recoveryStartDate]);

  const startRecoveryPlan = () => {
    const today = getNYDate().toISOString();
    setRecoveryStartDate(today);
    setDayProgress({});
    setCurrentRecoveryDay(1);
  };

  const resetRecoveryPlan = () => {
    setRecoveryStartDate(null);
    setDayProgress({});
    setCurrentRecoveryDay(1);
  };

  const toggleTask = (taskId: string) => {
    setDayProgress(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const getDayCompletion = (day: RecoveryDay) => {
    const completedTasks = day.tasks.filter(task => dayProgress[task.id]).length;
    return (completedTasks / day.tasks.length) * 100;
  };

  const getOverallProgress = () => {
    const totalTasks = recoveryPlan.flatMap(day => day.tasks).length;
    const completedTasks = Object.values(dayProgress).filter(Boolean).length;
    return (completedTasks / totalTasks) * 100;
  };

  const getRecoveryStatus = () => {
    const progress = getOverallProgress();
    if (progress < 20) return { text: "重启中", color: "text-yellow-500", icon: <Zap className="w-4 h-4" /> };
    if (progress < 50) return { text: "恢复中", color: "text-blue-500", icon: <TrendingUp className="w-4 h-4" /> };
    if (progress < 80) return { text: "渐入佳境", color: "text-green-500", icon: <Brain className="w-4 h-4" /> };
    return { text: "满血复活", color: "text-purple-500", icon: <CheckCircle2 className="w-4 h-4" /> };
  };

  const status = getRecoveryStatus();

  if (!recoveryStartDate) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            LeetCode 7天快速恢复计划
          </CardTitle>
          <CardDescription>
            专为有基础但需要快速恢复状态的你设计
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-semibold">你的优势：</p>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>有200道题基础（muscle memory还在）</li>
                    <li>报了班有recordings（资源齐全）</li>
                    <li>已经按分类做过（系统性基础）</li>
                  </ul>
                  <p className="font-semibold mt-3">时间窗口：2-3周必须恢复战斗力</p>
                </div>
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-7 gap-2">
              {recoveryPlan.map((day) => (
                <div key={day.day} className="text-center">
                  <div className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="text-lg font-bold">Day {day.day}</div>
                    <div className="text-xs text-muted-foreground mt-1">{day.title}</div>
                  </div>
                </div>
              ))}
            </div>

            <Button onClick={startRecoveryPlan} className="w-full" size="lg">
              <Zap className="w-4 h-4 mr-2" />
              开始7天恢复计划
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const todayPlan = recoveryPlan[currentRecoveryDay - 1] || recoveryPlan[6];

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Day {currentRecoveryDay} - {todayPlan.title}
            </CardTitle>
            <CardDescription className="mt-1">
              {todayPlan.focus} • {todayPlan.duration}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={`${status.color} flex items-center gap-1`}>
              {status.icon}
              {status.text}
            </Badge>
            <Button 
              variant="outline" 
              size="sm"
              onClick={resetRecoveryPlan}
            >
              重置
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>总体进度</span>
            <span className="font-medium">{Math.round(getOverallProgress())}%</span>
          </div>
          <Progress value={getOverallProgress()} className="h-2" />
        </div>

        {/* Today's Tasks */}
        <div className="space-y-3">
          <div className="font-medium flex items-center gap-2">
            <Clock className="w-4 h-4" />
            今日任务 ({todayPlan.tasks.filter(t => dayProgress[t.id]).length}/{todayPlan.tasks.length})
          </div>
          {todayPlan.tasks.map(task => (
            <div key={task.id} className="flex items-start gap-3 p-2 rounded hover:bg-muted/50">
              <Checkbox
                checked={dayProgress[task.id] || false}
                onCheckedChange={() => toggleTask(task.id)}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={dayProgress[task.id] ? 'line-through text-muted-foreground' : ''}>
                    {task.description}
                  </span>
                  {task.difficulty && (
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
                  )}
                  {task.leetcodeNumber && (
                    <a 
                      href={`https://leetcode.com/problems/${task.leetcodeNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-500 hover:underline"
                    >
                      LeetCode →
                    </a>
                  )}
                  <span className="text-xs text-muted-foreground">⏱️ {task.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tips */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <p className="font-semibold mb-2">今日提醒：</p>
              {todayPlan.tips.map((tip, index) => (
                <p key={index} className="text-sm">• {tip}</p>
              ))}
            </div>
          </AlertDescription>
        </Alert>

        {/* Emergency Help */}
        <div className="pt-2 border-t">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowEmergencyHelp(!showEmergencyHelp)}
          >
            <AlertCircle className="w-4 h-4 mr-2" />
            做不出来怎么办？
          </Button>
          
          {showEmergencyHelp && (
            <Alert className="mt-3">
              <AlertDescription>
                <div className="space-y-2 text-sm">
                  <p className="font-semibold">紧急处理方案：</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>20分钟没思路 → 看提示</li>
                    <li>30分钟还不会 → 直接看答案</li>
                    <li>看答案理解后 → 自己重写一遍</li>
                    <li>还是不懂 → 看你报的班的recording</li>
                    <li>用ChatGPT/Claude解释思路</li>
                  </ol>
                  <p className="text-xs text-muted-foreground mt-2">
                    记住：现在是恢复期，不是学习期。快速找回状态最重要！
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Week Progress Overview */}
        <div className="pt-2 border-t">
          <div className="text-sm font-medium mb-2">本周进度</div>
          <div className="grid grid-cols-7 gap-1">
            {recoveryPlan.map((day) => {
              const completion = getDayCompletion(day);
              const isCurrentDay = day.day === currentRecoveryDay;
              const isPastDay = day.day < currentRecoveryDay;
              
              return (
                <div 
                  key={day.day} 
                  className={`
                    p-2 rounded text-center text-xs
                    ${isCurrentDay ? 'ring-2 ring-primary' : ''}
                    ${completion === 100 ? 'bg-green-500/20' : 
                      completion > 0 ? 'bg-yellow-500/20' : 
                      isPastDay ? 'bg-red-500/20' : 'bg-muted/50'}
                  `}
                >
                  <div className="font-bold">D{day.day}</div>
                  <div className="text-[10px]">{Math.round(completion)}%</div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}