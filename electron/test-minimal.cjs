const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false
    }
  });

  // Test 1: Load minimal test HTML
  const testPath = path.join(__dirname, '..', 'test-minimal.html');
  console.log('Loading:', testPath);
  mainWindow.loadFile(testPath);
  
  mainWindow.webContents.openDevTools();
  
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Page loaded!');
    
    // After 3 seconds, try loading the actual app
    setTimeout(() => {
      console.log('Now loading actual app...');
      const appPath = path.join(__dirname, '..', 'dist', 'index.html');
      mainWindow.loadFile(appPath);
    }, 3000);
  });
});