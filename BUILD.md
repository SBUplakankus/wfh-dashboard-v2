# Building WFH Dashboard Electron Application

This guide provides detailed instructions for building the WFH Dashboard as a standalone Electron application for Windows, macOS, and Linux.

## Prerequisites

### All Platforms
- **Node.js**: Version 16.x or higher (LTS recommended)
- **npm**: Version 7.x or higher (comes with Node.js)
- **Git**: For cloning the repository

### Platform-Specific Requirements

#### Windows
- Windows 7 or higher (Windows 10/11 recommended)
- No additional requirements for building Windows executables

#### macOS
- macOS 10.13 (High Sierra) or higher
- Xcode Command Line Tools: `xcode-select --install`
- For code signing (optional): Apple Developer account

#### Linux
- Ubuntu 18.04+ or equivalent Linux distribution
- For Windows builds on Linux: Wine (optional, for cross-platform builds)

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SBUplakankus/wfh-dashboard-v2.git
   cd wfh-dashboard-v2
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

   This will install all required packages including:
   - React, TypeScript, and Vite for the frontend
   - Electron for the desktop shell
   - electron-builder for packaging

## Development Workflow

### Running in Development Mode

1. **Start the Vite dev server:**
   ```bash
   npm run dev
   ```
   This starts the development server on `http://localhost:3000` with hot module replacement.

2. **Start Electron (in a separate terminal):**
   ```bash
   npm run electron
   ```
   This opens the Electron window loading from the dev server.

The app will automatically reload when you make changes to the source code.

### Building for Production Testing

Before creating a distributable package, test the production build:

1. **Build the web assets:**
   ```bash
   npm run build
   ```
   This creates optimized production files in the `dist/` folder.

2. **Test with Electron:**
   ```bash
   npm run electron
   ```
   Electron will now load from the production build instead of the dev server.

## Creating Distributable Packages

### Windows Executable

**On Windows, macOS, or Linux:**

```bash
npm run electron:build:win
```

**Important:** This command may take 5-10 minutes on first run. You'll see output like:
```
> wfh-dashboard-v2@1.0.0 electron:build:win
> npm run build && electron-builder --win

> wfh-dashboard-v2@1.0.0 build
> vite build

vite v7.x.x building for production...
✓ built in 5.xx s

• electron-builder  version=26.7.0
• loaded configuration  file=package.json ("build" field)
• writing effective config  file=release/builder-effective-config.yaml
• packaging       platform=win32 arch=x64 electron=40.4.1 appOutDir=release\win-unpacked
• downloading     url=https://github.com/electron/electron/releases/download/...
• building        target=nsis arch=x64 file=release/WFH Dashboard Setup 1.0.0.exe
• building        target=portable arch=x64 file=release/WFH Dashboard 1.0.0.exe
```

**If terminal output stops:** The build is still running. Verify progress:

**On Windows (PowerShell):**
```powershell
# Check if build process is running
Get-Process | Where-Object {$_.ProcessName -like "*node*" -or $_.ProcessName -like "*electron*"}

# Watch for output files
while ($true) { Clear-Host; Get-ChildItem release -ErrorAction SilentlyContinue | Format-Table Name, Length, LastWriteTime; Start-Sleep 5 }
```

**On Windows (Command Prompt):**
```cmd
tasklist | findstr "node electron"
```

**On macOS/Linux:**
```bash
# Check processes
ps aux | grep -E 'node|electron'

# Watch release folder
watch -n 5 'ls -lh release/ 2>/dev/null || echo "release folder not created yet"'
```

This creates:
- **NSIS Installer**: `release/WFH Dashboard Setup 1.0.0.exe`
  - Full installer with start menu shortcuts
  - Supports per-user and per-machine installation
  - Can be customized with install location
  - ~150 MB file size
  
- **Portable Executable**: `release/WFH Dashboard 1.0.0.exe`
  - Standalone executable that can run without installation
  - Perfect for USB drives or network shares
  - No admin rights required
  - ~150 MB file size

**First-time notes:**
- The first build will download Windows build tools (~150 MB)
- Subsequent builds will be much faster (2-3 minutes)
- Windows may show a SmartScreen warning for unsigned executables
- Total download size on first build: ~300 MB

### macOS Application

**On macOS only:**

```bash
npm run electron:build:mac
```

This creates:
- **DMG Image**: `release/WFH Dashboard-X.X.X.dmg`
  - Drag-and-drop installer
  - Standard macOS application format

**Notes:**
- macOS builds require macOS with Xcode command line tools
- Apps are unsigned by default (fine for personal use)
- For distribution, code signing with Apple Developer cert is recommended

### Linux Application

**On any platform:**

```bash
npm run electron:build:linux
```

This creates:
- **AppImage**: `release/WFH Dashboard-X.X.X.AppImage`
  - Universal Linux package
  - Run directly without installation: `chmod +x *.AppImage && ./WFH-Dashboard-*.AppImage`
  - Works on most Linux distributions

- **Debian Package**: `release/wfh-dashboard-v2_X.X.X_amd64.deb`
  - For Debian/Ubuntu systems
  - Install with: `sudo dpkg -i wfh-dashboard-v2_*.deb`

### Build for Current Platform

To build for whatever platform you're currently on:

```bash
npm run electron:build
```

## Build Configuration

The build configuration is defined in `package.json` under the `"build"` section:

```json
{
  "build": {
    "appId": "com.wfh-dashboard-v2.app",
    "productName": "WFH Dashboard",
    "directories": {
      "output": "release",
      "buildResources": "public"
    },
    "files": [
      "dist/**/*",           // All built web assets (HTML, CSS, JS)
      "public/main.js",      // Electron main process (required)
      "public/preload.js",   // Electron preload script (required)
      "package.json"         // Package metadata
    ]
  }
}
```

**Files included in build:**
- `dist/**/*` - All built web assets from Vite (HTML, CSS, JS bundles)
- `public/main.js` - Electron main process (creates windows, handles IPC)
- `public/preload.js` - Context bridge for secure renderer ↔ main communication
- `package.json` - Package metadata and dependencies

**Note:** Only these specific files from `public/` are needed. The `public/index.html` is only used during development; production uses `dist/index.html` generated by Vite.

### Customization Options

#### Change App Name
Edit `productName` in `package.json`:
```json
"productName": "Your Custom Name"
```

#### Add Application Icon
1. Create icon files:
   - Windows: 256x256 PNG or .ico file
   - macOS: 512x512 PNG or .icns file
   - Linux: 512x512 PNG file

2. Save as `public/icon.png` (or separate files per platform)

3. Update `package.json`:
```json
"win": {
  "icon": "public/icon.ico"
},
"mac": {
  "icon": "public/icon.png"
},
"linux": {
  "icon": "public/icon.png"
}
```

#### Change Output Directory
Edit `directories.output` in `package.json`:
```json
"directories": {
  "output": "build-output"
}
```

## Troubleshooting

### Terminal Output Issues

**Problem: npm commands show no output or terminal seems frozen**

This is normal during the electron-builder download phase. The build process:
1. Runs `vite build` (5-10 seconds, shows progress)
2. Downloads Electron binaries silently (2-5 minutes on first run, **no output shown**)
3. Packages the application (1-2 minutes, shows progress)

**Solutions:**
- **Wait patiently** - First build takes 5-10 minutes total
- **Check Task Manager/Activity Monitor** - Verify npm/node processes are running
- **Check disk space** - Ensure you have at least 2 GB free space
- **Monitor the release folder**:
  ```bash
  # Windows
  dir release
  
  # macOS/Linux
  ls -lh release/
  ```
  Files will appear once the build completes

**Verify build is working:**
```bash
# Start the build
npm run electron:build:win

# In another terminal, check progress
watch -n 5 ls -lh release/
```

### Build Errors

**Error: "Cannot find module 'electron-builder'"**
```bash
npm install
```

**Error: "vite: command not found"**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Asset Loading Issues

**Problem: App shows blank screen or 404 errors**

This happens when assets are referenced with absolute paths instead of relative paths.

**Solution:** Verify `vite.config.ts` has `base: './'`:
```typescript
export default defineConfig({
  base: './',  // Critical for Electron file:// protocol
  // ... other config
});
```

Then rebuild:
```bash
npm run build
```

**Verify fix:** Check `dist/index.html` - paths should be `./assets/...` not `/assets/...`

### Platform-Specific Issues

#### Windows

**SmartScreen Warning:**
- Expected for unsigned apps
- Click "More info" → "Run anyway"
- For production, consider code signing certificate

**Antivirus False Positives:**
- Some antivirus software flags Electron apps
- Add exception or submit false positive report

#### macOS

**"App is damaged" Error:**
- macOS Gatekeeper blocks unsigned apps
- Right-click → Open (instead of double-click)
- Or: `xattr -cr /path/to/app.app`

**Building on M1/M2 Mac:**
- Builds work natively on Apple Silicon
- For Intel builds, add `"target": "darwin"` to mac config

#### Linux

**AppImage Won't Run:**
```bash
chmod +x WFH-Dashboard-*.AppImage
./WFH-Dashboard-*.AppImage
```

**FUSE Error:**
```bash
# Extract and run directly
./WFH-Dashboard-*.AppImage --appimage-extract
./squashfs-root/wfh-dashboard-v2
```

## Advanced Topics

### Code Signing

#### Windows
- Purchase code signing certificate
- Install certificate in Windows certificate store
- electron-builder will automatically use it

#### macOS
- Requires Apple Developer account ($99/year)
- Configure in `package.json`:
```json
"mac": {
  "identity": "Developer ID Application: Your Name (TEAM_ID)"
}
```

### Auto-Updates

To add auto-update functionality:

1. Install electron-updater:
```bash
npm install electron-updater
```

2. Add update server configuration to `package.json`
3. Implement update checks in `public/main.js`

See: https://www.electron.build/auto-update

### Cross-Platform Building

**Build Windows apps on macOS/Linux:**
- Requires Wine on Linux
- Limited support on macOS
- Recommended: Build on target platform or use CI/CD

**Build all platforms in CI:**
- Use GitHub Actions
- Matrix builds for each platform
- Store artifacts for download

## Build Output Structure

```
release/
├── WFH Dashboard Setup 1.0.0.exe       # Windows installer
├── WFH Dashboard 1.0.0.exe             # Windows portable
├── WFH Dashboard-1.0.0.dmg             # macOS DMG
├── WFH Dashboard-1.0.0.AppImage        # Linux AppImage
├── wfh-dashboard-v2_1.0.0_amd64.deb    # Debian package
├── builder-debug.yml                   # Build metadata
└── builder-effective-config.yaml       # Effective config
```

## Performance Optimization

### Reduce Bundle Size

The default build shows a warning about large chunks. To optimize:

1. **Code splitting:**
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'charts': ['recharts'],
          'utils': ['fuse.js', 'ical.js']
        }
      }
    }
  }
});
```

2. **Lazy loading:**
```typescript
// Lazy load heavy components
const AnalyticsView = lazy(() => import('./views/AnalyticsView'));
```

## Testing Builds

### Manual Testing Checklist

- [ ] App launches successfully
- [ ] All views render correctly
- [ ] Theme switching works
- [ ] File operations work (if configured)
- [ ] Settings persist across restarts
- [ ] Window size/position is remembered
- [ ] Keyboard shortcuts function
- [ ] External links open in browser
- [ ] No console errors

### Automated Testing

Run tests before building:
```bash
npm test
```

## Getting Help

- **Issues:** https://github.com/SBUplakankus/wfh-dashboard-v2/issues
- **electron-builder docs:** https://www.electron.build/
- **Electron docs:** https://www.electronjs.org/docs

## License

MIT License - See LICENSE file for details
