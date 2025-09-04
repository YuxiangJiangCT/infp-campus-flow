const { app, BrowserWindow, Menu, Tray, screen, ipcMain } = require('electron');
const path = require('path');
const { fork } = require('child_process');

let mainWindow = null;
let floatingWindow = null;
let tray = null;
let viteServer = null;

const isDev = process.env.NODE_ENV !== 'production';

// Start Vite dev server in development
function startViteServer() {
  if (!isDev) return;
  
  viteServer = fork(
    path.join(__dirname, '..', 'node_modules', '.bin', 'vite'),
    [],
    {
      stdio: 'inherit',
      shell: true
    }
  );
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs')
    },
    icon: path.join(__dirname, '..', 'public', 'favicon.ico'),
    show: false
  });

  const url = isDev 
    ? 'http://localhost:8081/infp-campus-flow/'
    : `file://${path.join(__dirname, '..', 'dist', 'index.html')}`;

  mainWindow.loadURL(url);
  
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createFloatingWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  
  floatingWindow = new BrowserWindow({
    width: 300,
    height: 200,
    x: width - 320,
    y: 20,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    movable: true,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs')
    }
  });

  const floatingUrl = isDev 
    ? 'http://localhost:8081/infp-campus-flow/#/floating'
    : `file://${path.join(__dirname, '..', 'dist', 'index.html')}#/floating`;

  floatingWindow.loadURL(floatingUrl);
  
  // Set window level to floating
  floatingWindow.setAlwaysOnTop(true, 'floating');
  
  // Make window click-through except for specific areas
  floatingWindow.setIgnoreMouseEvents(false);

  floatingWindow.on('closed', () => {
    floatingWindow = null;
  });
}

function createTray() {
  // Create tray icon
  tray = new Tray(path.join(__dirname, '..', 'public', 'tray-icon.png'));
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示主窗口',
      click: () => {
        if (!mainWindow) {
          createMainWindow();
        } else {
          mainWindow.show();
        }
      }
    },
    {
      label: '显示/隐藏浮动窗口',
      click: () => {
        if (!floatingWindow) {
          createFloatingWindow();
        } else if (floatingWindow.isVisible()) {
          floatingWindow.hide();
        } else {
          floatingWindow.show();
        }
      }
    },
    { type: 'separator' },
    {
      label: '退出',
      click: () => {
        app.quit();
      }
    }
  ]);
  
  tray.setToolTip('INFP Campus Flow - 任务管理');
  tray.setContextMenu(contextMenu);
  
  // Click on tray icon to show/hide floating window
  tray.on('click', () => {
    if (floatingWindow && floatingWindow.isVisible()) {
      floatingWindow.hide();
    } else if (floatingWindow) {
      floatingWindow.show();
    } else {
      createFloatingWindow();
    }
  });
}

// IPC handlers for window controls
ipcMain.on('close-floating-window', () => {
  if (floatingWindow) {
    floatingWindow.close();
  }
});

ipcMain.on('minimize-floating-window', () => {
  if (floatingWindow) {
    floatingWindow.hide();
  }
});

ipcMain.on('toggle-floating-transparency', (event, transparent) => {
  if (floatingWindow) {
    floatingWindow.setIgnoreMouseEvents(transparent);
  }
});

app.whenReady().then(() => {
  if (isDev) {
    startViteServer();
    // Wait for Vite to start
    setTimeout(() => {
      createMainWindow();
      createFloatingWindow();
      createTray();
    }, 3000);
  } else {
    createMainWindow();
    createFloatingWindow();
    createTray();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

// Clean up on quit
app.on('before-quit', () => {
  if (viteServer) {
    viteServer.kill();
  }
});