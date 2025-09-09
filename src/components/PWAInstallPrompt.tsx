import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Download, 
  X, 
  Smartphone,
  Monitor,
  Check
} from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop'>('desktop');

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Detect platform
    const userAgent = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setPlatform('ios');
    } else if (/android/.test(userAgent)) {
      setPlatform('android');
    } else {
      setPlatform('desktop');
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt after 30 seconds or on second visit
      const hasVisited = localStorage.getItem('infp-flow-visited');
      if (hasVisited) {
        setTimeout(() => setShowPrompt(true), 2000);
      } else {
        localStorage.setItem('infp-flow-visited', 'true');
        setTimeout(() => setShowPrompt(true), 30000);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if iOS and not installed
    if (platform === 'ios' && !isInstalled) {
      const hasSeenIOSPrompt = localStorage.getItem('infp-flow-ios-prompt');
      if (!hasSeenIOSPrompt) {
        setTimeout(() => setShowPrompt(true), 5000);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) {
      // For iOS, show instructions
      if (platform === 'ios') {
        localStorage.setItem('infp-flow-ios-prompt', 'true');
      }
      return;
    }

    try {
      await installPrompt.prompt();
      const result = await installPrompt.userChoice;
      
      if (result.outcome === 'accepted') {
        setIsInstalled(true);
        setShowPrompt(false);
        console.log('App installed successfully');
      }
    } catch (error) {
      console.error('Installation failed:', error);
    }
    
    setInstallPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't show again for 7 days
    localStorage.setItem('infp-flow-prompt-dismissed', Date.now().toString());
  };

  // Check if recently dismissed
  useEffect(() => {
    const dismissedTime = localStorage.getItem('infp-flow-prompt-dismissed');
    if (dismissedTime) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        setShowPrompt(false);
      }
    }
  }, []);

  if (isInstalled || !showPrompt) {
    return null;
  }

  // iOS specific instructions
  if (platform === 'ios') {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom">
        <Alert className="bg-background border-2 shadow-lg">
          <Smartphone className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-3">
              <p className="font-semibold">安装到主屏幕，获得更好体验！</p>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>点击Safari底部的分享按钮 <span className="text-blue-500">⬆️</span></li>
                <li>向下滑动，点击"添加到主屏幕" <span className="text-blue-500">➕</span></li>
                <li>点击"添加"完成安装</li>
              </ol>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleDismiss}>
                  知道了
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Android/Desktop install prompt
  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-in slide-in-from-bottom">
      <Alert className="bg-background border-2 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            {platform === 'desktop' ? <Monitor className="h-5 w-5 text-primary" /> : <Smartphone className="h-5 w-5 text-primary" />}
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-start">
              <p className="font-semibold">安装 INFP Flow 应用</p>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={handleDismiss}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              安装后可离线使用，获得原生应用体验
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Check className="h-3 w-3" />
              <span>离线可用</span>
              <Check className="h-3 w-3" />
              <span>独立窗口</span>
              <Check className="h-3 w-3" />
              <span>快速启动</span>
            </div>
            <div className="flex gap-2 pt-2">
              <Button size="sm" className="flex-1" onClick={handleInstall}>
                <Download className="h-4 w-4 mr-2" />
                立即安装
              </Button>
              <Button size="sm" variant="outline" onClick={handleDismiss}>
                稍后
              </Button>
            </div>
          </div>
        </div>
      </Alert>
    </div>
  );
}