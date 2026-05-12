# Progress Log

## 2026-05-11 — Rewrite README

Replaced prompt-style README with an industry-standard project README. Documents the actual architecture (data layer, shared chrome, design token system, activity widget), explains key design decisions (oklch colors, `--nav-h` token, Cloudflare Worker pattern), and removes generic boilerplate instructions.



## 2026-05-11 — Implement GitHub project board items (issues #4–#10, #12–#14)

### styles/tokens.css
- Added `--nav-h: 65px` CSS variable (actual nav height: 16px padding × 2 + 32px content + 1px border).
- Added `.nav-activity` pill styles: a compact indicator that fades into the nav when music/gaming/coding is live.

### scripts/chrome.js
- Added `#nav-activity` pill element to nav-inner; populated by `now-playing.js`.
- Nav label changed from "Résumé" → "Resume".

### index.html — activity widget (#4, #6, #8)
- Fixed widget `top` to use `calc(var(--nav-h) + var(--sp-3))` so it clears the nav on all screen sizes (#4).
- Renamed trigger label from "now" → "activity" (#6).
- Changed trigger from `<div tabindex="0">` to a semantic `<button>` with `aria-expanded`.
- Added `cursor: pointer`, hover color shift, `:active` scale, and `:focus-visible` outline to trigger (#8).
- Added `#bg-glow` reactive mouse-tracking gradient background; respects `prefers-reduced-motion` (#14).

### scripts/now-playing.js — nav indicator (#5), interaction fix
- `setupHover` now manages `aria-expanded` on the trigger and works via click on all devices.
- Added `updateNavIndicator(dominant)` — updates `#nav-activity` text and shows/hides based on active state (#5).
- Called `updateNavIndicator` at the end of each `updateDOM` cycle.

### cloudflare-worker/now-proxy.js — Steam debug + CORS (#7)
- Added localhost/127.0.0.1 to the CORS origin allowlist for local development.
- `corsHeaders()` returns the request origin (not a hardcoded domain) when the request comes from localhost.
- Added optional `debug` field to response when `DEBUG=1` env var is set; surfaces per-source errors and config status.

### about.html — layout (#9, #10)
- Updated sidebar `top`/`height` to use `var(--nav-h)` instead of hardcoded `56px` (#4).
- Increased sidebar bio `line-height` from 1.45 → 1.65 and paragraph margin from `--sp-2` → `--sp-3` (#9).
- Reduced sidebar right padding from `--sp-3` → `--sp-2` and scroll-col left padding from `--sp-4` → `--sp-3` (#10).

### resume.html — remove accent marks (#12)
- Updated toolbar `top` from `56px` to `var(--nav-h)` (#4).
- Replaced "Résumé" → "Resume" in `<title>`, `<meta>` description, and toolbar label text.

### data/site.js — MICE Explorable + URL fix (#13)
- Added `mice-explorable` project entry (DSC 106 group project, URL: sebastianferragut.github.io/miceexplorable/).
- Fixed `airbnb-sd` URL: was incorrectly pointing to the MICE Explorable URL; set to `null`.
- Added `mice-explorable` to `bsmath` experience `projectIds`.

## 2026-05-11 — Cleanup: remove stale bootstrap artifact, gitignore .claude/

- Deleted `data/projects-source.json` — one-time seed file superseded by `data/projects-auto.json`; no scripts referenced it.
- Added `.claude/` to `.gitignore` — Claude Code session/memory directory should not be tracked.

## 2026-05-11 — Fix "now" widget: GitHub integration + collapse-on-inactive rows

### Cloudflare Worker (`cloudflare-worker/now-proxy.js`)
- Added `User-Agent: now-proxy-worker` to GitHub API fetch — GitHub requires this header and was silently 403-ing all requests without it.
- Made `GH_TOKEN` optional (auth header only sent when env var present); falls back to unauthenticated for public events.
- Added `GetRecentlyPlayedGames` fallback for Steam: when not actively in-game, fetches most recent game for hover preview art.
- Fixed GitHub to use `GH_TOKEN`/`GH_USER` env var names consistently.

### index.html (now widget CSS)
- Changed inactive rows from opacity dimming to full collapse: `max-height: 0`, `padding: 0`, `opacity: 0` when `data-active="false"`.
- Hover reveal: hovering the panel slides inactive rows back in at 50% opacity with smooth `max-height` transition.
- Row labels swap dynamically: "music" ↔ "last heard", "gaming" ↔ "last played".

### scripts/now-playing.js
- `updateMusicRow` / `updateGamingRow` always populate track/game name and swap the `.now-row-label` text based on active state.

## 2026-05-11 — Move "now" widget to top-right, increase visibility

- Repositioned from `bottom: var(--sp-5)` to `top: calc(var(--sp-7) + var(--sp-3))` (~60px) so it clears the sticky nav.
- Swapped DOM order (trigger now before panel) so the expanded panel opens downward from the pill.
- Flipped panel animation: `translateY(-8px)` hidden → `translateY(0)` open, `transform-origin: top right`.
- Mobile breakpoint updated accordingly: `top: calc(var(--sp-6) + var(--sp-5))`.
- Visibility boost: `--now-border` raised to `var(--line-faint)` (dark mode full opacity); dot size 8px → 9px.

## 2026-05-10 — "Now" activity widget

Added a fixed-position corner widget to `index.html` that surfaces real-time activity across three sources.

### New files
- `scripts/now-playing.js` — client-side module: polls Last.fm directly (CORS-safe), polls a Cloudflare Worker proxy for Steam + GitHub private events. Exports `initNowWidget()`.
- `cloudflare-worker/now-proxy.js` — Cloudflare Worker that keeps Steam API key and GitHub PAT server-side, returns `{ steam, github }` JSON. Requires env vars `STEAM_API_KEY`, `STEAM_ID`, `GH_TOKEN`, `GH_USER` set in Cloudflare dashboard.

### index.html changes
- Added ~200 lines of CSS for the widget (glassmorphic pill trigger + expandable panel, waveform bars, dot animations, art strip, responsive breakpoints).
- Added widget HTML between `#site-footer-host` and the `<script>` block.
- Added `import { initNowWidget } from './scripts/now-playing.js'` and `initNowWidget()` call.

### Behavior
- Pill always visible at bottom-right; panel expands on hover (CSS `:hover`) or touch tap, keyboard navigable via focus-within.
- State machine: `gaming > music > coding > idle` — dot color and panel accent shift per state (green / terracotta / purple / grey). Animated waveform bars when music plays; pulsing controller icon when in-game; blurred album art / game header as panel backdrop.
- Polling: Last.fm every 30 s, proxy every 60 s (staggered 5 s).

### Setup required before deploy
Fill in `CONFIG` in `scripts/now-playing.js` (Last.fm API key + username, Cloudflare Worker URL). Deploy `cloudflare-worker/now-proxy.js` with env vars set.

## 2026-05-09 — Targeted refactor + automated sync pipeline

### Refactor
- Added `abbreviate(title)` as an exported function to `data/site.js` so all pages share one definition.
- `data/site.js` already exported `fmtDate` and `fmtRange`; pages were duplicating them inline.
- Removed inline `formatDate` / `abbreviate` definitions from `projects.html`, `index.html`, `about.html`. Each now imports `fmtDate` (and `abbreviate` where needed) from `data/site.js`.
- Removed inline `fmtRange` from `resume.html`; added it to that page's import from `data/site.js`.
- Extracted the 127-line skill autocomplete + pill system from `projects.html` into `scripts/autocomplete.js` (`initAutocomplete()`). `projects.html` now calls `initAutocomplete()` with DOM refs and a callback, dropping ~100 lines from its inline script.

### Sync pipeline
- Changed `scripts/sync-projects.js` output path from `lib/projects.json` (nonexistent) to `data/projects-auto.json`.
- Changed `scripts/infer_skills.py` output path from `lib/projects.json` to `data/projects-auto.json`.
- Added `// PROJECTS_AUTO_START` / `// PROJECTS_AUTO_END` markers around the PROJECTS array in `data/site.js` so the merge script can target it precisely.
- Created `scripts/merge-projects.js`: reads `data/projects-auto.json`, dynamic-imports `data/site.js`, matches projects by `repo` field, merges `description`, `skills`, `url`, and `lastCommit` without touching editorial fields (`id`, `category`, `experienceId`, `blurb`, `course`), and writes the updated PROJECTS array back between the markers.
- Initialized `data/projects-auto.json` from the existing `data/projects-source.json` snapshot.
- Created `.github/workflows/sync.yml`: runs every Monday at 9am UTC (and on manual `workflow_dispatch`). Steps: checkout → sync-projects.js → infer_skills.py → merge-projects.js → auto-commit changed files. Requires `SYNC_GITHUB_TOKEN` and `ANTHROPIC_API_KEY` secrets set in GitHub repo settings.

## 2026-05-01 — Narrow about page sidebar and reduce divider gap

- `.ab-sidebar` width reduced from `clamp(380px, 35vw, 640px)` to `clamp(320px, 28vw, 500px)`.
- Sidebar right padding reduced from `var(--sp-5)` to `var(--sp-3)` to close the gap to the border divider.
- `.ab-scroll-col .container` left padding overridden to `var(--sp-4)` (was inheriting `var(--sp-7)`) so content starts closer to the divider.

## 2026-05-01 — Show skill preview on collapsed project cards

- Added `.pcard-skill-preview` inside `.pcard-body` (after the blurb): renders the first 3 skills as `.chip` elements matching the expanded panel's style.
- If the project has more than 3 skills a `.pcard-skill-more` button shows `+N` after the chips; clicking it triggers the existing card-expand handler.
- `.pcard.is-expanded .pcard-skill-preview { display: none }` hides the preview once the card is expanded so it doesn't duplicate the full skill list.

## 2026-05-01 — Arrow-key navigation in search autocomplete dropdown

- ArrowDown/ArrowUp cycle the highlighted item in the autocomplete dropdown (`is-active` class); wraps at both ends.
- Enter confirms the highlighted item as a pill (if one is active), otherwise falls back to confirming the raw typed text.
- Tab confirms the highlighted item if one is active, else the first suggestion (existing behaviour preserved).
- `autocompleteActiveIndex` resets to -1 whenever the dropdown closes or suggestions are regenerated, so arrow state never bleeds across different queries.
- CSS: `.pj-autocomplete-item.is-active` shares the existing hover style.

## 2026-05-01 — Placeholder hide + multi-select category filter on projects page

- **Placeholder:** `.pj-tag-input.has-pills input::placeholder { color: transparent }` hides the placeholder whenever at least one skill pill is present. `renderPills()` and the clear button both toggle the `has-pills` class to keep it in sync.
- **Multi-select categories:** `activeCat` (single string) replaced with `activeCats` (Set). Clicking a non-All chip toggles it in/out of the set; clicking All clears the set. `applyFilter()` uses `activeCats.size === 0 || activeCats.has(card.dataset.cat)` (OR logic). A new `syncChipState()` helper updates `aria-pressed` on all chips after every click, allowing multiple chips to show the pressed style simultaneously.

## 2026-05-01 — Multi-skill pill filter on projects page

- Converted the single search `<input>` into a tag-input container (`.pj-tag-input`). Each confirmed skill becomes a removable pill inside the input area.
- Replaced `activeQuery` (single string) with `activeSkillPills` (string[]). `applyFilter()` now requires every pill to match the card's skill list (AND logic), combined with the category chip filter.
- Enter confirms the typed text as a pill; Backspace on empty input removes the last pill; × on a pill removes it individually; the global clear button wipes all pills and text at once.
- Tab autocomplete: if the dropdown is open, Tab confirms the top suggestion as a pill and keeps focus in the input; if closed, Tab behaves normally.
- Clicking an autocomplete suggestion now adds a pill instead of populating raw text.
- Already-active pills are filtered out of autocomplete suggestions to avoid duplicates.
- CSS: `.pj-search` max-width raised from 320px → 480px; `.pj-search-icon` and `.pj-search-clear` switched from `top: 50%` to fixed `top` so they don't float to the center of a tall pill container.

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
