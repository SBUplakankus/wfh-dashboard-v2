# WorkHub Dashboard

A fast, minimal desktop dashboard for solo developers. Organise projects, meetings, tasks, notes, quick links, and folder shortcuts — all in one place — without switching between five apps.

Built with Electron + vanilla JS/CSS. No framework, no build step for the UI. Runs directly on Windows.

---

## Features

| Feature | Details |
|---|---|
| **Multi-project** | Unlimited projects, each with their own data |
| **Work / Personal mode** | Work projects show a Meetings card with calendar; personal projects don't |
| **Meetings & calendar** | Today view + upcoming view; import Google Calendar `.ics` files; "Join" buttons for video calls; "Now" indicator for active meetings |
| **Quick Links** | Grid of icon tiles that open URLs or local paths in one click |
| **File Directories** | Named folder shortcuts with full path visible; one-click to open in Explorer |
| **Tasks** | Add / complete / delete tasks inline; Enter key works; progress counter in header |
| **Notes** | Modal editor with title + body; preview in card; integrates with Joplin |
| **11 project colours** | Amber, Blue, Green, Red, Purple, Cyan, Pink, Orange, Teal, Indigo, Sky |
| **Settings** | Live accent colour picker, 5 font options, Kanri and Joplin path configuration |
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

> **Cross-compile note:** Electron-builder requires a Windows environment (or a Docker cross-compile setup) to produce `.exe` files.

---

## App Icon

Place your icon file at `assets/icon.png` (minimum **256 × 256 px**, preferably **512 × 512 px**).

For the Windows installer, electron-builder will automatically convert the PNG to `.ico`. You can also drop a pre-made `assets/icon.ico` alongside it for faster builds.

A placeholder icon is included at `assets/icon.png`. Replace it with your own before distributing.

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
| Kanri .exe path | Full path to your `Kanri.exe`, e.g. `C:\Users\You\AppData\Local\Programs\Kanri\Kanri.exe` |
| Joplin .exe path | Full path to your `Joplin.exe` (stored for reference) |

---

## Integrations

### Kanri
Click **Kanri** in the sidebar (or the "Open" button in the Tasks card footer) to launch Kanri directly. Set the path in Settings first.

### Joplin
Click **Joplin** in the sidebar or in any Notes card header to open Joplin. If the project has a **Joplin notebook** name set (in the project's edit modal), the button deep-links directly into that notebook via the `joplin://` URL scheme.

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
      "links":   [{ "id": "…", "icon": "github", "name": "GitHub",   "url": "https://github.com" }],
      "tasks":   [{ "id": "…", "text": "Do the thing",               "done": false }],
      "notes":   [{ "id": "…", "title": "Ideas",  "body": "…",       "date": "Feb 18" }],
      "events":  [{ "id": "…", "title": "Standup","dayLabel": "Today","isToday": true, "time": "9:00 AM", "endTime": "9:15 AM", "joinUrl": "https://meet.google.com/…", "note": "" }],
      "folders": [{ "id": "…", "name": "Docs",    "path": "C:\\Users\\Dev\\Documents" }]
    }
  ],
  "settings": {
    "accent":     "#f0a843",
    "font":       "Syne",
    "kanriPath":  "C:\\…\\Kanri.exe",
    "joplinPath": "C:\\…\\Joplin.exe"
  }
}
```

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
