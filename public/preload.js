const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('dashboardAPI', {
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  openFile: (filePath) => ipcRenderer.invoke('open-file', filePath),
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
  writeFile: (filePath, data) => ipcRenderer.invoke('write-file', filePath, data),
  readDirectory: (dirPath) => ipcRenderer.invoke('read-directory', dirPath),
  readDirectoryRecursive: (dirPath, maxDepth) => ipcRenderer.invoke('read-directory-recursive', dirPath, maxDepth),
  deleteFile: (filePath) => ipcRenderer.invoke('delete-file', filePath),
  createDirectory: (dirPath) => ipcRenderer.invoke('create-directory', dirPath),
  fileExists: (filePath) => ipcRenderer.invoke('file-exists', filePath),
  saveConfig: (config) => ipcRenderer.invoke('save-config', config),
  loadConfig: () => ipcRenderer.invoke('load-config'),
});
