const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      enableRemoteModule: false,
    },
    backgroundColor: '#08090a',
    show: false,
  });

  const startURL = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../dist/index.html')}`;

  mainWindow.loadURL(startURL);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC Handlers
ipcMain.handle('open-external', async (event, url) => {
  await shell.openExternal(url);
});

ipcMain.handle('open-file', async (event, filePath) => {
  await shell.openPath(filePath);
});

ipcMain.handle('read-file', async (event, filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('write-file', async (event, filePath, data) => {
  try {
    fs.writeFileSync(filePath, data, 'utf8');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('read-directory', async (event, dirPath) => {
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    const files = entries.map(entry => ({
      name: entry.name,
      path: path.join(dirPath, entry.name),
      isFolder: entry.isDirectory(),
      size: entry.isFile() ? fs.statSync(path.join(dirPath, entry.name)).size : undefined,
      modified: fs.statSync(path.join(dirPath, entry.name)).mtime,
    }));
    return { success: true, data: files };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('read-directory-recursive', async (event, dirPath, maxDepth = 3) => {
  const readDir = (currentPath, depth = 0) => {
    if (depth > maxDepth) return [];
    
    try {
      const entries = fs.readdirSync(currentPath, { withFileTypes: true });
      return entries.map(entry => {
        const fullPath = path.join(currentPath, entry.name);
        const stats = fs.statSync(fullPath);
        
        return {
          name: entry.name,
          path: fullPath,
          isFolder: entry.isDirectory(),
          size: entry.isFile() ? stats.size : undefined,
          modified: stats.mtime,
          children: entry.isDirectory() ? readDir(fullPath, depth + 1) : undefined,
        };
      });
    } catch (error) {
      return [];
    }
  };
  
  try {
    const data = readDir(dirPath);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('delete-file', async (event, filePath) => {
  try {
    fs.unlinkSync(filePath);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('create-directory', async (event, dirPath) => {
  try {
    fs.mkdirSync(dirPath, { recursive: true });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('file-exists', async (event, filePath) => {
  try {
    return { success: true, exists: fs.existsSync(filePath) };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('save-config', async (event, config) => {
  const configPath = path.join(app.getPath('userData'), 'config.json');
  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('load-config', async () => {
  const configPath = path.join(app.getPath('userData'), 'config.json');
  try {
    if (fs.existsSync(configPath)) {
      const data = fs.readFileSync(configPath, 'utf8');
      return { success: true, data: JSON.parse(data) };
    }
    return { success: true, data: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
