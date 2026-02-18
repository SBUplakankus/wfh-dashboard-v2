# WorkHub — Unity UI Toolkit Recreation Guide

A complete reference for rebuilding this dashboard in Unity (2022.3 LTS or Unity 6) using
**UI Toolkit (UITK)** with UXML templates, USS stylesheets, and C# controllers.
External file-system integrations (Kanri, Joplin, ICS) are intentionally out of scope.

---

## Table of Contents

1. [Prerequisites & Project Setup](#1-prerequisites--project-setup)
2. [Folder Structure](#2-folder-structure)
3. [Data Model (C#)](#3-data-model-c)
4. [USS Variables & Color Palette](#4-uss-variables--color-palette)
5. [Global USS Stylesheet](#5-global-uss-stylesheet)
6. [App Shell UXML](#6-app-shell-uxml)
7. [Sidebar Component](#7-sidebar-component)
8. [Card System](#8-card-system)
   - [Meetings Card](#81-meetings-card-uxml)
   - [Quick Links Card](#82-quick-links-card-uxml)
   - [Tasks Card](#83-tasks-card-uxml)
   - [Notes Card](#84-notes-card-uxml)
9. [Modal Overlays](#9-modal-overlays)
   - [Project Modal](#91-project-modal)
   - [Link Modal](#92-link-modal)
   - [Event Modal](#93-event-modal)
   - [Note Modal](#94-note-modal)
   - [Settings Modal](#95-settings-modal)
10. [C# Controller Architecture](#10-c-controller-architecture)
11. [Per-Component Implementation Notes](#11-per-component-implementation-notes)
12. [Animations & Transitions](#12-animations--transitions)
13. [Data Persistence](#13-data-persistence)
14. [Icons](#14-icons)
15. [Fonts](#15-fonts)
16. [Key CSS → USS Translation Reference](#16-key-css--uss-translation-reference)
17. [Gotchas & Unity-Specific Patterns](#17-gotchas--unity-specific-patterns)

---

## 1. Prerequisites & Project Setup

| Requirement | Detail |
|---|---|
| Unity version | 2022.3 LTS (minimum) or Unity 6.0+ |
| Render pipeline | Any — UITK is pipeline-agnostic for runtime UI |
| Package | `com.unity.ui` is included since Unity 2021.2 — no install needed |
| Optional package | `com.unity.ui.builder` — the visual UXML/USS editor (Window → UI Toolkit → UI Builder) |

**Runtime UI setup:**
1. Create a `UIDocument` component on a GameObject in your scene.
2. Assign your root UXML asset to the `Source Asset` field.
3. Set `Panel Settings` to a new `PanelSettings` asset with `Scale Mode = Scale With Screen Size`
   (reference resolution 1440×900, match = 0 width-biased).
4. Set the `Sort Order` on the PanelSettings to 0 (raise for overlays/modals).

> **Note:** UITK runtime UI renders on top of the Game View by default.
> For a pure dashboard app with no 3D scene, set the Camera to `Clear Flags = Solid Color`
> and Background = `#0b0b0e` so the Unity camera matches the app background.

---

## 2. Folder Structure

```
Assets/
└── WorkHub/
    ├── Data/
    │   ├── WorkHubData.cs          # Serializable data model
    │   └── DataStore.cs            # Load/save to JSON file
    ├── UI/
    │   ├── PanelSettings.asset
    │   ├── Styles/
    │   │   ├── Variables.uss       # CSS custom property equivalents
    │   │   └── WorkHub.uss         # All component styles
    │   ├── UXML/
    │   │   ├── AppShell.uxml       # Root document
    │   │   ├── Sidebar.uxml        # Sidebar template
    │   │   ├── Cards/
    │   │   │   ├── MeetingsCard.uxml
    │   │   │   ├── LinksCard.uxml
    │   │   │   ├── TasksCard.uxml
    │   │   │   └── NotesCard.uxml
    │   │   └── Modals/
    │   │       ├── ProjectModal.uxml
    │   │       ├── LinkModal.uxml
    │   │       ├── EventModal.uxml
    │   │       ├── NoteModal.uxml
    │   │       └── SettingsModal.uxml
    │   └── Icons/
    │       └── IconAtlas.spriteAtlas   # Sprite atlas replacing Lucide icons
    └── Scripts/
        ├── AppController.cs        # Root entry point, wires everything together
        ├── Sidebar/
        │   ├── SidebarController.cs
        │   └── ProjectItem.cs      # Single project list element
        ├── Cards/
        │   ├── MeetingsCardController.cs
        │   ├── LinksCardController.cs
        │   ├── TasksCardController.cs
        │   └── NotesCardController.cs
        └── Modals/
            ├── ProjectModalController.cs
            ├── LinkModalController.cs
            ├── EventModalController.cs
            ├── NoteModalController.cs
            └── SettingsModalController.cs
```

---

## 3. Data Model (C#)

This is the C# equivalent of the JavaScript `DB` object stored in `localStorage`.

```csharp
// WorkHubData.cs
using System;
using System.Collections.Generic;
using UnityEngine;

[Serializable]
public class WorkHubData
{
    public List<ProjectData> projects = new();
    public AppSettings settings = new();
}

[Serializable]
public class ProjectData
{
    public string id;
    public string name;
    public string color;       // "amber" | "blue" | "green" | "red" | "purple"
    public bool workMode;
    public string joplin;
    public List<LinkData>   links   = new();
    public List<TaskData>   tasks   = new();
    public List<NoteData>   notes   = new();
    public List<EventData>  events  = new();
    public List<FolderData> folders = new();
}

[Serializable]
public class LinkData
{
    public string id;
    public string icon;   // icon name key (maps to a sprite)
    public string name;
    public string url;
}

[Serializable]
public class TaskData
{
    public string id;
    public string text;
    public bool done;
}

[Serializable]
public class NoteData
{
    public string id;
    public string title;
    public string body;
    public string date;
}

[Serializable]
public class EventData
{
    public string id;
    public string title;
    public string dayLabel;   // "Today" | "Tomorrow" | weekday | "Mar 5"
    public bool isToday;
    public string time;
    public string endTime;
    public string joinUrl;
    public string note;
}

[Serializable]
public class FolderData
{
    public string id;
    public string name;
    public string path;
}

[Serializable]
public class AppSettings
{
    public string accent   = "#f0a843";
    public string font     = "Syne";
    public string kanriPath  = "";
    public string joplinPath = "";
}
```

**Helper:**
```csharp
// DataStore.cs
using System.IO;
using UnityEngine;

public static class DataStore
{
    private static readonly string FilePath =
        Path.Combine(Application.persistentDataPath, "workhub.json");

    public static WorkHubData Load()
    {
        if (!File.Exists(FilePath)) return Seed();
        try { return JsonUtility.FromJson<WorkHubData>(File.ReadAllText(FilePath)); }
        catch { return Seed(); }
    }

    public static void Save(WorkHubData data)
    {
        File.WriteAllText(FilePath, JsonUtility.ToJson(data, prettyPrint: false));
    }

    private static WorkHubData Seed()
    {
        var data = new WorkHubData();
        // Populate default Work + Personal projects here (mirrors JS seed())
        Save(data);
        return data;
    }

    public static string NewId() =>
        System.Guid.NewGuid().ToString("N")[..7]; // 7-char hex, mirrors uid()
}
```

---

## 4. USS Variables & Color Palette

USS does not support CSS custom properties (`var()`) natively in Unity 2022.3.
The closest equivalent is to define all tokens as USS classes applied to `:root`
or, more practically, to maintain a `Variables.uss` that re-declares the colors
as named values in each rule. In **Unity 6**, USS variables (`var()`) are supported.

### For Unity 2022.3 (define explicit values)

```css
/* Variables.uss — place on the root VisualElement via AddToClassList or inline */

/* Replicate these everywhere they are needed — or use Unity 6 var() support */
/* bg        #0b0b0e */
/* bg2       #111115 */
/* bg3       #18181d */
/* bg4       #1e1e25 */
/* border    rgba(255,255,255,0.06)  → color: rgba(255,255,255,0.06) */
/* border-h  rgba(255,255,255,0.11) */
/* text      #e8e8f0 */
/* text2     #7a7a8c */
/* text3     #4a4a5c */
/* accent    #f0a843  (runtime-swappable via C#) */
/* blue      #5a9ef5 */
/* green     #5acc8a */
/* red       #e05a5a */
/* purple    #a78bfa */
/* radius    8px */
```

### For Unity 6 (var() is supported)

```css
/* Variables.uss */
:root {
    --accent:    #f0a843;
    --accent-dim: rgba(240, 168, 67, 0.10);
    --bg:        #0b0b0e;
    --bg2:       #111115;
    --bg3:       #18181d;
    --bg4:       #1e1e25;
    --border:    rgba(255, 255, 255, 0.06);
    --border-h:  rgba(255, 255, 255, 0.11);
    --text:      #e8e8f0;
    --text2:     #7a7a8c;
    --text3:     #4a4a5c;
    --red:       #e05a5a;
    --green:     #5acc8a;
    --blue:      #5a9ef5;
    --purple:    #a78bfa;
    --radius:    8px;
}
```

**Runtime accent color change (C#):**
```csharp
// AppController.cs — called when accent changes in Settings
void ApplyAccent(string hex)
{
    if (ColorUtility.TryParseHtmlString(hex, out Color c))
    {
        // Re-style elements that depend on accent by toggling a USS class
        // e.g., swap .accent-amber → .accent-custom, or inline-set via IStyle
        _root.style.unityBackgroundImageTintColor = c; // example
        // Better: iterate all elements with class "accent-bg" and set background-color
    }
}
```

---

## 5. Global USS Stylesheet

```css
/* WorkHub.uss */

/* ── Reset ── */
VisualElement {
    box-sizing: border-box;
}

/* ── App shell ── */
.app {
    flex-direction: row;
    width: 100%;
    height: 100%;
    background-color: #0b0b0e;
}

/* ── Sidebar ── */
.sidebar {
    width: 220px;
    background-color: #111115;
    border-right-width: 1px;
    border-right-color: rgba(255, 255, 255, 0.06);
    flex-direction: column;
    overflow: hidden;
}

.sb-top {
    padding: 18px 16px 14px;
    border-bottom-width: 1px;
    border-bottom-color: rgba(255, 255, 255, 0.06);
    flex-shrink: 0;
}

.wordmark {
    font-size: 16px;
    -unity-font-style: bold;
    letter-spacing: -0.48px; /* -0.03em × 16px */
    color: #e8e8f0;
}

.wordmark-accent {
    color: #f0a843;
}

/* sb-scroll: Unity uses ScrollView with vertical scroll */
.sb-scroll {
    flex: 1;
    overflow: hidden; /* inner ScrollView handles scroll */
    padding: 12px 8px;
    flex-direction: column;
}

.sb-label {
    font-size: 9px;
    color: #4a4a5c;
    letter-spacing: 1.08px; /* 0.12em × 9px */
    -unity-text-align: upper-left;
    padding: 6px 8px 3px;
    margin-top: 8px;
}

/* ── Project item ── */
.proj-item {
    flex-direction: row;
    align-items: center;
    padding: 7px 9px;
    border-radius: 6px;
    color: #7a7a8c;
    font-size: 13px;
    -unity-font-style: bold;   /* weight 500 — use medium font face */
    transition-property: background-color, color;
    transition-duration: 0.15s;
}

.proj-item:hover {
    background-color: #18181d;
    color: #e8e8f0;
}

.proj-item.active {
    background-color: rgba(240, 168, 67, 0.10);
    color: #f0a843;
}

.proj-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
    /* background-color set from C# based on project color */
}

.proj-name {
    flex: 1;
    overflow: hidden;
    /* text-overflow: ellipsis — use TextOverflow.Ellipsis in C# via IStyle */
    -unity-text-overflow-position: end;
    white-space: nowrap;
}

.proj-badge {
    font-size: 9px;
    padding: 1px 5px;
    border-radius: 3px;
    background-color: #1e1e25;
    color: #4a4a5c;
    border-width: 1px;
    border-color: rgba(255, 255, 255, 0.06);
    flex-shrink: 0;
}

.proj-item.active .proj-badge {
    background-color: rgba(240, 168, 67, 0.10);
    color: #f0a843;
    border-color: rgba(0, 0, 0, 0);
}

.proj-edit, .proj-del {
    opacity: 0;
    color: #4a4a5c;
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    transition-property: opacity, color;
    transition-duration: 0.15s;
}

.proj-item:hover .proj-edit,
.proj-item:hover .proj-del {
    opacity: 1;
}

.proj-edit:hover {
    color: #f0a843;
}

.proj-del:hover {
    color: #e05a5a;
}

/* ── Nav items (Kanri, Joplin) ── */
.nav-item {
    flex-direction: row;
    align-items: center;
    padding: 7px 9px;
    border-radius: 6px;
    color: #7a7a8c;
    font-size: 13px;
    -unity-font-style: bold;
    transition-property: background-color, color;
    transition-duration: 0.15s;
}

.nav-item:hover {
    background-color: #18181d;
    color: #e8e8f0;
}

.add-proj {
    flex-direction: row;
    align-items: center;
    padding: 6px 9px;
    border-radius: 6px;
    color: #4a4a5c;
    font-size: 12px;
    transition-property: background-color, color;
    transition-duration: 0.15s;
}

.add-proj:hover {
    background-color: #18181d;
    color: #7a7a8c;
}

/* ── Sidebar footer ── */
.sb-foot {
    padding: 12px 16px;
    border-top-width: 1px;
    border-top-color: rgba(255, 255, 255, 0.06);
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
    flex-shrink: 0;
}

.clock {
    font-size: 19px;
    -unity-font-style: bold;
    letter-spacing: -0.38px;
    color: #e8e8f0;
}

.clock-date {
    font-size: 10px;
    color: #4a4a5c;
    margin-top: 2px;
}

.cog-btn {
    width: 26px;
    height: 26px;
    border-radius: 5px;
    align-items: center;
    justify-content: center;
    color: #4a4a5c;
    transition-property: color, background-color;
    transition-duration: 0.15s;
}

.cog-btn:hover {
    color: #7a7a8c;
    background-color: #18181d;
}

/* ── Main area ── */
.main {
    flex: 1;
    flex-direction: column;
    overflow: hidden;
    padding: 20px;
}

.page-head {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
    flex-shrink: 0;
    margin-bottom: 12px;
}

.page-title {
    font-size: 19px;
    -unity-font-style: bold;
    letter-spacing: -0.57px;
    color: #e8e8f0;
}

.page-meta {
    font-size: 10px;
    color: #4a4a5c;
}

/* ── Content area ── */
.main-content {
    flex: 1;
    flex-direction: column;
    overflow: hidden;
}

/* ── Card rows ── */
.card-row {
    flex-direction: row;
    flex: 1;
    min-height: 0;
    margin-bottom: 12px;
}

.card-row:last-child {
    margin-bottom: 0;
}

/* UITK does not have CSS grid — use flex with equal children */
.card-row > VisualElement {
    flex: 1;
    margin-right: 12px;
}

.card-row > VisualElement:last-child {
    margin-right: 0;
}

/* ── Card ── */
.card {
    background-color: #111115;
    border-width: 1px;
    border-color: rgba(255, 255, 255, 0.06);
    border-radius: 8px;
    flex-direction: column;
    overflow: hidden;
    flex: 1;
}

.card-head {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 11px 13px;
    border-bottom-width: 1px;
    border-bottom-color: rgba(255, 255, 255, 0.06);
    flex-shrink: 0;
}

.card-label {
    flex-direction: row;
    align-items: center;
    font-size: 10px;
    color: #4a4a5c;
    letter-spacing: 1px;
    -unity-text-align: upper-left;
}

.card-acts {
    flex-direction: row;
    align-items: center;
}

/* ── Card buttons (cbtn) ── */
.cbtn {
    flex-direction: row;
    align-items: center;
    font-size: 10px;
    color: #4a4a5c;
    padding: 3px 7px;
    border-radius: 4px;
    border-width: 1px;
    border-color: rgba(255, 255, 255, 0.06);
    background-color: rgba(0, 0, 0, 0);
    margin-left: 5px;
    transition-property: color, border-color, background-color;
    transition-duration: 0.15s;
}

.cbtn:hover {
    color: #f0a843;
    border-color: #f0a843;
    background-color: rgba(240, 168, 67, 0.05);
}

.cbtn.tab-on {
    color: #f0a843;
    border-color: #f0a843;
    background-color: rgba(240, 168, 67, 0.05);
}

.cbtn.ext:hover {
    color: #5a9ef5;
    border-color: #5a9ef5;
    background-color: rgba(90, 158, 245, 0.06);
}

/* ── Card body (ScrollView content) ── */
.card-body {
    flex: 1;
    overflow: hidden; /* ScrollView handles it */
    padding: 10px 11px;
    flex-direction: column;
}

.card-footer {
    flex-shrink: 0;
    padding: 8px 11px;
    border-top-width: 1px;
    border-top-color: rgba(255, 255, 255, 0.06);
    flex-direction: column;
}

/* ── Meeting rows ── */
.meeting-row {
    flex-direction: row;
    align-items: center;
    padding: 9px 10px;
    border-radius: 6px;
    border-width: 1px;
    border-color: rgba(255, 255, 255, 0.06);
    margin-bottom: 6px;
    flex-shrink: 0;
    transition-property: border-color, background-color;
    transition-duration: 0.15s;
}

.meeting-row.now {
    border-color: rgba(90, 158, 245, 0.30);
    background-color: rgba(90, 158, 245, 0.04);
}

.meeting-time-block {
    flex-shrink: 0;
    width: 54px;
    align-items: flex-end;
}

.meeting-time {
    font-size: 12px;
    color: #e8e8f0;
    -unity-font-style: bold;
}

.meeting-end {
    font-size: 10px;
    color: #4a4a5c;
    margin-top: 1px;
}

.meeting-divider {
    width: 1px;
    height: 32px;
    background-color: rgba(255, 255, 255, 0.11);
    flex-shrink: 0;
    margin-left: 10px;
    margin-right: 10px;
}

.meeting-info {
    flex: 1;
    overflow: hidden;
}

.meeting-title {
    font-size: 13px;
    -unity-font-style: bold;
    color: #e8e8f0;
    white-space: nowrap;
    -unity-text-overflow-position: end;
    overflow: hidden;
}

.meeting-sub {
    font-size: 11px;
    color: #4a4a5c;
    margin-top: 2px;
    white-space: nowrap;
    -unity-text-overflow-position: end;
    overflow: hidden;
}

.meeting-now-pill {
    font-size: 9px;
    padding: 1px 6px;
    border-radius: 3px;
    background-color: rgba(90, 158, 245, 0.15);
    color: #5a9ef5;
    border-width: 1px;
    border-color: rgba(90, 158, 245, 0.25);
    flex-shrink: 0;
    margin-right: 6px;
}

.join-btn {
    flex-direction: row;
    align-items: center;
    font-size: 11px;
    -unity-font-style: bold;
    padding: 5px 10px;
    border-radius: 5px;
    border-width: 0;
    background-color: #5a9ef5;
    color: #ffffff;
    flex-shrink: 0;
    transition-property: opacity;
    transition-duration: 0.15s;
}

.join-btn:hover {
    opacity: 0.85;
}

.meeting-del {
    opacity: 0;
    color: #4a4a5c;
    flex-shrink: 0;
    width: 14px;
    height: 14px;
    margin-left: 6px;
    transition-property: opacity, color;
    transition-duration: 0.15s;
}

.meeting-row:hover .meeting-del {
    opacity: 1;
}

.meeting-del:hover {
    color: #e05a5a;
}

/* Upcoming event rows */
.ev-day {
    font-size: 10px;
    color: #4a4a5c;
    letter-spacing: 0.72px;
    padding: 6px 3px 3px;
    flex-shrink: 0;
}

.ev-row {
    flex-direction: row;
    align-items: flex-start;
    padding: 6px 3px;
    border-radius: 5px;
    flex-shrink: 0;
    transition-property: background-color;
    transition-duration: 0.12s;
}

.ev-row:hover {
    background-color: #18181d;
}

.ev-time {
    font-size: 10px;
    color: #4a4a5c;
    flex-shrink: 0;
    width: 54px;
    margin-top: 2px;
}

.ev-bar {
    width: 2px;
    align-self: stretch;
    border-radius: 2px;
    min-height: 16px;
    margin-right: 9px;
    /* background-color set from C# using BAR color array */
}

.ev-body {
    flex: 1;
    overflow: hidden;
}

.ev-title {
    font-size: 13px;
    color: #e8e8f0;
}

.ev-sub {
    font-size: 11px;
    color: #4a4a5c;
    margin-top: 1px;
    white-space: nowrap;
    -unity-text-overflow-position: end;
    overflow: hidden;
}

.ev-join {
    flex-direction: row;
    align-items: center;
    font-size: 10px;
    color: #5a9ef5;
    flex-shrink: 0;
    padding: 2px 6px;
    border-radius: 4px;
    border-width: 1px;
    border-color: rgba(90, 158, 245, 0.25);
    transition-property: background-color;
    transition-duration: 0.15s;
}

.ev-join:hover {
    background-color: rgba(90, 158, 245, 0.08);
}

.evdel {
    opacity: 0;
    color: #4a4a5c;
    flex-shrink: 0;
    width: 14px;
    height: 14px;
    transition-property: opacity, color;
    transition-duration: 0.15s;
}

.ev-row:hover .evdel {
    opacity: 1;
}

.evdel:hover {
    color: #e05a5a;
}

/* ── Quick Links ── */
/* links-grid: UITK has no auto-fill grid — use WrapBox or manual row building */
.links-grid {
    flex-direction: row;
    flex-wrap: wrap;
    align-content: flex-start;
}

.link-tile {
    width: 76px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12px 5px;
    border-radius: 6px;
    border-width: 1px;
    border-color: rgba(255, 255, 255, 0.06);
    margin: 3px;
    transition-property: border-color, background-color;
    transition-duration: 0.15s;
}

.link-tile:hover {
    border-color: rgba(255, 255, 255, 0.11);
    background-color: #18181d;
}

.link-tile-icon {
    width: 17px;
    height: 17px;
    color: #7a7a8c;
    /* Image element — tintColor set via IStyle */
    -unity-background-image-tint-color: #7a7a8c;
    transition-property: -unity-background-image-tint-color;
    transition-duration: 0.15s;
}

.link-tile:hover .link-tile-icon {
    -unity-background-image-tint-color: #e8e8f0;
}

.link-tile-name {
    font-size: 10px;
    color: #7a7a8c;
    -unity-font-style: bold;
    -unity-text-align: upper-center;
    margin-top: 6px;
}

.tile-del {
    position: absolute;
    top: 3px;
    right: 3px;
    opacity: 0;
    color: #4a4a5c;
    width: 13px;
    height: 13px;
    transition-property: opacity, color;
    transition-duration: 0.15s;
}

.link-tile:hover .tile-del {
    opacity: 1;
}

.tile-del:hover {
    color: #e05a5a;
}

.add-tile {
    width: 76px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12px 5px;
    border-radius: 6px;
    border-width: 1px;
    border-color: rgba(255, 255, 255, 0.06);
    /* dashed border — not supported in USS, use a workaround texture or omit */
    color: #4a4a5c;
    font-size: 10px;
    margin: 3px;
    transition-property: border-color, color;
    transition-duration: 0.15s;
}

.add-tile:hover {
    border-color: #4a4a5c;
    color: #7a7a8c;
}

.folder-tile {
    width: 76px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12px 5px;
    border-radius: 6px;
    border-width: 1px;
    border-color: rgba(240, 168, 67, 0.15);
    background-color: rgba(240, 168, 67, 0.04);
    margin: 3px;
    transition-property: border-color, background-color;
    transition-duration: 0.15s;
}

.folder-tile:hover {
    border-color: rgba(240, 168, 67, 0.30);
    background-color: rgba(240, 168, 67, 0.08);
}

/* ── Tasks ── */
.task-row {
    flex-direction: row;
    align-items: flex-start;
    padding: 6px 3px;
    border-radius: 5px;
    flex-shrink: 0;
    transition-property: background-color;
    transition-duration: 0.12s;
}

.task-row:hover {
    background-color: #18181d;
}

.tcheck {
    width: 14px;
    height: 14px;
    border-radius: 3px;
    border-width: 1.5px;
    border-color: rgba(255, 255, 255, 0.11);
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    margin-top: 2px;
    margin-right: 8px;
    transition-property: background-color, border-color;
    transition-duration: 0.15s;
}

.tcheck.done {
    background-color: #5acc8a;
    border-color: #5acc8a;
}

.tcheck:hover {
    border-color: #5acc8a;
}

.tcheck-mark {
    width: 9px;
    height: 9px;
    display: none;
    -unity-background-image-tint-color: #000000;
}

.tcheck.done .tcheck-mark {
    display: flex;
}

.ttext {
    font-size: 13px;
    color: #e8e8f0;
    flex: 1;
}

.ttext.done {
    color: #4a4a5c;
    /* text-decoration: line-through — not supported in USS; see §17 */
}

.tdel {
    opacity: 0;
    color: #4a4a5c;
    width: 14px;
    height: 14px;
    flex-shrink: 0;
    transition-property: opacity, color;
    transition-duration: 0.15s;
}

.task-row:hover .tdel {
    opacity: 1;
}

.tdel:hover {
    color: #e05a5a;
}

.task-input-row {
    flex-direction: row;
    margin-bottom: 6px;
}

.tool-hint-row {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}

.hint-text {
    font-size: 10px;
    color: #4a4a5c;
}

/* ── Notes ── */
.note-row {
    flex-direction: row;
    align-items: flex-start;
    padding: 8px 7px;
    border-radius: 6px;
    border-width: 1px;
    border-color: rgba(0, 0, 0, 0);
    flex-shrink: 0;
    transition-property: border-color, background-color;
    transition-duration: 0.15s;
}

.note-row:hover {
    border-color: rgba(255, 255, 255, 0.11);
    background-color: #18181d;
}

.note-ico {
    color: #f0a843;
    flex-shrink: 0;
    margin-top: 1px;
    margin-right: 9px;
    opacity: 0.7;
    width: 14px;
    height: 14px;
    -unity-background-image-tint-color: #f0a843;
}

.note-content {
    flex: 1;
    overflow: hidden;
}

.note-t {
    font-size: 13px;
    -unity-font-style: bold;
    white-space: nowrap;
    -unity-text-overflow-position: end;
    overflow: hidden;
    color: #e8e8f0;
}

.note-p {
    font-size: 11px;
    color: #4a4a5c;
    margin-top: 1px;
    white-space: nowrap;
    -unity-text-overflow-position: end;
    overflow: hidden;
}

.note-d {
    font-size: 10px;
    color: #4a4a5c;
    flex-shrink: 0;
    margin-top: 1px;
    margin-left: 8px;
}

.ndel {
    opacity: 0;
    color: #4a4a5c;
    flex-shrink: 0;
    width: 14px;
    height: 14px;
    margin-top: 1px;
    transition-property: opacity, color;
    transition-duration: 0.15s;
}

.note-row:hover .ndel {
    opacity: 1;
}

.ndel:hover {
    color: #e05a5a;
}

/* ── Empty state ── */
.empty {
    flex: 1;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    color: #4a4a5c;
    -unity-text-align: middle-center;
    padding: 24px 0;
}

/* ── Inputs ── */
.text-field {
    background-color: #18181d;
    border-width: 1px;
    border-color: rgba(255, 255, 255, 0.06);
    border-radius: 5px;
    color: #e8e8f0;
    font-size: 13px;
    padding: 7px 10px;
    width: 100%;
    transition-property: border-color;
    transition-duration: 0.15s;
}

.text-field:focus {
    border-color: #f0a843;
}

/* ── Buttons ── */
.btn {
    padding: 7px 14px;
    border-radius: 5px;
    border-width: 0;
    font-size: 13px;
    -unity-font-style: bold;
    flex-direction: row;
    align-items: center;
    transition-property: opacity;
    transition-duration: 0.15s;
}

.btn:hover {
    opacity: 0.85;
}

.btn-p {
    background-color: #f0a843;
    color: #0b0b0e;
}

.btn-g {
    background-color: #18181d;
    color: #7a7a8c;
    border-width: 1px;
    border-color: rgba(255, 255, 255, 0.06);
}

/* ── Toggle ── */
.toggle-row {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 2px 0;
}

.toggle-label {
    font-size: 13px;
    color: #7a7a8c;
    flex: 1;
    margin-right: 8px;
}

/* Unity Toggle has its own built-in visual — customise via :checked pseudo-class */
.toggle-track {
    width: 36px;
    height: 20px;
    border-radius: 10px;
    background-color: #1e1e25;
    border-width: 1px;
    border-color: rgba(255, 255, 255, 0.11);
    transition-property: background-color, border-color;
    transition-duration: 0.2s;
}

.toggle-track:checked {
    background-color: #f0a843;
    border-color: #f0a843;
}

.toggle-thumb {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 12px;
    height: 12px;
    background-color: #4a4a5c;
    border-radius: 6px;
    transition-property: translate, background-color;
    transition-duration: 0.2s;
}

.unity-toggle:checked .toggle-thumb {
    translate: 16px 0;
    background-color: #ffffff;
}

/* ── Overlay / Modal ── */
.overlay {
    position: absolute;
    left: 0; top: 0; right: 0; bottom: 0;
    background-color: rgba(0, 0, 0, 0.55);
    align-items: center;
    justify-content: center;
    opacity: 0;
    display: none;               /* toggled to flex in C# */
    transition-property: opacity;
    transition-duration: 0.18s;
}

.overlay.open {
    display: flex;
    opacity: 1;
}

.modal {
    background-color: #111115;
    border-width: 1px;
    border-color: rgba(255, 255, 255, 0.11);
    border-radius: 10px;
    padding: 22px;
    translate: 0 8px;
    transition-property: translate;
    transition-duration: 0.18s;
}

.overlay.open .modal {
    translate: 0 0;
}

.m-sm { width: 390px; max-width: 92%; }
.m-md { width: 460px; max-width: 92%; }
.m-lg { width: 520px; max-width: 92%; }

.modal-title {
    font-size: 15px;
    -unity-font-style: bold;
    color: #e8e8f0;
    margin-bottom: 16px;
}

.field {
    margin-bottom: 11px;
}

.lbl {
    font-size: 10px;
    color: #4a4a5c;
    letter-spacing: 0.81px;
    margin-bottom: 4px;
    display: flex;
}

.mrow {
    flex-direction: row;
    justify-content: flex-end;
    margin-top: 18px;
}

.mrow .btn {
    margin-left: 8px;
}

/* ── Icon grid (link picker) ── */
.icon-grid {
    flex-direction: row;
    flex-wrap: wrap;
    margin-top: 5px;
}

.icon-opt {
    width: 32px;
    height: 32px;
    border-radius: 5px;
    border-width: 1px;
    border-color: rgba(255, 255, 255, 0.06);
    background-color: #18181d;
    align-items: center;
    justify-content: center;
    margin: 2px;
    transition-property: border-color, background-color;
    transition-duration: 0.15s;
}

.icon-opt:hover {
    border-color: rgba(255, 255, 255, 0.11);
    background-color: #1e1e25;
}

.icon-opt.sel {
    border-color: #f0a843;
    background-color: rgba(240, 168, 67, 0.10);
}

.icon-opt-image {
    width: 14px;
    height: 14px;
    -unity-background-image-tint-color: #7a7a8c;
}

.icon-opt.sel .icon-opt-image {
    -unity-background-image-tint-color: #f0a843;
}

/* Color dot picker */
.cdots {
    flex-direction: row;
    margin-top: 5px;
}

.cdot {
    width: 20px;
    height: 20px;
    border-radius: 10px;
    border-width: 2px;
    border-color: rgba(0, 0, 0, 0);
    margin-right: 7px;
    transition-property: border-color;
    transition-duration: 0.15s;
}

.cdot.sel {
    border-color: rgba(255, 255, 255, 0.50);
}

/* Settings */
.s-section {
    margin-bottom: 18px;
}

.s-title {
    font-size: 10px;
    color: #4a4a5c;
    letter-spacing: 1px;
    margin-bottom: 9px;
}

.font-opt {
    padding: 8px 10px;
    border-radius: 5px;
    border-width: 1px;
    border-color: rgba(255, 255, 255, 0.06);
    font-size: 13px;
    color: #7a7a8c;
    margin-bottom: 4px;
    transition-property: border-color, background-color, color;
    transition-duration: 0.15s;
}

.font-opt:hover {
    border-color: rgba(255, 255, 255, 0.11);
    background-color: #18181d;
    color: #e8e8f0;
}

.font-opt.sel {
    border-color: #f0a843;
    background-color: rgba(240, 168, 67, 0.10);
    color: #f0a843;
}

/* Scrollbar */
.unity-scroll-view__vertical-scroller {
    width: 3px;
}

.unity-scroll-view__vertical-scroller .unity-scroller__slider .unity-base-slider__dragger {
    background-color: rgba(255, 255, 255, 0.11);
    border-radius: 2px;
    border-width: 0;
}

.unity-scroll-view__vertical-scroller .unity-scroller__slider .unity-base-slider__tracker {
    background-color: rgba(0, 0, 0, 0);
}
```

---

## 6. App Shell UXML

```xml
<!-- AppShell.uxml -->
<ui:UXML xmlns:ui="UnityEngine.UIElements"
         xsi:noNamespaceSchemaLocation="../UIElementsSchema/UIElements.xsd">
    <Style src="../Styles/WorkHub.uss"/>
    <ui:VisualElement class="app">

        <!-- Sidebar -->
        <ui:Instance template="Sidebar" />

        <!-- Main area -->
        <ui:VisualElement class="main" name="main">
            <ui:VisualElement class="page-head">
                <ui:Label class="page-title" name="ptitle" text="Select a project"/>
                <ui:Label class="page-meta"  name="pmeta"  text=""/>
            </ui:VisualElement>
            <!-- Card rows are built dynamically by AppController -->
            <ui:VisualElement class="main-content" name="main-content"/>
        </ui:VisualElement>

    </ui:VisualElement>

    <!-- Modal overlays (hidden by default, shown from C#) -->
    <ui:Instance template="Modals/ProjectModal" name="ov-proj"/>
    <ui:Instance template="Modals/LinkModal"    name="ov-link"/>
    <ui:Instance template="Modals/EventModal"   name="ov-event"/>
    <ui:Instance template="Modals/NoteModal"    name="ov-note"/>
    <ui:Instance template="Modals/SettingsModal" name="ov-settings"/>
</ui:UXML>
```

---

## 7. Sidebar Component

```xml
<!-- Sidebar.uxml -->
<ui:UXML xmlns:ui="UnityEngine.UIElements">
    <ui:VisualElement class="sidebar">

        <!-- Top: wordmark -->
        <ui:VisualElement class="sb-top">
            <ui:VisualElement class="wordmark" style="flex-direction:row">
                <ui:Label text="work" class="wordmark"/>
                <ui:Label text="hub"  class="wordmark wordmark-accent"/>
            </ui:VisualElement>
        </ui:VisualElement>

        <!-- Scrollable middle -->
        <ui:ScrollView class="sb-scroll"
                       vertical-scroller-visibility="Hidden"
                       horizontal-scroller-visibility="Hidden">

            <ui:Label class="sb-label" text="Projects"/>
            <!-- Project list populated at runtime from C# -->
            <ui:VisualElement name="proj-list"/>

            <ui:VisualElement class="add-proj" name="add-proj">
                <!-- Replace with sprite icon element -->
                <ui:VisualElement class="icon-sm" name="icon-plus"/>
                <ui:Label text="New project"/>
            </ui:VisualElement>

            <ui:Label class="sb-label" text="Tools"/>

            <ui:VisualElement class="nav-item" name="btn-kanri">
                <ui:VisualElement class="icon-sm" name="icon-kanban"/>
                <ui:Label text="Kanri"/>
            </ui:VisualElement>

            <ui:VisualElement class="nav-item" name="btn-joplin">
                <ui:VisualElement class="icon-sm" name="icon-notebook"/>
                <ui:Label text="Joplin"/>
            </ui:VisualElement>

        </ui:ScrollView>

        <!-- Footer: clock + settings cog -->
        <ui:VisualElement class="sb-foot">
            <ui:VisualElement>
                <ui:Label class="clock"      name="clock"  text="00:00"/>
                <ui:Label class="clock-date" name="cdate"  text=""/>
            </ui:VisualElement>
            <ui:VisualElement class="cog-btn" name="btn-settings">
                <ui:VisualElement class="icon-sm" name="icon-settings"/>
            </ui:VisualElement>
        </ui:VisualElement>

    </ui:VisualElement>
</ui:UXML>
```

**Single project item (built from C#, not a template):**
```csharp
// ProjectItem.cs — creates the VisualElement hierarchy for one project row
public static VisualElement Build(ProjectData p, bool isActive)
{
    var item = new VisualElement();
    item.AddToClassList("proj-item");
    if (isActive) item.AddToClassList("active");

    var dot = new VisualElement();
    dot.AddToClassList("proj-dot");
    dot.style.backgroundColor = DotColor(p.color);
    item.Add(dot);

    var name = new Label(p.name);
    name.AddToClassList("proj-name");
    item.Add(name);

    if (p.workMode)
    {
        var badge = new Label("work");
        badge.AddToClassList("proj-badge");
        item.Add(badge);
    }

    // Edit icon
    var editBtn = new VisualElement();
    editBtn.AddToClassList("proj-edit");
    editBtn.tooltip = "Edit project";
    editBtn.Add(IconSprite("pencil"));
    item.Add(editBtn);

    // Delete icon
    var delBtn = new VisualElement();
    delBtn.AddToClassList("proj-del");
    delBtn.Add(IconSprite("x"));
    item.Add(delBtn);

    return item;
}
```

---

## 8. Card System

All four cards share a common head + scrollable body + optional footer structure.
Each is built dynamically by its corresponding C# controller into a provided parent slot.

### 8.1 Meetings Card UXML

```xml
<!-- Cards/MeetingsCard.uxml -->
<ui:UXML xmlns:ui="UnityEngine.UIElements">
    <ui:VisualElement class="card" name="card-meetings">
        <ui:VisualElement class="card-head">
            <ui:VisualElement class="card-label">
                <ui:VisualElement class="icon-sm" name="icon-video"/>
                <ui:Label text=" Meetings"/>
            </ui:VisualElement>
            <ui:VisualElement class="card-acts">
                <ui:Button class="cbtn" name="btn-today"    text="Today"/>
                <ui:Button class="cbtn" name="btn-upcoming" text="Upcoming"/>
                <!-- .ics button omitted per scope -->
                <ui:Button class="cbtn" name="btn-add-event">
                    <ui:VisualElement class="icon-sm" name="icon-plus"/>
                </ui:Button>
            </ui:VisualElement>
        </ui:VisualElement>

        <ui:ScrollView class="card-body" name="meetings-body"
                       vertical-scroller-visibility="Auto"
                       horizontal-scroller-visibility="Hidden">
            <!-- MeetingsCardController populates rows here -->
        </ui:ScrollView>
    </ui:VisualElement>
</ui:UXML>
```

**Meeting row C# builder:**
```csharp
// MeetingsCardController.cs (excerpt)
VisualElement BuildMeetingRow(EventData ev, bool isNow)
{
    var row = new VisualElement();
    row.AddToClassList("meeting-row");
    if (isNow) row.AddToClassList("now");

    var timeBlock = new VisualElement();
    timeBlock.AddToClassList("meeting-time-block");
    timeBlock.Add(new Label(ev.time)    { name = "mt" });
    timeBlock.Add(new Label(ev.endTime) { name = "me" });
    // apply classes in C#
    row.Add(timeBlock);

    var divider = new VisualElement();
    divider.AddToClassList("meeting-divider");
    row.Add(divider);

    var info = new VisualElement();
    info.AddToClassList("meeting-info");
    info.Add(new Label(ev.title) { } /* .meeting-title */);
    if (!string.IsNullOrEmpty(ev.note))
        info.Add(new Label(ev.note) { } /* .meeting-sub */);
    row.Add(info);

    if (isNow)
    {
        var pill = new Label("Now");
        pill.AddToClassList("meeting-now-pill");
        row.Add(pill);
    }

    if (!string.IsNullOrEmpty(ev.joinUrl))
    {
        var joinBtn = new Button(() => Application.OpenURL(ev.joinUrl));
        joinBtn.AddToClassList("join-btn");
        joinBtn.text = "Join";
        row.Add(joinBtn);
    }

    var delBtn = new VisualElement();
    delBtn.AddToClassList("meeting-del");
    delBtn.RegisterCallback<ClickEvent>(_ => DeleteEvent(ev.id));
    row.Add(delBtn);

    return row;
}
```

### 8.2 Quick Links Card UXML

```xml
<!-- Cards/LinksCard.uxml -->
<ui:UXML xmlns:ui="UnityEngine.UIElements">
    <ui:VisualElement class="card" name="card-links">
        <ui:VisualElement class="card-head">
            <ui:VisualElement class="card-label">
                <ui:VisualElement class="icon-sm" name="icon-zap"/>
                <ui:Label text=" Quick Links"/>
            </ui:VisualElement>
            <ui:VisualElement class="card-acts">
                <ui:Button class="cbtn" name="btn-add-link">
                    <ui:VisualElement class="icon-sm" name="icon-plus"/>
                    <ui:Label text=" Add"/>
                </ui:Button>
            </ui:VisualElement>
        </ui:VisualElement>

        <ui:ScrollView class="card-body" name="links-body"
                       vertical-scroller-visibility="Auto"
                       horizontal-scroller-visibility="Hidden">
            <!-- LinksCardController builds .links-grid with tiles here -->
        </ui:ScrollView>
    </ui:VisualElement>
</ui:UXML>
```

**Link tile C# builder:**
```csharp
VisualElement BuildLinkTile(LinkData l)
{
    var tile = new VisualElement();
    tile.AddToClassList("link-tile");
    tile.RegisterCallback<ClickEvent>(_ => Application.OpenURL(l.url));

    var delBtn = new VisualElement();
    delBtn.AddToClassList("tile-del");
    delBtn.RegisterCallback<ClickEvent>(e => { e.StopPropagation(); DeleteLink(l.id); });
    tile.Add(delBtn);

    var icon = new VisualElement();
    icon.AddToClassList("link-tile-icon");
    icon.style.backgroundImage = new StyleBackground(GetSprite(l.icon));
    tile.Add(icon);

    var label = new Label(l.name);
    label.AddToClassList("link-tile-name");
    tile.Add(label);

    return tile;
}
```

### 8.3 Tasks Card UXML

```xml
<!-- Cards/TasksCard.uxml -->
<ui:UXML xmlns:ui="UnityEngine.UIElements">
    <ui:VisualElement class="card" name="card-tasks">
        <ui:VisualElement class="card-head">
            <ui:VisualElement class="card-label">
                <ui:VisualElement class="icon-sm" name="icon-check-square"/>
                <ui:Label text=" Tasks"/>
            </ui:VisualElement>
            <ui:VisualElement class="card-acts">
                <ui:Label class="page-meta" name="tasks-counter" text=""/>
            </ui:VisualElement>
        </ui:VisualElement>

        <ui:ScrollView class="card-body" name="tasks-body"
                       vertical-scroller-visibility="Auto"
                       horizontal-scroller-visibility="Hidden">
            <!-- Task rows added by TasksCardController -->
        </ui:ScrollView>

        <ui:VisualElement class="card-footer">
            <ui:VisualElement class="task-input-row">
                <ui:TextField class="text-field" name="task-input"
                              placeholder-text="Add a task…"
                              style="flex:1"/>
                <ui:Button class="btn btn-p" name="btn-add-task"
                           style="margin-left:7px;padding:6px 11px">
                    <ui:VisualElement class="icon-sm" name="icon-plus"/>
                </ui:Button>
            </ui:VisualElement>
            <ui:VisualElement class="tool-hint-row">
                <ui:Label class="hint-text" text="Advanced tasks in Kanri"/>
                <ui:Button class="cbtn ext" name="btn-open-kanri">
                    <ui:VisualElement class="icon-sm" name="icon-ext"/>
                    <ui:Label text=" Open"/>
                </ui:Button>
            </ui:VisualElement>
        </ui:VisualElement>
    </ui:VisualElement>
</ui:UXML>
```

### 8.4 Notes Card UXML

```xml
<!-- Cards/NotesCard.uxml -->
<ui:UXML xmlns:ui="UnityEngine.UIElements">
    <ui:VisualElement class="card" name="card-notes">
        <ui:VisualElement class="card-head">
            <ui:VisualElement class="card-label">
                <ui:VisualElement class="icon-sm" name="icon-file-text"/>
                <ui:Label text=" Notes"/>
            </ui:VisualElement>
            <ui:VisualElement class="card-acts">
                <ui:Button class="cbtn ext" name="btn-open-joplin">
                    <ui:VisualElement class="icon-sm" name="icon-ext"/>
                    <ui:Label text=" Joplin"/>
                </ui:Button>
                <ui:Button class="cbtn" name="btn-new-note">
                    <ui:VisualElement class="icon-sm" name="icon-plus"/>
                    <ui:Label text=" New"/>
                </ui:Button>
            </ui:VisualElement>
        </ui:VisualElement>

        <ui:ScrollView class="card-body" name="notes-body"
                       vertical-scroller-visibility="Auto"
                       horizontal-scroller-visibility="Hidden">
            <!-- Note rows added by NotesCardController -->
        </ui:ScrollView>
    </ui:VisualElement>
</ui:UXML>
```

---

## 9. Modal Overlays

In UITK, modals are absolute-positioned `VisualElement`s that cover the full panel.
Toggle `display: flex` + `opacity: 1` from C# by adding/removing the `open` USS class.

### 9.1 Project Modal

```xml
<!-- Modals/ProjectModal.uxml -->
<ui:UXML xmlns:ui="UnityEngine.UIElements">
    <ui:VisualElement class="overlay" name="ov-proj">
        <ui:VisualElement class="modal m-md">
            <ui:Label class="modal-title" name="proj-h" text="New Project"/>

            <ui:VisualElement style="flex-direction:row; gap:8px">
                <ui:VisualElement class="field" style="flex:1">
                    <ui:Label class="lbl" text="Name"/>
                    <ui:TextField class="text-field" name="proj-name"
                                  placeholder-text="My Project"/>
                </ui:VisualElement>
                <ui:VisualElement class="field">
                    <ui:Label class="lbl" text="Color"/>
                    <ui:VisualElement class="cdots" name="proj-dots">
                        <!-- 5 cdot elements — backgrounds set from C# -->
                        <ui:VisualElement class="cdot sel" name="cdot-amber"
                                          style="background-color:#f0a843"/>
                        <ui:VisualElement class="cdot" name="cdot-blue"
                                          style="background-color:#5a9ef5"/>
                        <ui:VisualElement class="cdot" name="cdot-green"
                                          style="background-color:#5acc8a"/>
                        <ui:VisualElement class="cdot" name="cdot-red"
                                          style="background-color:#e05a5a"/>
                        <ui:VisualElement class="cdot" name="cdot-purple"
                                          style="background-color:#a78bfa"/>
                    </ui:VisualElement>
                </ui:VisualElement>
            </ui:VisualElement>

            <ui:VisualElement class="field">
                <ui:VisualElement class="toggle-row">
                    <ui:Label class="toggle-label"
                              text="Work project (enables meetings &amp; calendar)"/>
                    <ui:Toggle name="proj-work"/>
                </ui:VisualElement>
            </ui:VisualElement>

            <ui:VisualElement class="field">
                <ui:Label class="lbl" text="Joplin notebook (optional)"/>
                <ui:TextField class="text-field" name="proj-joplin"
                              placeholder-text="Notebook name"/>
            </ui:VisualElement>

            <ui:VisualElement class="field">
                <ui:Label class="lbl" text="Folders"/>
                <ui:VisualElement name="proj-folder-list"/>
                <!-- Folder entries added dynamically -->
                <ui:Button class="add-folder-btn" name="btn-add-folder">
                    <ui:VisualElement class="icon-sm" name="icon-plus"/>
                    <ui:Label text=" Add folder"/>
                </ui:Button>
            </ui:VisualElement>

            <ui:VisualElement class="mrow">
                <ui:Button class="btn btn-g" name="btn-cancel-proj" text="Cancel"/>
                <ui:Button class="btn btn-p" name="btn-save-proj"   text="Save"/>
            </ui:VisualElement>
        </ui:VisualElement>
    </ui:VisualElement>
</ui:UXML>
```

### 9.2 Link Modal

```xml
<!-- Modals/LinkModal.uxml -->
<ui:UXML xmlns:ui="UnityEngine.UIElements">
    <ui:VisualElement class="overlay" name="ov-link">
        <ui:VisualElement class="modal m-md">
            <ui:Label class="modal-title" text="Add Quick Link"/>
            <ui:VisualElement class="field">
                <ui:Label class="lbl" text="Name"/>
                <ui:TextField class="text-field" name="l-name" placeholder-text="GitHub"/>
            </ui:VisualElement>
            <ui:VisualElement class="field">
                <ui:Label class="lbl" text="URL"/>
                <ui:TextField class="text-field" name="l-url"
                              placeholder-text="https://github.com"/>
            </ui:VisualElement>
            <ui:VisualElement class="field">
                <ui:Label class="lbl" text="Icon"/>
                <ui:VisualElement class="icon-grid" name="icon-grid"/>
                <!-- Icon option tiles built by C# from sprite atlas -->
            </ui:VisualElement>
            <ui:VisualElement class="mrow">
                <ui:Button class="btn btn-g" name="btn-cancel-link" text="Cancel"/>
                <ui:Button class="btn btn-p" name="btn-save-link"   text="Add"/>
            </ui:VisualElement>
        </ui:VisualElement>
    </ui:VisualElement>
</ui:UXML>
```

### 9.3 Event Modal

```xml
<!-- Modals/EventModal.uxml -->
<ui:UXML xmlns:ui="UnityEngine.UIElements">
    <ui:VisualElement class="overlay" name="ov-event">
        <ui:VisualElement class="modal m-sm">
            <ui:Label class="modal-title" text="Add Event / Meeting"/>
            <ui:VisualElement class="field">
                <ui:Label class="lbl" text="Title"/>
                <ui:TextField class="text-field" name="ev-t"
                              placeholder-text="Team standup"/>
            </ui:VisualElement>
            <ui:VisualElement class="field">
                <ui:Label class="lbl" text="Time"/>
                <ui:TextField class="text-field" name="ev-w"
                              placeholder-text="9:00 AM — 9:30 AM"/>
            </ui:VisualElement>
            <ui:VisualElement class="field">
                <ui:Label class="lbl" text="Join URL (optional)"/>
                <ui:TextField class="text-field" name="ev-url"
                              placeholder-text="https://meet.google.com/..."/>
            </ui:VisualElement>
            <ui:VisualElement class="field">
                <ui:Label class="lbl" text="Note (optional)"/>
                <ui:TextField class="text-field" name="ev-n"
                              placeholder-text="Location, agenda..."/>
            </ui:VisualElement>
            <ui:VisualElement class="mrow">
                <ui:Button class="btn btn-g" name="btn-cancel-ev" text="Cancel"/>
                <ui:Button class="btn btn-p" name="btn-save-ev"   text="Add"/>
            </ui:VisualElement>
        </ui:VisualElement>
    </ui:VisualElement>
</ui:UXML>
```

### 9.4 Note Modal

```xml
<!-- Modals/NoteModal.uxml -->
<ui:UXML xmlns:ui="UnityEngine.UIElements">
    <ui:VisualElement class="overlay" name="ov-note">
        <ui:VisualElement class="modal m-lg">
            <ui:TextField class="note-title-inp" name="n-title"
                          placeholder-text="Note title..."
                          style="font-size:17px;-unity-font-style:bold;
                                 border-width:0;border-bottom-width:1px;
                                 background-color:rgba(0,0,0,0);
                                 margin-bottom:11px;border-bottom-color:rgba(255,255,255,0.06)"/>
            <!-- Multiline TextField for body -->
            <ui:TextField class="text-field" name="n-body"
                          placeholder-text="Write anything..."
                          multiline="true"
                          style="min-height:140px;flex:1"/>
            <ui:VisualElement class="mrow">
                <ui:Button class="btn btn-g" name="btn-cancel-note" text="Cancel"/>
                <ui:Button class="btn btn-p" name="btn-save-note"   text="Save"/>
            </ui:VisualElement>
        </ui:VisualElement>
    </ui:VisualElement>
</ui:UXML>
```

### 9.5 Settings Modal

```xml
<!-- Modals/SettingsModal.uxml -->
<ui:UXML xmlns:ui="UnityEngine.UIElements">
    <ui:VisualElement class="overlay" name="ov-settings">
        <ui:VisualElement class="modal m-md">
            <ui:Label class="modal-title" text="Settings"/>

            <ui:VisualElement class="s-section">
                <ui:Label class="s-title" text="Accent Color"/>
                <!-- ColorField from UnityEditor not available at runtime.
                     Use a row of preset color swatches (same cdots pattern),
                     or build a custom HSV slider. -->
                <ui:VisualElement style="flex-direction:row; align-items:center">
                    <ui:VisualElement name="acc-preview"
                                      style="width:26px;height:26px;border-radius:13px;
                                             background-color:#f0a843;margin-right:10px"/>
                    <ui:Label name="acc-hex" text="#f0a843"
                              style="font-size:11px;color:#4a4a5c"/>
                </ui:VisualElement>
                <!-- 5 preset accent swatches — built the same as cdots -->
            </ui:VisualElement>

            <ui:VisualElement class="s-section">
                <ui:Label class="s-title" text="Font"/>
                <ui:VisualElement name="font-opts">
                    <ui:VisualElement class="font-opt sel" name="font-syne">
                        <ui:Label text="Syne — geometric"/>
                    </ui:VisualElement>
                    <ui:VisualElement class="font-opt" name="font-outfit">
                        <ui:Label text="Outfit — friendly"/>
                    </ui:VisualElement>
                    <ui:VisualElement class="font-opt" name="font-dmsans">
                        <ui:Label text="DM Sans — clean"/>
                    </ui:VisualElement>
                    <!-- Add IBM Plex Sans, Plus Jakarta Sans similarly -->
                </ui:VisualElement>
            </ui:VisualElement>

            <ui:VisualElement class="s-section">
                <ui:Label class="s-title" text="App Paths"/>
                <ui:VisualElement class="field">
                    <ui:Label class="lbl" text="Kanri .exe"/>
                    <ui:TextField class="text-field" name="kanri-path"
                                  placeholder-text="C:\...\Kanri.exe"/>
                </ui:VisualElement>
                <ui:VisualElement class="field">
                    <ui:Label class="lbl" text="Joplin .exe"/>
                    <ui:TextField class="text-field" name="joplin-path"
                                  placeholder-text="C:\...\Joplin.exe"/>
                </ui:VisualElement>
            </ui:VisualElement>

            <ui:VisualElement class="mrow">
                <ui:Button class="btn btn-p" name="btn-done-settings" text="Done"/>
            </ui:VisualElement>
        </ui:VisualElement>
    </ui:VisualElement>
</ui:UXML>
```

---

## 10. C# Controller Architecture

```
AppController                 ← MonoBehaviour on UIDocument GameObject
├── SidebarController         ← owns sidebar, clock ticker, project list
│   └── ProjectItem (×N)      ← one per project (not a MonoBehaviour)
├── MeetingsCardController
├── LinksCardController
├── TasksCardController
├── NotesCardController
└── Modals/
    ├── ProjectModalController
    ├── LinkModalController
    ├── EventModalController
    ├── NoteModalController
    └── SettingsModalController
```

```csharp
// AppController.cs
using UnityEngine;
using UnityEngine.UIElements;

public class AppController : MonoBehaviour
{
    [SerializeField] UIDocument _doc;

    WorkHubData _db;
    string      _activeProjectId;
    VisualElement _root;

    // Sub-controllers
    SidebarController      _sidebar;
    MeetingsCardController _meetings;
    LinksCardController    _links;
    TasksCardController    _tasks;
    NotesCardController    _notes;

    void OnEnable()
    {
        _root = _doc.rootVisualElement;
        _db   = DataStore.Load();
        if (_db.projects.Count > 0) _activeProjectId = _db.projects[0].id;

        _sidebar  = new SidebarController(_root, _db, OnProjectSelected, OpenModal);
        // Modals are wired in OnEnable — pass callbacks for save actions

        Render();
    }

    void OnProjectSelected(string id)
    {
        _activeProjectId = id;
        Render();
    }

    void Render()
    {
        _sidebar.Render(_activeProjectId);
        RebuildMainContent();
    }

    void RebuildMainContent()
    {
        var mc = _root.Q("main-content");
        mc.Clear();

        var proj = _db.projects.Find(p => p.id == _activeProjectId);
        if (proj == null) return;

        _root.Q<Label>("ptitle").text = proj.name;
        int done = proj.tasks.FindAll(t => t.done).Count;
        _root.Q<Label>("pmeta").text  = proj.tasks.Count > 0
            ? $"{done}/{proj.tasks.Count} tasks" : "";

        if (proj.workMode)
        {
            // Row 1: Meetings | Links
            var row1 = MakeRow();
            var slot1 = new VisualElement(); row1.Add(slot1);
            var slot2 = new VisualElement(); row1.Add(slot2);
            mc.Add(row1);
            _meetings = new MeetingsCardController(slot1, proj, _db, Save, OpenModal);
            _links    = new LinksCardController(slot2, proj, _db, Save, OpenModal);

            // Row 2: Tasks | Notes
            var row2 = MakeRow();
            var slot3 = new VisualElement(); row2.Add(slot3);
            var slot4 = new VisualElement(); row2.Add(slot4);
            mc.Add(row2);
            _tasks = new TasksCardController(slot3, proj, _db, Save);
            _notes = new NotesCardController(slot4, proj, _db, Save, OpenModal);
        }
        else
        {
            // Row 1: Links | Tasks
            var row1 = MakeRow();
            var slot1 = new VisualElement(); row1.Add(slot1);
            var slot2 = new VisualElement(); row1.Add(slot2);
            mc.Add(row1);
            _links = new LinksCardController(slot1, proj, _db, Save, OpenModal);
            _tasks = new TasksCardController(slot2, proj, _db, Save);

            // Row 2: Notes full-width
            var row2 = MakeRow();
            mc.Add(row2);
            _notes = new NotesCardController(row2, proj, _db, Save, OpenModal);
        }
    }

    VisualElement MakeRow()
    {
        var row = new VisualElement();
        row.AddToClassList("card-row");
        return row;
    }

    void Save() => DataStore.Save(_db);

    void OpenModal(string modalName) =>
        _root.Q(modalName).AddToClassList("open");

    // Clock tick — called from SidebarController via schedule
}
```

```csharp
// SidebarController.cs (excerpt)
public class SidebarController
{
    VisualElement _root;
    WorkHubData   _db;
    Action<string> _onSelect;
    Action<string> _openModal;
    IVisualElementScheduledItem _clockTicker;

    public SidebarController(VisualElement root, WorkHubData db,
                             Action<string> onSelect, Action<string> openModal)
    {
        _root = root; _db = db; _onSelect = onSelect; _openModal = openModal;

        root.Q("add-proj").RegisterCallback<ClickEvent>(_ => openModal("ov-proj"));
        root.Q("btn-settings").RegisterCallback<ClickEvent>(_ => openModal("ov-settings"));

        // Start clock ticker (every second)
        _clockTicker = root.schedule
            .Execute(Tick)
            .Every(1000);
        Tick(); // immediate first tick
    }

    public void Render(string activeId)
    {
        var list = _root.Q("proj-list");
        list.Clear();
        foreach (var p in _db.projects)
        {
            var item = ProjectItemBuilder.Build(p, p.id == activeId);
            item.RegisterCallback<ClickEvent>(e =>
            {
                // Walk up from e.target to find whether edit or del icon was clicked.
                // GetFirstAncestorWithClass is Editor-only; use the runtime-safe pattern:
                var ve = e.target as VisualElement;
                bool isEdit = false, isDel = false;
                while (ve != null && ve != item)
                {
                    if (ve.ClassListContains("proj-edit")) { isEdit = true; break; }
                    if (ve.ClassListContains("proj-del"))  { isDel  = true; break; }
                    ve = ve.parent;
                }

                if (isDel)  { e.StopPropagation(); _onDelete(p.id); }
                else if (isEdit) { e.StopPropagation(); _onEdit(p.id); }
                else _onSelect(p.id);
            });
            list.Add(item);
        }
    }

    void Tick()
    {
        var now = System.DateTime.Now;
        var clock = _root.Q<Label>("clock");
        var cdate = _root.Q<Label>("cdate");
        if (clock != null) clock.text = now.ToString("HH:mm");
        if (cdate != null) cdate.text = now.ToString("ddd, MMM d");
    }
}
```

---

## 11. Per-Component Implementation Notes

### Personal Layout (Notes Full-Width)

The personal-mode second row passes `row2` directly as the slot for `NotesCardController`,
so the notes card is the only child of that row and expands to fill the full width — exactly
matching the HTML fix. No special CSS needed; `flex:1` on the card handles it.

### Dynamic Grid Layout for Quick Links

CSS `grid-template-columns: repeat(auto-fill, minmax(76px, 1fr))` has no direct USS equivalent.
Workaround: use `flex-direction: row; flex-wrap: wrap` on `.links-grid` and give each tile
`width: 76px` with `margin: 3px`. This closely approximates the auto-fill behaviour.
Alternatively, use a `ListView` with a custom itemTemplate that shows tiles in rows.

### Toggle (Work Mode)

Use `UnityEngine.UIElements.Toggle` and override its default checkbox visuals with USS:
```css
.unity-toggle__checkmark { display: none; }  /* hide default box */
```
Then build the track + thumb as sibling `VisualElement`s controlled by a `RegisterValueChangedCallback`.

### Task Strike-Through

USS does not support `text-decoration: line-through`. Workaround:
- Overlay a 1px-tall `VisualElement` with `background-color: #4a4a5c` and `position: absolute`
  sized to the label width, or
- Use `RichText` with the `<s>` tag: `label.text = $"<s>{task.text}</s>"`.

### "Now" meeting detection

Replicate `isNowBetween()` in C#:
```csharp
bool IsNowBetween(string start, string end)
{
    if (!TryParseTime(start, out int sm)) return false;
    TryParseTime(end, out int em);
    var now = System.DateTime.Now;
    int nm = now.Hour * 60 + now.Minute;
    return nm >= sm && nm <= (em > 0 ? em : sm + 60);
}
```

### Modal Backdrop Click-to-Close

```csharp
overlay.RegisterCallback<ClickEvent>(e =>
{
    if (e.target == overlay) // only if clicking the backdrop, not the modal
        overlay.RemoveFromClassList("open");
});
```

### Keyboard: Enter to Add Task

```csharp
taskInput.RegisterCallback<KeyDownEvent>(e =>
{
    if (e.keyCode == KeyCode.Return || e.keyCode == KeyCode.KeypadEnter)
        AddTask();
});
```

### Escape to Close Any Open Modal

```csharp
_root.RegisterCallback<KeyDownEvent>(e =>
{
    if (e.keyCode == KeyCode.Escape)
        _root.Query(className: "overlay").ForEach(o => o.RemoveFromClassList("open"));
}, TrickleDown.TrickleDown);
```

---

## 12. Animations & Transitions

USS transitions work the same as CSS transitions in Unity 2022.2+.

**Card fade-in (equivalent to `fadeUp` keyframe animation):**
```css
/* USS transitions (no @keyframes support — use TransitionEndEvent + USS classes) */
.card {
    opacity: 0;
    translate: 0 5px;
    transition-property: opacity, translate;
    transition-duration: 0.22s;
    transition-timing-function: ease;
}
.card.visible {
    opacity: 1;
    translate: 0 0;
}
```
In C#, after adding the card to the hierarchy, schedule a one-frame delay then add `.visible`.
Use `.StartingIn(delayMs)` — **not** `.ExecuteLater()` (that method re-schedules an already-scheduled
item; `.StartingIn()` is the correct fluent API for setting the initial delay):
```csharp
card.schedule.Execute(() => card.AddToClassList("visible")).StartingIn(16);
```
Stagger by card index:
```csharp
card.schedule.Execute(() => card.AddToClassList("visible")).StartingIn(40L * index + 16);
```

**Modal slide-in:**
```css
.modal {
    translate: 0 8px;
    transition-property: translate;
    transition-duration: 0.18s;
    transition-timing-function: ease;
}
.overlay.open .modal {
    translate: 0 0;
}
```

**Hover transitions on all interactive elements:** already declared in the USS above with
`transition-duration: 0.15s` — these work automatically with USS `:hover`.

---

## 13. Data Persistence

Replace the HTML's `localStorage` with a JSON file written to `Application.persistentDataPath`.

```csharp
// DataStore.cs
using System.IO;
using UnityEngine;

public static class DataStore
{
    static string Path =>
        System.IO.Path.Combine(Application.persistentDataPath, "workhub.json");

    public static WorkHubData Load()
    {
        if (!File.Exists(Path)) return Seed();
        try   { return JsonUtility.FromJson<WorkHubData>(File.ReadAllText(Path)); }
        catch { return Seed(); }
    }

    public static void Save(WorkHubData data) =>
        File.WriteAllText(Path, JsonUtility.ToJson(data));

    static WorkHubData Seed()
    {
        var d = new WorkHubData();
        // build default Work + Personal projects
        Save(d); return d;
    }
}
```

> On Windows, `Application.persistentDataPath` resolves to
> `C:\Users\<user>\AppData\LocalLow\<Company>\<Product>\workhub.json`

---

## 14. Icons

Lucide icons are SVG — Unity's UITK uses sprite-based images.
The recommended approach:

1. **Download** Lucide icon SVGs you need (the 24 used in this dashboard):
   `globe, link, github, figma, code-2, terminal, folder, database, monitor, smartphone,
   mail, book, youtube, music, image, box, cloud, coffee, settings, send, layers, trello,
   slack, pen-tool, plus, x, pencil, check, video, zap, upload, check-square, file-text,
   layout-kanban, notebook, external-link, folder-open`

2. **Convert** SVGs to PNGs at 64×64 (scale up for retina support) using a tool like Inkscape.

3. **Import** PNGs into Unity, set `Texture Type = Sprite (2D and UI)`.

4. **Pack** into a `SpriteAtlas` (`Assets/WorkHub/UI/Icons/IconAtlas.spriteAtlas`).

5. **Look up** sprites by name at runtime:
```csharp
[SerializeField] SpriteAtlas _icons;

Sprite GetSprite(string name) => _icons.GetSprite(name);

VisualElement IconElement(string name, float size = 14f)
{
    var el = new VisualElement();
    el.style.width  = size;
    el.style.height = size;
    el.style.backgroundImage = new StyleBackground(GetSprite(name));
    el.style.unityBackgroundImageTintColor = Color.white; // override in USS
    return el;
}
```

---

## 15. Fonts

All five fonts are Google Fonts. Download the `.ttf` files and import into Unity:

| CSS Font | Google Fonts slug | Unity Font Asset name |
|---|---|---|
| Syne | Syne | Syne-Regular, Syne-Bold |
| Outfit | Outfit | Outfit-Regular, Outfit-Medium |
| DM Sans | DM_Sans | DMSans-Regular, DMSans-Medium |
| Plus Jakarta Sans | Plus_Jakarta_Sans | PlusJakartaSans-Regular |
| IBM Plex Sans | IBM_Plex_Sans | IBMPlexSans-Regular |
| JetBrains Mono | JetBrains_Mono | JetBrainsMono-Regular (monospace labels) |

**Import steps:**
1. In Unity: `Assets → Create → TextMeshPro → Font Asset` (TMP is required for UITK text in 2022.3).
2. Drag the `.ttf` into the font asset creator, click Generate.
3. Reference each font asset in USS via `-unity-font-definition`:
```css
.clock { -unity-font-definition: url('project://database/Assets/WorkHub/UI/Fonts/JetBrainsMono-Regular SDF.asset'); }
```
4. Runtime font swap (for the font picker in Settings):
```csharp
void ApplyFont(string fontName)
{
    var fontAsset = Resources.Load<FontAsset>($"Fonts/{fontName}-Regular SDF");
    _root.Query<Label>().ForEach(l => l.style.unityFontDefinition =
        new StyleFontDefinition(fontAsset));
}
```

---

## 16. Key CSS → USS Translation Reference

| CSS property / concept | USS equivalent |
|---|---|
| `display: flex` | default in UITK (all VisualElements are flex) |
| `display: grid` | **not supported** — use `flex-wrap: wrap` or manual row containers |
| `flex: 1` | `flex: 1 1 0` or `flex-grow: 1` |
| `min-height: 0` | `min-height: 0` ✅ supported |
| `overflow: hidden` | `overflow: hidden` ✅ |
| `overflow-y: auto` | use `ScrollView` element |
| `gap: 12px` | `margin-bottom` on children (USS `gap` not supported in 2022) |
| `grid-template-columns: 1fr 1fr` | two children each with `flex: 1` inside a row container |
| `position: absolute` | `position: absolute` ✅ |
| `inset: 0` | `left:0; top:0; right:0; bottom:0` |
| `var(--accent)` | Unity 6 only; in 2022 hardcode or update via C# `IStyle` |
| `rgba(r,g,b,a)` | `rgba(r, g, b, a)` ✅ (spaces required) |
| `text-overflow: ellipsis` | `-unity-text-overflow-position: end` + `overflow: hidden` |
| `white-space: nowrap` | `white-space: nowrap` ✅ |
| `text-transform: uppercase` | `-unity-text-align` only; uppercase via `text.ToUpper()` in C# |
| `letter-spacing: 0.12em` | `letter-spacing: Xpx` (convert em → px) |
| `text-decoration: line-through` | **not supported** — use `<s>` rich text tag |
| `backdrop-filter: blur(6px)` | **not supported** — add a semi-transparent panel behind modal |
| `@keyframes` animations | **not supported** — use USS transitions + class toggling |
| `:nth-child(n)` | **not supported** — apply classes from C# |
| `:first-child` | **not supported** — track index in C# |
| `cursor: pointer` | **no keyword equivalent** — USS `cursor` only accepts `url("tex.png") hx hy` for a custom texture, or `initial`/`auto`. Omit the property to keep the default arrow, or supply a hand-cursor PNG (see §17). |
| `transform: scale(1.15)` | `scale: 1.15 1.15` |
| `transition: X 0.15s ease` | `transition-property: X; transition-duration: 0.15s; transition-timing-function: ease` |
| `border: 1px dashed` | **not supported** — use a tiled border texture or workaround |
| `font-weight: 500` | use a Medium font face asset |
| `font-weight: 700` | `-unity-font-style: bold` (with a Bold font face asset) |
| `font-family: var(--mono)` | `-unity-font-definition: url(...)` |
| HTML `<input type="color">` | No runtime equivalent — use color swatches |
| HTML `<input type="file">` | No runtime equivalent — use a path text field |
| HTML `<textarea>` | `TextField` with `multiline="true"` |
| `pointer-events: none` | `pickingMode: PickingMode.Ignore` |
| `user-select: none` | `style.unityOverflowClipBox` (or ignore — text is not selectable by default) |
| `z-index` | `sort-order` on Panel Settings, or use absolute overlay at end of hierarchy |

---

## 17. Gotchas & Unity-Specific Patterns

### Calling `Q()` too early
Always query elements inside `OnEnable()` or after the `UIDocument` has finished loading.
Do **not** query in `Awake()` — the visual tree may not be ready.

### Pointer / hand cursor
CSS `cursor: pointer` has **no keyword equivalent** in USS. The USS `cursor` property only accepts
`url("path/to/cursor.png") <hotspot-x> <hotspot-y>` or the keyword `initial`.
To show a hand cursor on interactive tiles and buttons, import a 32×32 hand PNG and apply it via
USS or C#:
```css
/* In USS — reference a custom cursor texture */
.link-tile, .proj-item, .btn, .cbtn, .nav-item {
    cursor: url("project://database/Assets/WorkHub/UI/Cursors/hand.png") 8 2;
}
```
Or in C# inline (useful for dynamic elements):
```csharp
void SetHandCursor(VisualElement el, Texture2D handTex)
{
    el.style.cursor = new StyleCursor(new Cursor { texture = handTex, hotspot = new Vector2(8, 2) });
}
```
If you don't care about the hand appearance, simply omit the `cursor` property — the default arrow
is perfectly usable for a desktop app.

### `Clear()` vs re-render
Rather than `innerHTML = ''` + rebuild, prefer clearing with `container.Clear()` then
re-adding children. This is the direct equivalent of the JavaScript pattern in this dashboard.

### ListView for long lists
If tasks or notes grow large, replace the manual `container.Add(row)` loop with a `ListView`:
```csharp
var list = new ListView(tasks, itemHeight: 32, makeItem, bindItem);
list.style.flexGrow = 1;
container.Add(list);
```
`ListView` virtualises the DOM exactly like a browser's virtual list.

### No `confirm()` dialog
Replace `if(!confirm('Delete?'))` with a small inline confirmation step:
toggle a "confirm delete?" button row visible on first click, execute on second.

### Accent color runtime update
When the user changes the accent, iterate elements and update `IStyle.backgroundColor`
or `IStyle.borderColor` directly, rather than relying on CSS variables.
Alternatively, swap a USS class (e.g., `.accent-orange` ↔ `.accent-blue`) that defines
all accent-colored properties.

### ScrollView inside a card
The card body must use a `ScrollView` (not a plain `VisualElement`) to get internal
scrolling. Set the `ScrollView.contentContainer`'s padding, not the `ScrollView` itself:
```csharp
scrollView.contentContainer.style.paddingTop    = 10;
scrollView.contentContainer.style.paddingBottom = 10;
```

### Modal display toggle
UITK's `display` property does not support animation. Use `opacity` + `pointer-events` for
the fade, and toggle `display: none ↔ flex` only after the opacity transition ends:
```csharp
overlay.RegisterCallback<TransitionEndEvent>(_ =>
{
    if (!overlay.ClassListContains("open"))
        overlay.style.display = DisplayStyle.None;
});
```

### Staggered card animations
UITK transitions fire on class addition. Schedule the `.visible` class addition with
`schedule.Execute(...).StartingIn(ms)` rather than `SetTimeout`, which doesn't exist in C#.
Use `.StartingIn(long delayMs)` for the initial trigger delay (fluent API on
`IVisualElementScheduledItem`). Reserve `.ExecuteLater(long delayMs)` only for re-triggering an
item that is already scheduled.
