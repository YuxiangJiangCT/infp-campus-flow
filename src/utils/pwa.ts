// PWA Service Worker Registration

export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      // Wait for window load
      window.addEventListener('load', async () => {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/infp-campus-flow/'
        });
        
        console.log('Service Worker registered:', registration);
        
        // Check for updates every hour
        setInterval(() => {
          registration.update();
        }, 1000 * 60 * 60);
        
        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New update available
                showUpdateNotification();
              }
            });
          }
        });
      });
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
}

function showUpdateNotification() {
  const shouldUpdate = confirm('新版本可用！是否立即更新？');
  if (shouldUpdate) {
    window.location.reload();
  }
}

// Check if app is installed
export function isAppInstalled(): boolean {
  // Check display mode
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true;
  }
  
  // Check iOS standalone
  if ((window.navigator as any).standalone === true) {
    return true;
  }
  
  return false;
}

// Get platform info
export function getPlatformInfo() {
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (/iphone|ipad|ipod/.test(userAgent)) {
    return { platform: 'ios', device: 'mobile' };
  }
  
  if (/android/.test(userAgent)) {
    return { platform: 'android', device: 'mobile' };
  }
  
  if (/macintosh|mac os x/.test(userAgent)) {
    return { platform: 'macos', device: 'desktop' };
  }
  
  if (/windows/.test(userAgent)) {
    return { platform: 'windows', device: 'desktop' };
  }
  
  return { platform: 'unknown', device: 'desktop' };
}

// Request notification permission
export async function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return Notification.permission === 'granted';
}

// Show notification
export function showNotification(title: string, options?: NotificationOptions) {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/infp-campus-flow/icon-192.png',
      badge: '/infp-campus-flow/icon-192.png',
      ...options
    });
  }
}