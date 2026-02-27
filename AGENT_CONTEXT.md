# AGENT_CONTEXT.md
> This document exists for AI assistants resuming work on WorkHub in future sessions.
> Read this before touching any code. It will save you from making assumptions.

---

## What This Is

WorkHub is a personal **Electron desktop dashboard** for solo developers on Windows. It is a single-window app with a sidebar and a main content area. There is no backend, no database, no build step for the UI layer. Everything is vanilla JS + CSS running directly in the Electron renderer process.

**Entry point:** `dashboard.html`
**All logic:** `renderer/app.js`
**All styles:** `renderer/style.css`
**Electron bootstrap:** `main.js` (not modified in sessions so far)

---

## File Structure

```
workhub/
├── dashboard.html          ← App shell, all modals defined here as .overlay divs
├── main.js                 ← Electron entry point (untouched)
├── package.json            ← electron-builder config
├── renderer/
│   ├── app.js              ← All state, render logic, event handlers, integrations
│   └── style.css           ← All styles, CSS variables, component classes
├── assets/
│   └── icon.png
└── README.md               ← User-facing docs (keep in sync with features)
```

---

## Architecture: Key Facts

### State
- Single global `DB` object: `{ projects: [], settings: {} }`
- Persisted to `localStorage` under key `hub5` via `save()` / `load()`
- No reactivity system. Every state change calls `render()` which does a **full DOM teardown and rebuild** of the main content area. This is intentional and works fine at current scale.
- `active` (string) holds the current project ID.

### Render flow
```
render()
  → renderSidebar()     — rebuilds #proj-list
  → renderMain()        — rebuilds #main-content
    → buildMeetingsCard()
    → buildLinksCard()
    → buildTasksCard()
    → buildNotesCard()
    → buildDocsCard()   ← added in MarkText session
  → ri()                — re-runs lucide.createIcons() after DOM rebuild
```

`ri()` must be called after any DOM mutation that adds `<i data-lucide="...">` elements, otherwise icons won't render.

### Layout system
- Main content uses CSS Grid rows (`.card-row`)
- Work mode row 2: `cols-3` → Tasks | Notes | Docs
- Personal mode row 2: `cols-2` → Notes | Docs
- Cards use `flex: 1; min-height: 0` to fill their grid cell — **never use fixed heights on cards**

---

## Data Model (current shape)

```js
DB = {
  projects: [
    {
      id: string,
      name: string,
      color: string,           // key into DOT palette: 'amber' | 'blue' | 'green' | etc.
      workMode: boolean,       // true = shows Meetings card
      joplin: string,          // Joplin notebook name (optional)
      kanriBoard: string,      // Kanri board ID (optional)
      links: [{ id, icon, name, url }],
      tasks: [{ id, text, done }],
      notes: [{ id, title, body, date }],
      events: [{ id, title, dateStr, dayLabel, isToday, time, endTime, joinUrl, note }],
      folders: [{ id, name, path }],       // File Directories (open in Explorer)
      docFolders: [{ id, name, path }],    // Doc vaults (open in MarkText)
    }
  ],
  settings: {
    accent: string,        // hex color
    font: string,          // font name matching Google Fonts import
    kanriPath: string,     // full path to Kanri.exe or install folder
    joplinPath: string,    // full path to Joplin.exe or install folder
    markTextPath: string,  // full path to marktext.exe or install folder
    lastActive: string,    // last active project ID
  }
}
```

**When adding new fields to projects:** also update `np()` (new project factory), `seed()` (demo data), `saveProject()`, `editProject()`, and `load()` (for backward compat with old saves missing the field).

---

## Integrations

### Kanri
- Launched via `openKanri()` → `openApp(path)` or `child_process.spawn`
- Also shows an in-app board preview (`kanriPreviewing = true`) when triggered from sidebar
- Board data read from `kanri-data.json` in Kanri's data directory
- Auto-detect: checks `AppData\Local\Programs\Kanri\`, `Program Files\Kanri\`

### Joplin
- Launched via `openJoplin()` → `openApp(path)` or fallback to `joplin://` URL scheme
- Per-project notebook name stored in `p.joplin`; used for deep-linking via URL scheme
- API integration exists (`loadJoplinForProject`) but requires token in settings and local Joplin API running on port 41184

### MarkText
- Launched via `openMarkText(folderPath?)` → `child_process.spawn(path, [folderPath])`
- If `folderPath` provided, MarkText opens directly in that vault
- Per-project doc folders stored in `p.docFolders[]`
- Auto-detect: checks `AppData\Local\Programs\marktext\`, `AppData\Local\marktext\`
- Quick-add modal: `ov-docfolder` (name + path, no icon needed)
- `.md` file count badge: read live from disk via `fs.readdirSync` (Electron only, silently skipped in browser)

### Calendar / ICS
- `parseICS()` handles: single events, weekly RRULE recurrence, EXDATE exclusions, URL extraction from LOCATION/DESCRIPTION/URL fields
- Imports events for next 60 days from today
- Stored flat in `p.events[]` with resolved `dateStr` (YYYY-MM-DD), `time`, `endTime`

---

## Escaping: Important Pattern

HTML is built via template literals. Two escape functions exist and must be used together for `onclick` attributes containing user data:

```js
esc(s)    // HTML-escapes: &, <, >, "  — use for all user content in HTML
escJS(s)  // JS-escapes: \, ', \r, \n  — use for values inside JS strings in onclick

// Correct pattern for onclick with user path:
onclick="openMarkText('${esc(escJS(f.path))}')"
//                     ^^^--- JS first, then HTML
```

Missing `escJS()` on a Windows path (backslashes) or a name with an apostrophe will cause a silent JS error.

**Known limitation:** This pattern is fragile. If refactoring, prefer `data-` attributes + JS event delegation to eliminate the escaping requirement entirely.

---

## Modals

All modals are `.overlay` divs defined statically in `dashboard.html`. They are shown/hidden via `.open` class.

| ID | Purpose |
|---|---|
| `ov-proj` | New / edit project |
| `ov-link` | Add quick link |
| `ov-event` | Add meeting/event |
| `ov-note` | New / edit note |
| `ov-docfolder` | Quick-add doc folder (MarkText) |
| `ov-settings` | App settings |

Modals close on: Escape key, click outside (overlay background), or explicit `closeOv(id)` call.

---

## CSS Conventions

- All design tokens are CSS variables on `:root` — never hardcode colors
- Accent color and font are set dynamically via `applyTheme()` using `document.documentElement.style.setProperty`
- Hover states: **border-color change + `var(--bg3)` background only** — no shadows, no transforms
- All transitions: `0.15s ease`
- Scrollbars: 3px width, transparent track, `var(--border-h)` thumb
- Icons: Lucide via CDN (`https://unpkg.com/lucide@latest/dist/umd/lucide.js`) — must call `lucide.createIcons()` (aliased as `ri()`) after any DOM change that adds icon elements

**Do not add:**
- Box shadows
- `translateY` on hover
- Glow effects
- Color treatments that single out specific integrations (e.g. making MarkText purple because MarkText's logo is purple — this was done and immediately reverted)

---

## Things That Have Been Deliberately Removed

- **Task counter** (`1 / 3`) in the Tasks card header — removed as redundant; the checkboxes make progress visible
- **Hint row** at the bottom of the Tasks card footer ("Advanced tasks in Kanri" + Open button) — the Kanri button was moved into the card header instead
- **Purple tinting** on the Docs card and MarkText buttons — all cards and integration buttons use the same neutral `var(--border)` / `var(--text3)` treatment

If a future session re-introduces any of these, it should be a deliberate decision, not an accident.

---

## Known Weaknesses (not bugs, architectural notes)

1. **No data migration.** If a field is added to the data model, old saves silently lack it. Current workaround: null-check with `||[]` or `||''` at read time. A proper versioned migration system doesn't exist.

2. **Full re-render on every change.** Works fine now. Will cause scroll-position loss and focus loss on inputs if the app grows significantly. No virtual DOM or diffing.

3. **`esc()` + `escJS()` in onclick strings.** Any new onclick attribute that embeds user data must use both. Easy to forget. See Escaping section above.

4. **localStorage size cap.** ~5MB. Not an issue for current data shapes but ICS imports with large event sets could approach this.

5. **Windows-only auto-detect.** `detectKanri()`, `detectJoplin()`, `detectMarkText()` check Windows paths only (`AppData`, `Program Files`). macOS/Linux paths not handled.
