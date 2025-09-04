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
      preload: path.join(__dirname, 'preload.cjs'),
      webSecurity: false // Allow ES modules to load
    },
    icon: path.join(__dirname, '..', 'public', 'favicon.ico'),
    show: false
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:8080/infp-campus-flow/');
  } else {
    // In production, fix and load the HTML file
    const fs = require('fs');
    const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
    let htmlContent = fs.readFileSync(indexPath, 'utf8');
    
    // Fix for ES modules in Electron
    htmlContent = htmlContent.replace(/crossorigin/g, '');
    const distPath = path.join(__dirname, '..', 'dist');
    const filePrefix = `file://${distPath}/`;
    htmlContent = htmlContent.replace(/src="\.\/assets\//g, `src="${filePrefix}assets/`);
    htmlContent = htmlContent.replace(/href="\.\/assets\//g, `href="${filePrefix}assets/`);
    
    const fixedHtmlPath = path.join(distPath, 'index-electron.html');
    fs.writeFileSync(fixedHtmlPath, htmlContent);
    
    console.log('Loading main window from:', fixedHtmlPath);
    mainWindow.loadFile(fixedHtmlPath);
  }
  
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
      preload: path.join(__dirname, 'preload.cjs'),
      webSecurity: false // Allow ES modules to load
    }
  });

  if (isDev) {
    floatingWindow.loadURL('http://localhost:8080/infp-campus-flow/#/floating');
  } else {
    // In production, use the fixed HTML
    const fixedHtmlPath = path.join(__dirname, '..', 'dist', 'index-electron.html');
    console.log('Loading floating window from:', fixedHtmlPath);
    floatingWindow.loadFile(fixedHtmlPath, {
      hash: '/floating'
    });
  }
  
  // Set window level to floating
  floatingWindow.setAlwaysOnTop(true, 'floating');
  
  // Make window click-through except for specific areas
  floatingWindow.setIgnoreMouseEvents(false);

  floatingWindow.on('closed', () => {
    floatingWindow = null;
  });
}

function createTray() {
  // Create tray icon - use different path for production vs development
  let iconPath;
  if (isDev) {
    iconPath = path.join(__dirname, '..', 'public', 'tray-icon.png');
  } else {
    // In production, use resourcesPath
    iconPath = path.join(process.resourcesPath, 'tray-icon.png');
  }
  
  // Only create tray if icon exists
  const fs = require('fs');
  if (!fs.existsSync(iconPath)) {
    console.log('Tray icon not found at:', iconPath);
    console.log('Skipping tray creation');
    return;
  }
  
  tray = new Tray(iconPath);
  
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
  // Don't hide the window, let the React component handle the minimized state
  // The window stays visible but shows mini mode
});

ipcMain.on('toggle-floating-transparency', (event, transparent) => {
  if (floatingWindow) {
    floatingWindow.setIgnoreMouseEvents(transparent);
  }
});

// Handle window resize for mini/full mode
ipcMain.on('resize-floating-window', (event, { width, height }) => {
  if (floatingWindow) {
    floatingWindow.setSize(width, height);
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