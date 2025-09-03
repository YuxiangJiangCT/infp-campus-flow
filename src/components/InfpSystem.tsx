import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { TodayPanel } from './panels/TodayPanel';
import { WeekPanel } from './panels/WeekPanel';
import { SchedulePanel } from './panels/SchedulePanel';
import { MealsPanel } from './panels/MealsPanel';
import { ShoppingPanel } from './panels/ShoppingPanel';
import { EmergencyPanel } from './panels/EmergencyPanel';
import { StatsPanel } from './panels/StatsPanel';
import { ReferralTemplatesPanel } from './panels/ReferralTemplatesPanel';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export type Tab = 'today' | 'week' | 'schedule' | 'meals' | 'shopping' | 'emergency' | 'stats' | 'referrals';

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
  { id: 'referrals', label: '内推模板', icon: '🤝' },
  { id: 'emergency', label: '应急', icon: '🆘' },
  { id: 'stats', label: '统计', icon: '📊' },
];

export default function InfpSystem() {
  const [activeTab, setActiveTab] = useState<Tab>('today');
  const [weekProgress] = useLocalStorage('weekProgress', 25);

  const renderPanel = () => {
    switch (activeTab) {
      case 'today':
        return <TodayPanel />;
      case 'week':
        return <WeekPanel />;
      case 'schedule':
        return <SchedulePanel />;
      case 'meals':
        return <MealsPanel />;
      case 'shopping':
        return <ShoppingPanel />;
      case 'referrals':
        return <ReferralTemplatesPanel />;
      case 'emergency':
        return <EmergencyPanel />;
      case 'stats':
        return <StatsPanel />;
      default:
        return <TodayPanel />;
    }
  };

  return (
    <div className="min-h-screen p-2 sm:p-4">
      <div className="max-w-6xl mx-auto bg-card rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-8 text-center text-white" style={{ background: 'var(--gradient-hero)' }}>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">🎯 INFP秋招生活管理系统</h1>
          <p className="text-lg opacity-95 mb-4">科学作息 + 高效求职 + 健康饮食</p>
          <div className="inline-block bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
            <span className="font-semibold">📅 当前：第1周 - 建立基础</span>
          </div>
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