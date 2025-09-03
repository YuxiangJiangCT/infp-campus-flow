import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface BookProgress {
  currentChapter: number;
  totalChapters: number;
  currentPage: number;
  totalPages: number;
  todayStartPage: number;
  todayEndPage: number;
  totalNotes: number;
  todayReflection: string;
  weeklyVerse: string;
  lastUpdated: string;
}

const initialProgress: BookProgress = {
  currentChapter: 1,
  totalChapters: 10,
  currentPage: 1,
  totalPages: 180,
  todayStartPage: 1,
  todayEndPage: 1,
  totalNotes: 0,
  todayReflection: '',
  weeklyVerse: '',
  lastUpdated: new Date().toISOString()
};

export function PastorBookModule() {
  const [progress, setProgress] = useLocalStorage<BookProgress>('pastorBookProgress', initialProgress);
  const [isEditing, setIsEditing] = useLocalStorage('pastorBookEditing', false);
  
  const updateProgress = (field: keyof BookProgress, value: any) => {
    setProgress({
      ...progress,
      [field]: value,
      lastUpdated: new Date().toISOString()
    });
  };
  
  const pagesReadToday = progress.todayEndPage - progress.todayStartPage + 1;
  const progressPercentage = (progress.currentPage / progress.totalPages) * 100;
  const chapterProgress = (progress.currentChapter / progress.totalChapters) * 100;
  
  const saveReflection = () => {
    updateProgress('totalNotes', progress.totalNotes + 1);
    setIsEditing(false);
  };
  
  return (
    <Card className="gradient-card">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>📖 The Prodigal God 进度追踪</span>
          <Badge variant={progressPercentage === 100 ? 'default' : 'secondary'}>
            {progressPercentage.toFixed(0)}%
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Reading Progress */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="chapter">当前章节</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input 
                  id="chapter"
                  type="number"
                  min={1}
                  max={progress.totalChapters}
                  value={progress.currentChapter}
                  onChange={(e) => updateProgress('currentChapter', parseInt(e.target.value))}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">/ {progress.totalChapters} 章</span>
              </div>
            </div>
            
            <div>
              <Label htmlFor="page">今日页码</Label>
              <div className="flex items-center gap-1 mt-1">
                <Input 
                  type="number"
                  min={1}
                  max={progress.totalPages}
                  value={progress.todayStartPage}
                  onChange={(e) => updateProgress('todayStartPage', parseInt(e.target.value))}
                  className="w-16"
                  placeholder="起"
                />
                <span className="text-muted-foreground">-</span>
                <Input 
                  type="number"
                  min={progress.todayStartPage}
                  max={progress.totalPages}
                  value={progress.todayEndPage}
                  onChange={(e) => {
                    const endPage = parseInt(e.target.value);
                    updateProgress('todayEndPage', endPage);
                    updateProgress('currentPage', endPage);
                  }}
                  className="w-16"
                  placeholder="止"
                />
              </div>
            </div>
          </div>
          
          {/* Progress Bars */}
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>页码进度</span>
                <span>{progress.currentPage}/{progress.totalPages}页</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>章节进度</span>
                <span>第{progress.currentChapter}/{progress.totalChapters}章</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all"
                  style={{ width: `${chapterProgress}%` }}
                />
              </div>
            </div>
          </div>
          
          {/* Today's Stats */}
          <div className="flex gap-4 pt-2">
            <Badge variant="outline" className="text-sm">
              今日阅读：{pagesReadToday > 0 ? pagesReadToday : 0}页
            </Badge>
            <Badge variant="outline" className="text-sm">
              累计笔记：{progress.totalNotes}条
            </Badge>
          </div>
        </div>
        
        <div className="border-t pt-4">
          {/* Today's Reflection */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="reflection">今日Reflection主题</Label>
              <Textarea
                id="reflection"
                placeholder="记录今天阅读的核心感悟..."
                value={progress.todayReflection}
                onChange={(e) => updateProgress('todayReflection', e.target.value)}
                className="min-h-[80px] mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="verse">本周关键Verse</Label>
              <Input
                id="verse"
                placeholder="记录本周最触动你的经文..."
                value={progress.weeklyVerse}
                onChange={(e) => updateProgress('weeklyVerse', e.target.value)}
                className="mt-1"
              />
            </div>
            
            {progress.todayReflection && (
              <Button 
                onClick={saveReflection}
                size="sm"
                className="w-full"
              >
                保存今日笔记
              </Button>
            )}
          </div>
        </div>
        
        {/* Reading Schedule */}
        <div className="border-t pt-4">
          <div className="text-sm text-muted-foreground space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-primary">📅</span>
              <span>每天20-25页，约2周读完</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary">⏰</span>
              <span>最佳时间：20:00-21:00</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary">✏️</span>
              <span>记得写Margin Notes！</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}