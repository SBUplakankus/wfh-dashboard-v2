const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('dashboardAPI', {
  openApp: (path) => ipcRenderer.invoke('open-app', path),
  openFile: (path) => ipcRenderer.invoke('open-file', path),
  readFile: (path) => ipcRenderer.invoke('read-file', path),
  saveConfig: (payload) => ipcRenderer.invoke('save-config', payload),
  loadConfig: () => ipcRenderer.invoke('load-config'),
  selectFile: () => ipcRenderer.invoke('select-file'),
  selectFolder: () => ipcRenderer.invoke('select-folder')
});
