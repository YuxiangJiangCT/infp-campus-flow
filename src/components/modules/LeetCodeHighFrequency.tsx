import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { 
  TrendingUp, 
  ExternalLink, 
  Star,
  Target,
  Zap,
  Brain,
  Trophy,
  AlertTriangle
} from 'lucide-react';

interface Problem {
  id: string;
  number: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string[];
  frequency: 'Very High' | 'High' | 'Medium';
  companies: string[];
  timeEstimate: string;
  tips: string;
  leetcodeSlug: string;
}

const top10Problems: Problem[] = [
  {
    id: '1',
    number: '1',
    title: 'Two Sum',
    difficulty: 'Easy',
    category: ['Array', 'Hash Table'],
    frequency: 'Very High',
    companies: ['Amazon', 'Google', 'Facebook', 'Microsoft'],
    timeEstimate: '15 min',
    tips: 'HashMap一遍过，O(n)时间复杂度',
    leetcodeSlug: 'two-sum'
  },
  {
    id: '2',
    number: '15',
    title: '3Sum',
    difficulty: 'Medium',
    category: ['Array', 'Two Pointers'],
    frequency: 'Very High',
    companies: ['Facebook', 'Amazon', 'Microsoft'],
    timeEstimate: '30 min',
    tips: '排序+双指针，注意去重',
    leetcodeSlug: '3sum'
  },
  {
    id: '3',
    number: '200',
    title: 'Number of Islands',
    difficulty: 'Medium',
    category: ['DFS', 'BFS', 'Union Find'],
    frequency: 'Very High',
    companies: ['Amazon', 'Facebook', 'Google'],
    timeEstimate: '30 min',
    tips: 'DFS标记访问过的陆地',
    leetcodeSlug: 'number-of-islands'
  },
  {
    id: '4',
    number: '56',
    title: 'Merge Intervals',
    difficulty: 'Medium',
    category: ['Array', 'Sorting'],
    frequency: 'Very High',
    companies: ['Facebook', 'Google', 'Microsoft'],
    timeEstimate: '25 min',
    tips: '先排序，然后合并重叠区间',
    leetcodeSlug: 'merge-intervals'
  },
  {
    id: '5',
    number: '146',
    title: 'LRU Cache',
    difficulty: 'Medium',
    category: ['Design', 'Hash Table', 'Linked List'],
    frequency: 'Very High',
    companies: ['Amazon', 'Facebook', 'Microsoft'],
    timeEstimate: '40 min',
    tips: 'HashMap + 双向链表',
    leetcodeSlug: 'lru-cache'
  },
  {
    id: '6',
    number: '20',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    category: ['Stack', 'String'],
    frequency: 'Very High',
    companies: ['Amazon', 'Facebook', 'Microsoft'],
    timeEstimate: '15 min',
    tips: '栈的经典应用',
    leetcodeSlug: 'valid-parentheses'
  },
  {
    id: '7',
    number: '102',
    title: 'Binary Tree Level Order Traversal',
    difficulty: 'Medium',
    category: ['Tree', 'BFS'],
    frequency: 'High',
    companies: ['Facebook', 'Amazon', 'Microsoft'],
    timeEstimate: '25 min',
    tips: 'BFS用队列，记录每层节点数',
    leetcodeSlug: 'binary-tree-level-order-traversal'
  },
  {
    id: '8',
    number: '133',
    title: 'Clone Graph',
    difficulty: 'Medium',
    category: ['Graph', 'DFS', 'BFS'],
    frequency: 'High',
    companies: ['Facebook', 'Google', 'Amazon'],
    timeEstimate: '30 min',
    tips: 'HashMap存储原节点到克隆节点的映射',
    leetcodeSlug: 'clone-graph'
  },
  {
    id: '9',
    number: '79',
    title: 'Word Search',
    difficulty: 'Medium',
    category: ['Backtracking', 'DFS'],
    frequency: 'High',
    companies: ['Amazon', 'Microsoft', 'Facebook'],
    timeEstimate: '35 min',
    tips: 'DFS+回溯，记得恢复状态',
    leetcodeSlug: 'word-search'
  },
  {
    id: '10',
    number: '253',
    title: 'Meeting Rooms II',
    difficulty: 'Medium',
    category: ['Heap', 'Greedy', 'Sorting'],
    frequency: 'Very High',
    companies: ['Google', 'Facebook', 'Amazon'],
    timeEstimate: '30 min',
    tips: '最小堆维护结束时间',
    leetcodeSlug: 'meeting-rooms-ii'
  }
];

const additionalHighFrequency: Problem[] = [
  {
    id: '11',
    number: '121',
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'Easy',
    category: ['Array', 'Dynamic Programming'],
    frequency: 'Very High',
    companies: ['Amazon', 'Facebook', 'Microsoft'],
    timeEstimate: '20 min',
    tips: '记录最低价格，计算最大利润',
    leetcodeSlug: 'best-time-to-buy-and-sell-stock'
  },
  {
    id: '12',
    number: '206',
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    category: ['Linked List'],
    frequency: 'Very High',
    companies: ['Amazon', 'Microsoft', 'Facebook'],
    timeEstimate: '20 min',
    tips: '三指针迭代或递归',
    leetcodeSlug: 'reverse-linked-list'
  },
  {
    id: '13',
    number: '5',
    title: 'Longest Palindromic Substring',
    difficulty: 'Medium',
    category: ['String', 'Dynamic Programming'],
    frequency: 'High',
    companies: ['Amazon', 'Microsoft', 'Facebook'],
    timeEstimate: '35 min',
    tips: '中心扩展法或DP',
    leetcodeSlug: 'longest-palindromic-substring'
  },
  {
    id: '14',
    number: '322',
    title: 'Coin Change',
    difficulty: 'Medium',
    category: ['Dynamic Programming'],
    frequency: 'High',
    companies: ['Amazon', 'Microsoft', 'Google'],
    timeEstimate: '30 min',
    tips: 'DP经典题，dp[i] = min(dp[i], dp[i-coin]+1)',
    leetcodeSlug: 'coin-change'
  },
  {
    id: '15',
    number: '207',
    title: 'Course Schedule',
    difficulty: 'Medium',
    category: ['Graph', 'Topological Sort'],
    frequency: 'High',
    companies: ['Amazon', 'Google', 'Facebook'],
    timeEstimate: '35 min',
    tips: '拓扑排序检测环',
    leetcodeSlug: 'course-schedule'
  }
];

export function LeetCodeHighFrequency() {
  const [completedProblems, setCompletedProblems] = useLocalStorage<Record<string, boolean>>('leetcodeHighFrequencyCompleted', {});
  const [showAllProblems, setShowAllProblems] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const toggleProblem = (problemId: string) => {
    setCompletedProblems(prev => ({
      ...prev,
      [problemId]: !prev[problemId]
    }));
  };

  const allProblems = [...top10Problems, ...additionalHighFrequency];
  const displayProblems = showAllProblems ? allProblems : top10Problems;

  const categories = ['all', ...Array.from(new Set(allProblems.flatMap(p => p.category)))];

  const filteredProblems = selectedCategory === 'all' 
    ? displayProblems 
    : displayProblems.filter(p => p.category.includes(selectedCategory));

  const completedCount = Object.values(completedProblems).filter(Boolean).length;
  const top10CompletedCount = top10Problems.filter(p => completedProblems[p.id]).length;
  const progress = (top10CompletedCount / top10Problems.length) * 100;

  const getMasteryLevel = () => {
    if (top10CompletedCount < 3) return { text: "新手上路", color: "text-gray-500", icon: <Zap className="w-4 h-4" /> };
    if (top10CompletedCount < 6) return { text: "渐入佳境", color: "text-blue-500", icon: <TrendingUp className="w-4 h-4" /> };
    if (top10CompletedCount < 9) return { text: "即将突破", color: "text-green-500", icon: <Brain className="w-4 h-4" /> };
    return { text: "面试杀手", color: "text-purple-500", icon: <Trophy className="w-4 h-4" /> };
  };

  const mastery = getMasteryLevel();

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              高频面试题精选
            </CardTitle>
            <CardDescription className="mt-1">
              这些题目在大厂面试中出现频率最高
            </CardDescription>
          </div>
          <Badge className={`${mastery.color} flex items-center gap-1`}>
            {mastery.icon}
            {mastery.text}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Top 10 进度</span>
            <span className="font-medium">{top10CompletedCount}/10</span>
          </div>
          <Progress value={progress} className="h-2" />
          {top10CompletedCount === 10 && (
            <Alert className="mt-2">
              <Trophy className="h-4 w-4" />
              <AlertDescription>
                恭喜！你已完成所有Top 10高频题，面试成功率提升80%！
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Must Do Alert */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <span className="font-semibold">优先级提醒：</span>
            前10题是必刷题，覆盖了60%的面试考点。建议先完成这10题再做其他。
          </AlertDescription>
        </Alert>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === 'all' ? '全部' : cat}
            </Button>
          ))}
        </div>

        {/* Problems List */}
        <div className="space-y-2">
          {filteredProblems.map((problem, index) => (
            <div 
              key={problem.id} 
              className={`p-3 rounded-lg border ${completedProblems[problem.id] ? 'bg-green-50 dark:bg-green-900/20' : ''} hover:bg-muted/50 transition-colors`}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={completedProblems[problem.id] || false}
                  onCheckedChange={() => toggleProblem(problem.id)}
                />
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-medium ${completedProblems[problem.id] ? 'line-through text-muted-foreground' : ''}`}>
                          {index < 10 && !showAllProblems && (
                            <span className="text-red-500 font-bold">#{index + 1} </span>
                          )}
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
                        {problem.frequency === 'Very High' && (
                          <Badge variant="default" className="text-xs">
                            🔥 极高频
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {problem.category.map(cat => (
                          <Badge key={cat} variant="outline" className="text-xs">
                            {cat}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <a 
                      href={`https://leetcode.com/problems/${problem.leetcodeSlug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-500 hover:underline text-sm"
                    >
                      做题
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>⏱️ 预计用时：{problem.timeEstimate}</p>
                    <p>💡 技巧：{problem.tips}</p>
                    <div className="flex items-center gap-1">
                      <span>🏢</span>
                      <span className="text-xs">{problem.companies.join(', ')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show More Button */}
        {!showAllProblems && (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setShowAllProblems(true)}
          >
            <Target className="w-4 h-4 mr-2" />
            查看更多高频题 (15题)
          </Button>
        )}

        {/* Summary Stats */}
        <div className="pt-4 border-t grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">{completedCount}</div>
            <div className="text-xs text-muted-foreground">已完成题目</div>
          </div>
          <div>
            <div className="text-2xl font-bold">
              {Math.round((completedCount / allProblems.length) * 100)}%
            </div>
            <div className="text-xs text-muted-foreground">总体完成率</div>
          </div>
        </div>

        {/* Tips */}
        <Alert>
          <AlertDescription className="text-sm">
            <span className="font-semibold">刷题建议：</span>
            <ol className="list-decimal list-inside mt-1 space-y-1">
              <li>每题限时做，超时就看答案</li>
              <li>看懂答案后自己重写一遍</li>
              <li>第二天重做昨天的错题</li>
              <li>面试前一周把Top 10全部重做一遍</li>
            </ol>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}