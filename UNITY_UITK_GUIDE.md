# WorkHub — Unity UI Toolkit Visual Recreation Guide

A **visuals-only** reference for rebuilding this dashboard's look and feel in Unity using
**UI Toolkit (UITK)** — UXML layout skeletons and USS stylesheets only.
No C# logic, no data model, no persistence. The goal is to push USS as far as it goes
and produce a pixel-accurate dark dashboard skin.

> Verified against **UnityCsReference (master)** — every USS property named here exists in
> `IStyle.cs` / `StylePropertyUtil.cs`. Unity 2022.3 LTS or Unity 6 required.

---

## Table of Contents

1. [Project Setup](#1-project-setup)
2. [Asset Folder Layout](#2-asset-folder-layout)
3. [Design Tokens — USS Variables](#3-design-tokens--uss-variables)
4. [Global Reset & Typography](#4-global-reset--typography)
5. [App Shell Layout](#5-app-shell-layout)
6. [Sidebar](#6-sidebar)
7. [Card System](#7-card-system)
8. [Card Contents](#8-card-contents)
   - [Meetings Card](#81-meetings-card)
   - [Quick Links Card](#82-quick-links-card)
   - [Tasks Card](#83-tasks-card)
   - [Notes Card](#84-notes-card)
9. [Modal Overlays](#9-modal-overlays)
10. [Shared Controls](#10-shared-controls)
    - [Buttons](#101-buttons)
    - [Text Fields](#102-text-fields)
    - [Toggle Switch](#103-toggle-switch)
    - [Color Dot Picker](#104-color-dot-picker)
    - [Icon Grid](#105-icon-grid)
11. [Scrollbar Styling](#11-scrollbar-styling)
12. [Animations & Transitions — Full Showcase](#12-animations--transitions--full-showcase)
13. [Icons](#13-icons)
14. [Fonts](#14-fonts)
15. [CSS → USS Visual Property Reference](#15-css--uss-visual-property-reference)
16. [USS Visual Gotchas](#16-uss-visual-gotchas)

---

## 1. Project Setup

| | |
|---|---|
| Unity version | 2022.3 LTS (minimum) or Unity 6 |
| Package | `com.unity.ui` — built-in since Unity 2021.2, no install needed |
| Visual editor | `com.unity.ui.builder` — Window → UI Toolkit → UI Builder |
| Panel Settings | Scale Mode = **Scale With Screen Size**, reference = **1440 × 900** |

Attach a `UIDocument` component to a scene GameObject and assign your root UXML as
`Source Asset`. Set the Camera background to `#0b0b0e` so it matches the app background.

---

## 2. Asset Folder Layout

```
Assets/WorkHub/
├── UI/
│   ├── PanelSettings.asset
│   ├── Fonts/                  ← imported .ttf → SDF Font Assets
│   │   ├── Syne-Regular SDF.asset
│   │   ├── Syne-Bold SDF.asset
│   │   └── JetBrainsMono-Regular SDF.asset
│   ├── Icons/                  ← 64×64 white PNGs, tinted at runtime via USS
│   │   └── IconAtlas.spriteAtlas
│   ├── Cursors/
│   │   └── hand.png            ← 32×32 hand cursor PNG
│   ├── Styles/
│   │   ├── Tokens.uss          ← design tokens (Unity 6: var(); 2022: constants)
│   │   └── WorkHub.uss         ← all component styles
│   └── UXML/
│       ├── AppShell.uxml
│       ├── Sidebar.uxml
│       ├── Cards/
│       │   ├── MeetingsCard.uxml
│       │   ├── LinksCard.uxml
│       │   ├── TasksCard.uxml
│       │   └── NotesCard.uxml
│       └── Modals/
│           ├── ProjectModal.uxml
│           ├── LinkModal.uxml
│           ├── EventModal.uxml
│           ├── NoteModal.uxml
│           └── SettingsModal.uxml
```

---

## 3. Design Tokens — USS Variables

### Unity 6 (`var()` supported)

```css
/* Tokens.uss */
:root {
    /* Backgrounds */
    --bg:         #0b0b0e;
    --bg2:        #111115;
    --bg3:        #18181d;
    --bg4:        #1e1e25;

    /* Borders */
    --border:     rgba(255, 255, 255, 0.06);
    --border-h:   rgba(255, 255, 255, 0.11);

    /* Text */
    --text:       #e8e8f0;
    --text2:      #7a7a8c;
    --text3:      #4a4a5c;

    /* Accent (swapped at runtime by toggling a USS class on :root) */
    --accent:     #f0a843;
    --accent-dim: rgba(240, 168, 67, 0.10);
    --accent-glow:rgba(240, 168, 67, 0.05);

    /* Named palette */
    --blue:       #5a9ef5;
    --green:      #5acc8a;
    --red:        #e05a5a;
    --purple:     #a78bfa;
    --amber:      #f0a843;

    /* Radius */
    --radius-sm:  4px;
    --radius:     8px;
    --radius-lg:  10px;
    --radius-pill:999px;

    /* Motion */
    --dur-fast:   0.12s;
    --dur:        0.18s;
    --dur-slow:   0.28s;
    --ease:       ease;
}
```

### Unity 2022.3 (no `var()` — use a token comment header)

USS variables are **not** supported in 2022.3. Copy the values directly into each rule.
Keep `Tokens.uss` as a comment-only reference sheet and do a global find-replace whenever
you change a token.

> **Accent swap without `var()`:** Add one USS class per accent colour to the root
> `VisualElement` and use the class in every rule that references the accent:
> `.accent-amber .btn-p { background-color: #f0a843; }`
> `.accent-blue  .btn-p { background-color: #5a9ef5; }`

---

## 4. Global Reset & Typography

```css
/* WorkHub.uss — top of file */

/* ── Box model reset ── */
VisualElement {
    box-sizing: border-box;
}

/* ── Root font ── */
.app {
    width: 100%;
    height: 100%;
    flex-direction: row;
    background-color: #0b0b0e;
    -unity-font-definition: url("project://database/Assets/WorkHub/UI/Fonts/Syne-Regular SDF.asset");
    color: #e8e8f0;
    font-size: 13px;
}

/* ── Monospace override (clock, hex codes) ── */
.mono {
    -unity-font-definition: url("project://database/Assets/WorkHub/UI/Fonts/JetBrainsMono-Regular SDF.asset");
}

/* ── Weight helpers ── */
.bold {
    -unity-font-definition: url("project://database/Assets/WorkHub/UI/Fonts/Syne-Bold SDF.asset");
    -unity-font-style: bold;
}

/* ── Label size scale ── */
.text-xs  { font-size: 9px;  }
.text-sm  { font-size: 10px; }
.text-base{ font-size: 13px; }
.text-md  { font-size: 15px; }
.text-lg  { font-size: 19px; }

/* ── Muted text colours ── */
.muted  { color: #7a7a8c; }
.dimmed { color: #4a4a5c; }

/* ── Text overflow: single line clamp ── */
.clamp {
    overflow: hidden;
    white-space: nowrap;
    -unity-text-overflow-position: end;
    text-overflow: ellipsis;
}
```

---

## 5. App Shell Layout

```xml
<!-- AppShell.uxml -->
<ui:UXML xmlns:ui="UnityEngine.UIElements">
    <Style src="../Styles/Tokens.uss"/>
    <Style src="../Styles/WorkHub.uss"/>

    <ui:VisualElement name="app" class="app">

        <!-- Declare sub-templates before using them -->
        <ui:Template name="Sidebar"  src="Sidebar.uxml"/>
        <ui:Template name="ProjModal"   src="Modals/ProjectModal.uxml"/>
        <ui:Template name="LinkModal"   src="Modals/LinkModal.uxml"/>
        <ui:Template name="EventModal"  src="Modals/EventModal.uxml"/>
        <ui:Template name="NoteModal"   src="Modals/NoteModal.uxml"/>
        <ui:Template name="SettingsModal" src="Modals/SettingsModal.uxml"/>

        <!-- Sidebar -->
        <ui:Instance template="Sidebar"/>

        <!-- Main content area -->
        <ui:VisualElement name="main" class="main">
            <ui:VisualElement class="page-head">
                <ui:Label name="ptitle" class="page-title" text="Select a project"/>
                <ui:Label name="pmeta"  class="page-meta dimmed" text=""/>
            </ui:VisualElement>
            <!-- Card rows injected here at runtime -->
            <ui:VisualElement name="main-content" class="main-content"/>
        </ui:VisualElement>

        <!-- Modal overlays (hidden by default) -->
        <ui:Instance name="ov-proj"     template="ProjModal"/>
        <ui:Instance name="ov-link"     template="LinkModal"/>
        <ui:Instance name="ov-event"    template="EventModal"/>
        <ui:Instance name="ov-note"     template="NoteModal"/>
        <ui:Instance name="ov-settings" template="SettingsModal"/>

    </ui:VisualElement>
</ui:UXML>
```

```css
/* ── Main layout ── */
.main {
    flex: 1 1 0;
    flex-direction: column;
    overflow: hidden;
    padding: 20px;
    min-width: 0;
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
    margin-bottom: 2px;
}

.main-content {
    flex: 1 1 0;
    flex-direction: column;
    overflow: hidden;
    min-height: 0;
}

/* ── Card row ── */
.card-row {
    flex-direction: row;
    flex: 1 1 0;
    min-height: 0;
    margin-bottom: 12px;
}

.card-row:last-child {
    margin-bottom: 0;
}

/* Each direct child slot inside a .card-row gets equal width */
.card-row > .slot {
    flex: 1 1 0;
    min-width: 0;
    display: flex;
    flex-direction: column;
}

.card-row > .slot + .slot {
    margin-left: 12px;
}
```

---

## 6. Sidebar

```xml
<!-- Sidebar.uxml -->
<ui:UXML xmlns:ui="UnityEngine.UIElements">
    <ui:VisualElement class="sidebar">

        <!-- Wordmark -->
        <ui:VisualElement class="sb-top">
            <ui:VisualElement class="wordmark">
                <ui:Label text="work" class="wm-light"/>
                <ui:Label text="hub"  class="wm-accent"/>
            </ui:VisualElement>
        </ui:VisualElement>

        <!-- Scrollable nav -->
        <ui:ScrollView name="sb-scroll" class="sb-scroll"
                       vertical-scroller-visibility="Hidden"
                       horizontal-scroller-visibility="Hidden">

            <ui:Label class="sb-label" text="PROJECTS"/>

            <!-- Project list (populated at runtime) -->
            <ui:VisualElement name="proj-list"/>

            <!-- Add project -->
            <ui:VisualElement name="add-proj" class="add-proj">
                <ui:VisualElement class="icon-sm" name="icon-plus"/>
                <ui:Label text="New project"/>
            </ui:VisualElement>

            <ui:Label class="sb-label" text="TOOLS"/>

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
            <ui:VisualElement class="sb-clock-group">
                <ui:Label name="clock" class="clock mono" text="00:00"/>
                <ui:Label name="cdate" class="clock-date dimmed" text=""/>
            </ui:VisualElement>
            <ui:VisualElement name="btn-settings" class="cog-btn">
                <ui:VisualElement class="icon-sm" name="icon-settings"/>
            </ui:VisualElement>
        </ui:VisualElement>

    </ui:VisualElement>
</ui:UXML>
```

```css
/* ── Sidebar shell ── */
.sidebar {
    width: 220px;
    flex-shrink: 0;
    flex-direction: column;
    background-color: #111115;
    border-right-width: 1px;
    border-right-color: rgba(255, 255, 255, 0.06);
    overflow: hidden;
}

/* ── Wordmark ── */
.sb-top {
    flex-shrink: 0;
    padding: 18px 16px 14px;
    border-bottom-width: 1px;
    border-bottom-color: rgba(255, 255, 255, 0.06);
}

.wordmark {
    flex-direction: row;
    align-items: baseline;
}

.wm-light {
    font-size: 16px;
    -unity-font-style: bold;
    letter-spacing: -0.48px;
    color: #e8e8f0;
}

.wm-accent {
    font-size: 16px;
    -unity-font-style: bold;
    letter-spacing: -0.48px;
    color: #f0a843;   /* accent */
}

/* ── Scrollable nav ── */
.sb-scroll {
    flex: 1 1 0;
    min-height: 0;
    padding: 12px 8px;
}

.sb-label {
    font-size: 9px;
    color: #4a4a5c;
    letter-spacing: 1.08px;
    padding: 6px 8px 3px;
    margin-top: 8px;
}

/* ── Project list item ── */
.proj-item {
    flex-direction: row;
    align-items: center;
    padding: 7px 9px;
    border-radius: 6px;
    color: #7a7a8c;
    font-size: 13px;
    -unity-font-style: bold;
    transition-property: background-color, color;
    transition-duration: 0.15s;
    transition-timing-function: ease;
    cursor: url("project://database/Assets/WorkHub/UI/Cursors/hand.png") 8 2;
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
    border-radius: 3px;   /* 50% not valid — use large enough px value */
    flex-shrink: 0;
    margin-right: 8px;
    /* background-color set inline per project color */
}

.proj-name {
    flex: 1 1 0;
    overflow: hidden;
    white-space: nowrap;
    -unity-text-overflow-position: end;
    text-overflow: ellipsis;
    min-width: 0;
}

/* "work" badge */
.proj-badge {
    font-size: 9px;
    padding: 1px 5px;
    border-radius: 3px;
    background-color: #1e1e25;
    color: #4a4a5c;
    border-width: 1px;
    border-color: rgba(255, 255, 255, 0.06);
    flex-shrink: 0;
    margin-left: 4px;
    transition-property: background-color, color, border-color;
    transition-duration: 0.15s;
    transition-timing-function: ease;
}

.proj-item.active .proj-badge {
    background-color: rgba(240, 168, 67, 0.10);
    color: #f0a843;
    border-color: rgba(240, 168, 67, 0.20);
}

/* Edit / delete icons — fade in on parent hover */
.proj-edit,
.proj-del {
    opacity: 0;
    flex-shrink: 0;
    width: 14px;
    height: 14px;
    margin-left: 4px;
    -unity-background-image-tint-color: #4a4a5c;
    transition-property: opacity, -unity-background-image-tint-color;
    transition-duration: 0.15s;
    transition-timing-function: ease;
}

.proj-item:hover .proj-edit,
.proj-item:hover .proj-del {
    opacity: 1;
}

.proj-edit:hover {
    -unity-background-image-tint-color: #f0a843;
}

.proj-del:hover {
    -unity-background-image-tint-color: #e05a5a;
}

/* ── Nav items ── */
.nav-item,
.add-proj {
    flex-direction: row;
    align-items: center;
    padding: 7px 9px;
    border-radius: 6px;
    color: #7a7a8c;
    font-size: 13px;
    -unity-font-style: bold;
    transition-property: background-color, color;
    transition-duration: 0.15s;
    transition-timing-function: ease;
    cursor: url("project://database/Assets/WorkHub/UI/Cursors/hand.png") 8 2;
}

.nav-item:hover,
.add-proj:hover {
    background-color: #18181d;
    color: #e8e8f0;
}

.add-proj {
    color: #4a4a5c;
    font-size: 12px;
}

.add-proj:hover {
    color: #7a7a8c;
}

/* ── Footer ── */
.sb-foot {
    flex-shrink: 0;
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
    padding: 12px 16px;
    border-top-width: 1px;
    border-top-color: rgba(255, 255, 255, 0.06);
}

.clock {
    font-size: 19px;
    -unity-font-style: bold;
    letter-spacing: -0.57px;
    color: #e8e8f0;
}

.clock-date {
    font-size: 10px;
    color: #4a4a5c;
    margin-top: 2px;
}

/* Settings cog button */
.cog-btn {
    width: 28px;
    height: 28px;
    border-radius: 5px;
    align-items: center;
    justify-content: center;
    transition-property: background-color, -unity-background-image-tint-color;
    transition-duration: 0.15s;
    transition-timing-function: ease;
    cursor: url("project://database/Assets/WorkHub/UI/Cursors/hand.png") 8 2;
}

.cog-btn > .icon-sm {
    -unity-background-image-tint-color: #4a4a5c;
    transition-property: -unity-background-image-tint-color;
    transition-duration: 0.15s;
    transition-timing-function: ease;
}

.cog-btn:hover {
    background-color: #18181d;
}

.cog-btn:hover > .icon-sm {
    -unity-background-image-tint-color: #7a7a8c;
}

/* ── Small icon base ── */
.icon-sm {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
    -unity-background-image-tint-color: #7a7a8c;
    margin-right: 8px;
}

/* Icon inside nav/proj inherits parent hover colour via tint */
.nav-item:hover > .icon-sm,
.add-proj:hover > .icon-sm {
    -unity-background-image-tint-color: #e8e8f0;
}
```

---

## 7. Card System

Every card shares a three-part structure: `card-head` → `ScrollView card-body` → optional
`card-footer`. The `.card` USS class handles the shell.

```css
/* ── Card shell ── */
.card {
    flex: 1 1 0;
    flex-direction: column;
    min-height: 0;
    background-color: #111115;
    border-width: 1px;
    border-color: rgba(255, 255, 255, 0.06);
    border-radius: 8px;
    overflow: hidden;

    /* Entry animation — toggled to .card-visible by adding a class 1 frame after attachment */
    opacity: 0;
    translate: 0 6px 0;
    transition-property: opacity, translate;
    transition-duration: 0.22s;
    transition-timing-function: ease;
}

.card.card-visible {
    opacity: 1;
    translate: 0 0 0;
}

/* ── Card head ── */
.card-head {
    flex-shrink: 0;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 11px 13px;
    border-bottom-width: 1px;
    border-bottom-color: rgba(255, 255, 255, 0.06);
}

.card-label {
    flex-direction: row;
    align-items: center;
    font-size: 10px;
    letter-spacing: 1px;
    color: #4a4a5c;
    -unity-font-style: bold;
}

.card-label > .icon-sm {
    -unity-background-image-tint-color: #4a4a5c;
    margin-right: 6px;
}

.card-acts {
    flex-direction: row;
    align-items: center;
}

/* ── Card action button (cbtn) ── */
.cbtn {
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    -unity-font-style: bold;
    color: #4a4a5c;
    padding: 3px 8px;
    border-radius: 4px;
    border-width: 1px;
    border-color: rgba(255, 255, 255, 0.06);
    background-color: rgba(0, 0, 0, 0);
    margin-left: 5px;
    transition-property: color, border-color, background-color;
    transition-duration: 0.15s;
    transition-timing-function: ease;
    cursor: url("project://database/Assets/WorkHub/UI/Cursors/hand.png") 8 2;
}

.cbtn:hover {
    color: #f0a843;
    border-color: rgba(240, 168, 67, 0.50);
    background-color: rgba(240, 168, 67, 0.05);
}

/* Active tab state */
.cbtn.tab-on {
    color: #f0a843;
    border-color: rgba(240, 168, 67, 0.40);
    background-color: rgba(240, 168, 67, 0.08);
}

/* External-app variant (blue) */
.cbtn.ext:hover {
    color: #5a9ef5;
    border-color: rgba(90, 158, 245, 0.40);
    background-color: rgba(90, 158, 245, 0.06);
}

.cbtn > .icon-sm {
    -unity-background-image-tint-color: #4a4a5c;
    margin-right: 4px;
    transition-property: -unity-background-image-tint-color;
    transition-duration: 0.15s;
    transition-timing-function: ease;
}

.cbtn:hover > .icon-sm {
    -unity-background-image-tint-color: #f0a843;
}

.cbtn.ext:hover > .icon-sm {
    -unity-background-image-tint-color: #5a9ef5;
}

/* ── Card body (scroll container) ── */
.card-body {
    flex: 1 1 0;
    min-height: 0;
}

/* The ScrollView's inner content container */
.card-body > #unity-content-container {
    padding: 10px 11px;
    flex-direction: column;
}

/* ── Card footer ── */
.card-footer {
    flex-shrink: 0;
    flex-direction: column;
    padding: 8px 11px;
    border-top-width: 1px;
    border-top-color: rgba(255, 255, 255, 0.06);
}

/* ── Empty state ── */
.empty {
    flex: 1 1 0;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    color: #4a4a5c;
    -unity-text-align: middle-center;
    padding: 24px 12px;
}
```

---

## 8. Card Contents

### 8.1 Meetings Card

```xml
<!-- Cards/MeetingsCard.uxml -->
<ui:UXML xmlns:ui="UnityEngine.UIElements">
    <ui:VisualElement class="card" name="card-meetings">

        <ui:VisualElement class="card-head">
            <ui:VisualElement class="card-label">
                <ui:VisualElement class="icon-sm" name="icon-video"/>
                <ui:Label text="MEETINGS"/>
            </ui:VisualElement>
            <ui:VisualElement class="card-acts">
                <ui:Button class="cbtn tab-on" name="btn-today"    text="Today"/>
                <ui:Button class="cbtn"        name="btn-upcoming" text="Upcoming"/>
                <ui:Button class="cbtn"        name="btn-add-ev">
                    <ui:VisualElement class="icon-sm" name="icon-plus"/>
                </ui:Button>
            </ui:VisualElement>
        </ui:VisualElement>

        <ui:ScrollView class="card-body" name="meetings-body"
                       vertical-scroller-visibility="Auto"
                       horizontal-scroller-visibility="Hidden"/>
    </ui:VisualElement>
</ui:UXML>
```

```css
/* ── Meeting row (Today view) ── */
.meeting-row {
    flex-direction: row;
    align-items: center;
    padding: 9px 10px;
    border-radius: 6px;
    border-width: 1px;
    border-color: rgba(255, 255, 255, 0.06);
    margin-bottom: 6px;
    transition-property: border-color, background-color;
    transition-duration: 0.15s;
    transition-timing-function: ease;
}

/* Highlighted row — meeting is happening now */
.meeting-row.now {
    border-color: rgba(90, 158, 245, 0.30);
    background-color: rgba(90, 158, 245, 0.04);
}

/* Time block */
.meeting-time-block {
    flex-shrink: 0;
    width: 56px;
    align-items: flex-end;
    flex-direction: column;
}

.meeting-time {
    font-size: 12px;
    -unity-font-style: bold;
    color: #e8e8f0;
}

.meeting-end-time {
    font-size: 10px;
    color: #4a4a5c;
    margin-top: 1px;
}

/* Vertical divider */
.meeting-divider {
    width: 1px;
    align-self: stretch;
    min-height: 28px;
    background-color: rgba(255, 255, 255, 0.11);
    flex-shrink: 0;
    margin-left: 10px;
    margin-right: 10px;
}

/* Info block */
.meeting-info {
    flex: 1 1 0;
    min-width: 0;
    flex-direction: column;
}

.meeting-title {
    font-size: 13px;
    -unity-font-style: bold;
    color: #e8e8f0;
    overflow: hidden;
    white-space: nowrap;
    -unity-text-overflow-position: end;
    text-overflow: ellipsis;
}

.meeting-note {
    font-size: 11px;
    color: #4a4a5c;
    margin-top: 2px;
    overflow: hidden;
    white-space: nowrap;
    -unity-text-overflow-position: end;
    text-overflow: ellipsis;
}

/* "Now" pill badge */
.now-pill {
    font-size: 9px;
    -unity-font-style: bold;
    letter-spacing: 0.54px;
    padding: 2px 7px;
    border-radius: 3px;
    background-color: rgba(90, 158, 245, 0.15);
    color: #5a9ef5;
    border-width: 1px;
    border-color: rgba(90, 158, 245, 0.25);
    flex-shrink: 0;
    margin-right: 6px;
}

/* Join button */
.join-btn {
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    -unity-font-style: bold;
    padding: 5px 11px;
    border-radius: 5px;
    border-width: 0;
    background-color: #5a9ef5;
    color: #ffffff;
    flex-shrink: 0;
    transition-property: opacity;
    transition-duration: 0.15s;
    transition-timing-function: ease;
    cursor: url("project://database/Assets/WorkHub/UI/Cursors/hand.png") 8 2;
}

.join-btn:hover {
    opacity: 0.82;
}

/* Delete icon fades in on row hover */
.meeting-del {
    opacity: 0;
    flex-shrink: 0;
    width: 14px;
    height: 14px;
    margin-left: 6px;
    -unity-background-image-tint-color: #4a4a5c;
    transition-property: opacity, -unity-background-image-tint-color;
    transition-duration: 0.15s;
    transition-timing-function: ease;
}

.meeting-row:hover .meeting-del {
    opacity: 1;
}

.meeting-del:hover {
    -unity-background-image-tint-color: #e05a5a;
}

/* ── Upcoming view ── */
.ev-day-label {
    font-size: 9px;
    -unity-font-style: bold;
    letter-spacing: 0.81px;
    color: #4a4a5c;
    padding: 6px 3px 4px;
}

.ev-row {
    flex-direction: row;
    align-items: flex-start;
    padding: 6px 5px;
    border-radius: 5px;
    transition-property: background-color;
    transition-duration: 0.12s;
    transition-timing-function: ease;
    cursor: url("project://database/Assets/WorkHub/UI/Cursors/hand.png") 8 2;
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

/* Colour bar — accent matches BAR palette index */
.ev-bar {
    width: 2px;
    align-self: stretch;
    min-height: 16px;
    border-radius: 2px;
    flex-shrink: 0;
    margin-right: 9px;
    /* background-color set inline via the BAR[] colour array */
}

.ev-info {
    flex: 1 1 0;
    min-width: 0;
    flex-direction: column;
}

.ev-title {
    font-size: 13px;
    color: #e8e8f0;
    overflow: hidden;
    white-space: nowrap;
    -unity-text-overflow-position: end;
    text-overflow: ellipsis;
}

.ev-sub {
    font-size: 11px;
    color: #4a4a5c;
    margin-top: 1px;
    overflow: hidden;
    white-space: nowrap;
    -unity-text-overflow-position: end;
    text-overflow: ellipsis;
}

.ev-join-link {
    flex-direction: row;
    align-items: center;
    font-size: 10px;
    color: #5a9ef5;
    flex-shrink: 0;
    padding: 2px 7px;
    border-radius: 4px;
    border-width: 1px;
    border-color: rgba(90, 158, 245, 0.25);
    margin-left: 6px;
    transition-property: background-color;
    transition-duration: 0.15s;
    transition-timing-function: ease;
    cursor: url("project://database/Assets/WorkHub/UI/Cursors/hand.png") 8 2;
}

.ev-join-link:hover {
    background-color: rgba(90, 158, 245, 0.08);
}

.ev-del {
    opacity: 0;
    flex-shrink: 0;
    width: 14px;
    height: 14px;
    -unity-background-image-tint-color: #4a4a5c;
    transition-property: opacity, -unity-background-image-tint-color;
    transition-duration: 0.15s;
    transition-timing-function: ease;
}

.ev-row:hover .ev-del {
    opacity: 1;
}

.ev-del:hover {
    -unity-background-image-tint-color: #e05a5a;
}
```

---

### 8.2 Quick Links Card

```xml
<!-- Cards/LinksCard.uxml -->
<ui:UXML xmlns:ui="UnityEngine.UIElements">
    <ui:VisualElement class="card" name="card-links">

        <ui:VisualElement class="card-head">
            <ui:VisualElement class="card-label">
                <ui:VisualElement class="icon-sm" name="icon-zap"/>
                <ui:Label text="QUICK LINKS"/>
            </ui:VisualElement>
            <ui:VisualElement class="card-acts">
                <ui:Button class="cbtn" name="btn-add-link">
                    <ui:VisualElement class="icon-sm" name="icon-plus"/>
                    <ui:Label text="Add"/>
                </ui:Button>
            </ui:VisualElement>
        </ui:VisualElement>

        <ui:ScrollView class="card-body" name="links-body"
                       vertical-scroller-visibility="Auto"
                       horizontal-scroller-visibility="Hidden">
            <!-- Link tiles and folder tiles rendered here -->
            <!-- Tile grid uses flex-wrap (see USS) -->
            <ui:VisualElement name="links-grid" class="links-grid"/>
        </ui:ScrollView>
    </ui:VisualElement>
</ui:UXML>
```

```css
/* ── Links grid: CSS auto-fill approximated with flex-wrap ── */
.links-grid {
    flex-direction: row;
    flex-wrap: wrap;
    align-content: flex-start;
    padding: 2px;
}

/* ── Link tile ── */
.link-tile {
    width: 76px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12px 4px;
    border-radius: 6px;
    border-width: 1px;
    border-color: rgba(255, 255, 255, 0.06);
    margin: 3px;
    position: relative;
    transition-property: border-color, background-color, scale;
    transition-duration: 0.15s;
    transition-timing-function: ease;
    cursor: url("project://database/Assets/WorkHub/UI/Cursors/hand.png") 8 2;
}

.link-tile:hover {
    border-color: rgba(255, 255, 255, 0.11);
    background-color: #18181d;
    scale: 1.04 1.04;
}

.link-tile-icon {
    width: 18px;
    height: 18px;
    -unity-background-image-tint-color: #7a7a8c;
    transition-property: -unity-background-image-tint-color;
    transition-duration: 0.15s;
    transition-timing-function: ease;
}

.link-tile:hover .link-tile-icon {
    -unity-background-image-tint-color: #e8e8f0;
}

.link-tile-name {
    font-size: 10px;
    -unity-font-style: bold;
    color: #7a7a8c;
    -unity-text-align: middle-center;
    margin-top: 7px;
    overflow: hidden;
    white-space: nowrap;
    -unity-text-overflow-position: end;
    text-overflow: ellipsis;
    max-width: 70px;
    transition-property: color;
    transition-duration: 0.15s;
    transition-timing-function: ease;
}

.link-tile:hover .link-tile-name {
    color: #e8e8f0;
}

/* Delete X — top-right, fades in on tile hover */
.tile-del {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 13px;
    height: 13px;
    opacity: 0;
    -unity-background-image-tint-color: #4a4a5c;
    transition-property: opacity, -unity-background-image-tint-color;
    transition-duration: 0.15s;
    transition-timing-function: ease;
}

.link-tile:hover .tile-del {
    opacity: 1;
}

.tile-del:hover {
    -unity-background-image-tint-color: #e05a5a;
}

/* ── Add tile (dashed look via low-opacity border) ── */
.add-tile {
    width: 76px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12px 4px;
    border-radius: 6px;
    border-width: 1px;
    border-color: rgba(255, 255, 255, 0.06);
    color: #4a4a5c;
    font-size: 10px;
    -unity-text-align: middle-center;
    margin: 3px;
    transition-property: border-color, background-color, color;
    transition-duration: 0.15s;
    transition-timing-function: ease;
    cursor: url("project://database/Assets/WorkHub/UI/Cursors/hand.png") 8 2;
}

.add-tile > .icon-sm {
    -unity-background-image-tint-color: #4a4a5c;
    margin-right: 0;
    margin-bottom: 4px;
    transition-property: -unity-background-image-tint-color;
    transition-duration: 0.15s;
    transition-timing-function: ease;
}

.add-tile:hover {
    border-color: rgba(255, 255, 255, 0.22);
    background-color: #18181d;
    color: #7a7a8c;
}

.add-tile:hover > .icon-sm {
    -unity-background-image-tint-color: #7a7a8c;
}

/* ── Folder tile (amber tinted) ── */
.folder-tile {
    width: 76px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12px 4px;
    border-radius: 6px;
    border-width: 1px;
    border-color: rgba(240, 168, 67, 0.18);
    background-color: rgba(240, 168, 67, 0.04);
    margin: 3px;
    transition-property: border-color, background-color, scale;
    transition-duration: 0.15s;
    transition-timing-function: ease;
    cursor: url("project://database/Assets/WorkHub/UI/Cursors/hand.png") 8 2;
}

.folder-tile:hover {
    border-color: rgba(240, 168, 67, 0.40);
    background-color: rgba(240, 168, 67, 0.09);
    scale: 1.04 1.04;
}

.folder-tile .link-tile-icon {
    -unity-background-image-tint-color: rgba(240, 168, 67, 0.70);
}

.folder-tile:hover .link-tile-icon {
    -unity-background-image-tint-color: #f0a843;
}

.folder-tile .link-tile-name {
    color: rgba(240, 168, 67, 0.60);
}

.folder-tile:hover .link-tile-name {
    color: #f0a843;
}
```

---

### 8.3 Tasks Card

```xml
<!-- Cards/TasksCard.uxml -->
<ui:UXML xmlns:ui="UnityEngine.UIElements">
    <ui:VisualElement class="card" name="card-tasks">

        <ui:VisualElement class="card-head">
            <ui:VisualElement class="card-label">
                <ui:VisualElement class="icon-sm" name="icon-check-sq"/>
                <ui:Label text="TASKS"/>
            </ui:VisualElement>
            <ui:VisualElement class="card-acts">
                <ui:Label name="tasks-counter" class="dimmed" style="font-size:10px"/>
            </ui:VisualElement>
        </ui:VisualElement>

        <ui:ScrollView class="card-body" name="tasks-body"
                       vertical-scroller-visibility="Auto"
                       horizontal-scroller-visibility="Hidden"/>

        <ui:VisualElement class="card-footer">
            <ui:VisualElement class="task-input-row">
                <ui:TextField name="task-input" class="text-field"
                              placeholder-text="Add a task…"
                              style="flex-grow:1"/>
                <ui:Button name="btn-add-task" class="btn btn-p task-add-btn">
                    <ui:VisualElement class="icon-sm" name="icon-plus"
                                      style="-unity-background-image-tint-color:#0b0b0e; margin-right:0"/>
                </ui:Button>
            </ui:VisualElement>
            <ui:VisualElement class="hint-row">
                <ui:Label text="Advanced tasks in Kanri" class="dimmed" style="font-size:10px"/>
                <ui:Button class="cbtn ext" name="btn-kanri">
                    <ui:VisualElement class="icon-sm" name="icon-ext"/>
                    <ui:Label text="Open"/>
                </ui:Button>
            </ui:VisualElement>
        </ui:VisualElement>
    </ui:VisualElement>
</ui:UXML>
```

```css
/* ── Task row ── */
.task-row {
    flex-direction: row;
    align-items: flex-start;
    padding: 6px 4px;
    border-radius: 5px;
    transition-property: background-color;
    transition-duration: 0.12s;
    transition-timing-function: ease;
    cursor: url("project://database/Assets/WorkHub/UI/Cursors/hand.png") 8 2;
}

.task-row:hover {
    background-color: #18181d;
}

/* Custom checkbox */
.tcheck {
    width: 14px;
    height: 14px;
    border-radius: 3px;
    border-width: 1.5px;
    border-color: rgba(255, 255, 255, 0.15);
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    margin-top: 1px;
    margin-right: 9px;
    transition-property: background-color, border-color;
    transition-duration: 0.15s;
    transition-timing-function: ease;
    cursor: url("project://database/Assets/WorkHub/UI/Cursors/hand.png") 8 2;
}

.task-row:hover .tcheck {
    border-color: rgba(90, 204, 138, 0.50);
}

.tcheck.done {
    background-color: #5acc8a;
    border-color: #5acc8a;
}

/* Checkmark icon inside the box — shown only when done */
.tcheck-mark {
    width: 9px;
    height: 9px;
    opacity: 0;
    scale: 0.5 0.5;
    -unity-background-image-tint-color: #0b0b0e;
    transition-property: opacity, scale;
    transition-duration: 0.15s;
    transition-timing-function: ease;
}

.tcheck.done .tcheck-mark {
    opacity: 1;
    scale: 1 1;
}

/* Task text */
.ttext {
    flex: 1 1 0;
    font-size: 13px;
    color: #e8e8f0;
    min-width: 0;
    transition-property: color, opacity;
    transition-duration: 0.20s;
    transition-timing-function: ease;
}

.ttext.done {
    color: #4a4a5c;
    opacity: 0.6;
    /* text-decoration: line-through not supported in USS
       Workaround: use <s>text</s> rich text markup in the Label text property */
}

/* Delete icon */
.tdel {
    opacity: 0;
    flex-shrink: 0;
    width: 14px;
    height: 14px;
    margin-left: 4px;
    margin-top: 1px;
    -unity-background-image-tint-color: #4a4a5c;
    transition-property: opacity, -unity-background-image-tint-color;
    transition-duration: 0.15s;
    transition-timing-function: ease;
}

.task-row:hover .tdel {
    opacity: 1;
}

.tdel:hover {
    -unity-background-image-tint-color: #e05a5a;
}

/* Footer input row */
.task-input-row {
    flex-direction: row;
    margin-bottom: 6px;
}

.task-add-btn {
    flex-shrink: 0;
    width: 30px;
    height: 30px;
    padding: 0;
    margin-left: 7px;
    align-items: center;
    justify-content: center;
}

.hint-row {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}
```

---

### 8.4 Notes Card

```xml
<!-- Cards/NotesCard.uxml -->
<ui:UXML xmlns:ui="UnityEngine.UIElements">
    <ui:VisualElement class="card" name="card-notes">

        <ui:VisualElement class="card-head">
            <ui:VisualElement class="card-label">
                <ui:VisualElement class="icon-sm" name="icon-file-text"/>
                <ui:Label text="NOTES"/>
            </ui:VisualElement>
            <ui:VisualElement class="card-acts">
                <ui:Button class="cbtn ext" name="btn-joplin">
                    <ui:VisualElement class="icon-sm" name="icon-ext"/>
                    <ui:Label text="Joplin"/>
                </ui:Button>
                <ui:Button class="cbtn" name="btn-new-note">
                    <ui:VisualElement class="icon-sm" name="icon-plus"/>
                    <ui:Label text="New"/>
                </ui:Button>
            </ui:VisualElement>
        </ui:VisualElement>

        <ui:ScrollView class="card-body" name="notes-body"
                       vertical-scroller-visibility="Auto"
                       horizontal-scroller-visibility="Hidden"/>
    </ui:VisualElement>
</ui:UXML>
```

```css
/* ── Note row ── */
.note-row {
    flex-direction: row;
    align-items: center;
    padding: 8px 6px;
    border-radius: 6px;
    border-width: 1px;
    border-color: rgba(0, 0, 0, 0);
    margin-bottom: 2px;
    transition-property: border-color, background-color;
    transition-duration: 0.15s;
    transition-timing-function: ease;
    cursor: url("project://database/Assets/WorkHub/UI/Cursors/hand.png") 8 2;
}

.note-row:hover {
    border-color: rgba(255, 255, 255, 0.09);
    background-color: #18181d;
}

.note-ico {
    flex-shrink: 0;
    width: 14px;
    height: 14px;
    -unity-background-image-tint-color: rgba(240, 168, 67, 0.70);
    margin-right: 10px;
    margin-top: 1px;
    transition-property: -unity-background-image-tint-color;
    transition-duration: 0.15s;
    transition-timing-function: ease;
}

.note-row:hover .note-ico {
    -unity-background-image-tint-color: #f0a843;
}

.note-content {
    flex: 1 1 0;
    min-width: 0;
    flex-direction: column;
}

.note-t {
    font-size: 13px;
    -unity-font-style: bold;
    color: #e8e8f0;
    overflow: hidden;
    white-space: nowrap;
    -unity-text-overflow-position: end;
    text-overflow: ellipsis;
}

.note-p {
    font-size: 11px;
    color: #4a4a5c;
    margin-top: 1px;
    overflow: hidden;
    white-space: nowrap;
    -unity-text-overflow-position: end;
    text-overflow: ellipsis;
}

.note-date {
    font-size: 10px;
    color: #4a4a5c;
    flex-shrink: 0;
    margin-left: 8px;
}

.ndel {
    opacity: 0;
    flex-shrink: 0;
    width: 14px;
    height: 14px;
    margin-left: 6px;
    -unity-background-image-tint-color: #4a4a5c;
    transition-property: opacity, -unity-background-image-tint-color;
    transition-duration: 0.15s;
    transition-timing-function: ease;
}

.note-row:hover .ndel {
    opacity: 1;
}

.ndel:hover {
    -unity-background-image-tint-color: #e05a5a;
}
```

---

## 9. Modal Overlays

All five modals share the same overlay + modal-box pattern. Toggle visibility by adding/removing
the `.open` USS class on the overlay element.

```css
/* ── Backdrop overlay ── */
.overlay {
    position: absolute;
    left: 0; top: 0; right: 0; bottom: 0;
    background-color: rgba(0, 0, 0, 0);
    align-items: center;
    justify-content: center;
    display: none;
    /* display cannot be transitioned — use opacity + pickingMode instead */
}

/* When open: show backdrop and slide modal in */
.overlay.open {
    display: flex;
    background-color: rgba(0, 0, 0, 0.55);
}

/* Note: overlay background-color cannot transition because display toggles.
   Fade the .modal child instead. */

/* ── Modal box ── */
.modal {
    flex-direction: column;
    background-color: #111115;
    border-width: 1px;
    border-color: rgba(255, 255, 255, 0.11);
    border-radius: 10px;
    padding: 22px;
    /* Entry animation */
    opacity: 0;
    translate: 0 10px 0;
    scale: 0.97 0.97;
    transition-property: opacity, translate, scale;
    transition-duration: 0.20s;
    transition-timing-function: ease;
}

.overlay.open .modal {
    opacity: 1;
    translate: 0 0 0;
    scale: 1 1;
}

/* Size variants */
.m-sm { width: 390px; }
.m-md { width: 460px; }
.m-lg { width: 520px; }

/* ── Modal header ── */
.modal-title {
    font-size: 15px;
    -unity-font-style: bold;
    color: #e8e8f0;
    letter-spacing: -0.3px;
    margin-bottom: 18px;
}

/* ── Form field group ── */
.field {
    flex-direction: column;
    margin-bottom: 11px;
}

.lbl {
    font-size: 9px;
    -unity-font-style: bold;
    letter-spacing: 0.9px;
    color: #4a4a5c;
    margin-bottom: 5px;
}

/* ── Modal button row ── */
.mrow {
    flex-direction: row;
    justify-content: flex-end;
    margin-top: 18px;
}

.mrow > .btn + .btn {
    margin-left: 8px;
}
```

```xml
<!-- Modals/ProjectModal.uxml -->
<ui:UXML xmlns:ui="UnityEngine.UIElements">
<ui:VisualElement class="overlay" name="ov-proj">
  <ui:VisualElement class="modal m-md">
    <ui:Label class="modal-title" name="proj-h" text="New Project"/>

    <!-- Name + Color on same row -->
    <ui:VisualElement style="flex-direction:row; margin-bottom:11px">
      <ui:VisualElement class="field" style="flex:1; margin-right:12px; margin-bottom:0">
        <ui:Label class="lbl" text="NAME"/>
        <ui:TextField class="text-field" name="proj-name" placeholder-text="My Project"/>
      </ui:VisualElement>
      <ui:VisualElement class="field" style="margin-bottom:0">
        <ui:Label class="lbl" text="COLOUR"/>
        <ui:VisualElement class="cdots" name="proj-dots">
          <ui:VisualElement class="cdot sel" name="cdot-amber" style="background-color:#f0a843"/>
          <ui:VisualElement class="cdot"     name="cdot-blue"  style="background-color:#5a9ef5"/>
          <ui:VisualElement class="cdot"     name="cdot-green" style="background-color:#5acc8a"/>
          <ui:VisualElement class="cdot"     name="cdot-red"   style="background-color:#e05a5a"/>
          <ui:VisualElement class="cdot"     name="cdot-purple"style="background-color:#a78bfa"/>
        </ui:VisualElement>
      </ui:VisualElement>
    </ui:VisualElement>

    <!-- Work toggle -->
    <ui:VisualElement class="field">
      <ui:VisualElement class="toggle-row">
        <ui:Label class="toggle-label" text="Work project (enables meetings &amp; calendar)"/>
        <ui:Toggle name="proj-work" class="workhub-toggle"/>
      </ui:VisualElement>
    </ui:VisualElement>

    <!-- Joplin notebook -->
    <ui:VisualElement class="field">
      <ui:Label class="lbl" text="JOPLIN NOTEBOOK (OPTIONAL)"/>
      <ui:TextField class="text-field" name="proj-joplin" placeholder-text="Notebook name"/>
    </ui:VisualElement>

    <!-- Folders -->
    <ui:VisualElement class="field">
      <ui:Label class="lbl" text="FOLDERS"/>
      <ui:VisualElement name="proj-folder-list"/>
      <ui:Button class="add-folder-btn" name="btn-add-folder">
        <ui:VisualElement class="icon-sm" name="icon-plus"/>
        <ui:Label text="Add folder"/>
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

```xml
<!-- Modals/LinkModal.uxml -->
<ui:UXML xmlns:ui="UnityEngine.UIElements">
<ui:VisualElement class="overlay" name="ov-link">
  <ui:VisualElement class="modal m-md">
    <ui:Label class="modal-title" text="Add Quick Link"/>
    <ui:VisualElement class="field">
      <ui:Label class="lbl" text="NAME"/>
      <ui:TextField class="text-field" name="l-name" placeholder-text="GitHub"/>
    </ui:VisualElement>
    <ui:VisualElement class="field">
      <ui:Label class="lbl" text="URL"/>
      <ui:TextField class="text-field" name="l-url" placeholder-text="https://github.com"/>
    </ui:VisualElement>
    <ui:VisualElement class="field">
      <ui:Label class="lbl" text="ICON"/>
      <ui:VisualElement name="icon-grid" class="icon-grid"/>
    </ui:VisualElement>
    <ui:VisualElement class="mrow">
      <ui:Button class="btn btn-g" name="btn-cancel-link" text="Cancel"/>
      <ui:Button class="btn btn-p" name="btn-save-link"   text="Add"/>
    </ui:VisualElement>
  </ui:VisualElement>
</ui:VisualElement>
</ui:UXML>
```

```xml
<!-- Modals/EventModal.uxml -->
<ui:UXML xmlns:ui="UnityEngine.UIElements">
<ui:VisualElement class="overlay" name="ov-event">
  <ui:VisualElement class="modal m-sm">
    <ui:Label class="modal-title" text="Add Event / Meeting"/>
    <ui:VisualElement class="field">
      <ui:Label class="lbl" text="TITLE"/>
      <ui:TextField class="text-field" name="ev-t" placeholder-text="Team standup"/>
    </ui:VisualElement>
    <ui:VisualElement class="field">
      <ui:Label class="lbl" text="TIME"/>
      <ui:TextField class="text-field" name="ev-w" placeholder-text="9:00 AM — 9:30 AM"/>
    </ui:VisualElement>
    <ui:VisualElement class="field">
      <ui:Label class="lbl" text="JOIN URL (OPTIONAL)"/>
      <ui:TextField class="text-field" name="ev-url" placeholder-text="https://meet.google.com/..."/>
    </ui:VisualElement>
    <ui:VisualElement class="field">
      <ui:Label class="lbl" text="NOTE (OPTIONAL)"/>
      <ui:TextField class="text-field" name="ev-n" placeholder-text="Location, agenda..."/>
    </ui:VisualElement>
    <ui:VisualElement class="mrow">
      <ui:Button class="btn btn-g" name="btn-cancel-ev" text="Cancel"/>
      <ui:Button class="btn btn-p" name="btn-save-ev"   text="Add"/>
    </ui:VisualElement>
  </ui:VisualElement>
</ui:VisualElement>
</ui:UXML>
```

```xml
<!-- Modals/NoteModal.uxml -->
<ui:UXML xmlns:ui="UnityEngine.UIElements">
<ui:VisualElement class="overlay" name="ov-note">
  <ui:VisualElement class="modal m-lg">
    <ui:TextField name="n-title" class="note-title-inp"
                  placeholder-text="Note title..."/>
    <ui:TextField name="n-body"  class="text-field note-body-inp"
                  placeholder-text="Write anything..."
                  multiline="true"/>
    <ui:VisualElement class="mrow">
      <ui:Button class="btn btn-g" name="btn-cancel-note" text="Cancel"/>
      <ui:Button class="btn btn-p" name="btn-save-note"   text="Save"/>
    </ui:VisualElement>
  </ui:VisualElement>
</ui:VisualElement>
</ui:UXML>
```

```xml
<!-- Modals/SettingsModal.uxml -->
<ui:UXML xmlns:ui="UnityEngine.UIElements">
<ui:VisualElement class="overlay" name="ov-settings">
  <ui:VisualElement class="modal m-md">
    <ui:Label class="modal-title" text="Settings"/>

    <!-- Accent colour -->
    <ui:VisualElement class="s-section">
      <ui:Label class="s-title" text="ACCENT COLOUR"/>
      <ui:VisualElement class="cdots" name="accent-dots">
        <ui:VisualElement class="cdot sel" name="acc-amber"  style="background-color:#f0a843"/>
        <ui:VisualElement class="cdot"     name="acc-blue"   style="background-color:#5a9ef5"/>
        <ui:VisualElement class="cdot"     name="acc-green"  style="background-color:#5acc8a"/>
        <ui:VisualElement class="cdot"     name="acc-red"    style="background-color:#e05a5a"/>
        <ui:VisualElement class="cdot"     name="acc-purple" style="background-color:#a78bfa"/>
      </ui:VisualElement>
    </ui:VisualElement>

    <!-- Font -->
    <ui:VisualElement class="s-section">
      <ui:Label class="s-title" text="FONT"/>
      <ui:VisualElement name="font-opts">
        <ui:VisualElement class="font-opt sel" name="font-syne">
          <ui:Label text="Syne — geometric" style="-unity-font-style:bold"/>
        </ui:VisualElement>
        <ui:VisualElement class="font-opt" name="font-outfit">
          <ui:Label text="Outfit — friendly"/>
        </ui:VisualElement>
        <ui:VisualElement class="font-opt" name="font-dmsans">
          <ui:Label text="DM Sans — clean"/>
        </ui:VisualElement>
        <ui:VisualElement class="font-opt" name="font-jakarta">
          <ui:Label text="Plus Jakarta Sans — sharp"/>
        </ui:VisualElement>
        <ui:VisualElement class="font-opt" name="font-ibmplex">
          <ui:Label text="IBM Plex Sans — technical"/>
        </ui:VisualElement>
      </ui:VisualElement>
    </ui:VisualElement>

    <!-- App paths -->
    <ui:VisualElement class="s-section">
      <ui:Label class="s-title" text="APP PATHS"/>
      <ui:VisualElement class="field">
        <ui:Label class="lbl" text="KANRI .EXE"/>
        <ui:TextField class="text-field" name="kanri-path" placeholder-text="C:\...\Kanri.exe"/>
      </ui:VisualElement>
      <ui:VisualElement class="field" style="margin-bottom:0">
        <ui:Label class="lbl" text="JOPLIN .EXE"/>
        <ui:TextField class="text-field" name="joplin-path" placeholder-text="C:\...\Joplin.exe"/>
      </ui:VisualElement>
    </ui:VisualElement>

    <ui:VisualElement class="mrow">
      <ui:Button class="btn btn-p" name="btn-done" text="Done"/>
    </ui:VisualElement>
  </ui:VisualElement>
</ui:VisualElement>
</ui:UXML>
```

---

## 10. Shared Controls

### 10.1 Buttons

```css
/* ── Base button ── */
.btn {
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 7px 15px;
    border-radius: 5px;
    border-width: 0;
    font-size: 13px;
    -unity-font-style: bold;
    letter-spacing: 0.13px;
    transition-property: opacity, scale;
    transition-duration: 0.15s;
    transition-timing-function: ease;
    cursor: url("project://database/Assets/WorkHub/UI/Cursors/hand.png") 8 2;
}

.btn:hover {
    opacity: 0.85;
}

.btn:active {
    scale: 0.97 0.97;
    opacity: 0.9;
}

/* Primary — accent filled */
.btn-p {
    background-color: #f0a843;
    color: #0b0b0e;
}

/* Ghost — subtle background */
.btn-g {
    background-color: #18181d;
    color: #7a7a8c;
    border-width: 1px;
    border-color: rgba(255, 255, 255, 0.08);
}

.btn-g:hover {
    opacity: 1;
    background-color: #1e1e25;
    color: #e8e8f0;
}
```

### 10.2 Text Fields

```css
/* ── Text field ── */
.text-field {
    background-color: #18181d;
    border-width: 1px;
    border-color: rgba(255, 255, 255, 0.08);
    border-radius: 5px;
    color: #e8e8f0;
    font-size: 13px;
    transition-property: border-color;
    transition-duration: 0.15s;
    transition-timing-function: ease;
}

/* Focus ring using accent */
.text-field:focus {
    border-color: #f0a843;
}

/* Unity TextField internal label element */
.text-field > .unity-base-text-field__input {
    background-color: rgba(0, 0, 0, 0);
    border-width: 0;
    padding: 7px 10px;
    color: #e8e8f0;
}

/* Placeholder text colour */
.text-field .unity-text-element--inner-input-field-component {
    color: #e8e8f0;
}

/* Note modal title input — borderless large style */
.note-title-inp {
    background-color: rgba(0, 0, 0, 0);
    border-width: 0;
    border-bottom-width: 1px;
    border-bottom-color: rgba(255, 255, 255, 0.08);
    border-radius: 0;
    font-size: 17px;
    -unity-font-style: bold;
    color: #e8e8f0;
    margin-bottom: 11px;
    transition-property: border-bottom-color;
    transition-duration: 0.15s;
    transition-timing-function: ease;
}

.note-title-inp:focus {
    border-bottom-color: #f0a843;
}

/* Note modal body textarea */
.note-body-inp {
    min-height: 140px;
    flex: 1 1 0;
    white-space: normal;
}

/* Folder path row in project modal */
.folder-path-row {
    flex-direction: row;
    align-items: center;
    margin-bottom: 6px;
}

.folder-path-row > .text-field {
    flex: 1 1 0;
}

.folder-path-del {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    margin-left: 7px;
    -unity-background-image-tint-color: #4a4a5c;
    transition-property: -unity-background-image-tint-color;
    transition-duration: 0.15s;
    transition-timing-function: ease;
    cursor: url("project://database/Assets/WorkHub/UI/Cursors/hand.png") 8 2;
}

.folder-path-del:hover {
    -unity-background-image-tint-color: #e05a5a;
}

.add-folder-btn {
    flex-direction: row;
    align-items: center;
    color: #4a4a5c;
    font-size: 11px;
    margin-top: 4px;
    transition-property: color;
    transition-duration: 0.15s;
    transition-timing-function: ease;
    cursor: url("project://database/Assets/WorkHub/UI/Cursors/hand.png") 8 2;
}

.add-folder-btn:hover {
    color: #7a7a8c;
}

.add-folder-btn > .icon-sm {
    -unity-background-image-tint-color: #4a4a5c;
    transition-property: -unity-background-image-tint-color;
    transition-duration: 0.15s;
    transition-timing-function: ease;
}

.add-folder-btn:hover > .icon-sm {
    -unity-background-image-tint-color: #7a7a8c;
}
```

### 10.3 Toggle Switch

Unity's built-in `Toggle` uses a checkmark image by default. Override it completely for a
custom pill-style track + thumb.

```css
/* Hide Unity's default checkmark and label */
.workhub-toggle .unity-toggle__checkmark {
    display: none;
}
.workhub-toggle .unity-toggle__label {
    display: none;
}

/* The track — the toggle's root element becomes the track */
.workhub-toggle {
    width: 36px;
    height: 20px;
    border-radius: 10px;
    background-color: #1e1e25;
    border-width: 1.5px;
    border-color: rgba(255, 255, 255, 0.11);
    overflow: visible;
    flex-shrink: 0;
    transition-property: background-color, border-color;
    transition-duration: 0.20s;
    transition-timing-function: ease;
    cursor: url("project://database/Assets/WorkHub/UI/Cursors/hand.png") 8 2;
}

.workhub-toggle:checked {
    background-color: #f0a843;
    border-color: #f0a843;
}

/* The thumb — an absolutely positioned child VisualElement */
/* In UXML, add a VisualElement class="toggle-thumb" inside the Toggle */
.toggle-thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 12px;
    height: 12px;
    border-radius: 6px;
    background-color: #4a4a5c;
    transition-property: translate, background-color;
    transition-duration: 0.20s;
    transition-timing-function: ease;
}

.workhub-toggle:checked .toggle-thumb {
    translate: 16px 0 0;
    background-color: #ffffff;
}

/* Toggle row layout */
.toggle-row {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 2px 0;
}

.toggle-label {
    flex: 1 1 0;
    font-size: 13px;
    color: #7a7a8c;
    margin-right: 10px;
}
```

### 10.4 Color Dot Picker

```css
/* ── Color dot row ── */
.cdots {
    flex-direction: row;
    align-items: center;
    margin-top: 6px;
}

.cdot {
    width: 20px;
    height: 20px;
    border-radius: 10px;
    border-width: 2px;
    border-color: rgba(0, 0, 0, 0);
    margin-right: 7px;
    scale: 1 1;
    transition-property: border-color, scale;
    transition-duration: 0.15s;
    transition-timing-function: ease;
    cursor: url("project://database/Assets/WorkHub/UI/Cursors/hand.png") 8 2;
}

.cdot:hover {
    scale: 1.15 1.15;
}

.cdot.sel {
    border-color: rgba(255, 255, 255, 0.55);
}
```

### 10.5 Icon Grid

```css
/* ── Icon picker grid (link modal) ── */
.icon-grid {
    flex-direction: row;
    flex-wrap: wrap;
    margin-top: 6px;
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
    scale: 1 1;
    transition-property: border-color, background-color, scale;
    transition-duration: 0.15s;
    transition-timing-function: ease;
    cursor: url("project://database/Assets/WorkHub/UI/Cursors/hand.png") 8 2;
}

.icon-opt:hover {
    border-color: rgba(255, 255, 255, 0.18);
    background-color: #1e1e25;
    scale: 1.08 1.08;
}

.icon-opt.sel {
    border-color: rgba(240, 168, 67, 0.60);
    background-color: rgba(240, 168, 67, 0.10);
}

.icon-opt > .icon-sm {
    -unity-background-image-tint-color: #4a4a5c;
    margin-right: 0;
    width: 15px;
    height: 15px;
    transition-property: -unity-background-image-tint-color;
    transition-duration: 0.15s;
    transition-timing-function: ease;
}

.icon-opt:hover > .icon-sm {
    -unity-background-image-tint-color: #7a7a8c;
}

.icon-opt.sel > .icon-sm {
    -unity-background-image-tint-color: #f0a843;
}

/* ── Settings font options ── */
.s-section {
    margin-bottom: 18px;
}

.s-title {
    font-size: 9px;
    -unity-font-style: bold;
    letter-spacing: 1px;
    color: #4a4a5c;
    margin-bottom: 9px;
}

.font-opt {
    flex-direction: row;
    align-items: center;
    padding: 8px 10px;
    border-radius: 5px;
    border-width: 1px;
    border-color: rgba(255, 255, 255, 0.06);
    margin-bottom: 4px;
    font-size: 13px;
    color: #7a7a8c;
    transition-property: border-color, background-color, color;
    transition-duration: 0.15s;
    transition-timing-function: ease;
    cursor: url("project://database/Assets/WorkHub/UI/Cursors/hand.png") 8 2;
}

.font-opt:hover {
    border-color: rgba(255, 255, 255, 0.14);
    background-color: #18181d;
    color: #e8e8f0;
}

.font-opt.sel {
    border-color: rgba(240, 168, 67, 0.45);
    background-color: rgba(240, 168, 67, 0.08);
    color: #f0a843;
}
```

---

## 11. Scrollbar Styling

USS can target the Unity-generated scrollbar sub-elements using their USS class names.

```css
/* ── Custom thin scrollbar ── */

/* Track (the rail) */
.unity-scroll-view__vertical-scroller {
    width: 4px;
    background-color: rgba(0, 0, 0, 0);
    border-width: 0;
}

.unity-scroll-view__vertical-scroller > .unity-scroller__low-button,
.unity-scroll-view__vertical-scroller > .unity-scroller__high-button {
    display: none;   /* hide arrow buttons */
}

/* The slider track — transparent */
.unity-scroll-view__vertical-scroller
    .unity-base-slider--vertical
    .unity-base-slider__tracker {
    background-color: rgba(0, 0, 0, 0);
    border-width: 0;
}

/* The thumb (draggable knob) */
.unity-scroll-view__vertical-scroller
    .unity-base-slider--vertical
    .unity-base-slider__dragger {
    width: 3px;
    border-radius: 2px;
    border-width: 0;
    background-color: rgba(255, 255, 255, 0.12);
    transition-property: background-color;
    transition-duration: 0.15s;
    transition-timing-function: ease;
}

/* Brighten on hover / active */
.unity-scroll-view__vertical-scroller
    .unity-base-slider--vertical
    .unity-base-slider__dragger:hover {
    background-color: rgba(255, 255, 255, 0.25);
}

/* Sidebar ScrollView — even narrower */
.sb-scroll
    .unity-scroll-view__vertical-scroller
    .unity-base-slider--vertical
    .unity-base-slider__dragger {
    width: 2px;
    background-color: rgba(255, 255, 255, 0.08);
}
```

---

## 12. Animations & Transitions — Full Showcase

USS transitions in Unity work exactly like CSS transitions: they fire automatically when a
property value changes (via class toggle or inline style). The following lists **every visual
transition** used in this dashboard and how to reproduce it.

### 12.1 Properties that can be transitioned (confirmed in IStyle.cs)

| Property | USS name |
|---|---|
| Opacity | `opacity` |
| Translate (position offset) | `translate` |
| Scale | `scale` |
| Rotate | `rotate` |
| Background colour | `background-color` |
| Border colour | `border-color`, `border-top-color`, etc. |
| Icon tint | `-unity-background-image-tint-color` |
| Text colour | `color` |
| Font size | `font-size` |
| Width / Height | `width`, `height` |
| Padding / Margin | `padding-*`, `margin-*` |
| Border radius | `border-radius`, `border-top-left-radius`, etc. |
| Letter spacing | `letter-spacing` |

### 12.2 Card entry animation (stagger on appear)

Toggle `.card-visible` after the element is attached. Stagger each card by index in
milliseconds using `schedule.Execute(...).StartingIn(indexMs)`.

```css
.card {
    opacity: 0;
    translate: 0 6px 0;
    transition-property: opacity, translate;
    transition-duration: 0.22s;
    transition-timing-function: ease;
}

.card.card-visible {
    opacity: 1;
    translate: 0 0 0;
}
```

### 12.3 Modal entry animation (fade + slide + slight scale)

Three properties transition together when `.open` is added to `.overlay`:

```css
.modal {
    opacity: 0;
    translate: 0 10px 0;
    scale: 0.97 0.97;
    transition-property: opacity, translate, scale;
    transition-duration: 0.20s;
    transition-timing-function: ease;
}

.overlay.open .modal {
    opacity: 1;
    translate: 0 0 0;
    scale: 1 1;
}
```

### 12.4 Icon tint transition (used on every icon that reacts to hover)

```css
.icon-sm {
    -unity-background-image-tint-color: #4a4a5c;
    transition-property: -unity-background-image-tint-color;
    transition-duration: 0.15s;
    transition-timing-function: ease;
}

/* Parent hover changes the tint */
.proj-item:hover > .icon-sm {
    -unity-background-image-tint-color: #e8e8f0;
}
```

### 12.5 Scale pop on interactive tiles

```css
.link-tile {
    scale: 1 1;
    transition-property: scale, border-color, background-color;
    transition-duration: 0.15s;
    transition-timing-function: ease;
}

.link-tile:hover {
    scale: 1.04 1.04;
    border-color: rgba(255, 255, 255, 0.11);
    background-color: #18181d;
}
```

### 12.6 Checkmark reveal (task completion)

```css
.tcheck-mark {
    opacity: 0;
    scale: 0.5 0.5;
    transition-property: opacity, scale;
    transition-duration: 0.15s;
    transition-timing-function: ease;
}

.tcheck.done .tcheck-mark {
    opacity: 1;
    scale: 1 1;
}
```

### 12.7 Delete / edit icon fade-in on parent hover

```css
.proj-edit,
.proj-del,
.meeting-del,
.tile-del,
.tdel,
.ndel {
    opacity: 0;
    transition-property: opacity, -unity-background-image-tint-color;
    transition-duration: 0.15s;
    transition-timing-function: ease;
}

/* The *parent* row's :hover pseudo-class triggers the child's opacity */
.proj-item:hover   .proj-edit,
.proj-item:hover   .proj-del,
.meeting-row:hover .meeting-del,
.link-tile:hover   .tile-del,
.task-row:hover    .tdel,
.note-row:hover    .ndel {
    opacity: 1;
}
```

### 12.8 Toggle thumb slide

```css
.toggle-thumb {
    transition-property: translate, background-color;
    transition-duration: 0.20s;
    transition-timing-function: ease;
}

.workhub-toggle:checked .toggle-thumb {
    translate: 16px 0 0;
    background-color: #ffffff;
}
```

### 12.9 Colour dot bounce

```css
.cdot {
    scale: 1 1;
    transition-property: scale, border-color;
    transition-duration: 0.15s;
    transition-timing-function: ease;
}

.cdot:hover {
    scale: 1.15 1.15;
}

.cdot.sel {
    border-color: rgba(255, 255, 255, 0.55);
}
```

### 12.10 Button press

`:active` is available in Unity 2022.3+:

```css
.btn:active {
    scale: 0.97 0.97;
    opacity: 0.9;
}
```

### 12.11 Focus ring on text fields

`:focus` fires when a `TextField` gains keyboard focus:

```css
.text-field:focus {
    border-color: #f0a843;
}
```

### 12.12 Text colour fade on task completion

```css
.ttext {
    color: #e8e8f0;
    opacity: 1;
    transition-property: color, opacity;
    transition-duration: 0.20s;
    transition-timing-function: ease;
}

.ttext.done {
    color: #4a4a5c;
    opacity: 0.6;
}
```

---

## 13. Icons

Lucide SVG icons → Unity sprite atlas.

**Pipeline:**
1. Download the 38 icons used in this dashboard as SVGs from [lucide.dev](https://lucide.dev).
2. Convert to **64 × 64 white PNG** (white so `‑unity‑background‑image‑tint‑color` can recolour
   them freely at any colour without baking the colour into the texture).
3. Import into Unity, set **Texture Type = Sprite (2D and UI)**.
4. Pack into `Assets/WorkHub/UI/Icons/IconAtlas.spriteAtlas`.
5. In USS, assign a sprite as background via inline style in UXML:
   ```xml
   <ui:VisualElement class="icon-sm"
     style="background-image: url('project://database/Assets/WorkHub/UI/Icons/globe.png')"/>
   ```
6. Recolour using `-unity-background-image-tint-color` from parent rules.

**Icons required:**

```
globe, link, github, figma, code-2, terminal, folder, folder-open, database,
monitor, smartphone, mail, book, youtube, music, image, box, cloud, coffee,
settings, send, layers, slack, pen-tool, plus, x, pencil, check, check-square,
video, zap, upload, file-text, layout-kanban, notebook, external-link, trash-2
```

---

## 14. Fonts

All fonts are Google Fonts. Import `.ttf` → Unity **TextMeshPro SDF Font Asset**.

| Screen label | Google Font | Weight(s) needed |
|---|---|---|
| Default UI | Syne | Regular 400, Bold 700 |
| "friendly" option | Outfit | Regular 400, Medium 500 |
| "clean" option | DM Sans | Regular 400, Medium 500 |
| "sharp" option | Plus Jakarta Sans | Regular 400, SemiBold 600 |
| "technical" option | IBM Plex Sans | Regular 400, Medium 500 |
| Clock / hex codes | JetBrains Mono | Regular 400 |

**Import steps:**
1. `Window → TextMeshPro → Font Asset Creator`
2. Source Font: drag `.ttf` → Generate → Save SDF asset.
3. Reference in USS:
   ```css
   .app {
       -unity-font-definition: url("project://database/Assets/WorkHub/UI/Fonts/Syne-Regular SDF.asset");
   }
   .bold {
       -unity-font-definition: url("project://database/Assets/WorkHub/UI/Fonts/Syne-Bold SDF.asset");
       -unity-font-style: bold;
   }
   .mono {
       -unity-font-definition: url("project://database/Assets/WorkHub/UI/Fonts/JetBrainsMono-Regular SDF.asset");
   }
   ```
4. Font inheritance: child elements **inherit** `-unity-font-definition` from their parent
   (same as CSS `font-family`). Setting it on `.app` applies everywhere unless overridden.

---

## 15. CSS → USS Visual Property Reference

All verified against `UnityCsReference/Modules/UIElements/Core/Style/Generated/IStyle.cs`
and `StylePropertyUtil.cs`.

| CSS | USS (confirmed) |
|---|---|
| `display: flex` | Default — all `VisualElement`s are flex |
| `display: none` | `display: none` ✅ |
| `display: grid` | **Not supported** — use `flex-wrap: wrap` |
| `flex: 1` | `flex-grow: 1; flex-shrink: 1; flex-basis: 0` |
| `gap: 12px` | **Not supported** — use `margin-bottom` on children |
| `overflow: hidden` | `overflow: hidden` ✅ |
| `overflow-y: auto` | Use `<ui:ScrollView>` element |
| `position: absolute` | `position: absolute` ✅ |
| `inset: 0` | `left:0; top:0; right:0; bottom:0` |
| `border-radius: 50%` | Use a large `px` value e.g. `border-radius: 999px` |
| `opacity: 0.5` | `opacity: 0.5` ✅ |
| `translate: 0 8px` | `translate: 0 8px 0` ✅ (3-value; z is required in USS) |
| `scale: 1.05` | `scale: 1.05 1.05` ✅ (two-value x y) |
| `rotate: 45deg` | `rotate: 45deg` ✅ |
| `transform-origin: center` | `transform-origin: center center` ✅ |
| `background-color: rgba(...)` | `background-color: rgba(r, g, b, a)` ✅ |
| `letter-spacing: 0.12em` | `letter-spacing: Xpx` (convert em → px at your font-size) |
| `white-space: nowrap` | `white-space: nowrap` ✅ |
| `text-overflow: ellipsis` | `text-overflow: ellipsis` + `white-space: nowrap` + `overflow: hidden` + `-unity-text-overflow-position: end` ✅ |
| `font-weight: 700` | `-unity-font-style: bold` (+ Bold font asset) ✅ |
| `font-family: 'Syne'` | `-unity-font-definition: url("...SDF.asset")` ✅ |
| `color: #e8e8f0` | `color: #e8e8f0` ✅ |
| `background-image: url(...)` | `background-image: url("project://...")` ✅ |
| `-webkit-filter: tint` | `-unity-background-image-tint-color: #hex` ✅ |
| `cursor: pointer` | `cursor: url("hand.png") hx hy` — **no keyword**, texture only |
| `box-shadow` | **Not supported** — use `text-shadow` on Labels only |
| `backdrop-filter: blur` | **Not supported** |
| `text-decoration: line-through` | **Not supported** — use `<s>text</s>` rich text in Label |
| `@keyframes` | **Not supported** — use USS `transition-*` + class toggle |
| `:nth-child(n)` | **Not supported** — apply classes from C# |
| `:first-child` / `:last-child` | **Not supported** — apply classes from C# |
| `var(--token)` | ✅ Unity 6 only — in 2022.3 hardcode values |
| `transition: X 0.15s ease` | `transition-property: X; transition-duration: 0.15s; transition-timing-function: ease` ✅ |
| `:hover` | ✅ |
| `:focus` | ✅ |
| `:active` | ✅ Unity 2022.3+ |
| `:checked` | ✅ (Toggle elements) |
| `:disabled` | ✅ |

---

## 16. USS Visual Gotchas

### `border-radius: 50%` does not work
USS does not support percentage border radii. Use `border-radius: 999px` instead.

### `translate` requires three values in USS
CSS `translate: 0 8px` → USS `translate: 0 8px 0`. Always provide the Z axis.

### `:hover` on a child is triggered by the parent element's `:hover` state
```css
/* This works — parent hover changes child tint */
.proj-item:hover > .icon-sm {
    -unity-background-image-tint-color: #e8e8f0;
}

/* This does NOT work in USS — can't nest :hover inside :hover */
.proj-item:hover .proj-edit:hover { ... }
```

### Opacity `0` does NOT block pointer events
An element with `opacity: 0` still receives mouse events. To make an invisible element
non-interactive, also set `picking-mode="Ignore"` in UXML or `pickingMode = PickingMode.Ignore`
in C#.

### USS `display: none` cannot be animated
`display` is not a transitionable property. For fade-in/out: toggle `opacity` and `translate`
and set `display: none` only after the transition ends via `TransitionEndEvent` in C#.

### `scale` is around the element's pivot (top-left by default)
To scale from the centre (as you'd expect from CSS `transform-origin: center`), set:
```css
.link-tile {
    transform-origin: center center;
    scale: 1 1;
    transition-property: scale;
    transition-duration: 0.15s;
}
.link-tile:hover {
    scale: 1.04 1.04;
}
```

### `-unity-background-image-tint-color` only works with a background image set
The tint property has no visual effect if `background-image` is not also set on the element.
Always pair them:
```css
.icon-sm {
    background-image: url("project://database/Assets/.../icon.png");
    -unity-background-image-tint-color: #7a7a8c;
}
```

### Text overflow needs all four properties together
```css
.clamp {
    overflow: hidden;               /* 1 — clip the box */
    white-space: nowrap;            /* 2 — prevent wrapping */
    text-overflow: ellipsis;        /* 3 — draw "…" */
    -unity-text-overflow-position: end; /* 4 — clip at end */
}
```
Missing any one of the four will silently fail to show the ellipsis.

### `font-weight: 500` requires a separate font asset
USS `-unity-font-style` only accepts `normal`, `bold`, `italic`, `bold-and-italic`. There
is no `weight: 500` equivalent. To use a Medium weight, import the Medium `.ttf` as a
separate Font Asset and assign it via `-unity-font-definition`.

### USS child selectors use `>` only — no descendant spaces
```css
/* ✅ Direct child */
.card-head > .card-label { }

/* ❌ Descendant — not supported in USS */
.card-head .card-label { }
```
Use class names or direct `>` chains exclusively.
