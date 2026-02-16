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

```bash
npm install
npm run dev
```

Open Electron shell (optional, in another terminal):

```bash
npm run electron
```

Production build:

```bash
npm run build
```

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

- `/docs/SETUP.md`
- `/docs/ARCHITECTURE.md`
- `/docs/CUSTOMIZATION.md`
- `/docs/CALENDAR-GUIDE.md`
- `/docs/TOOL-INTEGRATIONS.md`
- `/docs/VALIDATION.md`
