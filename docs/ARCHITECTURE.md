# Architecture

## Runtime overview

- `ThemeContext` manages active theme and presets.
- `ProjectContext` manages project list, selection, and persistence.
- `useTheme` maps theme values to CSS variables on `document.documentElement`.
- Electron `preload.js` exposes the IPC bridge consumed by `src/utils/ipc.js`.

## Key UI modules

- `src/components/Dashboard.tsx` — app shell composition
- `src/components/sections/CalendarSection.tsx` — calendar + meetings surfaces
- `src/components/sections/ToolsSection.tsx` — integration hub (MkDocs/Joplin/Kanri MVP)
- `src/components/SettingsPanel.tsx` — modal with tabs for projects/theme/calendar/tools

## Integration flow (MVP)

1. User configures tool/data paths per project in **Settings → Tools**.
2. `ToolsSection` consumes project paths and calls IPC wrappers:
   - `listDirectory` and `readFile` for MkDocs browsing/preview
   - `writeFile` for “Create & Open” markdown flow
   - `openApp` / `openAppWithFile` for launching native tools
3. Electron main process (`public/main.js`) handles filesystem/process operations:
   - `list-directory`
   - `read-file`
   - `write-file`
   - `open-app`
   - `open-app-with-file`

## Data persistence

- Project/theme config is saved in:
  - `localStorage` (web fallback)
  - Electron userData JSON via IPC when available

## Build/test pipeline

- Build: `npm run build` (Vite)
- Tests: `npm test` (Vitest + RTL)
