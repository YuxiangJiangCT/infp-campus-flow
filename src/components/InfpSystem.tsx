import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { TodayPanel } from './panels/TodayPanel';
import { WeekPanel } from './panels/WeekPanel';
import { SchedulePanel } from './panels/SchedulePanel';
import { MealsPanel } from './panels/MealsPanel';
import { ShoppingPanel } from './panels/ShoppingPanel';
import { EmergencyPanel } from './panels/EmergencyPanel';
import { StatsPanel } from './panels/StatsPanel';
import { ReferralTemplatesPanel } from './panels/ReferralTemplatesPanel';
import { PhoneManagementPanel } from './panels/PhoneManagementPanel';
import { ReflectionPanel } from './panels/ReflectionPanel';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { DataBackup } from './DataBackup';

export type Tab = 'today' | 'week' | 'schedule' | 'meals' | 'shopping' | 'phone' | 'emergency' | 'stats' | 'referrals' | 'reflections' | 'backup';

interface TabData {
  id: Tab;
  label: string;
  icon: string;
}

const tabs: TabData[] = [
  { id: 'today', label: '今日', icon: '📍' },
  { id: 'week', label: '周计划', icon: '📈' },
  { id: 'schedule', label: '作息', icon: '⏰' },
  { id: 'meals', label: '饮食', icon: '🍱' },
  { id: 'shopping', label: '购物', icon: '🛒' },
  { id: 'phone', label: '手机', icon: '📱' },
  { id: 'reflections', label: '反思', icon: '📝' },
  { id: 'referrals', label: '内推模板', icon: '🤝' },
  { id: 'emergency', label: '应急', icon: '🆘' },
  { id: 'stats', label: '统计', icon: '📊' },
  { id: 'backup', label: '备份', icon: '💾' },
];

export default function InfpSystem() {
  const [activeTab, setActiveTab] = useState<Tab>('today');
  const [weekProgress] = useLocalStorage('weekProgress', 25);
  
  // Day detection
  const dayOfWeek = new Date().getDay();
  const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const currentDay = dayNames[dayOfWeek];
  const isSpecialDay = dayOfWeek === 2 || dayOfWeek === 4;
  const scheduleMode = isSpecialDay ? '晚课日' : '正常日';
  const wakeUpTime = isSpecialDay ? '6:30' : '7:30';
  const currentWeek = Math.ceil((new Date().getDate()) / 7);

  const renderPanel = () => {
    switch (activeTab) {
      case 'today':
        return <TodayPanel onNavigateToReflections={() => setActiveTab('reflections')} />;
      case 'week':
        return <WeekPanel />;
      case 'schedule':
        return <SchedulePanel />;
      case 'meals':
        return <MealsPanel />;
      case 'shopping':
        return <ShoppingPanel />;
      case 'phone':
        return <PhoneManagementPanel />;
      case 'reflections':
        return <ReflectionPanel />;
      case 'referrals':
        return <ReferralTemplatesPanel />;
      case 'emergency':
        return <EmergencyPanel />;
      case 'stats':
        return <StatsPanel />;
      case 'backup':
        return <DataBackup />;
      default:
        return <TodayPanel />;
    }
  };

  return (
    <div className="min-h-screen p-2 sm:p-4">
      <div className="max-w-6xl mx-auto bg-card rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-8 text-center text-white" style={{ background: 'var(--gradient-hero)' }}>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">🎯 INFP秋招生活管理系统 v2.0</h1>
          <p className="text-lg opacity-95 mb-4">科学作息 + 高效求职 + 健康饮食</p>
          <div className="flex justify-center gap-2 flex-wrap">
            <div className="inline-block bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
              <span className="font-semibold">📅 今天是：{currentDay}</span>
            </div>
            <div className="inline-block bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
              <span className="font-semibold">
                {isSpecialDay ? '⚠️ ' : '✅ '}{scheduleMode}
              </span>
            </div>
            <div className="inline-block bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
              <span className="font-semibold">⏰ 起床：{wakeUpTime}</span>
            </div>
            <div className="inline-block bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
              <span className="font-semibold">📈 第{currentWeek}周</span>
            </div>
          </div>
          {isSpecialDay && (
            <div className="mt-4 bg-yellow-500/30 px-4 py-2 rounded-lg backdrop-blur-sm inline-block">
              <span className="font-medium">
                ⚠️ 今晚有课：{dayOfWeek === 2 ? 'INFO 5920' : 'TECH 5900'}，注意早起！
              </span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto bg-muted/50 border-b-2 border-border px-4 no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-button whitespace-nowrap ${
                activeTab === tab.id ? 'active' : ''
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {renderPanel()}
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="float-btn" onClick={() => setActiveTab('today')}>
        ⚡
      </div>

    </div>
  );
}