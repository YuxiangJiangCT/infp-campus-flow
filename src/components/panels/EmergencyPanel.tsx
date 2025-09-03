import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EmergencyScenario {
  icon: string;
  title: string;
  solutions: string[];
  donts?: string[];
}

const emergencyScenarios: EmergencyScenario[] = [
  {
    icon: "😴",
    title: "睡过头了",
    solutions: [
      "不要恐慌或自责（INFP容易内疚）",
      "直接从当前时间开始执行",
      "跳过已错过的，不要试图补偿",
      "晚上正常时间睡觉（不要熬夜补偿）"
    ]
  },
  {
    icon: "🌙",
    title: "失眠睡不着",
    solutions: [
      "起来写日记10分钟（INFP疗愈法）",
      "做10分钟冥想或祷告",
      "听Yoga Nidra音频",
      "第二天正常起床（即使很困）"
    ],
    donts: [
      "绝对不看手机！不看时间！"
    ]
  },
  {
    icon: "🍔",
    title: "太饿了/没准备食物",
    solutions: [
      "冰箱常备：Greek Yogurt、水煮蛋、坚果",
      "快速选择：TJ Mac & Cheese（3分钟）",
      "深夜选择：只喝Kefir或温牛奶",
      "应急外卖：限制$15以内，不要罪恶感"
    ]
  },
  {
    icon: "📱",
    title: "想刷手机",
    solutions: [
      "设置15分钟倒计时",
      "冲动像海浪，等10分钟会消退",
      "替代：写3个感恩的事",
      "或者：做5个深呼吸",
      "记录：什么触发了这个冲动？"
    ]
  },
  {
    icon: "😔",
    title: "被拒/情绪低落",
    solutions: [
      "立即运动15分钟（最有效！）",
      "给自己写一封鼓励信",
      "看之前的成功记录",
      "允许自己难过30分钟",
      "然后做一件小的productive事情"
    ]
  }
];

export function EmergencyPanel() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">🆘 应急处理方案</h2>
      
      <div className="space-y-4">
        {emergencyScenarios.map((scenario, index) => (
          <Card key={index} className="gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">{scenario.icon}</span>
                {scenario.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {scenario.donts && (
                <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded">
                  <h4 className="font-semibold text-red-700 mb-2">❌ 绝对不要做：</h4>
                  <ul className="space-y-1">
                    {scenario.donts.map((dont, dontIndex) => (
                      <li key={dontIndex} className="text-red-600">
                        • {dont}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <h4 className="font-semibold text-green-700 mb-2">✅ 应对方法：</h4>
              <ul className="space-y-2">
                {scenario.solutions.map((solution, solutionIndex) => (
                  <li key={solutionIndex} className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>{solution}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="alert-success">
        <strong>💝 INFP提醒：</strong>
        你是一个有感情、有创造力的人。偶尔的失误不代表失败，而是成长的机会。
        记住你的内在价值不取决于完美的执行。
      </div>
    </div>
  );
}