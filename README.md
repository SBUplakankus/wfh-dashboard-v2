# wfh-dashboard-v2

Game Dev Unified Dashboard v2 — a local-first Electron + React + Vite workspace hub for projects, calendar, docs, notes, and tool launch workflows.

## Highlights

- **Project hub** with per-project settings and feature toggles
- **Calendar + work-week meetings** from local ICS files
- **Theme customization** using runtime CSS variables and presets
- **Deep tool integration surfaces (MVP)** for:
  - MkDocs markdown tree browsing + preview + create/open in MarkText
  - Joplin notes preview via optional JSON export
  - Kanri task preview via optional JSON export
- **Desktop shell** through Electron IPC bridge with local file access

## Tech stack

- React 18 + TypeScript
- Vite (build/dev)
- Vitest + React Testing Library
- Electron (desktop shell + local integration layer)
- Tailwind CSS + CSS custom properties

## Quick start

### Development Mode

```bash
npm install
npm run dev
```

Then open Electron shell in another terminal:

```bash
npm run electron
```

The app will hot-reload as you make changes to the code.

### Production Build

Build the web assets:

```bash
npm run build
```

Test the production build locally:

```bash
npm run electron
```

## Building Electron Executable

> **📖 For detailed build instructions, troubleshooting, and advanced topics, see [BUILD.md](BUILD.md)**

### Prerequisites

- Node.js 16+ and npm installed
- For Windows: Windows 7+ (Windows 10+ recommended)
- For macOS: macOS 10.13+ 
- For Linux: Ubuntu 18.04+ or equivalent

### Build Commands

**Build for Windows (creates .exe installer and portable .exe):**
```bash
npm run electron:build:win
```

**Build for macOS (creates .dmg):**
```bash
npm run electron:build:mac
```

**Build for Linux (creates AppImage and .deb):**
```bash
npm run electron:build:linux
```

**Build for current platform:**
```bash
npm run electron:build
```

### Output Location

After building, your executable files will be in the `release/` folder:

- **Windows**: 
  - `release/WFH Dashboard Setup X.X.X.exe` (installer)
  - `release/WFH Dashboard X.X.X.exe` (portable)
- **macOS**: `release/WFH Dashboard-X.X.X.dmg`
- **Linux**: 
  - `release/WFH Dashboard-X.X.X.AppImage`
  - `release/wfh-dashboard-v2_X.X.X_amd64.deb`

### Build Notes

- The first build may take several minutes as electron-builder downloads necessary dependencies
- Windows builds can be created on Windows, macOS, or Linux (using Wine)
- macOS builds require macOS with Xcode command line tools
- Linux builds work on any platform
- The build process automatically includes all necessary files from `dist/` and `public/`

## Testing Your Build

1. After running `npm run build`, test the production version with Electron:
   ```bash
   npm run electron
   ```

2. To build and test the packaged executable, run the appropriate build command and then locate the executable in the `release/` folder

## Troubleshooting

### Build Issues

**404 errors when loading in Electron:**
- Ensure `vite.config.ts` has `base: './'` set (already configured)
- Run `npm run build` to rebuild with correct asset paths

**Build fails with "electron-builder not found":**
```bash
npm install
```

**Windows executable won't run:**
- Windows may show a SmartScreen warning on first run - this is normal for unsigned apps
- Click "More info" → "Run anyway"

**macOS build requires code signing:**
- For development/testing, unsigned builds work fine
- For distribution, you'll need an Apple Developer account

Run tests:

```bash
npm test
```

## Integration setup (MVP)

Open **Settings → Tools** and configure:

- `MarkText executable path`
- `MkDocs docs folder path` (path to local `docs/` folder)
- `Joplin executable path`
- `Joplin data JSON path` (optional, for in-dashboard previews)
- `Kanri executable path`
- `Kanri data JSON path` (optional, for in-dashboard previews)

When configured, the **Tools** section provides:

- MkDocs file browser (markdown files/folders)
- markdown preview panel
- “Create & Open” markdown workflow with templates
- quick open into MarkText
- Joplin notes summary cards (from JSON)
- Kanri tasks summary cards (from JSON)

## Documentation index

- `/BUILD.md` - **Comprehensive Electron build guide for creating Windows EXE, macOS DMG, and Linux packages**
- `/docs/SETUP.md`
- `/docs/ARCHITECTURE.md`
- `/docs/CUSTOMIZATION.md`
- `/docs/CALENDAR-GUIDE.md`
- `/docs/TOOL-INTEGRATIONS.md`
- `/docs/VALIDATION.md`
