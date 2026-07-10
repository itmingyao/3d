# Daily Record Calendar Design

## Goal

Build a single-page daily record web app that can be opened directly in a browser. The app lets the user record everyday life by date, review entries through a calendar, search past records, and back up data through JSON import and export.

## Scope

The first version is a pure frontend app with no server, build step, account system, cloud sync, or database. Data is stored in the current browser using `localStorage`.

## User Experience

The page uses a calendar-first layout.

- The left/main area shows a monthly calendar.
- Calendar controls include previous month, today, and next month.
- Each date cell shows the day number and lightweight indicators for saved content, such as mood, tags, or an entry marker.
- Clicking a date selects it and opens that day's record in the editor.
- The right/secondary area shows the selected day's editing panel.

On smaller screens, the layout stacks vertically: calendar first, editor below.

## Record Fields

Each daily record contains:

- `date`: ISO date string such as `2026-06-16`.
- `title`: short title for the day.
- `mood`: simple mood value.
- `weather`: optional weather note.
- `tags`: comma-separated tags stored as an array.
- `tasks`: a short checklist or task text.
- `content`: main daily note.
- `updatedAt`: ISO timestamp for the last save.

## Data Model

Records are stored in `localStorage` under one app-specific key. The value is a JSON object keyed by date:

```json
{
  "2026-06-16": {
    "date": "2026-06-16",
    "title": "A normal day",
    "mood": "calm",
    "weather": "sunny",
    "tags": ["study", "exercise"],
    "tasks": "Read\nWalk",
    "content": "Daily note text",
    "updatedAt": "2026-06-16T10:00:00.000Z"
  }
}
```

## Import And Export

Export downloads the full record object as a JSON file. Import accepts a JSON file with the same object shape.

When imported records share dates with existing local records, the imported records overwrite the existing ones. The app asks for confirmation before applying the import. Invalid JSON or unsupported data shapes show an error message and leave existing data unchanged.

## Search

Search matches against title, content, mood, weather, and tags. Results show matching dates and short summaries. Clicking a result selects that date and moves the calendar to the correct month.

## Feedback And Error Handling

The app shows short status messages for save, export, import, and clear-data actions.

Risky actions use confirmation:

- Importing data that may overwrite existing dates.
- Clearing all local records.

Import validation checks that the parsed value is an object and that each record has a valid `date` matching its key before writing anything to `localStorage`.

## Files

The implementation will use:

- `index.html`: semantic page structure.
- `styles.css`: responsive layout and visual design.
- `app.js`: calendar rendering, editor state, persistence, search, import, and export.

No package manager or build tooling is required.

## Verification

Manual verification will cover:

- Open `index.html` directly in a browser.
- Create and save a record.
- Refresh the browser and confirm the record remains.
- Move between months and select recorded dates.
- Search by title, content, and tag.
- Export JSON and confirm a file downloads.
- Import a valid JSON backup and confirm records appear.
- Try invalid import data and confirm existing data is unchanged.
- Clear all records only after confirmation.
