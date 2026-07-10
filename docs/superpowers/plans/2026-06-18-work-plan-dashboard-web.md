# Work Plan Dashboard Web Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing daily-record static app with a dashboard-first work plan web app based on the Excel template.

**Architecture:** Keep the app as a no-build static site. `index.html` owns semantic structure, `styles.css` owns dashboard presentation, and `app.js` owns task state, rendering, persistence, import/export, filters, and calendar logic.

**Tech Stack:** Plain HTML, CSS, and browser JavaScript with `localStorage`.

---

### Task 1: Static Markup

**Files:**
- Modify: `C:\Users\As\Documents\New project\index.html`

- [ ] Replace daily-record labels and fields with work-plan dashboard markup.
- [ ] Include metric cards, calendar, priority lists, task form, filters, table, import/export controls, and status bar.
- [ ] Keep script and stylesheet references unchanged.

### Task 2: Dashboard Styles

**Files:**
- Modify: `C:\Users\As\Documents\New project\styles.css`

- [ ] Replace diary color/layout rules with compact operational dashboard styles.
- [ ] Support desktop two-column layout and mobile stacked layout.
- [ ] Ensure tables, forms, buttons, tags, priority colors, and calendar cells remain readable.

### Task 3: Task Logic

**Files:**
- Modify: `C:\Users\As\Documents\New project\app.js`

- [ ] Replace record model with task model.
- [ ] Implement add/update/delete/status actions.
- [ ] Render metrics, calendar counts, selected-day lists, and filtered task table.
- [ ] Implement JSON import/export and local persistence.

### Task 4: Verification

**Files:**
- Verify: `C:\Users\As\Documents\New project\index.html`

- [ ] Start a static local server.
- [ ] Open the page in the in-app browser.
- [ ] Add a task, update status, filter tasks, select dates, export JSON, and check console errors.
