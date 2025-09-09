import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { 
  Target, 
  Zap,
  Trophy,
  Flame,
  HelpCircle,
  ChevronRight,
  Clock,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  Brain,
  Coffee
} from 'lucide-react';
import { getNYDate } from '@/utils/timezone';
import { toast } from 'sonner';

interface TodayProblem {
  id: string;
  number: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  timeEstimate: string;
  hint: string;
  template: string;
  leetcodeSlug: string;
  completed: boolean;
}

interface RecoveryPhase {
  name: string;
  description: string;
  icon: React.ReactNode;
  minDays: number;
  maxDays: number;
  problemPool: TodayProblem[];
}

const phases: RecoveryPhase[] = [
  {
    name: "评估阶段",
    description: "测试当前水平，找回手感",
    icon: <Target className="w-4 h-4" />,
    minDays: 1,
    maxDays: 2,
    problemPool: [
      {
        id: 'assess-1',
        number: '1',
        title: 'Two Sum',
        difficulty: 'Easy',
        category: 'Array',
        timeEstimate: '20min',
        hint: '用HashMap存储已遍历的数字和索引',
        template: 'HashMap一遍遍历',
        leetcodeSlug: 'two-sum',
        completed: false
      },
      {
        id: 'assess-2',
        number: '15',
        title: '3Sum',
        difficulty: 'Medium',
        category: 'Two Pointers',
        timeEstimate: '40min',
        hint: '先排序，固定一个数，剩下用双指针',
        template: '排序 + 双指针',
        leetcodeSlug: '3sum',
        completed: false
      },
      {
        id: 'assess-3',
        number: '200',
        title: 'Number of Islands',
        difficulty: 'Medium',
        category: 'DFS',
        timeEstimate: '40min',
        hint: 'DFS标记访问过的陆地为0',
        template: 'Grid DFS模板',
        leetcodeSlug: 'number-of-islands',
        completed: false
      },
      {
        id: 'assess-4',
        number: '20',
        title: 'Valid Parentheses',
        difficulty: 'Easy',
        category: 'Stack',
        timeEstimate: '15min',
        hint: '左括号入栈，右括号出栈匹配',
        template: '栈的基础应用',
        leetcodeSlug: 'valid-parentheses',
        completed: false
      },
      {
        id: 'assess-5',
        number: '206',
        title: 'Reverse Linked List',
        difficulty: 'Easy',
        category: 'Linked List',
        timeEstimate: '20min',
        hint: '三指针：prev, curr, next',
        template: '链表反转模板',
        leetcodeSlug: 'reverse-linked-list',
        completed: false
      }
    ]
  },
  {
    name: "基础恢复",
    description: "复习核心数据结构",
    icon: <Brain className="w-4 h-4" />,
    minDays: 3,
    maxDays: 4,
    problemPool: [
      {
        id: 'basic-1',
        number: '11',
        title: 'Container With Most Water',
        difficulty: 'Medium',
        category: 'Two Pointers',
        timeEstimate: '30min',
        hint: '双指针，移动较矮的边',
        template: '双指针优化',
        leetcodeSlug: 'container-with-most-water',
        completed: false
      },
      {
        id: 'basic-2',
        number: '49',
        title: 'Group Anagrams',
        difficulty: 'Medium',
        category: 'HashMap',
        timeEstimate: '30min',
        hint: '排序后的字符串作为key',
        template: 'HashMap分组',
        leetcodeSlug: 'group-anagrams',
        completed: false
      },
      {
        id: 'basic-3',
        number: '56',
        title: 'Merge Intervals',
        difficulty: 'Medium',
        category: 'Sorting',
        timeEstimate: '25min',
        hint: '先按起始点排序',
        template: '区间合并',
        leetcodeSlug: 'merge-intervals',
        completed: false
      },
      {
        id: 'basic-4',
        number: '121',
        title: 'Best Time to Buy and Sell Stock',
        difficulty: 'Easy',
        category: 'Array',
        timeEstimate: '20min',
        hint: '记录最低价，计算最大利润',
        template: '单次遍历优化',
        leetcodeSlug: 'best-time-to-buy-and-sell-stock',
        completed: false
      }
    ]
  },
  {
    name: "DFS专项",
    description: "深度优先搜索强化",
    icon: <Zap className="w-4 h-4" />,
    minDays: 5,
    maxDays: 7,
    problemPool: [
      {
        id: 'dfs-1',
        number: '104',
        title: 'Maximum Depth of Binary Tree',
        difficulty: 'Easy',
        category: 'Tree DFS',
        timeEstimate: '20min',
        hint: '递归返回左右子树最大深度+1',
        template: 'Tree DFS基础',
        leetcodeSlug: 'maximum-depth-of-binary-tree',
        completed: false
      },
      {
        id: 'dfs-2',
        number: '226',
        title: 'Invert Binary Tree',
        difficulty: 'Easy',
        category: 'Tree DFS',
        timeEstimate: '20min',
        hint: '递归交换左右子树',
        template: 'Tree DFS基础',
        leetcodeSlug: 'invert-binary-tree',
        completed: false
      },
      {
        id: 'dfs-3',
        number: '98',
        title: 'Validate Binary Search Tree',
        difficulty: 'Medium',
        category: 'Tree DFS',
        timeEstimate: '35min',
        hint: '传递上下界限制',
        template: 'Tree DFS with bounds',
        leetcodeSlug: 'validate-binary-search-tree',
        completed: false
      },
      {
        id: 'dfs-4',
        number: '133',
        title: 'Clone Graph',
        difficulty: 'Medium',
        category: 'Graph DFS',
        timeEstimate: '30min',
        hint: 'HashMap存储原节点到克隆节点映射',
        template: 'Graph DFS + HashMap',
        leetcodeSlug: 'clone-graph',
        completed: false
      },
      {
        id: 'dfs-5',
        number: '79',
        title: 'Word Search',
        difficulty: 'Medium',
        category: 'Backtracking',
        timeEstimate: '35min',
        hint: 'DFS+回溯，记得恢复状态',
        template: 'Grid DFS + Backtrack',
        leetcodeSlug: 'word-search',
        completed: false
      }
    ]
  },
  {
    name: "进阶冲刺",
    description: "准备面试实战",
    icon: <Trophy className="w-4 h-4" />,
    minDays: 8,
    maxDays: 14,
    problemPool: [
      {
        id: 'adv-1',
        number: '146',
        title: 'LRU Cache',
        difficulty: 'Medium',
        category: 'Design',
        timeEstimate: '40min',
        hint: 'HashMap + 双向链表',
        template: 'LRU设计模板',
        leetcodeSlug: 'lru-cache',
        completed: false
      },
      {
        id: 'adv-2',
        number: '207',
        title: 'Course Schedule',
        difficulty: 'Medium',
        category: 'Graph',
        timeEstimate: '35min',
        hint: '拓扑排序检测环',
        template: '有向图环检测',
        leetcodeSlug: 'course-schedule',
        completed: false
      },
      {
        id: 'adv-3',
        number: '322',
        title: 'Coin Change',
        difficulty: 'Medium',
        category: 'DP',
        timeEstimate: '30min',
        hint: 'dp[i] = min(dp[i], dp[i-coin]+1)',
        template: 'DP经典',
        leetcodeSlug: 'coin-change',
        completed: false
      }
    ]
  }
];

export function LeetCodeRecoverySimple() {
  const [startDate, setStartDate] = useLocalStorage<string | null>('leetcodeRecoveryStart', null);
  const [completedProblems, setCompletedProblems] = useLocalStorage<string[]>('leetcodeCompletedProblems', []);
  const [currentStreak, setCurrentStreak] = useLocalStorage('leetcodeStreak', 0);
  const [lastCompleteDate, setLastCompleteDate] = useLocalStorage<string | null>('leetcodeLastComplete', null);
  const [showHelp, setShowHelp] = useState<string | null>(null);
  const [currentPhase, setCurrentPhase] = useState<RecoveryPhase>(phases[0]);
  const [todayProblems, setTodayProblems] = useState<TodayProblem[]>([]);
  const [muscleMemory, setMuscleMemory] = useState(0);

  // Calculate recovery day and phase
  useEffect(() => {
    if (!startDate) return;
    
    const start = new Date(startDate);
    const today = getNYDate();
    const daysPassed = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    // Determine current phase based on days and completion
    let phase = phases[0];
    if (daysPassed <= 2) {
      phase = phases[0]; // 评估阶段
    } else if (daysPassed <= 4) {
      phase = phases[1]; // 基础恢复
    } else if (daysPassed <= 7) {
      phase = phases[2]; // DFS专项
    } else {
      phase = phases[3]; // 进阶冲刺
    }
    
    setCurrentPhase(phase);
    
    // Calculate muscle memory recovery
    const baseRecovery = Math.min(daysPassed * 5, 30); // 每天恢复5%，最多30%
    const completionBonus = completedProblems.length * 3; // 每题额外3%
    setMuscleMemory(Math.min(baseRecovery + completionBonus, 100));
  }, [startDate, completedProblems]);

  // Select today's problems
  useEffect(() => {
    if (!currentPhase) return;
    
    // Filter uncompleted problems from current phase
    const available = currentPhase.problemPool.filter(p => !completedProblems.includes(p.id));
    
    // Select 3 problems for today
    const selected = available.slice(0, 3);
    
    // If less than 3, add from next phase
    if (selected.length < 3 && phases.indexOf(currentPhase) < phases.length - 1) {
      const nextPhase = phases[phases.indexOf(currentPhase) + 1];
      const additional = nextPhase.problemPool
        .filter(p => !completedProblems.includes(p.id))
        .slice(0, 3 - selected.length);
      selected.push(...additional);
    }
    
    setTodayProblems(selected);
  }, [currentPhase, completedProblems]);

  const startRecovery = () => {
    const today = getNYDate().toISOString();
    setStartDate(today);
    setCompletedProblems([]);
    setCurrentStreak(0);
    setLastCompleteDate(null);
  };

  const completeProblem = (problemId: string) => {
    const newCompleted = [...completedProblems, problemId];
    setCompletedProblems(newCompleted);
    
    // Update streak
    const today = getNYDate().toISOString().split('T')[0];
    if (lastCompleteDate !== today) {
      setCurrentStreak(prev => prev + 1);
      setLastCompleteDate(today);
    }
    
    // Celebration
    toast.success(
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4" />
        <span>太棒了！Muscle Memory恢复中...</span>
      </div>
    );
    
    // Check if all today's problems are done
    const todayCompleted = todayProblems.filter(p => 
      newCompleted.includes(p.id)
    ).length;
    
    if (todayCompleted === todayProblems.length && todayProblems.length > 0) {
      toast.success(
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4" />
          <span>今日任务完成！明天继续加油！</span>
        </div>
      );
    }
  };

  const toggleHelp = (problemId: string) => {
    setShowHelp(showHelp === problemId ? null : problemId);
  };

  if (!startDate) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            LeetCode 快速恢复系统
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Coffee className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-semibold">你的状况：</p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>有200道题基础，muscle memory还在</li>
                  <li>2-3周内需要恢复战斗力</li>
                  <li>每天2-3小时集中练习</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>
          
          <div className="text-center space-y-4 py-6">
            <div className="text-6xl">🎯</div>
            <h3 className="text-xl font-semibold">准备好开始恢复了吗？</h3>
            <p className="text-muted-foreground">
              系统会根据你的进度智能推荐每日3道题
            </p>
            <Button size="lg" className="w-full" onClick={startRecovery}>
              <Zap className="w-4 h-4 mr-2" />
              开始恢复计划
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const todayCompleted = todayProblems.filter(p => completedProblems.includes(p.id)).length;
  const todayProgress = todayProblems.length > 0 ? (todayCompleted / todayProblems.length) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              今日必做 ({todayCompleted}/3)
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Flame className="w-3 h-3" />
                {currentStreak}天连续
              </Badge>
              <Badge className="flex items-center gap-1">
                {currentPhase.icon}
                {currentPhase.name}
              </Badge>
            </div>
          </div>
          
          {/* Muscle Memory Recovery Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Muscle Memory 恢复度</span>
              <span className="font-medium">{muscleMemory}%</span>
            </div>
            <Progress value={muscleMemory} className="h-2" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Today's Problems */}
        <div className="space-y-3">
          {todayProblems.map((problem, index) => {
            const isCompleted = completedProblems.includes(problem.id);
            
            return (
              <div 
                key={problem.id}
                className={`
                  p-4 rounded-lg border-2 transition-all
                  ${isCompleted 
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-500/50' 
                    : 'border-border hover:border-primary/50'
                  }
                `}
              >
                <div className="space-y-3">
                  {/* Problem Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={isCompleted}
                          onCheckedChange={() => !isCompleted && completeProblem(problem.id)}
                        />
                        <div className={`
                          text-2xl font-bold 
                          ${index === 0 ? 'text-green-500' : 
                            index === 1 ? 'text-blue-500' : 
                            'text-purple-500'}
                        `}>
                          #{index + 1}
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                            {problem.number}. {problem.title}
                          </span>
                          <Badge 
                            variant={
                              problem.difficulty === 'Easy' ? 'outline' : 
                              problem.difficulty === 'Medium' ? 'secondary' : 
                              'destructive'
                            }
                            className="text-xs"
                          >
                            {problem.difficulty}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {problem.category}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {problem.timeEstimate}
                          </span>
                          {isCompleted && (
                            <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              已完成
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {!isCompleted && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleHelp(problem.id)}
                        >
                          <HelpCircle className="w-4 h-4" />
                        </Button>
                      )}
                      <a
                        href={`https://leetcode.com/problems/${problem.leetcodeSlug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" size="sm">
                          做题
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </a>
                    </div>
                  </div>
                  
                  {/* Help Section */}
                  {showHelp === problem.id && !isCompleted && (
                    <Alert className="mt-3">
                      <HelpCircle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="space-y-2">
                          <div>
                            <span className="font-semibold">💡 思路提示：</span>
                            <p className="text-sm mt-1">{problem.hint}</p>
                          </div>
                          <div>
                            <span className="font-semibold">📝 模板：</span>
                            <p className="text-sm mt-1">{problem.template}</p>
                          </div>
                          <div className="text-xs text-muted-foreground mt-2">
                            还是不会？没关系，看答案理解后重写一遍也是学习！
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Today's Progress */}
        {todayCompleted === 3 && (
          <Alert className="bg-green-50 dark:bg-green-900/20 border-green-500">
            <Trophy className="h-4 w-4" />
            <AlertDescription>
              <div className="font-semibold">🎉 今日任务完成！</div>
              <div className="text-sm mt-1">
                你的muscle memory正在快速恢复，继续保持！
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        {/* Phase Info */}
        <div className="pt-3 border-t">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              {currentPhase.icon}
              <span className="font-medium">{currentPhase.name}</span>
            </div>
            <span className="text-muted-foreground">
              {currentPhase.description}
            </span>
          </div>
        </div>
        
        {/* Motivational Message */}
        <Alert>
          <TrendingUp className="h-4 w-4" />
          <AlertDescription>
            {muscleMemory < 30 && "别着急，手感正在恢复中..."}
            {muscleMemory >= 30 && muscleMemory < 60 && "不错！你的编程直觉正在苏醒！"}
            {muscleMemory >= 60 && muscleMemory < 80 && "太棒了！大部分技能已经回来了！"}
            {muscleMemory >= 80 && "满血复活！你已经准备好面试了！"}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}