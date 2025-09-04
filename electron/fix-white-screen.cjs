const { app, BrowserWindow, protocol } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

// Register protocol for serving local files
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true, stream: true } }
]);

app.on('ready', () => {
  // Register file protocol
  protocol.registerFileProtocol('app', (request, callback) => {
    let url = request.url.substr(6); // Remove 'app://'
    
    // Handle root path
    if (url === '/' || url === '') {
      url = '/index.html';
    }
    
    const filePath = path.normalize(path.join(__dirname, '..', 'dist', url));
    console.log('Protocol request:', request.url, '->', filePath);
    callback({ path: filePath });
  });

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false
    }
  });

  // Try different loading methods
  console.log('=== Attempting to load app ===');
  
  // Method 1: Direct file load
  const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
  
  if (!fs.existsSync(indexPath)) {
    console.error('index.html not found at:', indexPath);
    return;
  }
  
  // Read and modify HTML to use absolute paths
  let htmlContent = fs.readFileSync(indexPath, 'utf8');
  
  // Replace relative paths with app:// protocol
  htmlContent = htmlContent.replace(/src="\.\/assets\//g, 'src="app://assets/');
  htmlContent = htmlContent.replace(/href="\.\/assets\//g, 'href="app://assets/');
  
  // Create a temporary HTML file with modified content
  const tempHtmlPath = path.join(__dirname, '..', 'dist', 'index-fixed.html');
  fs.writeFileSync(tempHtmlPath, htmlContent);
  
  console.log('Loading fixed HTML from:', tempHtmlPath);
  mainWindow.loadFile(tempHtmlPath);
  
  mainWindow.webContents.openDevTools();
  
  // Log all console messages
  mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`[Renderer ${level}]:`, message);
  });
  
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Page loaded successfully');
    
    // Check what's actually loaded
    mainWindow.webContents.executeJavaScript(`
      console.log('=== Page Analysis ===');
      console.log('Title:', document.title);
      console.log('Scripts:', document.scripts.length);
      console.log('Stylesheets:', document.styleSheets.length);
      console.log('Body content:', document.body ? document.body.innerHTML.substring(0, 200) : 'NO BODY');
      console.log('Root element:', document.getElementById('root'));
      
      // Check if React is loaded
      console.log('React loaded?', typeof React !== 'undefined');
      console.log('ReactDOM loaded?', typeof ReactDOM !== 'undefined');
      
      // List all loaded scripts
      Array.from(document.scripts).forEach(script => {
        console.log('Script:', script.src || 'inline');
      });
    `);
  });
  
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
  });
});