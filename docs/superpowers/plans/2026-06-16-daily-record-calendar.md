# Daily Record Calendar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a directly openable single-page daily record app with calendar review, local persistence, search, JSON import, and JSON export.

**Architecture:** Use three static files: `index.html` for structure, `styles.css` for responsive presentation, and `app.js` for state, rendering, persistence, and file operations. Store all records in `localStorage` under one namespaced key, keyed by ISO date.

**Tech Stack:** Plain HTML, CSS, and JavaScript. No package manager, server, or build step.

---

## File Structure

- `index.html`: Defines the app shell, calendar area, editor form, search panel, import/export controls, and toast/status region.
- `styles.css`: Defines the calendar-first desktop layout, mobile stacked layout, controls, form fields, and visual states.
- `app.js`: Owns date helpers, record storage, calendar rendering, editor synchronization, search, import, export, and destructive-action confirmations.

## Tasks

### Task 1: Static App Shell

**Files:**
- Create: `index.html`
- Create: `styles.css`
- Create: `app.js`

- [ ] Create `index.html` with linked CSS and JS, calendar controls, editor form fields, search area, import/export controls, and status live region.
- [ ] Create `styles.css` with responsive layout, calendar grid, editor panel, buttons, forms, search results, and toast styling.
- [ ] Create `app.js` with a startup hook that renders an empty placeholder and confirms the script loads.
- [ ] Open `index.html` in a browser and confirm the layout appears without console errors.

### Task 2: Calendar Rendering And Selection

**Files:**
- Modify: `app.js`
- Modify: `styles.css`

- [ ] Implement date helpers for ISO date formatting, month bounds, and month labels.
- [ ] Render a 7-column calendar with weekday headers and leading/trailing blank cells.
- [ ] Add previous month, today, and next month controls.
- [ ] Add selected-day state and update the editor heading when a date is clicked.
- [ ] Verify month navigation and date selection manually in the browser.

### Task 3: Local Record Editing

**Files:**
- Modify: `app.js`
- Modify: `index.html`

- [ ] Implement `loadRecords()` and `saveRecords()` around `localStorage`.
- [ ] Bind editor fields for title, mood, weather, tags, tasks, and content.
- [ ] Save the selected day's record with `updatedAt`.
- [ ] Reload the selected day's record when switching dates.
- [ ] Highlight dates that have saved records.
- [ ] Verify that a saved record survives browser refresh.

### Task 4: Search, Export, Import, And Clear

**Files:**
- Modify: `app.js`
- Modify: `styles.css`

- [ ] Implement search across title, mood, weather, tags, tasks, and content.
- [ ] Render clickable search results that select the matching date and month.
- [ ] Implement JSON export using a browser download.
- [ ] Implement JSON import with validation and confirmation before overwrite.
- [ ] Implement clear-all with confirmation.
- [ ] Verify valid import, invalid import, export, search, and clear behavior manually.

### Task 5: Polish And Final Verification

**Files:**
- Modify: `index.html`
- Modify: `styles.css`
- Modify: `app.js`

- [ ] Refine empty states, status messages, and mobile spacing.
- [ ] Open the final app in the browser.
- [ ] Verify create, save, refresh, month navigation, search, export, import, invalid import, and clear data.
- [ ] Confirm no console errors during the core flows.
