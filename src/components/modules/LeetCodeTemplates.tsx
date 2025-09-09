import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Copy, 
  CheckCircle, 
  Code2, 
  BookOpen,
  Lightbulb
} from 'lucide-react';
import { toast } from 'sonner';

interface Template {
  name: string;
  language: 'python' | 'javascript';
  code: string;
  explanation: string;
  examples: string[];
  complexity: string;
}

const templates: Record<string, Template[]> = {
  'Tree DFS': [
    {
      name: 'Basic Tree DFS',
      language: 'python',
      code: `def dfs(root):
    if not root:
        return
    
    # Process current node
    print(root.val)
    
    # Traverse left subtree
    dfs(root.left)
    
    # Traverse right subtree
    dfs(root.right)`,
      explanation: '基础的树深度优先搜索模板。前序遍历：先处理当前节点，再递归左右子树。',
      examples: ['Maximum Depth #104', 'Invert Binary Tree #226'],
      complexity: 'Time: O(n), Space: O(h) where h is height'
    },
    {
      name: 'Tree DFS with Return Value',
      language: 'python',
      code: `def dfs(root):
    if not root:
        return 0  # or None, [], etc.
    
    # Recursive calls
    left_result = dfs(root.left)
    right_result = dfs(root.right)
    
    # Process and return
    return max(left_result, right_result) + 1`,
      explanation: '带返回值的DFS，用于计算树的属性（高度、路径和等）',
      examples: ['Maximum Depth #104', 'Path Sum #112', 'Diameter of Binary Tree #543'],
      complexity: 'Time: O(n), Space: O(h)'
    },
    {
      name: 'Tree Path DFS',
      language: 'python',
      code: `def dfs(root, path, result):
    if not root:
        return
    
    # Add current node to path
    path.append(root.val)
    
    # Check if leaf node
    if not root.left and not root.right:
        result.append(path[:])  # Save a copy
    
    # Continue DFS
    dfs(root.left, path, result)
    dfs(root.right, path, result)
    
    # Backtrack
    path.pop()`,
      explanation: '用于找所有根到叶路径的模板，包含回溯',
      examples: ['Binary Tree Paths #257', 'Path Sum II #113'],
      complexity: 'Time: O(n), Space: O(n)'
    }
  ],
  'Graph DFS': [
    {
      name: 'Basic Graph DFS',
      language: 'python',
      code: `def dfs(graph, visited, node):
    # Mark as visited
    visited.add(node)
    
    # Process current node
    print(node)
    
    # Visit neighbors
    for neighbor in graph[node]:
        if neighbor not in visited:
            dfs(graph, visited, neighbor)

# Usage
visited = set()
dfs(graph, visited, start_node)`,
      explanation: '基础图DFS模板，使用visited集合避免重复访问',
      examples: ['Number of Islands #200', 'Clone Graph #133'],
      complexity: 'Time: O(V+E), Space: O(V)'
    },
    {
      name: 'Grid DFS (2D Array)',
      language: 'python',
      code: `def dfs(grid, i, j):
    # Check boundaries
    if i < 0 or i >= len(grid) or j < 0 or j >= len(grid[0]):
        return
    
    # Check if visited or invalid
    if grid[i][j] == '0':  # or visited
        return
    
    # Mark as visited
    grid[i][j] = '0'
    
    # Visit 4 directions
    dfs(grid, i + 1, j)  # down
    dfs(grid, i - 1, j)  # up
    dfs(grid, i, j + 1)  # right
    dfs(grid, i, j - 1)  # left`,
      explanation: '2D网格DFS，常用于岛屿、迷宫等问题',
      examples: ['Number of Islands #200', 'Max Area of Island #695'],
      complexity: 'Time: O(m*n), Space: O(m*n)'
    },
    {
      name: 'Graph DFS with Cycle Detection',
      language: 'python',
      code: `def hasCycle(graph):
    WHITE = 0  # Not visited
    GRAY = 1   # Visiting
    BLACK = 2  # Visited
    
    color = {node: WHITE for node in graph}
    
    def dfs(node):
        if color[node] == GRAY:
            return True  # Cycle detected
        if color[node] == BLACK:
            return False  # Already processed
        
        color[node] = GRAY
        for neighbor in graph[node]:
            if dfs(neighbor):
                return True
        color[node] = BLACK
        return False
    
    for node in graph:
        if color[node] == WHITE:
            if dfs(node):
                return True
    return False`,
      explanation: '检测有向图中的环，使用三色标记法',
      examples: ['Course Schedule #207', 'Course Schedule II #210'],
      complexity: 'Time: O(V+E), Space: O(V)'
    }
  ],
  'Backtracking': [
    {
      name: 'Basic Backtracking',
      language: 'python',
      code: `def backtrack(path, choices, result):
    # Base case: found a solution
    if len(path) == target_length:
        result.append(path[:])  # Save a copy
        return
    
    # Try all choices
    for choice in choices:
        # Make choice
        path.append(choice)
        
        # Recurse
        backtrack(path, choices, result)
        
        # Undo choice (backtrack)
        path.pop()`,
      explanation: '基础回溯模板，用于生成所有可能的组合/排列',
      examples: ['Permutations #46', 'Combinations #77'],
      complexity: 'Varies by problem, often exponential'
    },
    {
      name: 'Backtracking with Pruning',
      language: 'python',
      code: `def backtrack(start, path, remain):
    # Pruning: impossible to reach target
    if remain < 0:
        return
    
    # Found valid solution
    if remain == 0:
        result.append(path[:])
        return
    
    # Try choices from start index
    for i in range(start, len(candidates)):
        # Skip duplicates
        if i > start and candidates[i] == candidates[i-1]:
            continue
        
        path.append(candidates[i])
        # Note: i not i+1 if reuse allowed
        backtrack(i + 1, path, remain - candidates[i])
        path.pop()`,
      explanation: '带剪枝的回溯，提高效率',
      examples: ['Combination Sum #39', 'Combination Sum II #40', 'Subsets II #90'],
      complexity: 'Better than brute force due to pruning'
    },
    {
      name: 'Word Search Backtracking',
      language: 'python',
      code: `def exist(board, word):
    def dfs(i, j, k):
        # Found the word
        if k == len(word):
            return True
        
        # Out of bounds or wrong character
        if (i < 0 or i >= len(board) or 
            j < 0 or j >= len(board[0]) or 
            board[i][j] != word[k]):
            return False
        
        # Mark as visited
        temp = board[i][j]
        board[i][j] = '#'
        
        # Try 4 directions
        found = (dfs(i+1, j, k+1) or 
                dfs(i-1, j, k+1) or 
                dfs(i, j+1, k+1) or 
                dfs(i, j-1, k+1))
        
        # Backtrack
        board[i][j] = temp
        return found
    
    for i in range(len(board)):
        for j in range(len(board[0])):
            if dfs(i, j, 0):
                return True
    return False`,
      explanation: '在2D网格中搜索单词的回溯模板',
      examples: ['Word Search #79', 'Word Search II #212'],
      complexity: 'Time: O(m*n*4^L) where L is word length'
    }
  ]
};

export function LeetCodeTemplates() {
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);
  const [expandedExplanation, setExpandedExplanation] = useState<string | null>(null);

  const copyToClipboard = (code: string, templateName: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedTemplate(templateName);
      toast.success('模板已复制到剪贴板！');
      setTimeout(() => setCopiedTemplate(null), 2000);
    });
  };

  const toggleExplanation = (templateName: string) => {
    setExpandedExplanation(expandedExplanation === templateName ? null : templateName);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code2 className="w-5 h-5" />
          LeetCode 核心模板库
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <Lightbulb className="h-4 w-4" />
          <AlertDescription>
            <span className="font-semibold">记住：先背模板，再理解！</span> 
            这些模板覆盖了80%的面试题型。
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="Tree DFS" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="Tree DFS">Tree DFS</TabsTrigger>
            <TabsTrigger value="Graph DFS">Graph DFS</TabsTrigger>
            <TabsTrigger value="Backtracking">Backtracking</TabsTrigger>
          </TabsList>

          {Object.entries(templates).map(([category, categoryTemplates]) => (
            <TabsContent key={category} value={category} className="space-y-4">
              {categoryTemplates.map((template) => (
                <div key={template.name} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold flex items-center gap-2">
                        {template.name}
                        <Badge variant="outline" className="text-xs">
                          Python
                        </Badge>
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {template.complexity}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(template.code, template.name)}
                    >
                      {copiedTemplate === template.name ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-1" />
                          已复制
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-1" />
                          复制
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="relative">
                    <pre className="bg-muted p-3 rounded-md overflow-x-auto">
                      <code className="text-sm">{template.code}</code>
                    </pre>
                  </div>

                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => toggleExplanation(template.name)}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      {expandedExplanation === template.name ? '收起说明' : '查看说明'}
                    </Button>

                    {expandedExplanation === template.name && (
                      <div className="pl-6 space-y-2">
                        <p className="text-sm text-muted-foreground">
                          {template.explanation}
                        </p>
                        <div>
                          <p className="text-xs font-semibold mb-1">适用题目：</p>
                          <div className="flex flex-wrap gap-1">
                            {template.examples.map((example) => (
                              <Badge key={example} variant="secondary" className="text-xs">
                                {example}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </TabsContent>
          ))}
        </Tabs>

        <Alert className="mt-4">
          <AlertDescription className="text-sm">
            <span className="font-semibold">使用技巧：</span>
            <ol className="list-decimal list-inside mt-1 space-y-1">
              <li>每天早上先默写一遍当天要用的模板</li>
              <li>做题时先判断属于哪种模板</li>
              <li>套用模板后再根据题目调整细节</li>
              <li>不理解没关系，先用熟练了自然就懂了</li>
            </ol>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}