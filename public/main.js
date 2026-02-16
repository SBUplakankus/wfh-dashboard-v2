const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const fs = require('fs/promises');
const path = require('path');
const { spawn } = require('child_process');
const isDev = require('electron-is-dev');
const MAX_DIRECTORY_DEPTH = 5;

const configPath = () => path.join(app.getPath('userData'), 'dashboard-config.json');
const isMarkdown = (value) => value.toLowerCase().endsWith('.md');

const buildDirectoryTree = async (dirPath, depth = 0, maxDepth = MAX_DIRECTORY_DEPTH) => {
  if (!dirPath || depth > maxDepth) return [];
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const nodes = await Promise.all(
    entries
      .filter((entry) => !entry.name.startsWith('.'))
      .map(async (entry) => {
        const fullPath = path.join(dirPath, entry.name);
        if (entry.isDirectory()) {
          return {
            type: 'folder',
            name: entry.name,
            path: fullPath,
            children: await buildDirectoryTree(fullPath, depth + 1, maxDepth)
          };
        }

        if (!isMarkdown(entry.name)) return null;
        const stats = await fs.stat(fullPath);
        return {
          type: 'file',
          name: entry.name,
          path: fullPath,
          modifiedAt: stats.mtimeMs,
          size: stats.size
        };
      })
  );

  return nodes.filter(Boolean).sort((a, b) => {
    if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
};

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
    win.loadFile(path.join(__dirname, '../dist/index.html'));
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

  ipcMain.handle('open-app-with-file', async (_, payload) => {
    const appPath = payload?.appPath;
    const filePath = payload?.filePath;
    if (!appPath || !filePath) return { ok: false, error: 'Missing app path or file path' };
    try {
      spawn(appPath, [filePath], { detached: true, stdio: 'ignore' }).unref();
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

  ipcMain.handle('write-file', async (_, payload) => {
    const filePath = payload?.path;
    if (!filePath) return { ok: false, error: 'Missing file path' };
    try {
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, payload?.content || '', 'utf8');
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  });

  ipcMain.handle('list-directory', async (_, dirPath) => {
    if (!dirPath) return [];
    try {
      return await buildDirectoryTree(dirPath, 0, 5);
    } catch {
      return [];
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
