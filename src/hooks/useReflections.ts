import { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { autoTranslate } from '@/lib/translationService';
import { getNYDateString } from '@/utils/timezone';

export type Mood = 'great' | 'good' | 'neutral' | 'bad' | 'terrible';
export type Language = 'zh' | 'en' | 'mixed';

export interface DailyReflection {
  date: string;
  content: string;
  contentEn?: string;  // English version
  contentZh?: string;  // Chinese version
  originalLang?: Language;  // Original writing language
  mood?: Mood;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  wordCount: number;
}

const getMoodEmoji = (mood?: Mood): string => {
  switch (mood) {
    case 'great': return '😊';
    case 'good': return '🙂';
    case 'neutral': return '😐';
    case 'bad': return '😔';
    case 'terrible': return '😢';
    default: return '💭';
  }
};

const getTodayString = () => {
  return getNYDateString();
};

const countWords = (text: string): number => {
  // Count Chinese characters and English words
  const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  const englishWords = text.replace(/[\u4e00-\u9fa5]/g, '').split(/\s+/).filter(word => word.length > 0).length;
  return chineseChars + englishWords;
};

export function useReflections() {
  const [reflections, setReflections] = useLocalStorage<Record<string, DailyReflection>>(
    'dailyReflections',
    {}
  );
  
  const today = getTodayString();
  const [currentContent, setCurrentContent] = useState<string>(
    reflections[today]?.content || ''
  );
  const [currentMood, setCurrentMood] = useState<Mood | undefined>(
    reflections[today]?.mood
  );
  const [currentTags, setCurrentTags] = useState<string[]>(
    reflections[today]?.tags || []
  );
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Save reflection for a specific date with auto-translation
  const saveReflection = useCallback(async (
    date: string,
    content: string,
    mood?: Mood,
    tags?: string[]
  ) => {
    const now = new Date().toISOString();
    const wordCount = countWords(content);
    
    // Auto-translate the content
    let contentEn = content;
    let contentZh = content;
    let originalLang: Language = 'mixed';
    
    try {
      const translation = await autoTranslate(content);
      contentEn = translation.english;
      contentZh = translation.chinese;
      originalLang = translation.originalLang;
    } catch (error) {
      console.error('Translation failed:', error);
      // Keep original content if translation fails
    }
    
    const reflection: DailyReflection = {
      date,
      content,
      contentEn,
      contentZh,
      originalLang,
      mood,
      tags,
      wordCount,
      createdAt: reflections[date]?.createdAt || now,
      updatedAt: now
    };

    setReflections(prev => ({
      ...prev,
      [date]: reflection
    }));
    
    setLastSaved(new Date());
    
    return reflection;
  }, [reflections, setReflections]);

  // Save today's reflection
  const saveTodayReflection = useCallback(async (content: string, mood?: Mood, tags?: string[]) => {
    setCurrentContent(content);
    setCurrentMood(mood);
    setCurrentTags(tags || []);
    return await saveReflection(today, content, mood, tags);
  }, [today, saveReflection]);

  // Get reflection for a specific date
  const getReflection = useCallback((date: string): DailyReflection | null => {
    return reflections[date] || null;
  }, [reflections]);

  // Get today's reflection
  const getTodayReflection = useCallback((): DailyReflection | null => {
    return getReflection(today);
  }, [today, getReflection]);

  // Get all reflections
  const getAllReflections = useCallback((): Record<string, DailyReflection> => {
    return reflections;
  }, [reflections]);

  // Get reflections within a date range
  const getReflectionsInRange = useCallback((startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const result: Record<string, DailyReflection> = {};
    
    Object.entries(reflections).forEach(([date, reflection]) => {
      const reflectionDate = new Date(date);
      if (reflectionDate >= start && reflectionDate <= end) {
        result[date] = reflection;
      }
    });
    
    return result;
  }, [reflections]);

  // Search reflections by keyword
  const searchReflections = useCallback((keyword: string) => {
    const lowerKeyword = keyword.toLowerCase();
    const results: Record<string, DailyReflection> = {};
    
    Object.entries(reflections).forEach(([date, reflection]) => {
      if (
        reflection.content.toLowerCase().includes(lowerKeyword) ||
        reflection.tags?.some(tag => tag.toLowerCase().includes(lowerKeyword))
      ) {
        results[date] = reflection;
      }
    });
    
    return results;
  }, [reflections]);

  // Get reflection statistics
  const getReflectionStats = useCallback(() => {
    const allReflections = Object.values(reflections);
    const totalDays = allReflections.length;
    const totalWords = allReflections.reduce((sum, r) => sum + r.wordCount, 0);
    const averageWords = totalDays > 0 ? Math.round(totalWords / totalDays) : 0;
    
    const moodCounts = allReflections.reduce((acc, r) => {
      if (r.mood) {
        acc[r.mood] = (acc[r.mood] || 0) + 1;
      }
      return acc;
    }, {} as Record<Mood, number>);
    
    const tagCounts = allReflections.reduce((acc, r) => {
      r.tags?.forEach(tag => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);
    
    // Get current streak
    let streak = 0;
    const sortedDates = Object.keys(reflections).sort().reverse();
    const today = new Date();
    
    for (let i = 0; i < sortedDates.length; i++) {
      const date = new Date(sortedDates[i]);
      const daysDiff = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === i) {
        streak++;
      } else {
        break;
      }
    }
    
    return {
      totalDays,
      totalWords,
      averageWords,
      currentStreak: streak,
      moodCounts,
      tagCounts,
      mostRecentDate: sortedDates[0] || null
    };
  }, [reflections]);

  // Delete a reflection
  const deleteReflection = useCallback((date: string) => {
    setReflections(prev => {
      const newReflections = { ...prev };
      delete newReflections[date];
      return newReflections;
    });
  }, [setReflections]);

  // Clear all reflections (use with caution!)
  const clearAllReflections = useCallback(() => {
    setReflections({});
    setCurrentContent('');
    setCurrentMood(undefined);
    setCurrentTags([]);
  }, [setReflections]);

  // Auto-save current content for today
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (currentContent && currentContent !== reflections[today]?.content) {
        await saveReflection(today, currentContent, currentMood, currentTags);
      }
    }, 2000); // Auto-save after 2 seconds of no typing

    return () => clearTimeout(timer);
  }, [currentContent, currentMood, currentTags, today, reflections, saveReflection]);

  return {
    // Current state
    currentContent,
    setCurrentContent,
    currentMood,
    setCurrentMood,
    currentTags,
    setCurrentTags,
    lastSaved,
    
    // Core functions
    saveReflection,
    saveTodayReflection,
    getReflection,
    getTodayReflection,
    getAllReflections,
    getReflectionsInRange,
    searchReflections,
    deleteReflection,
    clearAllReflections,
    
    // Stats and utils
    getReflectionStats,
    getMoodEmoji,
    countWords,
    
    // Data
    reflections,
    today
  };
}