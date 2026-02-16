const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('dashboardAPI', {
  openApp: (path) => ipcRenderer.invoke('open-app', path),
  openAppWithFile: (payload) => ipcRenderer.invoke('open-app-with-file', payload),
  openFile: (path) => ipcRenderer.invoke('open-file', path),
  readFile: (path) => ipcRenderer.invoke('read-file', path),
  writeFile: (payload) => ipcRenderer.invoke('write-file', payload),
  listDirectory: (path) => ipcRenderer.invoke('list-directory', path),
  saveConfig: (payload) => ipcRenderer.invoke('save-config', payload),
  loadConfig: () => ipcRenderer.invoke('load-config'),
  selectFile: () => ipcRenderer.invoke('select-file'),
  selectFolder: () => ipcRenderer.invoke('select-folder')
});
