import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { getNYDate } from '@/utils/timezone';
import { 
  Lightbulb, 
  Moon, 
  Sun,
  Smartphone,
  Monitor,
  ShoppingCart,
  Check,
  AlertCircle,
  Clock,
  Zap,
  Home
} from 'lucide-react';

interface LightPhase {
  id: string;
  time: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  actions: string[];
  completed?: boolean;
}

interface LightSetting {
  id: string;
  device: string;
  setting: string;
  instruction: string;
  completed?: boolean;
}

const lightPhases: LightPhase[] = [
  {
    id: 'phase1',
    time: '20:00',
    title: '开始调暗',
    description: '关掉一半的灯，营造放松氛围',
    icon: <Sun className="w-4 h-4" />,
    actions: [
      '关掉顶灯（天花板大灯）',
      '关掉所有白色亮灯',
      '只开1-2个暖光台灯',
      '灯光调到最低亮度',
      '灯光不要直射眼睛'
    ]
  },
  {
    id: 'phase2',
    time: '21:00',
    title: '深度调暗',
    description: '只留最小必要光源',
    icon: <Moon className="w-4 h-4" />,
    actions: [
      '只留一盏最弱的暖光灯',
      '可以用盐灯或蜡烛（安全前提下）',
      '手机/电脑亮度调到30%以下',
      '开启所有设备的夜间模式',
      '避免去明亮的房间（如浴室）'
    ]
  },
  {
    id: 'phase3',
    time: '22:00',
    title: '睡眠模式',
    description: '准备入睡，最小光源',
    icon: <Moon className="w-4 h-4 text-blue-500" />,
    actions: [
      '只开床头最小的灯',
      '或用手机手电筒朝天花板（最弱模式）',
      '够走路不撞到就行',
      '浴室如需使用，用手机照明',
      '避免查看任何屏幕'
    ]
  }
];

const deviceSettings: LightSetting[] = [
  {
    id: 'iphone',
    device: 'iPhone',
    setting: 'Night Shift',
    instruction: '设置 → 显示与亮度 → 夜览 → 设置20:00-7:00，色温最暖'
  },
  {
    id: 'iphone2',
    device: 'iPhone',
    setting: '降低白点值',
    instruction: '设置 → 辅助功能 → 显示与文字大小 → 降低白点值 → 调到50%'
  },
  {
    id: 'mac',
    device: 'Mac',
    setting: 'Night Shift',
    instruction: '系统设置 → 显示器 → Night Shift → 设置20:00-7:00，色温最暖'
  },
  {
    id: 'windows',
    device: 'Windows',
    setting: 'Night Light',
    instruction: '设置 → 系统 → 显示 → 夜间模式 → 计划20:00-7:00，强度最大'
  }
];

const shoppingList = [
  {
    category: '不花钱方案',
    items: [
      '20:00 - 关掉一半的灯',
      '21:00 - 只留一盏最远的灯',
      '22:00 - 只用手机屏幕的光',
      '用衣服/纸巾遮住部分灯泡降低亮度'
    ]
  },
  {
    category: '基础方案 ($10-20)',
    items: [
      '暖光灯泡 2700K (标注"warm white")',
      '小夜灯（插墙上那种）',
      '灯泡调光器（旋钮式）'
    ]
  },
  {
    category: '理想方案 ($30-50)',
    items: [
      '可调光台灯（带旋钮调节）',
      '智能灯泡（手机APP控制）',
      '盐灯（天然橙色光）',
      '红光小夜灯'
    ]
  }
];

export function LightManagementModule() {
  const [phaseStatus, setPhaseStatus] = useLocalStorage<Record<string, boolean>>('lightPhaseStatus', {});
  const [deviceStatus, setDeviceStatus] = useLocalStorage<Record<string, boolean>>('lightDeviceStatus', {});
  const [consecutiveDays, setConsecutiveDays] = useLocalStorage('lightConsecutiveDays', 0);
  const [lastCompleteDate, setLastCompleteDate] = useLocalStorage<string | null>('lightLastComplete', null);
  const [currentPhase, setCurrentPhase] = useState<LightPhase | null>(null);
  const [showSetupGuide, setShowSetupGuide] = useState(false);

  // Determine current phase based on time
  useEffect(() => {
    const checkCurrentPhase = () => {
      const now = getNYDate();
      const hour = now.getHours();
      const minute = now.getMinutes();
      const currentTime = hour * 60 + minute;
      
      if (currentTime >= 22 * 60) {
        setCurrentPhase(lightPhases[2]); // 22:00+ Sleep mode
      } else if (currentTime >= 21 * 60) {
        setCurrentPhase(lightPhases[1]); // 21:00+ Deep dim
      } else if (currentTime >= 20 * 60) {
        setCurrentPhase(lightPhases[0]); // 20:00+ Start dimming
      } else {
        setCurrentPhase(null); // Before 20:00
      }
    };
    
    checkCurrentPhase();
    const interval = setInterval(checkCurrentPhase, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  const togglePhase = (phaseId: string) => {
    const newStatus = { ...phaseStatus, [phaseId]: !phaseStatus[phaseId] };
    setPhaseStatus(newStatus);
    
    // Check if all phases completed today
    const allCompleted = lightPhases.every(phase => newStatus[phase.id]);
    if (allCompleted) {
      const today = getNYDate().toISOString().split('T')[0];
      if (lastCompleteDate !== today) {
        setConsecutiveDays(prev => prev + 1);
        setLastCompleteDate(today);
      }
    }
  };

  const toggleDevice = (deviceId: string) => {
    setDeviceStatus({ ...deviceStatus, [deviceId]: !deviceStatus[deviceId] });
  };

  const completedPhases = lightPhases.filter(p => phaseStatus[p.id]).length;
  const phaseProgress = (completedPhases / lightPhases.length) * 100;
  
  const completedDevices = deviceSettings.filter(d => deviceStatus[d.id]).length;
  const deviceProgress = (completedDevices / deviceSettings.length) * 100;

  const isNightTime = currentPhase !== null;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              晚间灯光管理
            </CardTitle>
            <CardDescription className="mt-1">
              渐进式调暗，帮助身体自然产生褪黑素
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              连续{consecutiveDays}天
            </Badge>
            {isNightTime && currentPhase && (
              <Badge className="flex items-center gap-1">
                {currentPhase.icon}
                {currentPhase.title}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current Status Alert */}
        {isNightTime && currentPhase && (
          <Alert className="border-orange-500/50 bg-orange-50 dark:bg-orange-900/20">
            <Clock className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <div className="font-semibold">
                  现在应该：{currentPhase.description}
                </div>
                <div className="text-sm">
                  {currentPhase.actions[0]}
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        {/* Progress Overview */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">今日进度</span>
              <span>{completedPhases}/3 阶段</span>
            </div>
            <Progress value={phaseProgress} className="h-2" />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">设备设置</span>
              <span>{completedDevices}/{deviceSettings.length}</span>
            </div>
            <Progress value={deviceProgress} className="h-2" />
          </div>
        </div>

        <Tabs defaultValue="phases" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="phases">灯光阶段</TabsTrigger>
            <TabsTrigger value="devices">设备设置</TabsTrigger>
            <TabsTrigger value="shopping">购物清单</TabsTrigger>
          </TabsList>

          {/* Light Phases Tab */}
          <TabsContent value="phases" className="space-y-3 mt-4">
            {lightPhases.map((phase, index) => (
              <div 
                key={phase.id}
                className={`
                  p-4 rounded-lg border-2 transition-all
                  ${phaseStatus[phase.id] 
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-500/50' 
                    : currentPhase?.id === phase.id
                    ? 'border-orange-500/50 bg-orange-50/50 dark:bg-orange-900/10'
                    : 'border-border'
                  }
                `}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={phaseStatus[phase.id] || false}
                        onCheckedChange={() => togglePhase(phase.id)}
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-semibold text-primary">
                            {phase.time}
                          </span>
                          <span className="font-medium">
                            {phase.title}
                          </span>
                          {phase.icon}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {phase.description}
                        </p>
                      </div>
                    </div>
                    {currentPhase?.id === phase.id && (
                      <Badge variant="default">当前</Badge>
                    )}
                  </div>
                  
                  <div className="ml-11 space-y-1">
                    {phase.actions.map((action, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <span className="text-muted-foreground">•</span>
                        <span className={phaseStatus[phase.id] ? 'text-muted-foreground line-through' : ''}>
                          {action}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <span className="font-semibold">判断标准：</span>
                能看清东西但感觉"有点暗"就对了。如果还很亮，继续调暗！
              </AlertDescription>
            </Alert>
          </TabsContent>

          {/* Device Settings Tab */}
          <TabsContent value="devices" className="space-y-3 mt-4">
            <Alert>
              <Smartphone className="h-4 w-4" />
              <AlertDescription>
                设备的蓝光是影响睡眠的主要元凶，必须设置夜间模式！
              </AlertDescription>
            </Alert>
            
            {deviceSettings.map(device => (
              <div 
                key={device.id}
                className={`
                  p-3 rounded-lg border
                  ${deviceStatus[device.id] ? 'bg-green-50 dark:bg-green-900/20' : ''}
                `}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={deviceStatus[device.id] || false}
                    onCheckedChange={() => toggleDevice(device.id)}
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Monitor className="w-4 h-4" />
                      <span className="font-medium">{device.device}</span>
                      <Badge variant="outline" className="text-xs">
                        {device.setting}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {device.instruction}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="pt-3 border-t">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowSetupGuide(!showSetupGuide)}
              >
                查看详细设置教程
              </Button>
            </div>
          </TabsContent>

          {/* Shopping List Tab */}
          <TabsContent value="shopping" className="space-y-4 mt-4">
            <Alert>
              <ShoppingCart className="h-4 w-4" />
              <AlertDescription>
                先试试不花钱的方案，有效果再考虑购买！
              </AlertDescription>
            </Alert>
            
            {shoppingList.map(category => (
              <div key={category.category} className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  {category.category}
                </h4>
                <div className="space-y-1 ml-6">
                  {category.items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <Check className="w-3 h-3 text-green-500 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            <Alert className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500/50">
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <span className="font-semibold">关键词：</span>
                买灯泡时找"2700K"或"warm white"（暖白光），避免"cool white"（冷白光）！
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>

        {/* Quick Summary */}
        <div className="pt-4 border-t">
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold">
              一句话总结
            </p>
            <p className="text-sm text-muted-foreground">
              晚上8点后，家里要像酒吧一样暗（但不是全黑），暖黄光，看得见但不刺眼
            </p>
            {!isNightTime && (
              <p className="text-xs text-muted-foreground">
                晚上8点后回来查看今日灯光管理计划
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}