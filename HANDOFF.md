# WorkHub — Agent Handoff

## What This Is

A single-file HTML desktop dashboard (`dashboard.html`) for a solo developer. Loaded directly by Electron — no build step, no npm, no framework. Everything is vanilla JS + CSS with Lucide icons via CDN.

The goal is a clean, fast hub to access tools and projects without switching between apps constantly.

---

## Current State

### What Works
- Multi-project system with per-project data (links, tasks, notes, events, folders)
- **Work mode toggle** per project — enables meetings/calendar card, hides it for personal projects
- **Meetings card** with Today / Upcoming toggle, Join button (blue), "Now" pill for active meetings
- **ICS import** — parses Google Calendar `.ics` exports, extracts join URLs from LOCATION/DESCRIPTION/URL fields automatically, groups events by Today / Tomorrow / weekday / date
- **Quick Links** grid with Lucide icon picker, click to open URL or local path
- **Folder shortcuts** — amber-tinted tiles in the links grid, one click opens directory
- **Tasks** with inline add (Enter key works), check off, delete, Kanri open button
- **Notes** with modal editor, preview in card, Joplin open button
- **Settings panel** — accent color picker (live preview), 5 font choices, Kanri/Joplin exe paths
- **Fluid layout** — cards fill available height using flex/grid with `min-height: 0`, no fixed heights, scrollable card bodies
- All data persists to `localStorage` key `hub5`
- Electron-ready: uses `window.require('electron').shell.openExternal()` for links, falls back to `window.open` in browser

### Known Limitations / Next Steps

#### Electron wiring (not yet done)
The HTML file is ready to be loaded by Electron but no `main.js` or `preload.js` exists yet. Needs:
```js
// main.js (minimal)
const { app, BrowserWindow, shell } = require('electron')
const path = require('path')

app.whenReady().then(() => {
  const win = new BrowserWindow({
    width: 1200, height: 800,
    webPreferences: { nodeIntegration: true, contextIsolation: false }
  })
  win.loadFile('dashboard.html')
})
```
> Note: `nodeIntegration: true` is used here for simplicity since this is a local-only personal tool with no remote content. For production hardening, switch to a preload script with contextBridge.

#### File system access (not yet done)
- Folder tiles currently call `shell.openExternal(path)` which works for URLs but for local directories in Electron should use `shell.openPath(path)` instead
- File listing inside directories is not implemented — user just opens the folder in Explorer
- This was a conscious scope decision: keep it simple, open folder rather than browse files

#### Kanri integration (stub only)
- Currently just opens the Kanri `.exe` via stored path
- Full integration would read Kanri's SQLite database directly using `better-sqlite3`
- Kanri stores data at `%APPDATA%\kanri\` in a file called `kanri.db`
- Schema: `boards` table → `lists` table → `cards` table (roughly)
- Tasks could be pulled per-board and shown in the tasks card

#### Joplin integration (stub only)  
- Currently opens via `joplin://` URL scheme (requires Joplin to be installed)
- Full integration: Joplin has a REST API on `http://localhost:41184` (enable in Joplin settings → Web Clipper)
- Endpoints: `GET /notes`, `GET /notebooks`, `GET /notes/:id`
- Notes could be listed per-notebook and shown in the notes card

#### ICS / Calendar
- Import works well for one-time imports
- Auto-refresh would require watching the file or polling — doable with Electron's `fs.watchFile`
- Google Calendar can auto-export to a URL (Calendar Settings → share → secret address in iCal format) — could poll this URL on a timer

#### Personal project layout
- Work mode: Meetings | Links (top), Tasks | Notes (bottom) — ✅
- Personal mode: Links | Tasks (top), Notes | empty (bottom) — the empty cell is a known gap
- Fix: personal layout should be Links | Tasks top row, Notes full-width bottom row

---

## Data Structure

All data is in `localStorage` under key `hub5`:

```json
{
  "projects": [
    {
      "id": "abc123",
      "name": "Work",
      "color": "blue",
      "workMode": true,
      "joplin": "Work Notebook",
      "links": [{ "id": "x", "icon": "github", "name": "GitHub", "url": "https://github.com" }],
      "tasks": [{ "id": "y", "text": "Do the thing", "done": false }],
      "notes": [{ "id": "z", "title": "Ideas", "body": "...", "date": "Feb 18" }],
      "events": [{ "id": "w", "title": "Standup", "dayLabel": "Today", "isToday": true, "time": "9:00 AM", "endTime": "9:15 AM", "joinUrl": "https://meet.google.com/...", "note": "" }],
      "folders": [{ "id": "v", "name": "Docs", "path": "C:\\Users\\Dev\\Documents" }]
    }
  ],
  "settings": {
    "accent": "#f0a843",
    "font": "Syne",
    "kanriPath": "C:\\..\\Kanri.exe",
    "joplinPath": "C:\\..\\Joplin.exe"
  }
}
```

---

## Design Rules (do not break these)

- **No glow effects**
- **No translateY on hover**
- **No shadows**
- Hover = border-color change + subtle background only (`var(--bg3)`)
- Border radius: 6–8px
- All transitions: `0.15s ease`
- Card body scrolls internally — never overflow the viewport
- Cards fill their grid cell height — `flex: 1; min-height: 0` pattern throughout
- Font via Google Fonts CDN, icons via Lucide CDN (`https://unpkg.com/lucide@latest/dist/umd/lucide.js`)
- Call `lucide.createIcons()` (aliased as `ri()`) after any DOM mutation that adds Lucide `<i>` tags

### Color palette
```
--bg:      #0b0b0e   (app background)
--bg2:     #111115   (sidebar, cards)
--bg3:     #18181d   (hover states, inputs)
--bg4:     #1e1e25   (badges, toggle track)
--text:    #e8e8f0
--text2:   #7a7a8c
--text3:   #4a4a5c
--border:  rgba(255,255,255,0.06)
--border-h: rgba(255,255,255,0.11)
--accent:  #f0a843  (user-configurable)
--blue:    #5a9ef5  (join buttons)
--green:   #5acc8a  (task completion)
--red:     #e05a5a  (delete actions)
--purple:  #a78bfa
```

---

## File Structure (target for Electron project)

```
/
├── dashboard.html     ← everything lives here for now
├── main.js            ← Electron entry point (create this)
├── preload.js         ← optional security bridge (create if hardening)
├── package.json       ← Electron dependency
└── HANDOFF.md         ← this file
```

---

## Suggested Next Tasks (in priority order)

1. **Create `main.js`** — minimal Electron wrapper to load `dashboard.html`
2. **Fix `shell.openPath` for folders** — replace `openExternal` with `openPath` for local directory paths
3. **Fix personal layout gap** — Notes card should span full width in personal mode bottom row
4. **Kanri DB read** — use `better-sqlite3` to read tasks from Kanri's local database
5. **Joplin REST API** — list notebooks/notes via `localhost:41184` when Joplin is running
6. **ICS auto-refresh** — watch the imported `.ics` file for changes using `fs.watchFile`
7. **Persist data to disk** — replace `localStorage` with `fs.writeFileSync` to a JSON file in `app.getPath('userData')`
