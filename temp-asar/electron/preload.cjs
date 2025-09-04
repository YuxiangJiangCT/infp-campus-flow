const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  closeFloatingWindow: () => ipcRenderer.send('close-floating-window'),
  minimizeFloatingWindow: () => ipcRenderer.send('minimize-floating-window'),
  toggleFloatingTransparency: (transparent) => ipcRenderer.send('toggle-floating-transparency', transparent),
  resizeFloatingWindow: (width, height) => ipcRenderer.send('resize-floating-window', { width, height }),
  
  // Platform detection
  platform: process.platform,
  
  // Window type detection
  isFloatingWindow: () => {
    return window.location.hash === '#/floating';
  }
});