import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar } from '@/components/ui/calendar';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Download, 
  TrendingUp, 
  Calendar as CalendarIcon,
  BookOpen,
  Target,
  Sparkles,
  Save,
  Languages,
  Loader2
} from 'lucide-react';
import { format, addDays, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useReflections, Mood, DailyReflection } from '@/hooks/useReflections';

const moodOptions: { value: Mood; emoji: string; label: string; color: string }[] = [
  { value: 'great', emoji: '😊', label: '很棒', color: 'text-green-500' },
  { value: 'good', emoji: '🙂', label: '不错', color: 'text-blue-500' },
  { value: 'neutral', emoji: '😐', label: '一般', color: 'text-gray-500' },
  { value: 'bad', emoji: '😔', label: '不好', color: 'text-orange-500' },
  { value: 'terrible', emoji: '😢', label: '糟糕', color: 'text-red-500' },
];

const reflectionTemplates = [
  {
    name: '每日三省',
    prompts: [
      '今天最感恩的三件事',
      '今天学到的最重要的一课',
      '明天要改进的一个方面'
    ]
  },
  {
    name: '成长复盘',
    prompts: [
      '今天的主要成就',
      '遇到的挑战和解决方案',
      '获得的新认知或技能',
      '需要继续努力的方向'
    ]
  },
  {
    name: '情绪日记',
    prompts: [
      '今天的情绪变化',
      '影响情绪的关键事件',
      '如何更好地管理情绪'
    ]
  }
];

function ReflectionEditor({ 
  date, 
  reflection,
  onSave 
}: { 
  date: string;
  reflection: DailyReflection | null;
  onSave: (content: string, mood?: Mood) => Promise<void>;
}) {
  const [content, setContent] = useState(reflection?.content || '');
  const [mood, setMood] = useState<Mood | undefined>(reflection?.mood);
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [displayLang, setDisplayLang] = useState<'original' | 'zh' | 'en'>('original');

  // Get displayed content based on selected language
  const getDisplayContent = () => {
    if (!reflection) return content;
    
    switch (displayLang) {
      case 'zh':
        return reflection.contentZh || content;
      case 'en':
        return reflection.contentEn || content;
      default:
        return content;
    }
  };
  
  const displayedContent = getDisplayContent();

  const wordCount = useMemo(() => {
    const textToCount = displayedContent;
    const chineseChars = (textToCount.match(/[\u4e00-\u9fa5]/g) || []).length;
    const englishWords = textToCount.replace(/[\u4e00-\u9fa5]/g, '').split(/\s+/).filter(w => w).length;
    return chineseChars + englishWords;
  }, [displayedContent]);

  const handleSave = async () => {
    setIsSaving(true);
    setIsTranslating(true);
    await onSave(content, mood);
    setIsSaving(false);
    setTimeout(() => setIsTranslating(false), 2000);
  };

  const insertTemplate = () => {
    const template = reflectionTemplates[selectedTemplate];
    const templateText = template.prompts.map(p => `### ${p}\n\n`).join('\n');
    setContent(prev => prev + (prev ? '\n\n' : '') + templateText);
  };

  return (
    <div className="space-y-4">
      {/* Mood Selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">心情：</span>
        <div className="flex gap-2">
          {moodOptions.map((option) => (
            <Button
              key={option.value}
              size="sm"
              variant={mood === option.value ? 'default' : 'outline'}
              onClick={() => setMood(option.value)}
              className="p-2"
            >
              <span className="text-lg">{option.emoji}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Template Selector */}
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <select
          value={selectedTemplate}
          onChange={(e) => setSelectedTemplate(Number(e.target.value))}
          className="text-sm border rounded px-2 py-1"
        >
          {reflectionTemplates.map((template, index) => (
            <option key={index} value={index}>
              {template.name}
            </option>
          ))}
        </select>
        <Button size="sm" variant="outline" onClick={insertTemplate}>
          插入模板
        </Button>
      </div>

      {/* Editor */}
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="记录今天的感悟、学习和思考..."
        className="min-h-[400px] font-mono text-sm"
      />

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          {wordCount} 字 • {format(new Date(date), 'yyyy年MM月dd日 EEEE', { locale: zhCN })}
          {isTranslating && (
            <span className="flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              翻译中...
            </span>
          )}
          {reflection?.originalLang && !isTranslating && (
            <span className="flex items-center gap-1">
              <Languages className="h-3 w-3" />
              {reflection.originalLang === 'zh' ? '中→英' : 
               reflection.originalLang === 'en' ? '英→中' : '混合'}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          {reflection && (reflection.contentZh || reflection.contentEn) && (
            <div className="flex gap-1">
              <Button
                size="sm"
                variant={displayLang === 'original' ? 'default' : 'outline'}
                onClick={() => setDisplayLang('original')}
              >
                原文
              </Button>
              <Button
                size="sm"
                variant={displayLang === 'zh' ? 'default' : 'outline'}
                onClick={() => setDisplayLang('zh')}
              >
                中文
              </Button>
              <Button
                size="sm"
                variant={displayLang === 'en' ? 'default' : 'outline'}
                onClick={() => setDisplayLang('en')}
              >
                English
              </Button>
            </div>
          )}
          <Button onClick={handleSave} disabled={!content.trim()}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? '保存中...' : '保存'}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ReflectionList({ 
  reflections,
  onSelectDate 
}: { 
  reflections: Record<string, DailyReflection>;
  onSelectDate: (date: string) => void;
}) {
  const sortedReflections = useMemo(() => {
    return Object.entries(reflections)
      .sort(([a], [b]) => b.localeCompare(a))
      .slice(0, 10); // Show recent 10
  }, [reflections]);

  if (sortedReflections.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>还没有反思记录</p>
        <p className="text-sm mt-1">开始记录你的第一篇反思吧</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[500px]">
      <div className="space-y-3 pr-4">
        {sortedReflections.map(([date, reflection]) => {
          const moodOption = moodOptions.find(m => m.value === reflection.mood);
          return (
            <Card 
              key={date}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onSelectDate(date)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {format(new Date(date), 'MM月dd日', { locale: zhCN })}
                    </span>
                    {moodOption && (
                      <span className="text-lg" title={moodOption.label}>
                        {moodOption.emoji}
                      </span>
                    )}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {reflection.wordCount} 字
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground" style={{ 
                  display: '-webkit-box',
                  WebkitLineClamp: 5,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'pre-wrap'
                }}>
                  {reflection.content}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </ScrollArea>
  );
}

export function ReflectionPanel() {
  const {
    reflections,
    saveReflection,
    getReflection,
    getReflectionStats,
    searchReflections,
    today
  } = useReflections();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchKeyword, setSearchKeyword] = useState('');
  const [viewMode, setViewMode] = useState<'edit' | 'stats'>('edit');

  const selectedDateString = format(selectedDate, 'yyyy-MM-dd');
  const selectedReflection = getReflection(selectedDateString);
  const stats = getReflectionStats();

  const handlePreviousDay = () => {
    setSelectedDate(prev => subDays(prev, 1));
  };

  const handleNextDay = () => {
    setSelectedDate(prev => addDays(prev, 1));
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  const handleSaveReflection = async (content: string, mood?: Mood) => {
    await saveReflection(selectedDateString, content, mood);
  };

  const searchResults = useMemo(() => {
    if (!searchKeyword) return {};
    return searchReflections(searchKeyword);
  }, [searchKeyword, searchReflections]);

  const reflectionDates = useMemo(() => {
    return Object.keys(reflections).map(dateStr => new Date(dateStr));
  }, [reflections]);

  const isToday = selectedDateString === today;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">📝 反思记录</h2>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            连续 {stats.currentStreak} 天
          </Badge>
          <Badge variant="outline">
            共 {stats.totalDays} 篇
          </Badge>
          <Button
            size="sm"
            variant={viewMode === 'edit' ? 'default' : 'outline'}
            onClick={() => setViewMode('edit')}
          >
            编辑
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'stats' ? 'default' : 'outline'}
            onClick={() => setViewMode('stats')}
          >
            <TrendingUp className="h-4 w-4" />
            统计
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Calendar and History */}
        <div className="space-y-6">
          {/* Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                日历
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                locale={zhCN}
                modifiers={{
                  hasReflection: reflectionDates
                }}
                modifiersStyles={{
                  hasReflection: {
                    backgroundColor: 'hsl(var(--primary) / 0.1)',
                    fontWeight: 'bold'
                  }
                }}
              />
              <div className="mt-3 flex items-center justify-between">
                <Button size="sm" variant="outline" onClick={handlePreviousDay}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={handleToday}>
                  今天
                </Button>
                <Button size="sm" variant="outline" onClick={handleNextDay}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Search */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">搜索</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索反思内容..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="pl-8"
                />
              </div>
            </CardContent>
          </Card>

          {/* Recent Reflections */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">最近反思</CardTitle>
            </CardHeader>
            <CardContent>
              <ReflectionList 
                reflections={searchKeyword ? searchResults : reflections}
                onSelectDate={(date) => setSelectedDate(new Date(date))}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right: Editor or Stats */}
        <div className="lg:col-span-2">
          {viewMode === 'edit' ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>
                    {format(selectedDate, 'yyyy年MM月dd日 EEEE', { locale: zhCN })}
                  </span>
                  {isToday && <Badge>今天</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ReflectionEditor
                  date={selectedDateString}
                  reflection={selectedReflection}
                  onSave={handleSaveReflection}
                />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>统计分析</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">{stats.totalDays}</div>
                    <div className="text-sm text-muted-foreground">总天数</div>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">{stats.totalWords}</div>
                    <div className="text-sm text-muted-foreground">总字数</div>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">{stats.currentStreak}</div>
                    <div className="text-sm text-muted-foreground">连续天数</div>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">{stats.averageWords}</div>
                    <div className="text-sm text-muted-foreground">平均字数</div>
                  </div>
                </div>

                {/* Mood Distribution */}
                {Object.keys(stats.moodCounts).length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-medium mb-3">心情分布</h3>
                    <div className="space-y-2">
                      {moodOptions.map(option => {
                        const count = stats.moodCounts[option.value] || 0;
                        const percentage = stats.totalDays > 0 
                          ? Math.round((count / stats.totalDays) * 100) 
                          : 0;
                        return (
                          <div key={option.value} className="flex items-center gap-2">
                            <span className="text-lg">{option.emoji}</span>
                            <div className="flex-1 bg-muted rounded-full h-4 relative">
                              <div 
                                className="absolute inset-y-0 left-0 bg-primary rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {count}天 ({percentage}%)
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}