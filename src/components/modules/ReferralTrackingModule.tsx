import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface ReferralStats {
  sent: number;
  replies: number;
  successful: number;
}

export function ReferralTrackingModule() {
  const [referralStats, setReferralStats] = useLocalStorage<ReferralStats>('referralStats', {
    sent: 8,
    replies: 3,
    successful: 1
  });

  const updateStat = (key: keyof ReferralStats, increment: number) => {
    setReferralStats((prev: ReferralStats) => ({
      ...prev,
      [key]: Math.max(0, prev[key] + increment)
    }));
  };

  return (
    <Card className="gradient-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🤝 内推追踪统计
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center space-y-3">
            <h3 className="font-semibold text-lg">📩 本周发送</h3>
            <div className="text-3xl font-bold text-primary">{referralStats.sent}/25</div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(referralStats.sent / 25) * 100}%` }}
              >
                {Math.round((referralStats.sent / 25) * 100)}%
              </div>
            </div>
            <div className="flex gap-2 justify-center">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => updateStat('sent', 1)}
              >
                +1
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => updateStat('sent', -1)}
              >
                -1
              </Button>
            </div>
          </div>

          <div className="text-center space-y-3">
            <h3 className="font-semibold text-lg">💬 收到回复</h3>
            <div className="text-3xl font-bold text-green-600">{referralStats.replies}</div>
            <div className="text-sm text-muted-foreground">
              回复率: {referralStats.sent > 0 ? Math.round((referralStats.replies / referralStats.sent) * 100) : 0}%
            </div>
            <div className="flex gap-2 justify-center">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => updateStat('replies', 1)}
              >
                +1
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => updateStat('replies', -1)}
              >
                -1
              </Button>
            </div>
          </div>

          <div className="text-center space-y-3">
            <h3 className="font-semibold text-lg">✅ 成功内推</h3>
            <div className="text-3xl font-bold text-amber-600">{referralStats.successful}</div>
            <div className="text-sm text-muted-foreground">
              成功率: {referralStats.replies > 0 ? Math.round((referralStats.successful / referralStats.replies) * 100) : 0}%
            </div>
            <div className="flex gap-2 justify-center">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => updateStat('successful', 1)}
              >
                +1
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => updateStat('successful', -1)}
              >
                -1
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-semibold mb-2">📈 本周目标进度</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>发送内推消息</span>
              <span className={referralStats.sent >= 25 ? 'text-green-600 font-semibold' : ''}>
                {referralStats.sent}/25
              </span>
            </div>
            <div className="flex justify-between">
              <span>获得回复</span>
              <span className={referralStats.replies >= 5 ? 'text-green-600 font-semibold' : ''}>
                {referralStats.replies}/5 (目标)
              </span>
            </div>
            <div className="flex justify-between">
              <span>成功内推</span>
              <span className={referralStats.successful >= 2 ? 'text-green-600 font-semibold' : ''}>
                {referralStats.successful}/2 (目标)
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}