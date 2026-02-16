# Calendar Guide

Set an ICS file path in **Settings → Calendar**.
The parser uses `ical.js` and gracefully falls back to sample events when no file is configured.
The dashboard also includes a **Work Week Meetings** panel (Mon-Fri) with previous/next week navigation and optional Join buttons when event URLs exist.

## Current behavior

- Month-view summary card with loaded event count
- Work-week meeting columns (Mon–Fri) with week navigation
- Grouped meetings list:
  - Today
  - Tomorrow
  - This Week
  - Later

## Filtering controls

In **Settings → Calendar** you can:

- hide all-day events
- hide past meetings
- set optional IANA timezone
