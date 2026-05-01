# Nathaniel Oliver — Personal Site

A static personal website built with vanilla HTML, CSS, and JavaScript (ES modules). No build step, no framework, no dependencies.

**Live pages:**
- `index.html` — landing
- `about.html` — bio, experience timeline, filterable
- `projects.html` — project grid, category filter + skill search
- `resume.html` — one-page printable résumé with PDF download

---

## Project structure

```
.
├── index.html              # Landing
├── about.html              # Bio + experience timeline
├── projects.html           # Project grid
├── resume.html             # One-page résumé
├── resume.pdf              # ← Drop your résumé PDF here
├── favicon.svg
├── data/
│   └── site.js             # Single source of truth: profile, experiences, projects
├── scripts/
│   └── chrome.js           # Shared nav, footer, theme toggle
├── styles/
│   └── tokens.css          # Design tokens + base components (light + dark)
└── imgs/                   # Project thumbnails, profile photo
```

All page content (bio, experiences, projects, skills) lives in **`data/site.js`** — edit there and every page updates.

---

## Local development

ES modules can't be loaded over `file://`, so you need a local server.

**Option A — Python:**

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

**Option B — Node:**

```bash
npx serve
```

**Option C — VS Code:** install the "Live Server" extension, right-click `index.html` → "Open with Live Server".

---

## Deploy

This is a static site — drop the folder anywhere that serves files.

### Vercel (drag-and-drop, fastest)

1. Sign in at <https://vercel.com>
2. Click **Add New → Project → Import**, or drag this folder onto the dashboard
3. Accept defaults (no build command, output directory = root)
4. Live at `your-project.vercel.app` in ~30s

### Netlify (drag-and-drop)

1. Sign in at <https://app.netlify.com>
2. Drag this folder onto the **Sites** dashboard
3. Live at `your-site.netlify.app`

### GitHub Pages

1. Create a repo, push these files
2. **Settings → Pages → Source:** Deploy from a branch · `main` · `/ (root)`
3. Live at `https://<username>.github.io/<repo>/` in ~1 minute

**Custom domain:** all three hosts let you attach one in the project settings.

---

## Editing content

### Update bio, experiences, projects, skills

Edit `data/site.js`. The structure:

- `PROFILE` — name, contact, photo, bio
- `EXPERIENCES[]` — research / internship / education / other roles
- `PROJECTS[]` — projects, each linked to an experience by `experienceId`
- `CATEGORIES` — drives the filter chips on /projects and /about

### Update the résumé PDF

Replace `resume.pdf` with your own file (keep the filename). The download button on `/resume.html` already points at it.

### Theme

`styles/tokens.css` holds all design tokens — colors, type scale, spacing, shadows. Light and dark variants both defined. Toggle in the top-right of every page.

### Add a new page

1. Copy any existing page as a template
2. Add an entry to `PAGES` in `scripts/chrome.js` so it appears in the nav
3. Use shared components from `styles/tokens.css` (`.btn`, `.chip`, `.badge`, `.container`, etc.)

### Cache busting after edits to `data/site.js`

Module imports use a query string (`?v=1`) for cache control. After meaningful changes to `data/site.js` or `scripts/chrome.js`, bump the version in every importing file to force browsers to refetch:

```bash
# Find all imports
grep -rE "data/site\.js|scripts/chrome\.js" --include="*.html" --include="*.js" .
```

Production hosts (Vercel, Netlify, Pages) generally serve files with reasonable cache headers, so this matters most when you're iterating locally and want to force a hard reload.

---

## Browser support

Modern evergreen browsers (Chrome, Firefox, Safari, Edge — last 2 versions). Uses CSS custom properties, ES modules, and `oklch()` colors.

---

## License

Personal use. Content (text, images) © Nathaniel Oliver. Code structure free to adapt.
