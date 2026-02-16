# Architecture

- `ThemeContext` manages active theme and presets.
- `ProjectContext` manages project list, selection, and persistence.
- Electron `preload.js` exposes a minimal, secure IPC bridge used by `src/utils/ipc.js`.
