const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const fs = require('fs/promises');
const path = require('path');
const { spawn } = require('child_process');
const isDev = require('electron-is-dev');

const configPath = () => path.join(app.getPath('userData'), 'dashboard-config.json');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1600,
    height: 1000,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  if (isDev) {
    win.loadURL('http://localhost:3000');
  } else {
    win.loadFile(path.join(__dirname, '../build/index.html'));
  }
};

app.whenReady().then(() => {
  ipcMain.handle('open-app', async (_, appPath) => {
    if (!appPath) return { ok: false, error: 'Missing app path' };
    try {
      spawn(appPath, [], { detached: true, stdio: 'ignore' }).unref();
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  });

  ipcMain.handle('open-file', async (_, filePath) => {
    if (!filePath) return { ok: false, error: 'Missing file path' };
    try {
      await shell.openPath(filePath);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  });

  ipcMain.handle('read-file', async (_, filePath) => {
    if (!filePath) return '';
    try {
      return await fs.readFile(filePath, 'utf8');
    } catch {
      return '';
    }
  });

  ipcMain.handle('save-config', async (_, payload) => {
    await fs.writeFile(configPath(), JSON.stringify(payload, null, 2), 'utf8');
    return true;
  });

  ipcMain.handle('load-config', async () => {
    try {
      const raw = await fs.readFile(configPath(), 'utf8');
      return JSON.parse(raw);
    } catch {
      return null;
    }
  });

  ipcMain.handle('select-file', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({ properties: ['openFile'] });
    return canceled ? null : filePaths[0];
  });

  ipcMain.handle('select-folder', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({ properties: ['openDirectory'] });
    return canceled ? null : filePaths[0];
  });

  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
