# nathansso.github.io

Personal portfolio for Nathaniel Oliver — Data Scientist, M.S. UC San Diego.

**Live:** [nathansso.github.io](https://nathansso.github.io/portfolio)

---

## Stack

Vanilla HTML, CSS, and JavaScript (ES modules). No framework, no bundler, no build step. The site is a flat collection of `.html` files that can be served by any static host.

---

## Pages

| File | Route | Description |
|------|-------|-------------|
| `index.html` | `/` | Hero, contact pills, featured project tiles, activity widget |
| `about.html` | `/about` | Sticky bio sidebar + scrollable experience timeline with category filter |
| `projects.html` | `/projects` | Full project grid with multi-select category filter and skill search |
| `resume.html` | `/resume` | Rendered one-page resume with print/PDF download |

---

## Architecture

### Data layer — `data/site.js`

Single source of truth for all content. Exported as an ES module and imported by every page. Editing here updates every page simultaneously.

```
PROFILE       — name, contact, bio, photo
EXPERIENCES[] — research, internship, education, and other roles
PROJECTS[]    — projects, each optionally linked to an experience via experienceId
CATEGORIES    — defines the filter vocabulary and color palette for each category
```

Projects in `PROJECTS[]` are populated and kept in sync by `scripts/sync-projects.js` (fetches GitHub repo metadata) and `scripts/merge-projects.js` (merges auto-generated data back into `site.js` without overwriting editorial fields like `blurb` and `category`). Manual fields are never touched by the sync.

### Shared chrome — `scripts/chrome.js`

Exports `mountChrome(currentPageId)`, called once on page load by every page. Renders the sticky nav, footer, theme toggle, and mobile menu into pre-existing host elements (`#site-nav-host`, `#site-footer-host`). The nav dynamically marks the active page via `aria-current`. Also includes a `#nav-activity` pill that the activity widget populates when music, gaming, or coding is live.

### Design tokens — `styles/tokens.css`

All visual decisions live here — no magic numbers elsewhere in the codebase.

- **Color:** `oklch()` across the board for perceptually uniform hue shifts. Light and dark variants both defined under `:root` and `[data-theme="dark"]`. Theme preference persisted in `localStorage` under `nso-theme`.
- **Category palette:** six semantic colors (`--cat-research`, `--cat-internship`, `--cat-graduate`, `--cat-undergrad`, `--cat-personal`, `--cat-other`) used consistently across badges, filter chips, experience card accents, and project thumbnails.
- **Spacing:** 4px base scale (`--sp-1` through `--sp-10`).
- **Nav height:** `--nav-h: 65px` — shared by the sticky nav, the about sidebar, the resume toolbar, and the activity widget top offset so they all stay in sync.
- **Components:** `.btn`, `.chip`, `.badge`, `.container`, `.nav`, `.footer` defined here and composed by page-level styles.

### Activity widget — `scripts/now-playing.js` + `cloudflare-worker/`

A fixed pill in the top-right corner of the landing page that surfaces real-time activity across three sources: Last.fm (music), Steam (gaming), GitHub (recent pushes). Expands on hover/click to show a panel with per-source rows.

All API keys live server-side in a Cloudflare Worker (`cloudflare-worker/now-proxy.js`) — the client makes a single unauthenticated request to the Worker URL and receives a unified `{ music, steam, github }` payload. The Worker requires the following environment variables set in the Cloudflare dashboard:

```
LASTFM_API_KEY   LASTFM_USER
STEAM_API_KEY    STEAM_ID
GH_TOKEN         GH_USER
ALLOWED_ORIGIN   (defaults to nathansso.github.io)
```

State machine: `gaming > music > coding > idle`. Each state shifts the accent color and triggers source-specific animations (waveform bars for music, pulsing icon for gaming). Inactive rows collapse to zero height and reveal at reduced opacity on panel hover as a "last known" hint. Polling interval: 30 seconds.

---

## Local development

ES modules require a server — `file://` won't work.

```bash
python3 -m http.server 8000
# or
npx serve .
```

Open `http://localhost:8000`. The Cloudflare Worker already allows `localhost` origins, so the activity widget will function locally without any extra configuration.

---

## Project sync

GitHub repo metadata (descriptions, skills, last commit date) can be refreshed by running:

```bash
npm run sync
```

This runs `scripts/sync-projects.js` → `scripts/infer_skills.py` → `scripts/merge-projects.js` in sequence. Requires a `.env` file with `GITHUB_TOKEN` (see `.env.example`). Output is written to `data/projects-auto.json` and merged back into `data/site.js`.

---

## Browser support

Modern evergreen browsers (Chrome, Firefox, Safari, Edge). Requires CSS custom properties, ES modules, `oklch()` color syntax, and `backdrop-filter`.

---

## License

Content (bio, project descriptions, images) © Nathaniel Oliver. Code structure is unlicensed — adapt freely.
