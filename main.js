const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')
const fs = require('fs')

function createWindow() {
  const iconPath = path.join(__dirname, 'assets', 'icon.png')
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    title: 'WorkHub',
    backgroundColor: '#0b0b0e',
    icon: fs.existsSync(iconPath) ? iconPath : undefined,
    webPreferences: {
      // nodeIntegration is enabled intentionally: this is a local-only personal
      // tool with no remote content. The renderer loads a bundled HTML file and
      // never fetches untrusted scripts. For a multi-user / internet-facing app
      // switch to a preload.js with contextBridge instead.
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  win.loadFile('dashboard.html')

  // Remove the default application menu for a cleaner look
  Menu.setApplicationMenu(null)
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
