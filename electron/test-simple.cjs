const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Load test HTML
  const testPath = path.join(__dirname, '..', 'test-electron.html');
  console.log('Loading test HTML from:', testPath);
  mainWindow.loadFile(testPath);
  
  mainWindow.webContents.openDevTools();
  
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Page loaded successfully!');
  });
  
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
  });
}

app.whenReady().then(createWindow);