# Work Plan Dashboard Web Design

## Goal

Convert the existing static daily-record calendar app into a work plan dashboard based on the Excel workbook template. The web page should open directly in a browser, store data locally, and prioritize daily work review.

## Chosen Direction

Use the dashboard-first layout selected by the user.

- Top area: today metrics for started work, due work, completed work, completion rate, total work, and overdue work.
- Main area: month calendar plus today's categorized task lists.
- Secondary area: task entry and editable task table.
- Priority model: important/urgent, important/not urgent, urgent/not important, not important/not urgent.
- Status model: pending, completed, canceled.

## Data Model

Tasks are stored in `localStorage` as an array under one app-specific key. Each task has:

- `id`: stable generated id.
- `planDate`: planned start date.
- `title`: work plan text.
- `priority`: one of the four priority values.
- `dueDate`: deadline.
- `status`: pending, completed, or canceled.
- `notes`: optional notes.
- `createdAt` and `updatedAt`: ISO timestamps.

## User Experience

The first screen shows the information needed for today's work without requiring navigation. The user can add a task, update status, filter the task table, switch calendar months, select dates, and export/import JSON backups.

Calendar day cells show small counts for tasks planned or due on that date. Selecting a date changes the focused day and refreshes the day-specific lists.

## Files

- `index.html`: replace daily-record structure with dashboard, calendar, quick entry form, task table, and import/export controls.
- `styles.css`: replace diary-style layout with a compact operational dashboard.
- `app.js`: replace record logic with task CRUD, metrics, calendar rendering, filtering, import/export, and local persistence.

## Verification

Manual verification:

- Open `index.html` or local server in a browser.
- Add a task and confirm it appears in metrics, calendar, daily lists, and table.
- Toggle completed/canceled status and confirm metrics update.
- Filter by priority/status/date text.
- Move calendar months and select dates.
- Export JSON, clear data, import JSON, and confirm tasks restore.
- Refresh the page and confirm local data persists.
