# WorkHub Dashboard

A fast, minimal desktop dashboard for solo developers. Organise projects, meetings, tasks, notes, quick links, folder shortcuts, and markdown doc vaults — all in one place — without switching between five apps.

Built with Electron + vanilla JS/CSS. No framework, no build step for the UI. Runs directly on Windows.

---

## Features

| Feature | Details |
|---|---|
| **Multi-project** | Unlimited projects, each with their own data |
| **Work / Personal mode** | Work projects show Meetings, Tasks, Notes, and Docs cards; personal projects show Links, Tasks, Notes, and Docs |
| **Meetings & calendar** | Today view + upcoming view; import Google Calendar `.ics` files; "Join" buttons for video calls; "Now" indicator for active meetings |
| **Quick Links** | Grid of icon tiles that open URLs or local paths in one click |
| **File Directories** | Named folder shortcuts with full path visible; one-click to open in Explorer |
| **Tasks** | Add / complete / delete tasks inline; Enter key works; Kanri shortcut in card header |
| **Notes** | Modal editor with title + body; preview in card; Joplin shortcut in card header |
| **Docs** | Markdown vault directories opened directly in MarkText; `.md` file count badge per folder; Edit (MarkText) and Explorer buttons per row |
| **11 project colours** | Amber, Blue, Green, Red, Purple, Cyan, Pink, Orange, Teal, Indigo, Sky |
| **Settings** | Live accent colour picker, 5 font options, Kanri / Joplin / MarkText path configuration |
| **Data import/export** | Backup or restore your entire database via JSON file from Settings |
| **Persistent data** | All data saved to `localStorage` under key `hub5` |
| **Clock** | Live clock + date in sidebar footer |

---

## Getting Started

### Run in development

```bash
npm install
npm start
```

Requires [Node.js](https://nodejs.org/) (v18+) and a working Electron install.

### Build for Windows

```bash
# NSIS installer + portable .exe (both x64)
npm run build
```

Output goes to `release/`. You'll find:
- `WorkHub Setup 1.0.0.exe` — one-click NSIS installer (creates Start Menu + Desktop shortcut)
- `WorkHub 1.0.0.exe` — portable single-file executable

---

## Project Structure

```
workhub/
├── dashboard.html      ← App shell (HTML only, no inline CSS/JS)
├── main.js             ← Electron entry point
├── package.json        ← Dependencies + electron-builder config
├── renderer/
│   ├── style.css       ← All styles
│   └── app.js          ← All application logic
├── assets/
│   └── icon.png        ← App icon (replace with your own)
└── README.md
```

---

## Configuration

Open **Settings** (gear icon, bottom-left) to configure:

| Setting | Description |
|---|---|
| Accent Color | Live colour picker — changes accent everywhere immediately |
| Font | Choose from 5 typefaces (Syne, Outfit, DM Sans, Plus Jakarta Sans, IBM Plex Sans) |
| Kanri path | Full path to `Kanri.exe` or its install folder. Auto-detects common locations; use the **Detect** button to search automatically. |
| Joplin path | Full path to `Joplin.exe` or its install folder. Falls back to the `joplin://` URL scheme if left blank. |
| MarkText path | Full path to `marktext.exe` or its install folder. Auto-detects common locations; use the **Detect** button to search automatically. |

---

## Integrations

### Kanri
Click **Kanri** in the sidebar or in any Tasks card header to launch Kanri directly. Set the path in Settings first, or use **Detect** to auto-find it.

### Joplin
Click **Joplin** in the sidebar or in any Notes card header to open Joplin. If the project has a **Joplin notebook** name set (in the project edit modal), the button deep-links directly into that notebook via the `joplin://` URL scheme.

### MarkText
Click **MarkText** in the sidebar to open MarkText without a specific folder. Inside the **Docs card**, each folder row has an **Edit** button that launches MarkText with that folder as the working directory, letting you jump straight into the right vault. Use the **Detect** button in Settings to auto-find a MarkText install.

### Calendar / ICS
In the Meetings card click **`.ics`** to import a Google Calendar export. WorkHub parses events for the next 60 days and extracts meeting join URLs automatically from `LOCATION`, `DESCRIPTION`, and `URL` fields.

---

## Data Model

All data is stored in `localStorage` under key `hub5`:

```json
{
  "projects": [
    {
      "id": "abc123",
      "name": "Work",
      "color": "blue",
      "workMode": true,
      "joplin": "Work Notebook",
      "kanriBoard": "board-id",
      "links":      [{ "id": "…", "icon": "github",    "name": "GitHub",       "url": "https://github.com" }],
      "tasks":      [{ "id": "…", "text": "Do the thing",                       "done": false }],
      "notes":      [{ "id": "…", "title": "Ideas",    "body": "…",            "date": "Feb 18" }],
      "events":     [{ "id": "…", "title": "Standup",  "dayLabel": "Today",    "isToday": true, "time": "9:00 AM", "endTime": "9:15 AM", "joinUrl": "https://meet.google.com/…", "note": "" }],
      "folders":    [{ "id": "…", "name": "Docs",      "path": "C:\\Users\\Dev\\Documents" }],
      "docFolders": [{ "id": "…", "name": "Notes Vault", "path": "C:\\Users\\Dev\\Documents\\Notes" }]
    }
  ],
  "settings": {
    "accent":       "#f0a843",
    "font":         "Syne",
    "kanriPath":    "C:\\…\\Kanri.exe",
    "joplinPath":   "C:\\…\\Joplin.exe",
    "markTextPath": "C:\\…\\marktext.exe"
  }
}
```

---

## Layout

**Work mode** (two rows):
- Row 1: Meetings · Quick Links
- Row 2: Tasks · Notes · Docs

**Personal mode** (two rows):
- Row 1: Quick Links · Tasks
- Row 2: Notes · Docs

---

## Design Principles

- No glow effects, no translateY on hover, no box-shadows
- Hover = border-colour change + subtle `var(--bg3)` background only
- Cards fill their grid cell height via `flex: 1; min-height: 0` — never fixed heights
- All transitions: `0.15s ease`
- Card bodies scroll internally; viewport never overflows
- Icons: [Lucide](https://lucide.dev/) via CDN
- Fonts: [Google Fonts](https://fonts.google.com/) via CDN

---

## Licence

MIT
