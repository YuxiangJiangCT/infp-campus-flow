import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ChevronDown, ChevronUp, History, Save, Sparkles, Languages, Loader2 } from 'lucide-react';
import { useReflections, Mood } from '@/hooks/useReflections';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface QuickReflectionCardProps {
  date?: string;
  onViewHistory?: () => void;
  defaultExpanded?: boolean;
}

const moodOptions: { value: Mood; emoji: string; label: string }[] = [
  { value: 'great', emoji: '😊', label: '很棒' },
  { value: 'good', emoji: '🙂', label: '不错' },
  { value: 'neutral', emoji: '😐', label: '一般' },
  { value: 'bad', emoji: '😔', label: '不好' },
  { value: 'terrible', emoji: '😢', label: '糟糕' },
];

const reflectionPrompts = [
  '今天最让你感恩的三件事是什么？',
  '今天你学到了什么新知识或技能？',
  '有什么事情可以做得更好？',
  '明天最重要的三件事是什么？',
  '今天有什么让你感到自豪的时刻？',
];

export function QuickReflectionCard({ 
  date, 
  onViewHistory,
  defaultExpanded = false 
}: QuickReflectionCardProps) {
  const {
    currentContent,
    setCurrentContent,
    currentMood,
    setCurrentMood,
    saveTodayReflection,
    getTodayReflection,
    lastSaved,
    countWords,
    today
  } = useReflections();

  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isSaving, setIsSaving] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [displayLang, setDisplayLang] = useState<'original' | 'zh' | 'en'>('original');

  const targetDate = date || today;
  const todayReflection = getTodayReflection();
  const wordCount = countWords(currentContent);

  // Load existing reflection when component mounts
  useEffect(() => {
    if (todayReflection) {
      setCurrentContent(todayReflection.content);
      setCurrentMood(todayReflection.mood);
    }
  }, []);

  // Rotate through prompts
  const nextPrompt = () => {
    setCurrentPrompt((prev) => (prev + 1) % reflectionPrompts.length);
  };

  const handleContentChange = (value: string) => {
    setCurrentContent(value);
    setIsSaving(true);
    setIsTranslating(true);
  };

  const handleMoodChange = async (mood: Mood) => {
    setCurrentMood(mood);
    setIsTranslating(true);
    await saveTodayReflection(currentContent, mood);
    setIsTranslating(false);
  };
  
  // Get displayed content based on selected language
  const getDisplayContent = () => {
    if (!todayReflection) return currentContent;
    
    switch (displayLang) {
      case 'zh':
        return todayReflection.contentZh || currentContent;
      case 'en':
        return todayReflection.contentEn || currentContent;
      default:
        return currentContent;
    }
  };

  // Auto-save and translation indicator
  useEffect(() => {
    if (isSaving || isTranslating) {
      const timer = setTimeout(() => {
        setIsSaving(false);
        setIsTranslating(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [lastSaved, isSaving, isTranslating]);

  return (
    <Card className="gradient-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>📝 今日反思</span>
            {currentMood && (
              <span className="text-xl">
                {moodOptions.find(m => m.value === currentMood)?.emoji}
              </span>
            )}
            {wordCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {wordCount} 字
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            {todayReflection && (todayReflection.contentZh || todayReflection.contentEn) && (
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant={displayLang === 'original' ? 'default' : 'ghost'}
                  onClick={() => setDisplayLang('original')}
                  className="px-2"
                  title="Original"
                >
                  原
                </Button>
                <Button
                  size="sm"
                  variant={displayLang === 'zh' ? 'default' : 'ghost'}
                  onClick={() => setDisplayLang('zh')}
                  className="px-2"
                  title="中文"
                >
                  中
                </Button>
                <Button
                  size="sm"
                  variant={displayLang === 'en' ? 'default' : 'ghost'}
                  onClick={() => setDisplayLang('en')}
                  className="px-2"
                  title="English"
                >
                  EN
                </Button>
              </div>
            )}
            {onViewHistory && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onViewHistory}
                className="gap-1"
              >
                <History className="h-4 w-4" />
                历史
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  收起
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  展开
                </>
              )}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Mood Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">今日心情：</span>
            <div className="flex gap-1">
              {moodOptions.map((option) => (
                <Button
                  key={option.value}
                  size="sm"
                  variant={currentMood === option.value ? 'default' : 'ghost'}
                  className="p-2"
                  onClick={() => handleMoodChange(option.value)}
                  title={option.label}
                >
                  <span className="text-lg">{option.emoji}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Reflection Prompt */}
          <div 
            className="p-3 bg-muted/30 rounded-lg cursor-pointer hover:bg-muted/40 transition-colors"
            onClick={nextPrompt}
          >
            <div className="flex items-start gap-2">
              <Sparkles className="h-4 w-4 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  {reflectionPrompts[currentPrompt]}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  点击切换提示问题
                </p>
              </div>
            </div>
          </div>

          {/* Text Input */}
          <Textarea
            value={currentContent}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="记录今天的感悟、学习和思考..."
            className="min-h-[150px] resize-none"
          />

          {/* Status Bar */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              {isTranslating ? (
                <span className="flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  翻译中...
                </span>
              ) : isSaving ? (
                <span className="flex items-center gap-1">
                  <Save className="h-3 w-3 animate-pulse" />
                  保存中...
                </span>
              ) : lastSaved ? (
                <span className="flex items-center gap-1">
                  {todayReflection?.originalLang && (
                    <>
                      <Languages className="h-3 w-3" />
                      {todayReflection.originalLang === 'zh' ? '中→英' : 
                       todayReflection.originalLang === 'en' ? '英→中' : '混合'}
                    </>
                  )}
                  已保存于 {format(lastSaved, 'HH:mm', { locale: zhCN })}
                </span>
              ) : (
                <span>自动保存</span>
              )}
            </div>
            <span>
              {format(new Date(), 'yyyy年MM月dd日 EEEE', { locale: zhCN })}
            </span>
          </div>
        </CardContent>
      )}
      
      {!isExpanded && currentContent && (
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {getDisplayContent()}
          </p>
        </CardContent>
      )}
    </Card>
  );
}