# Progress Log

## 2026-05-01 — Fix projects page category filter and search

- **Bug 1 (filter chips):** `.pcard { display: flex }` in the author stylesheet overrode the UA's `[hidden] { display: none }`, so `card.hidden = true` never hid cards. Fixed by adding `.pcard[hidden] { display: none; }` with higher specificity.
- **Bug 2 (search + autocomplete):** Filtering now works (same CSS fix). Added autocomplete dropdown: deduplicates and sorts all skills from PROJECTS[], shows up to 8 case-insensitive substring matches beneath the input, selecting populates the input and applies the filter. Dropdown closes on blur, Enter/Escape, or clear button. Both category and search filters apply simultaneously (AND logic).
- Changed search wrapper from `<label>` to `<div>` so the `<ul>` dropdown is valid HTML; `aria-label` moved to the `<input>`.

## 2026-04-30 — About page sidebar layout refactor

- Replaced `.about-hero` block-flow with sticky `.ab-sidebar` + scrollable `.ab-scroll-col` split layout.
- Sidebar: `35vw` wide (clamped 380–640px), left-aligned content, full `PROFILE.bio` at 18px/1.45 line-height.
- Removed "Currently / Internship / Based in" stat cards — info already present in bio and timeline.
- Filter bar now sticks to top of right scroll column (`top: 0`) rather than viewport.
- Reduced experience card padding and internal spacing so more cards are visible at once.
- Mobile: collapses to single-column stack below 768px.

## 2026-04-30 — Full redesign

- Replaced index/projects/resume/about pages with new design system.
- New data layer at data/site.js; old lib/projects.json removed.
- Shared chrome at scripts/chrome.js; tokens at styles/tokens.css.
- Old top-level pages, helpers, and unused images removed.
- PR: redesign/2026-04 → main.

## 2026-04-26

### CLAUDE.md + progress.md initialization
- Created `CLAUDE.md` with development commands, CI/CD details, architecture overview, and workflow instructions
- Created `progress.md` (this file) to track all future changes

### Project card link bar
- Added per-card links section to `renderProjects` in `global.js`: "View Project" pill (when `url` set) and GitHub icon pill (when `repo` field set)
- Removed whole-card `<a>` wrap; projects without links render cleanly with no interactive elements
- Inline SVG GitHub mark — no external icon dependency
- Updated `style.css`: new `.project-links`, `.project-link-url`, `.project-link-github`, `.github-icon` styles; removed old `.project a.project-link` and conflicting `.project a` rules

### GitHub repo sync script
- Created `scripts/sync-projects.js` — fetches all public repos for `nathansso`, updates descriptions from README content for projects with a `repo` field, and adds new repos not yet in the list
- Created `.env.example` with `GITHUB_TOKEN` placeholder; `.env` added to `.gitignore`
- Updated `package.json`: added `"type": "module"`, `npm run sync` script, and `dotenv` devDependency
- Added `"repo"` field to `datacycling` and `dsc207finalproject` entries in `lib/projects.json` so the sync script can link and update them
- Removed 3 lorem-ipsum placeholder entries from `lib/projects.json`
- Run with: `npm run sync` (requires `.env` with your token)
