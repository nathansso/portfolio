# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development

This is a static site — no build step required. To develop locally, serve the root directory with any HTTP server:

```bash
python -m http.server 8000
# or
npx serve .
```

Then open `http://localhost:8000` in a browser.

## CI/CD

There is no CI/CD pipeline. The GitHub Actions workflow and GitHub Pages deployment have been removed.

## Testing

There is no test framework. The "test" for UI changes is to serve the site locally and verify the feature in a browser. When implementing new features, create a test in a `tests/` directory using plain JS assertions or a lightweight framework like `@web/test-runner`.

## Architecture

**Shared infrastructure** — `global.js` is loaded by every page and provides:
- Navigation rendering (dynamically adjusts relative paths based on page depth)
- Color scheme toggle (light/dark, persisted in `localStorage`)
- `fetchJSON()` utility
- `renderProjects()` — shared card renderer used on both home and projects pages
- GitHub API data fetching

**Data layer** — `lib/projects.json` is the single source of truth for all project cards. Each entry: `{ title, year, image, description, url }`. The `url` field can be `null`.

**Visualization pages** use D3.js v7 (CDN):
- `projects/projects.js` — pie chart filtering by year; search filters both chart and cards

**Page pattern**: every subdirectory (`projects/`, `resume/`) has its own `index.html` and optionally a `.js` file. Pages at subdirectory depth adjust `src`/`href` paths with a `../` prefix.

## Progress Tracking

A `progress.md` file tracks all changes made in this project. **After completing each task:**
1. Append an entry to `progress.md` describing what changed and why
2. Commit all changes (including the `progress.md` update) to the repo
3. Run `/compact` to keep conversation context manageable

When a new feature is added, create a corresponding test in `tests/`.
