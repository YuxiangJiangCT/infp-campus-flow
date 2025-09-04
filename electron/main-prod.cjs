const { app, BrowserWindow, Menu, Tray, screen, ipcMain, protocol } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow = null;
let floatingWindow = null;
let tray = null;

// Register file protocol for serving local files
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true, stream: true } }
]);

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),
      webSecurity: false // Temporarily disable for testing
    },
    icon: path.join(__dirname, '..', 'public', 'favicon.ico'),
    show: false
  });

  // Load the index.html file
  const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
  
  // Check if file exists
  if (!fs.existsSync(indexPath)) {
    console.error('Index file not found at:', indexPath);
    console.error('Current directory:', __dirname);
    console.error('Looking for files in:', path.join(__dirname, '..', 'dist'));
    
    // Try to list what's available
    const distPath = path.join(__dirname, '..', 'dist');
    if (fs.existsSync(distPath)) {
      console.log('Files in dist:', fs.readdirSync(distPath));
    }
  } else {
    console.log('Loading index from:', indexPath);
    mainWindow.loadFile(indexPath).catch(err => {
      console.error('Failed to load index.html:', err);
    });
  }
  
  // Open DevTools for debugging
  mainWindow.webContents.openDevTools();
  
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  
  // Log any console messages from the renderer
  mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`Renderer: ${message}`);
  });
  
  // Log navigation errors
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
  });
}

function createFloatingWindow() {
  const { width } = screen.getPrimaryDisplay().workAreaSize;
  
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
      webSecurity: false
    }
  });

  const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
  floatingWindow.loadFile(indexPath, { hash: '/floating' });
  
  floatingWindow.setAlwaysOnTop(true, 'floating');
  floatingWindow.setIgnoreMouseEvents(false);

  floatingWindow.on('closed', () => {
    floatingWindow = null;
  });
}

function createTray() {
  let iconPath = path.join(process.resourcesPath, 'tray-icon.png');
  
  if (!fs.existsSync(iconPath)) {
    console.log('Tray icon not found at:', iconPath);
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

// IPC handlers
ipcMain.on('close-floating-window', () => {
  if (floatingWindow) {
    floatingWindow.close();
  }
});

ipcMain.on('minimize-floating-window', () => {
  // Window stays visible but shows mini mode
});

ipcMain.on('toggle-floating-transparency', (event, transparent) => {
  if (floatingWindow) {
    floatingWindow.setIgnoreMouseEvents(transparent);
  }
});

ipcMain.on('resize-floating-window', (event, { width, height }) => {
  if (floatingWindow) {
    floatingWindow.setSize(width, height);
  }
});

app.whenReady().then(() => {
  // Setup custom protocol to serve local files
  protocol.registerFileProtocol('app', (request, callback) => {
    const url = request.url.substr(6); // Remove 'app://'
    callback({ path: path.normalize(path.join(__dirname, '..', url)) });
  });
  
  createMainWindow();
  createFloatingWindow();
  createTray();
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