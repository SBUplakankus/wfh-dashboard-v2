# Tool Integrations (MkDocs, MarkText, Joplin, Kanri)

This document describes the current MVP integration layer and expected data formats.

## Overview

The dashboard is a **local integration hub**. It does not replace native tools, but it surfaces previews and quick actions directly in the dashboard.

Configured in **Settings → Tools**:

- `marktextPath`
- `mkdocsPath`
- `joplinPath`
- `joplinDataFile` (optional)
- `kanriPath`
- `kanriDataFile` (optional)

## MkDocs + MarkText integration

### Supported today

- Browse markdown files (`.md`) in configured MkDocs docs folder
- Expand/collapse folder tree
- Select markdown file to preview content
- Create markdown files from templates:
  - Blank
  - Page
  - Tutorial
  - API
- Open selected/created file in MarkText (if executable path provided)

### Notes

- Tree is built from filesystem and filtered to markdown files/folders.
- Preview is plain markdown text (fast, safe MVP rendering).

## Joplin integration (read-only preview, MVP)

Optional `joplinDataFile` can point to a JSON export.

Expected shape:

```json
{
  "notebooks": [{ "id": "nb-1", "title": "Research" }],
  "notes": [
    {
      "id": "n-1",
      "title": "Design Notes",
      "body": "markdown...",
      "notebookId": "nb-1",
      "updatedAt": 1739700000000,
      "tags": ["GameDev"]
    }
  ]
}
```

Dashboard behavior:

- Shows notebook/note counts
- Shows recent note cards
- Clicking a note opens Joplin executable

## Kanri integration (read-only preview, MVP)

Optional `kanriDataFile` can point to a JSON export.

Expected shape:

```json
{
  "columns": [{ "id": "todo", "name": "To Do" }, { "id": "doing", "name": "In Progress" }],
  "tasks": [
    { "id": "t-1", "title": "Write API docs", "status": "todo", "priority": "high", "dueDate": "2026-02-20" }
  ]
}
```

Dashboard behavior:

- Shows per-column task counts
- Shows recent task cards
- Clicking a task opens Kanri executable

## Security/operational notes

- Integrations rely on local file paths and Electron IPC.
- If running in pure browser mode (without Electron), filesystem/process actions degrade gracefully.
