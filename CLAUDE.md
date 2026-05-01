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

**Data layer** — `data/site.js` is the single source of truth: `PROFILE`, `EXPERIENCES[]`, `PROJECTS[]`, `CATEGORIES`. Edit there and every page updates. Imported as ES module with a `?v=1` query string for cache busting — bump the version after meaningful edits.

**Shared chrome** — `scripts/chrome.js` exports `mountChrome(currentPageId)` which renders the nav, footer, theme toggle, and mobile menu. Every page calls it on init.

**Design tokens** — `styles/tokens.css` holds all colors, type, spacing, radii, and base components (`.btn`, `.chip`, `.badge`, `.container`, `.nav`, `.footer`). Light + dark variants both defined; toggle persists in `localStorage` under `nso-theme`.

**Pages** — flat at repo root: `index.html`, `about.html`, `projects.html`, `resume.html`. No build step. Each page has its own page-specific `<style>` block but pulls primitives from `tokens.css`.

**Legacy scripts** — `scripts/sync-projects.js` and `scripts/infer_skills.py` are unused by the live site but kept for the user's external data-sync workflow (`npm run sync`). They no longer write to anything the site reads.

## Progress Tracking

A `progress.md` file tracks all changes made in this project. **`progress.md` must be updated as part of every commit — never commit without it.**

Workflow:
1. Make code changes.
2. Append an entry to `progress.md` describing what changed and why.
3. Stage both the code changes and `progress.md` together and commit in a single commit.
4. Push to the remote branch.
5. Run `/compact` to keep conversation context manageable.

When a new feature is added, create a corresponding test in `tests/`.
