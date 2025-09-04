const { app, BrowserWindow, protocol } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

// Enable detailed logging
app.commandLine.appendSwitch('enable-logging');
app.commandLine.appendSwitch('v', '1');

function createWindow() {
  console.log('=== Creating Electron Window ===');
  console.log('Current directory:', __dirname);
  console.log('App path:', app.getAppPath());
  
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false // Disable security for testing
    }
  });

  const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
  console.log('Looking for index.html at:', indexPath);
  
  // Check if file exists
  if (!fs.existsSync(indexPath)) {
    console.error('ERROR: index.html not found!');
    console.error('Checking parent directory:', path.join(__dirname, '..'));
    const parentFiles = fs.readdirSync(path.join(__dirname, '..'));
    console.log('Files in parent directory:', parentFiles);
  } else {
    console.log('SUCCESS: index.html found!');
    const stats = fs.statSync(indexPath);
    console.log('File size:', stats.size, 'bytes');
    
    // Read and log first 500 characters of HTML
    const htmlContent = fs.readFileSync(indexPath, 'utf8');
    console.log('First 500 chars of HTML:', htmlContent.substring(0, 500));
  }

  // Try to load the file
  console.log('Loading file...');
  mainWindow.loadFile(indexPath).then(() => {
    console.log('SUCCESS: File loaded!');
  }).catch(err => {
    console.error('ERROR loading file:', err);
  });

  // Open DevTools
  mainWindow.webContents.openDevTools();

  // Log all console messages from renderer
  mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`RENDERER [${level}]:`, message);
    if (sourceId) console.log(`  Source: ${sourceId}:${line}`);
  });

  // Log when DOM is ready
  mainWindow.webContents.on('dom-ready', () => {
    console.log('DOM Ready');
    
    // Inject a test script
    mainWindow.webContents.executeJavaScript(`
      console.log('=== Injected Script Running ===');
      console.log('Document title:', document.title);
      console.log('Document body:', document.body ? 'EXISTS' : 'MISSING');
      console.log('Root element:', document.getElementById('root'));
      console.log('All scripts:', Array.from(document.scripts).map(s => s.src || 'inline'));
      console.log('Window location:', window.location.href);
    `);
  });

  // Log navigation events
  mainWindow.webContents.on('did-start-loading', () => {
    console.log('Started loading...');
  });

  mainWindow.webContents.on('did-stop-loading', () => {
    console.log('Stopped loading');
  });

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error('FAILED TO LOAD:', errorCode, errorDescription, validatedURL);
  });

  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Finished loading');
  });

  // Log any crashes
  mainWindow.webContents.on('crashed', (event, killed) => {
    console.error('Renderer crashed! Killed:', killed);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  console.log('=== Electron App Ready ===');
  console.log('App version:', app.getVersion());
  console.log('Electron version:', process.versions.electron);
  console.log('Node version:', process.versions.node);
  console.log('Chrome version:', process.versions.chrome);
  
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});