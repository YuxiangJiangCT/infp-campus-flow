import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface Meal {
  time: string;
  title: string;
  description: string;
  items: string[];
  note?: string;
  calories?: number;
}

const normalDayMeals: Meal[] = [
  {
    time: "8:00",
    title: "🌅 早餐",
    description: "Tvorog组合",
    items: [
      "Tvorog（奶渣）250g + 蜂蜜 + 核桃",
      "黑面包 2片 + 花生酱",
      "Kefir 400ml"
    ],
    note: "蛋白质：35g+ | 准备时间：3分钟",
    calories: 580
  },
  {
    time: "12:00",
    title: "☀️ 午餐",
    description: "Pelmeni大餐",
    items: [
      "Pelmeni 25个 + Smetana",
      "酸黄瓜几根",
      "黑面包 1-2片"
    ],
    calories: 750
  },
  {
    time: "15:30",
    title: "🍎 加餐",
    description: "坚果+水果",
    items: [
      "混合坚果 30g",
      "苹果 1个",
      "酸奶 200ml"
    ],
    calories: 280
  },
  {
    time: "19:00",
    title: "🌙 晚餐",
    description: "烤肉+沙拉",
    items: [
      "烤肉串 1串（150g）",
      "蔬菜沙拉 200g",
      "黑面包 1片"
    ],
    calories: 550
  },
  {
    time: "20:00",
    title: "⏰ 停止进食",
    description: "开始禁食窗口",
    items: [
      "只喝水、茶或黑咖啡",
      "保持16小时禁食"
    ]
  }
];

const fastingDayMeals: Meal[] = [
  {
    time: "早上",
    title: "☕ 禁食期",
    description: "保持空腹状态",
    items: [
      "黑咖啡（不加糖奶）",
      "水 2L+",
      "绿茶（可选）"
    ],
    note: "保持胰岛素敏感性",
    calories: 0
  },
  {
    time: "12:00",
    title: "🥤 破禁食",
    description: "轻柔开始",
    items: [
      "水果（苹果/香蕉）1个",
      "酸奶 200ml",
      "等30分钟再正餐"
    ],
    calories: 250
  },
  {
    time: "12:30",
    title: "🍽️ 正餐",
    description: "营养密集",
    items: [
      "Pelmeni 20个",
      "Smetana适量",
      "酸菜 100g"
    ],
    calories: 600
  },
  {
    time: "19:00",
    title: "🥗 轻晚餐",
    description: "清淡收尾",
    items: [
      "蔬菜汤 300ml",
      "全麦面包 1片",
      "奶酪 50g"
    ],
    calories: 350
  },
  {
    time: "20:00",
    title: "🚫 禁食开始",
    description: "明日12:00前不进食",
    items: [
      "开始16小时禁食窗口",
      "充足睡眠帮助禁食"
    ]
  }
];

export function MealsPanel() {
  const [mealMode, setMealMode] = useState<'normal' | 'fasting'>('normal');
  const [totalCalories, setTotalCalories] = useState(0);
  
  // Auto-detect Wednesday as fasting day
  const dayOfWeek = new Date().getDay();
  const isWednesday = dayOfWeek === 3;
  
  useEffect(() => {
    if (isWednesday) {
      setMealMode('fasting');
    }
  }, [isWednesday]);
  
  const currentMeals = mealMode === 'normal' ? normalDayMeals : fastingDayMeals;
  
  useEffect(() => {
    const total = currentMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
    setTotalCalories(total);
  }, [mealMode]);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">🍱 饮食管理</h2>
        <Badge variant={totalCalories > 0 ? "default" : "secondary"}>
          总热量：{totalCalories} kcal
        </Badge>
      </div>
      
      {/* Mode Toggle */}
      <div className="flex gap-2">
        <Button 
          variant={mealMode === 'normal' ? 'default' : 'outline'}
          onClick={() => setMealMode('normal')}
          className="flex-1"
        >
          🍽️ 普通日
        </Button>
        <Button 
          variant={mealMode === 'fasting' ? 'default' : 'outline'}
          onClick={() => setMealMode('fasting')}
          className="flex-1"
        >
          ⏱️ 禁食日（周三）
        </Button>
      </div>
      
      {isWednesday && (
        <div className="alert-warning">
          <strong>提醒：</strong>今天是周三，建议执行16:8间歇性禁食
        </div>
      )}
      
      {/* Meal Schedule */}
      <div className="space-y-4">
        {currentMeals.map((meal, index) => (
          <Card key={index} className={`gradient-card ${mealMode === 'fasting' ? 'border-yellow-500/20' : ''}`}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{meal.title}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {meal.time}
                  </Badge>
                  {meal.calories !== undefined && meal.calories > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {meal.calories} kcal
                    </Badge>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold mb-3 text-muted-foreground">{meal.description}</p>
              <ul className="space-y-2">
                {meal.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              {meal.note && (
                <div className="mt-3 p-2 bg-primary/10 rounded text-sm">
                  💡 {meal.note}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Tips Section */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>🎯 饮食原则</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>优先选择：Tvorog、Kefir、Pelmeni、黑面包</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>16:8间歇性禁食：20:00-次日12:00禁食</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>周三特别日：延长禁食窗口，清理肠胃</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-600">✗</span>
              <span>避免：深夜进食、过度加工食品、高糖饮料</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}