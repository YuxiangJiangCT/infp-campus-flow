const { app, BrowserWindow, protocol } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false // Temporarily disable for ES modules
    }
  });

  // Read the HTML file
  const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
  let htmlContent = fs.readFileSync(indexPath, 'utf8');
  
  // Fix 1: Remove crossorigin attribute
  htmlContent = htmlContent.replace(/crossorigin/g, '');
  
  // Fix 2: Convert relative paths to absolute file:// paths
  const distPath = path.join(__dirname, '..', 'dist');
  const filePrefix = `file://${distPath}/`;
  
  htmlContent = htmlContent.replace(/src="\.\/assets\//g, `src="${filePrefix}assets/`);
  htmlContent = htmlContent.replace(/href="\.\/assets\//g, `href="${filePrefix}assets/`);
  
  // Write the fixed HTML
  const fixedHtmlPath = path.join(distPath, 'index-electron.html');
  fs.writeFileSync(fixedHtmlPath, htmlContent);
  
  console.log('Loading fixed HTML with absolute paths...');
  mainWindow.loadFile(fixedHtmlPath);
  
  mainWindow.webContents.openDevTools();
  
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Page loaded!');
    
    // Check if the app is working
    mainWindow.webContents.executeJavaScript(`
      setTimeout(() => {
        console.log('=== App Status Check ===');
        const root = document.getElementById('root');
        console.log('Root children:', root ? root.children.length : 0);
        console.log('Has content?', root && root.children.length > 0 ? 'YES' : 'NO');
        
        // Check for React
        console.log('Window.__remixContext:', typeof window.__remixContext);
        console.log('Window.React:', typeof window.React);
      }, 1000);
    `);
  });
  
  mainWindow.webContents.on('console-message', (event, level, message) => {
    console.log(`[Renderer]:`, message);
  });
});