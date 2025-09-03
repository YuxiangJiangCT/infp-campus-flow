import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Meal {
  time: string;
  title: string;
  description: string;
  items: string[];
  note?: string;
}

const meals: Meal[] = [
  {
    time: "12:00",
    title: "🌅 破禁食餐",
    description: "东欧早餐组合：",
    items: [
      "Tvorog（奶渣）250g + 蜂蜜 + 核桃",
      "黑面包 2-3片 + 黄油",
      "水煮蛋 2个（熟食区买）",
      "Kefir 400ml",
      "酸黄瓜几根"
    ],
    note: "💡 准备时间：3分钟 | 蛋白质：35g+"
  },
  {
    time: "15:00",
    title: "☀️ 午餐大餐",
    description: "选择1：汤+饺子组合",
    items: [
      "Borsch罗宋汤 500ml（微波加热）",
      "Pelmeni 25个 + Smetana厚厚一层",
      "黑面包 2-3片",
      "酸菜 100g（助消化）"
    ]
  },
  {
    time: "18:00-19:00",
    title: "🌙 晚餐",
    description: "丰盛晚餐：",
    items: [
      "Kotlety肉饼 3个（微波加热）",
      "土豆泥 250g（熟食区）",
      "甜菜沙拉 150g",
      "酸奶油 + 青葱",
      "Kompot果汁 500ml"
    ]
  },
  {
    time: "下午3点",
    title: "🧠 LeetCode加餐",
    description: "快速能量补充：",
    items: [
      "Halva（芝麻糖）50g - 快速能量",
      "葵花籽一大把",
      "Pryaniki蜂蜜饼 2-3块",
      "浓茶配柠檬"
    ]
  }
];

export function MealsPanel() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">🍱 Tashkent Market饮食方案</h2>
      
      <div className="space-y-4">
        {meals.map((meal, index) => (
          <Card key={index} className="gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {meal.title}
              </CardTitle>
              <div className="text-sm text-muted-foreground">{meal.time}</div>
            </CardHeader>
            <CardContent>
              <p className="font-semibold mb-3">{meal.description}</p>
              <ul className="space-y-2">
                {meal.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              {meal.note && (
                <div className="mt-3 p-2 bg-green-50 text-green-700 rounded text-sm">
                  {meal.note}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}