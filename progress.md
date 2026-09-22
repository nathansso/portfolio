# Progress Log

## 2026-08-15 — Only re-summarize a project when its repo actually changed

- **Why.** The weekly `Sync project data` workflow (`.github/workflows/sync.yml`, Mondays 09:00 UTC) rewrote `description` and `skills` for every unlocked project on every run, whether or not the repo had moved. That is how `f99093f` silently reworded `ca-real-estate`, `portfolio-editor`, and `ecommerce-intent` and dropped "cross-validation", "hyperparameter tuning", and "model selection" from the real-estate skill list. Hard-locking those fields would have stopped the churn but also frozen genuinely new work out of the summaries. The rule we want is narrower: no diff in the repo, no rewrite.
- **Not disabling the job.** Worth recording because it was the first instinct: `merge-projects.js` maps over the `PROJECTS` array already present in `site.js` and only overwrites `description` / `skills` / `url` / `lastCommit` on entries it matches by repo name (`scripts/merge-projects.js:52-67`). It has no code path that appends. So the 11 projects pruned earlier today cannot come back on their own, and the job is still worth keeping for `lastCommit` refreshes and new-repo discovery.
- `scripts/infer_skills.py` — added `context_fingerprint()`, a SHA-256 over the canonicalized repo material that actually feeds the prompt: sorted `languages`, the README excerpt, and the dependency manifests plus `detected_imports`. Stored on each project as `contextHash`. When the recomputed hash matches the stored one, both model calls are skipped and the existing text is kept verbatim.
  - The fingerprint deliberately **excludes** the project title and current description, which also reach the prompt via `build_context_lines()`. Both are editorial and change without the repo changing; including them would re-summarize a project because someone retitled a card, which is the churn this cache exists to prevent.
  - Languages are sorted before hashing — the GitHub `/languages` endpoint makes no ordering promise, and an unsorted hash would have produced spurious cache misses.
  - **First-run seeding.** A project with no `contextHash` that already has both a description and skills adopts its current text as the baseline and just records the hash, rather than regenerating everything once more to arrive back where it started. A project with no text yet still generates normally.
  - Added `--force` to bypass the cache and regenerate everything.
- `scripts/sync-projects.js` — this step runs *before* `infer_skills.py` and was unconditionally overwriting `description` with a fresh README extract. Left alone it would have defeated the cache entirely: the text would still churn weekly, only now with the regex-extracted README blurb instead of the model's summary. Description is now only **seeded** when a project has none; `infer_skills.py` owns rewrites. `url` still refreshes, but only when it actually differs, and `changed` now counts real changes so the "No changes." log line is honest.
- `contextHash` stays in `data/projects-auto.json` and never reaches `site.js` — `merge-projects.js` copies only its four `AUTO_FIELDS`.
- `tests/test_summary_cache.py` — new (first file in `tests/`). Covers fingerprint stability, insensitivity to language and dependency-key ordering, sensitivity to README / dependency / language changes, the repo-less case, and all five branches of the regenerate decision including `--force`. 13 assertions, all passing via `python tests/test_summary_cache.py`.
- **Verification.** `node --check scripts/sync-projects.js` clean. Ran `node scripts/merge-projects.js` for real against the current data: matched 8 of 8 projects, produced a **zero-line diff** in `data/site.js`, and resurrected none of the pruned projects — which is precisely the steady state we want, since `git-auto-commit-action` only commits when a file actually changes, so a quiet week now produces no commit at all. Confirmed `contextHash` did not leak into `site.js`.
- Not run here: the full workflow end to end, which needs `ANTHROPIC_API_KEY` and `SYNC_GITHUB_TOKEN`. The first real run will seed a `contextHash` for every project in `projects-auto.json` and should rewrite nothing.

## 2026-08-15 — Prune undergraduate coursework and placeholder projects

- **Why.** The projects grid should only show work that demonstrates engineering rigor. Eleven entries were undergraduate course deliverables (static charts, one-off D3 assignments, a small image filter) or had placeholder descriptions that openly said the notebook had not been read.
- `data/site.js` — `PROJECTS[]`: removed `dsc80-notebook`, `ucsd-research-lab`, `bike-cambridge`, `mice-temp`, `airbnb-sd`, `mice-explorable`, `estrus-rats`, `allrecipes`, `math189-edu`, `asteroid`, `image-processor`. 19 → 8 projects: Atrium, Alongside, RollAway, California Real Estate, Diginetica, Portfolio Live Editor, ARTie, eCommerce Session Purchase Intent.
  - `dsc80-notebook` and `ucsd-research-lab` were the two entries whose `description` was literally an apology from the generator ("Without access to the actual notebook contents…"), so they were the clearest cuts.
  - The `ecommerce-intent` DSC 207 project was **kept** — it is graduate coursework, not undergraduate, and carries real modeling results.
- `data/site.js` — `EXPERIENCES[]`: `bsmath.projectIds` (10 ids) and `econ-gray.projectIds` (1 id) emptied, since every project they linked is gone. `projectsByIds()` already filters missing ids, but leaving stale ids would have been dead data.
- `CATEGORIES` left untouched. The `research` and `undergrad` keys still describe experience categories on the about page, and `projects.html` computes its own counts and suppresses any chip with a count of 0 (`projects.html:558`), so those two chips simply stop rendering on the projects page.
- `projects.html`: hero subtitle no longer claims the page spans "undergraduate course projects" — now "internship, graduate, and personal work."
- `index.html`, `about.html`, `projects.html`, `reading.html`, `blog.html`: bumped the `site.js` cache-bust `?v=8` → `?v=9`.
- Images for the removed entries (`imgs/bike_cambridge.jpg`, `imgs/mice_temp.jpg`, `imgs/airbnb_sd.png`, `imgs/estrus_static.png`, `imgs/allrecipes.jpg`, `imgs/math189.jpg`, `imgs/asteroid.jpg`, `imgs/image_processor.png`) were left on disk — unreferenced but harmless, and easy to restore an entry from. `data/projects-auto.json` still holds the raw sync records for the same reason; it is not read by the live site.
- **Verification.** Served locally and checked in the browser. Projects page reads "8 of 8 projects" with chips All 8 · Internship 1 · Graduate 1 · Personal 6 — Research and Undergrad chips absent, as intended. About page renders all 7 experiences; the B.S. Mathematics & Economics and Cohabitation & Census cards now render without a "Linked projects" row rather than breaking. No console errors.

## 2026-08-08 — Add Alongside (JacHacks SF) + blog post; day-level dates

- **Day-level dates.** `fmtDate()` in `data/site.js` now accepts `"YYYY-MM-DD"` as well as `"YYYY-MM"`, rendering the day when present (`"Jul 25, 2026"`) and falling back to the original month-only format otherwise (`"Jul 2026"`). Backward compatible: every pre-existing entry is month-only and renders exactly as before — verified against `EXPERIENCES` via `fmtRange` (about page) and `READING` (reading page). Both forms still sort correctly under the plain `localeCompare` used by the projects grid (`projects.html:540`) and the blog feed (`blog.html:172`), since `"2026-07-25" > "2026-07"` as strings.
  - This was needed because RollAway and Alongside are both July 2026; at month granularity their order was a tie.
- `data/site.js` — `PROJECTS[]`: added `alongside` (`date: "2026-07-25"`, JacHacks SF, two weeks before today). Category `personal`, `repo: "Alongside"`, `url: null` — the JacHammer deploy was a temporary hackathon URL and the README lists a permanent deploy as pending, so there is no live link to point at.
  - **No award.** The repo says it was built for JacHacks SF targeting three tracks (Social Impact, Agentic AI, Best JacHammer) and the user did not report placing, so no `award` field was added. Unlike `rollaway` and `atrium`, this tile carries no badge.
  - `description` written from the user's Devpost copy: the endpoints-vs-slope framing, "relevance is reachability, not similarity", the convergence and absence findings that top-k cannot produce, the three node layers (provenance floor / anchor / belief), the two-channel traversal (Channel B exhaustive, unscored, killable only by a `Supersedes` edge), six walkers under a hard two-`by llm()` budget with a zero-model-call read path, the deliberate refusal of `visit [-->] by llm()`, and the single-file `main.jac` vertical slice on JacHammer. 27 `skills`; `lockedFields` set so `npm run sync` won't overwrite it.
- `data/site.js` — `POSTS[]`: added `alongside-jachacks` (`2026-07-25`), placed between the RollAway and Atrium posts. Body adapted from the Devpost, opening with the grandfather framing that motivated the project.
- `data/site.js`: `atrium` project and `atrium-hackathon-win` post re-dated `"2026-08"` → `"2026-08-03"`, the actual build date, which now renders as "Aug 3, 2026".
- **Resulting order** (verified by running the same sort the pages use) — chronologically RollAway → Alongside → Atrium, so both the blog feed and the projects grid show newest first: Atrium (Aug 3) · Alongside (Jul 25) · RollAway (Jul).
- `blog.html`: `formatBody()` gained inline-code support (`` `code` `` → `<code>`), applied after HTML escaping so it stays injection-safe, plus a `.post-content code` rule using the existing `--font-mono` / `--r-1` tokens. The Alongside post uses `by llm()` and `visit [-->] by llm()` inline; without this they rendered as literal backticks. Project *descriptions* still use bare backticks, matching the existing `diginetica-ecomm` entry.
- `index.html`, `about.html`, `projects.html`, `reading.html`, `blog.html`: bumped the `site.js` cache-bust `?v=7` → `?v=8`.
- **Verification.** Data layer checked by importing `data/site.js` in Node: `fmtDate` output for all three formats, `fmtRange` on existing experiences, blog and project sort order, and the Alongside entry's fields. Then visually verified in Chromium once the browser extension reconnected: the Alongside card renders with no award badge, "JUL 25, 2026", 27 skill chips, and a GitHub-only action row (no "Live demo", since `url` is null); the grid orders Atrium (Aug 3, 2026) → Alongside (Jul 25, 2026) → RollAway (Jul 2026); the blog feed matches; inline `code` renders in mono with its own background. No console errors.
- **Follow-up fix after seeing it rendered:** the Alongside `description` had inline backticks that `projects.html` renders literally as text (it does no markdown), so they read as typos on the card. Stripped them there. The blog `body` keeps its backticks, because `blog.html` now renders them as `<code>`. Note the pre-existing `diginetica-ecomm` description still shows literal backticks for `abs_time` / `rank:ndcg` / `task.evaluate` — same underlying issue, left alone as out of scope.
- Branch note: this work was done on a branch off `origin/main` (which already has Atrium), not on `feature/reading-blog-tabs`, to avoid compounding that branch's divergence from the auto-sync commits.

### Merging `feature/reading-blog-tabs` (finally closed out)

- The branch had diverged awkwardly: its original commit `8eb972b` was already on main as squash-merge `4922333` (#21), and its copy of `fcc67e9` (Atrium) was already on main as cherry-pick `a528e7d`. Only **one** commit carried content main did not have — `2bc101c` ("Make reading list a vertical scroll; filter null blog images").
- A plain `git merge` was the wrong tool here: because of the squash, the merge base predates the reading/blog work, so main's three `chore: auto-sync project data` commits and the newer Atrium/Alongside edits would have been diffed against the branch's stale `data/site.js` and `data/projects-auto.json` — a conflict resolution that could silently revert regenerated project descriptions.
- Instead cherry-picked `2bc101c` alone onto the main-based branch. It auto-merged cleanly across all three files, and critically it did **not** touch `data/site.js`, so nothing on main was at risk.
- Verified the cherry-pick composed correctly rather than overwriting: `blog.html` now holds *both* its `.filter(Boolean)` null-image guard (from `2bc101c`) *and* the newer inline-code regex + `.post-content code` rule, and `reading.html` kept the `?v=8` cache-bust while taking the new vertical-row layout. Confirmed in the browser: the reading list renders as a single centered column of horizontal rows with month-only dates unchanged.

## 2026-08-08 — Add Atrium (1st Overall, Memory Meets Motion) + blog post

- `data/site.js` — `PROJECTS[]`: added `atrium` at the top of the array (newest, `date: "2026-08"`). Category `personal`, `award: { placement: "1st Overall", event: "Memory Meets Motion Hackathon — hosted by Devnovate at Frontier Tower, San Francisco" }`.
  - `url` points at the live Railway deployment (`atrium-web-production-164a.up.railway.app`); `repo: "Atrium."` — the trailing dot is part of the actual GitHub repo name, and `projects.html` builds the link as `github.com/nathansso/${p.repo}`, so it resolves correctly.
  - `description` written from the repo README plus the user's LinkedIn post: two-phase research → simulated-classroom workflow, the dual-half FalkorDB knowledge graph (Source → Lesson → Concept and Student → Misconception → Concept joined at shared Concept nodes), the core modeling decision to treat a misconception as its own node rather than a low score, the nine Guild.ai agents, RocketRide chained pipelines, Bayesian Knowledge Tracing mastery updates, the LaserData/Iggy event stream, the two non-disableable human approval gates, and the Next.js + custom canvas isometric renderer on Railway/Docker.
  - 34 `skills` covering the stack (typescript, next.js, falkordb, cypher, graphrag, firecrawl, guild.ai, rocketride, laserdata, apache iggy, event sourcing, bayesian knowledge tracing, etc.). `lockedFields` set so `npm run sync` won't overwrite the hand-written copy.
  - Note: the README says **nine** agents (and enumerates nine); the LinkedIn post says eight. The project `description` uses nine and names them; the blog `body` preserves the user's original "eight" wording.
- `data/site.js` — `POSTS[]`: added `atrium-hackathon-win` (Aug 2026) ahead of the RollAway post; the feed sorts newest-first so it leads. Body is the user's LinkedIn copy, essentially verbatim, with `**bold**` on the placement, the product name, and "The classroom remembers.", and a closing line linking the live demo and the GitHub repo. `link: "projects.html#atrium"` drives the "Read more →" button.
- `index.html`, `about.html`, `projects.html`, `reading.html`, `blog.html`: bumped the `site.js` cache-bust query string `?v=6` → `?v=7`.
- Verified in Chromium against a local `python -m http.server`: `projects.html#atrium` deep-links and auto-expands the card, the `1ST OVERALL` badge renders beside the category badge, the Award side-panel block shows placement + event, all 34 skill chips render, and both "Live demo" / "View on GitHub" buttons appear. `blog.html` renders the new post first with correct paragraphs, bold, both inline links, the Read more button, and the permalink. No console errors.
- `index.html`: `FEATURED_IDS` homepage strip is now `['atrium', 'rollaway', 'ats-resume']` — Atrium leads, replacing `diginetica-ecomm` (per the user). Diginetica remains on `projects.html`.
- Follow-up per the user: Manny Vazquez was a full team member, so the blog opener now reads "Dat Nguyen, Bryan Pham, Manny Vazquez, and I formed our own terrifying **quartet**" (was "trio", which contradicted the four-person thanks line). `blurb` updated to match.
- Per the user, `award.placement` is `"1st Overall"` (not `"1st Place Overall"`) — shorter badge text that keeps "Overall", the distinction that matters here (cf. the 2026-07-15 RollAway track-vs-overall correction). Prose in the `description` and blog `body` still reads "1st Place Overall", which is the user's own LinkedIn phrasing; only the badge/side-panel label was shortened.

## 2026-07-17 — Add Reading list + Blog tabs

- **New feature: two content tabs**, both following the projects mold — data lives in `data/site.js` as the single source of truth, and a flat page at the repo root renders it client-side. No build step.
- `data/site.js`: added three exports.
  - `READING_TYPES` — a small vocabulary (`paper` / `book` / `article` / `media`), each with a `hue`, mirroring the `CATEGORIES` map so type badges get consistent colors.
  - `READING[]` — reading-list entries: `title`, `authors`, `type`, `date`, `link`, `note`, `tags`, plus optional manual `image`. Seeded with four papers — Codified Finite-state Machines for Role-playing (arXiv 2602.05905), RelBench, Relational Deep Learning, and Attention Is All You Need — with accurate titles/authors verified against arXiv. Notes left empty (the card shows a tidy "No note yet." state) for the user to fill in.
  - `POSTS[]` — blog posts: `title`, `date`, `tags`, `blurb`, `body` (blank-line paragraphs + `**bold**` + `[text](url)`), `images[]` (paths into `imgs/blog/`, first = header), optional `link`. Seeded with the RollAway hackathon-win post using the user's own LinkedIn copy (fixed the truncated "pent" → "Spent", linked the live demo).
- `scripts/chrome.js`: added `reading` and `blog` entries to `PAGES[]`, between Projects and Resume. Nav order is now Home · About · Projects · Reading · Blog · Resume.
- `reading.html` (new): filterable card grid modeled on `projects.html` but leaner (no skill autocomplete). Type filter chips, click-to-expand cards revealing the note + an "Open →" link, `#slug` deep-linking. Thumbnail resolves `image || THUMBS[id]`, falling back to a per-type SVG glyph placeholder. Per-type accent colors defined locally (light + dark), matching the category color system.
- `blog.html` (new): single-column readable feed (max-width 760px) rather than an expand-grid — better for prose + photos. Each post renders an optional 16:9 header image, date + hashtag tags, title, a safely-escaped mini-markdown body, a responsive photo gallery from the remaining `images[]`, an optional "Read more →" button, and a permalink. `#slug` deep-link scrolls to the post.
- `index.html`, `about.html`, `projects.html`: bumped the `site.js` cache-bust query string `?v=5` → `?v=6` (both new pages import `?v=6`).

### Auto-thumbnail generator (`npm run thumbs`)

- `data/thumbs.js` (new): an auto-generated manifest mapping entry `id` → generated thumbnail path. Ships **empty** (`export const THUMBS = {}`) so every page can import it before the first generation run. A manual `image` on an entry always wins; `THUMBS[id]` is the fallback.
- `scripts/gen-thumbs.js` (new) + `package.json` `"thumbs"` script: walks `PROJECTS` and `READING`, builds a work plan, and renders previews for any entry that has no manual `image`.
  - **Live sites** (a project `url`, or a reading `link` that isn't a paper) → Playwright screenshots a 1200×750 (~16:10) viewport into `imgs/auto/<id>.png`. GitHub *repo* URLs (`github.com/...`) are skipped — they're not "a site" — while project pages on `*.github.io` are treated as real sites.
  - **Papers / PDFs** (reading `type: "paper"`, arXiv, or `.pdf`) → downloads the PDF and renders **page 1** to PNG via `pdfjs-dist` + `@napi-rs/canvas`. arXiv `/abs/` links are rewritten to `/pdf/`. Critically, pdf.js is pointed at its bundled `standard_fonts/` via `standardFontDataUrl` — without it Times/Helvetica glyphs render blank.
  - Skips entries already generated unless `--force`; `--dry-run` prints the plan and exits. The manifest is rebuilt from whatever `.png` files exist in `imgs/auto/`, so it always mirrors disk.
- Pages consume the manifest: `reading.html`, `projects.html`, and `index.html` all import `THUMBS` and use `image || THUMBS[id]` for their thumbnails, so generated previews light up automatically. (Blog is photo-driven, so it's excluded.)
- Dev deps added: `playwright`, `pdfjs-dist`, `@napi-rs/canvas`. One-time setup: `npm install && npx playwright install chromium`, then `npm run thumbs`. The generated `imgs/auto/*.png` and `data/thumbs.js` are committed to publish.
- Verified: generator `--dry-run` produces the correct 8-job plan (4 live sites: RollAway, CA real-estate Streamlit, ARTie Fly.io, mice-explorable; 4 papers). The PDF path was run for real against arXiv 1706.03762 — the rendered first page shows full, crisp text (confirmed visually) after the `standardFontDataUrl` fix. The Playwright screenshot path is unrun here (heavy chromium download) but uses the standard `goto` + `screenshot` pattern.
- Not yet run in bulk: the user runs `npm run thumbs` on their machine to populate `imgs/auto/` and `data/thumbs.js`. Until then, `THUMBS` is empty and all cards fall back to their placeholders (unchanged behavior).

## 2026-07-15 — Correct RollAway award: Beginner Track winner

- `data/site.js`: corrected the `rollaway` award, which the previous entry had overstated. The win was the **Beginner Track**, not the overall first-place prize. Set `award.placement` to `"Winner"` (was `"1st Place"`) and `award.event` to `"Beginner Track — MLH x DigitalOcean AI Hackathon for Social Good"`, and reworded the `description` sentence from "won first place at" to "won the Beginner Track at". The `blurb`'s "Hackathon-winning" opener stays accurate as-is.
- Verified in Chromium: the badge reads "WINNER" on both the project card and the homepage tile, and the expanded side panel shows the track. Grepped `data/site.js`, `index.html`, and `projects.html` to confirm no "1st Place" / "first place" claims survive anywhere.

## 2026-07-15 — Add RollAway project + award badge; repin featured projects

- `data/site.js`: added the `rollaway` project entry, written from the repo README (`nathansso/RollAway`, pushed 2026-07-14). Category `personal`, dated `2026-07` so it sorts to the top of the projects page (the grid sorts by `date` desc, so array position is irrelevant). `url` is the live Railway demo `https://rollaway-frontend-production.up.railway.app/` and `repo` is `RollAway`, which drive the existing "Live demo" / "View on GitHub" buttons — no new link markup needed. The `description` leads with the first-place win and centers the repo's core design claim: scoring, hard constraints, travel time, and legality are computed deterministically in code and never inside an LLM, with setbacks encoded from SF Public Works Order 182101 and every legality check citing its source. Covers the four managed layers (React 19 + Vite PWA on Railway behind Caddy reading a runtime `/config.json`; FastAPI agents backend; Supabase Postgres with a pgvector HNSW KB + a year of Bay Wheels foot-traffic aggregates; seven DigitalOcean Functions), DO Gradient inference, the live city data feeds, and the eval gate. 37 skills.
- `data/site.js`: set `"lockedFields": ["description", "blurb", "url", "skills"]` on `rollaway` so the sync can't clobber the curated copy (same protection as `ats-resume`).
- **New optional `award` field** — `{ placement, event }`. Added as a general data-layer concept rather than special-cased to this project, so future wins only need data. RollAway carries `1st Place` / `MLH x DigitalOcean AI Hackathon for Social Good`.
- `styles/tokens.css`: added `--award` / `--award-bg` gold tokens to both the light and dark blocks (`oklch(52% 0.13 85)` / `oklch(80% 0.13 85)`), and a `.badge-award` class that composes with `.badge` — a trophy glyph overrides the inherited `.badge::before` category dot, plus a hairline inset ring.
- `projects.html`: render the award badge in `.pcard-meta` next to the category badge, and an "Award" block at the top of the expanded `.pcard-side` panel showing placement + event.
- `index.html`: render the award badge in `.tile-meta`.
- `projects.html`, `index.html`: both meta rows are `justify-content: space-between`, so a third child made the award badge drift to the center of the row. Added `gap` and a scoped `.pcard-meta .badge-award { margin-right: auto; }` / `.tile-meta .badge-award { ... }` to keep it beside the category badge with the date still right-aligned — scoped per page so the shared token stays layout-agnostic.
- `index.html`: repinned `FEATURED_IDS` to `['rollaway', 'ats-resume', 'diginetica-ecomm']` (was `ca-real-estate`, `ats-resume`, `ecommerce-intent`).
- `index.html`, `about.html`, `projects.html`: bumped the `site.js` cache-bust query string `?v=4` → `?v=5`.
- Verified in Chromium (Playwright) against a local server: RollAway is the first card on the projects page, all three featured tiles resolve, the award badge renders in both light and dark, the side panel shows the award, and both action links point at the live demo and the repo (both confirmed HTTP 200). No new console errors — the pre-existing `now-proxy` CORS error on localhost is unrelated.
- Known gap: `abbreviate()` renders the empty thumbnail as a bare "R" since "RollAway" is a single capitalized word. Left as-is pending a real screenshot in `imgs/`.

## 2026-07-05 — Update visible resume to Data Scientist 7/5

- `resume.pdf`: replaced with `Nathaniel_Oliver_Data_Scientist_7_5.pdf` (the current Data Scientist resume). `resume.html` embeds/serves `resume.pdf` (PDF.js canvas render + Print/Download links), so swapping the file updates the live resume everywhere. Confirmed the new file is a single page, matching the renderer which draws only page 1.
- `resume.html`: renamed the Download PDF button's `download` attribute from `Nathaniel-Oliver-Resume.pdf` to `Nathaniel_Oliver_Data_Scientist.pdf` so the saved file matches the current resume.

## 2026-07-05 — Refresh ARTie tile: live-demo link + description to match repo

- `data/site.js`: for `ats-resume` (ARTie), set `url` to the live Fly.io demo `https://artie-resume-tailoring.fly.dev/` (the "Live demo" button on the projects page reads `p.url`; it had reverted to the GitHub repo URL — the `repo` field already provides the "View on GitHub" link).
- `data/site.js`: rewrote the click-in `description` to match the current repo, which pivoted from the old Textual terminal-UI system to a production web platform: React 18 + TypeScript / Vite frontend, FastAPI backend on Fly.io (Docker); ingest resume/GitHub/LinkedIn into a per-user skills knowledge graph; LangGraph tailoring pipeline (LangChain over Anthropic/OpenAI) with best-of-N + early-exit; ATS-style scoring and chat revision loop; SQLModel ORM (SQLite local / Supabase Postgres prod) with Supabase JWT auth; CLI mirror; single-process serving of the compiled React app.
- `data/site.js`: refreshed the `ats-resume` `skills` array to the current stack — dropped stale TUI-era tags (`plpgsql`, `ollama`, `scikit-learn`, `nltk`, `networkx`, `beautifulsoup4`, `textual`, `jupyter`, `explainable ai`, `hallucination prevention`, `terminal ui`, `docling`, `plotext`, `etl pipeline`) and added `react`, `vite`, `fastapi`, `sqlite`, `supabase`, `jwt auth`, `fly.io`, `playwright`, `best-of-n selection`, `evidence grounding`, `latex`, `pdf export`, `rest api`, `cli`. (LaTeX export is still supported, so the blurb's LaTeX mention stays.)
- `data/site.js`: added `"lockedFields": ["description", "url", "skills"]` to `ats-resume` so the weekly sync can't clobber the curated description/url/skills again (the `url` change on 2026-06-09 had previously been reverted by the sync).
- `index.html`, `about.html`, `projects.html`: bumped the `site.js` cache-bust query string `?v=3` → `?v=4`.

## 2026-06-23 — Refresh diginetica-ecomm tile from reframed repo

- `data/site.js`: rewrote the `diginetica-ecomm` project entry to match the substantially reframed repo (pushed 2026-06-23). The project pivoted from "session conversion prediction" to a fair, slice-aware comparison of a heterogeneous GNN vs. a tuned XGBoost ranker on Diginetica (CIKM Cup 2016), built on RelBench with two tasks (session-conversion entity classification + next-item link prediction). Updated `title` and `blurb`; wrote a technically-focused `description` covering RelBench graph construction (8 node types / 22 edge types), the microsecond `abs_time` clock + time-aware neighbor sampling, the two-tower HeteroGraphSAGE encoder with sampled-softmax, the XGBoost LambdaRank baseline, the shared candidate-pool fairness protocol, Optuna tuning, and slice-decomposed evaluation/ablations (rather than the win/loss + leakage-correction narrative). Refreshed `skills` (added relbench, learning-to-rank, lambdarank, optuna, link prediction, next-item recommendation, data leakage audit, temporal graphs, time-aware neighbor sampling, recall@k, ndcg, mrr, two-tower model; dropped stale hgt/bipartite), and bumped `lastCommit` to 2026-06-23. `url` already points to the repo (`https://github.com/nathansso/diginetica-ecomm`). This supersedes the auto-sync's regenerated tile, whose description was stale.
- `index.html`, `about.html`, `projects.html`: bumped the `site.js` cache-bust query string `?v=2` → `?v=3`.

## 2026-06-23 — Add per-project `lockedFields` so the sync can't clobber curated copy

- Problem: the weekly `Sync project data` workflow (`.github/workflows/sync.yml`, Mondays 09:00 UTC) regenerates `description`/`skills`/`lastCommit` from the repo README via `sync-projects.js` → `infer_skills.py` → `merge-projects.js`, which would overwrite the hand-curated diginetica description/skills on the next run.
- Added a `lockedFields` opt-out honored at every write site:
  - `scripts/merge-projects.js` (the only writer to `data/site.js`): skips any `AUTO_FIELDS` listed in a project's `lockedFields`, so locked fields keep their `site.js` value regardless of what the auto JSON holds. This is the guaranteed chokepoint.
  - `scripts/sync-projects.js`: skips README-summary/url writes for locked fields (and avoids the README fetch when `description` is locked).
  - `scripts/infer_skills.py`: skips LLM summary/skill regeneration (and the API calls) for locked fields; `lastCommit`/`year` still refresh unless locked.
- `data/site.js` and `data/projects-auto.json`: set `"lockedFields": ["description", "skills"]` on the `diginetica-ecomm` entry and aligned the auto JSON's `description`/`skills`/`title`/`lastCommit` with the curated `site.js` values. `url` and `lastCommit` remain unlocked so they auto-refresh.
- Verified: a lock unit check confirms a simulated stale auto entry can't overwrite the locked fields while `lastCommit` still updates; running `node scripts/merge-projects.js` leaves the curated diginetica tile intact (only the 4-line `lockedFields` addition in `site.js`).

## 2026-06-09 — Add diginetica-ecomm and portfolio-editor; fix sync discovery

- `data/site.js`: added `diginetica-ecomm` (GNN session conversion, CIKM Cup 2016) and `portfolio-editor` (Express overlay editor) as personal project entries
- `data/projects-auto.json`: seeded both new entries so the weekly sync can track and update them going forward
- `scripts/sync-projects.js`: removed pre-filter that dropped repos lacking a GitHub description and homepage before checking the README — the subsequent `if (!description)` guard is sufficient and less aggressive

## 2026-06-09 — Project data updates

- `data/site.js`: enhanced `mice-explorable` description + blurb with scrollytelling story mode, multi-view details, and estrus filtering — project already existed but was sparse
- `data/site.js`: updated `ats-resume` (ARTie) `url` from GitHub repo to live Fly.dev demo (`https://artie-resume-tailoring.fly.dev`)
- `data/site.js`: updated `ca-real-estate` `repo` from stale `idx_38` to correct public repo `idx-app`
- GitHub scrape: `sleeper_fantasy_app_agentic` is essentially empty (only `.gitattributes`), skipped

## 2026-05-18 — Issue #19: Remove activity indicator from navbar

Removed the duplicate nav activity pill that mirrored the landing page activity widget.

- `scripts/chrome.js`: removed `#nav-activity` pill element from nav HTML
- `scripts/now-playing.js`: removed `updateNavIndicator` call in `updateDOM` and the full function
- `styles/tokens.css`: removed `.nav-activity`, `.nav-activity-dot`, `.nav-activity-text`, `@keyframes nav-dot-pulse`, and the mobile hide rule

## 2026-05-18 — Issue #11: Resume page PDF embed

Replaced the data-driven HTML resume renderer with an embedded PDF viewer using PDF.js (v4.4.168 via CDN). Key changes:

- `resume.pdf` replaced with the updated resume file (`Nathaniel Oliver Resume - 5_18_26.pdf`)
- `resume.html` rewritten: PDF rendered to `<canvas>` at 8.5in width via PDF.js, matching the original white-card-on-dark-background layout
- Link annotations extracted from the PDF and overlaid as real `<a>` elements so URLs are clickable
- Reactive mouse-tracking glow background added (same as landing page)
- Dark mode support: `filter: invert(0.9) hue-rotate(180deg)` on the canvas adapts the PDF to the site's dark theme

## 2026-05-18 — Issue workflow + dependency tracking in CLAUDE.md

Added structured issue workflow to `CLAUDE.md`: enter plan mode when starting an issue, draft and revise the implementation plan with the user before writing code, verify in-browser after implementing, then confirm with the user before marking Done. Added dependency tracking rules — new issues get a `## Dependencies` section assessed against open issues, and remaining Todo issues are re-evaluated for ordering after each completion. Also updated `/new-issue` skill to derive a clean title and generate a summary from the user's prompt instead of using the raw input verbatim. Backfilled `## Dependencies: None` on all three currently open issues (#11, #15, #19).

## 2026-05-18 — Add GitHub project board slash commands

Added `.claude/commands/` with six slash commands (`/projects`, `/ready`, `/issue`, `/start`, `/done`, `/new-issue`) that manage the Portfolio Improvements project board (number 1, owner `nathansso`) without manual API calls. Migrated from the ART repo pattern; adapted for this project's Todo/In Progress/Done status schema. Documented the commands and project IDs in `CLAUDE.md`.

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

## 2026-07-17

### Reading list → vertical scroll + editor support for Reading & Blog
- **reading.html:** Replaced the tile grid (and the click-to-expand mechanic) with a single centered column of horizontal rows (`.rd-list` / `.rrow`). Each row shows thumbnail (left), type badge, date, title, authors, note, and tags — all inline, so it reads top-to-bottom and every field is directly editable. A left accent rail is keyed to the entry type; rows are links when the entry has one; layout stacks (thumb-on-top) below 620px. Removed the expand/collapse/close/deep-link-expand code; kept type filter chips and deep-link scroll.
- **blog.html:** `images` is now filtered with `.filter(Boolean)` so a cleared header image can't render a broken gallery tile.
- **portfolio_editor/server.js:** `/api/content` GET now also returns `READING`, `READING_TYPES`, and `POSTS`; the PUT handler now writes `READING` and `POSTS` back via `replaceExport`.
- **portfolio_editor/public/editor.html:** Added Reading and Blog page tabs.
- **portfolio_editor/overlay.js:** Added bindings for the reading page (title, authors, note, tags array, and thumbnail image — injecting add-placeholders for empty authors/note/tags) and the blog page (title, body, tags array, and header image — injecting a placeholder `.post-hero` when a post has no image so one can be uploaded).
- **portfolio_editor/public/editor.js:** Added edit-panel hints for `POSTS.*.body`, `READING.*.note`, and `READING.*.authors`.
- Verified: site.js parses; editor GET returns the new exports; a PUT round-trip writes valid, re-importable site.js with all other exports intact; reading render loop runs against real data with no errors.

## 2026-08-15

### Rotating hero photo on the homepage

The homepage hero photo was a single static image (`PROFILE.photo`). It now cycles through a list of photos with a crossfade.

- **data/site.js:** added `PROFILE.photos` — an array of `{ src, alt, label, place }`. `label` renders in the bottom-left of the frame, `place` in the bottom-right (the old hardcoded "NSO · 2025" / "Porto / PT" pair). Seeded with the existing Porto photo. `PROFILE.photo` is kept as the single-image fallback for when the array is empty. Bumped the `site.js?v=` cache-bust from 9 to 10 across all five pages.
- **index.html markup:** `.hero-photo` now holds a `.hero-photo-stack` of layered `<img class="hero-slide">` elements, a `.hero-photo-dots` indicator row, and the caption spans given IDs so JS can swap their text. The static first slide is left in the HTML so the frame still renders without JS.
- **index.html CSS:** slides are absolutely positioned and crossfade on `.is-active` (900ms opacity) with a slow 1.05 → 1.0 scale drift over the display interval; `prefers-reduced-motion` drops the drift and shortens the fade. Dots sit top-left inside the frame on a blurred dark pill — **top-left specifically**, because the fixed activity widget floats over the top-right corner of the photo and would swallow the clicks. `.hero-photo` needed an explicit `width: 100%`: every child is now absolutely positioned, and with `margin-left: auto` suppressing grid stretch the box was shrink-to-fitting to 0×0.
- **index.html JS:** `initHeroPhotos()` builds the slide stack and dots from `PROFILE.photos`, auto-advances every 5.2s, and fades the caption out/in around each swap. Dots are hidden entirely for a single photo. Rotation pauses on hover, on focus within the frame, and when the tab is hidden; it does not auto-advance at all under `prefers-reduced-motion`, though the dots still work. Only the first image is eager-loaded; the rest are `loading="lazy"`.
- Verified in Chromium against a stubbed 3-photo array: auto-advance swaps slide + caption + dot state, dot clicks jump directly and restart the timer, and hover holds the current slide across a full interval. No new console errors (the pre-existing now-proxy CORS failure on localhost is unrelated).

### Hero photos added

- **imgs/:** added `frontier-tower-demo.jpg`, `frontier-tower-team.jpg`, and `mlh-digitalocean.jpg` (renamed from the user's `mim2`, `mim1`, `do1`).
- **data/site.js:** `PROFILE.photos` now carries four entries — Porto, the Frontier Tower demo, the Frontier Tower team shot, and the MLH × DigitalOcean hackathon.
- Added two optional per-photo fields since the new shots are landscape and the frame is 4:5: `fit: "contain"` letterboxes onto the frame's surface color instead of cropping, and `position` sets `object-position`. The MLH × DigitalOcean photo uses `contain` — a center crop cut the two outer people out of frame. The Frontier Tower team shot crops cleanly (subjects sit in the middle third) so it stays on `cover`.
- Verified all four slides in Chromium: correct image, caption pair, and dot state on each, no console errors.

## 2026-08-24

### Reading list removed; nav reordered

- **Deleted `reading.html`.** The Reading page and its data are gone from the site.
- **data/site.js:** removed the `READING_TYPES` and `READING` exports and their header comment block.
- **scripts/chrome.js:** dropped the `reading` entry from `PAGES`, and moved `resume` ahead of `blog` so the nav now reads Home · About · Projects · Resume · Blog. `.is-resume` (the dimmed treatment) stays on the Resume link.
- **scripts/gen-thumbs.js:** stopped importing `READING` and removed the reading half of `plan()`; the generator now only walks `PROJECTS`. Header comment updated to match.

### New downloadable resume

- **resume.pdf:** replaced with `Nathaniel_Oliver_Data_Scientist_8_20.pdf` from Downloads. Both the Print and Download PDF buttons on `resume.html` point at the same path, so no markup change was needed. Verified the new page-1 render (which now leads with Agos) in the pdf.js canvas.

### Agos — new role

Added the Agos job across the data layer, the About page, and the blog.

- **New `work` category.** A full-time role does not belong under "Internship," so the timeline gained a fifth category.
  - `data/site.js`: `CATEGORIES.work` (label "Work", hue 195).
  - `styles/tokens.css`: `--cat-work` / `--cat-work-bg` in both the light and dark blocks, plus a `.badge[data-cat="work"]` rule. Hue 195 (teal) was chosen because it is the widest gap left between research (250), internship (145), graduate (305), undergrad (75), and personal (25).
  - `about.html`: `.fchip`, `.fchip[aria-pressed]`, `.exp-card`, and `.ptile-thumb` colour rules for `work`; a "Work" chip in `FILTER_CATS`; and `work` placed first in `CATEGORY_ORDER` so the current job leads the timeline.
- **data/site.js `EXPERIENCES`:** new `agos` entry at the top — AI Engineer, Agos, San Francisco, Aug 2026 – Present, with four bullets covering the claim-ledger memory layer, memory-as-read-only-verb, the LongMemEval benchmark, and ContractKit.
- **IDX Exchange closed out:** `end` changed from `null` to `"2026-08"`, and the blurb's "Currently building a production multi-agent AI assistant…" retensed to "Built…" now that the role has ended.
- **`PROFILE.bio`:** the "I'm currently a Data Science Intern at IDX Exchange…" paragraph was replaced by an Agos paragraph, with IDX demoted to a following "Before Agos I was…" paragraph. Also fixed two long-standing "ETF" typos that were meant to be "ETL".
- **`PROFILE.currently`:** "Predictive modeling at **IDX Exchange**" → "Agent memory systems at **Agos**". This is the line in the homepage hero's Currently card.
- **New blog post** `joining-agos` (2026-08-24), newest in `POSTS`: why a voice agent that remembers badly is worse than one that forgets, the claim ledger and its provenance/recency/support scoring, memory as a read-only verb, the LongMemEval benchmark ladder, ContractKit, and a sign-off on the IDX chapter. Links to `about.html`.

### Latest blog headline on the landing page

- **index.html:** a new `.latest` section sits between the Selected work strip and the footer. It is one row, not a card — a `Latest post` mono eyebrow, the headline, the date beneath it, and a right-aligned arrow, bounded by hairline top and bottom rules. On hover the row takes a 5% accent wash, the headline and arrow go accent, and the arrow slides 4px right. Below 640px the eyebrow drops to its own full-width line above the headline.
- Populated from `POSTS` (newest by date) in the existing module script; the section ships `hidden` and is only revealed once a post is found, so an empty `POSTS` array leaves no orphan rules on the page.
- Bumped the `site.js?v=` cache-bust from 10 to 11 across all four remaining pages.
- Verified in Chromium at `localhost:8765`: nav order and the missing Reading link, the new resume rendering, the Agos card leading the About timeline with a working "Work" filter chip (1 of 8), the blog post's bold/paragraph formatting, and the latest-post row at rest and on hover in both light and dark themes. No console errors on any page.

### Agos scope widened; stale project links cleaned up

Read `~/Desktop/coding_projects/agos` (its `PROJECTS.md` registry plus each child's README) and widened the Agos entry to match the actual work, which is a federation of small deterministic kernels and the labs/harnesses that measure them — not just the memory layer.

- **data/site.js `EXPERIENCES.agos`:** blurb now leads with "the deterministic kernels behind a voice agent — memory, context, and property evidence." Bullets went from four to five: the memory kernel (admission / retention / bounded selection / exact source support) with its LongMemEval lab, the context and property kernels, the **recursion harness** (candidate-neutral measurement of whether an answer improves across a feedback lineage, candidates scored as black boxes against a fixed suite with append-only run artifacts), the **evolution lab** for bounded self-evolving agents, and ContractKit. Skills chips: Evaluation → Benchmarking + Evals.
- **`PROFILE.bio`:** the Agos paragraph broadened from "the memory layer / a claim ledger" to the kernels plus "the labs and harnesses that measure whether any of it actually works."
- **Blog post `joining-agos`:** one paragraph added between the benchmark and ContractKit paragraphs covering the two additional kernels, the recursion harness, and the evolution lab. Deliberately kept high level and link-free — the `agos` workspace and the `agos-recursion-harness`, `bbot`, and `contractkit` repositories are private.

Project entries audited against their live URLs and GitHub state:

- **Dead links removed.** `artie-resume-tailoring.fly.dev` no longer resolves at all, and `idx-app`'s Streamlit deployment now 303s to a login wall, so neither is a demo a visitor can open. Both `url` fields are now `null`; `projects.html` guards the link row on `linksList.length`, so each card keeps its GitHub button and drops the "Live demo" one.
- **Duplicate links removed.** `diginetica-ecomm`, `ecommerce-intent`, and `portfolio-editor` each had `url` set to the same GitHub URL as `repo`, which rendered two buttons pointing at the same page. `url` is now `null` on all three.
- **portfolio-editor has no links at all now.** The `portfolio_editor` repo is private, so the "View on GitHub" button was a 404 for everyone but the owner; `repo` is `null` until the repo is made public. Verified the card still expands cleanly with description and skills and no empty link row.
- **Blurbs refreshed.** `ca-real-estate` now states the current model result (7.74% MdAPE on 200K+ CRMLS listings, held across scheduled retrains) instead of the old "100K+ MLS rows / sub-8%". `ats-resume` leads with the GraphRAG + two-agent planner framing that matches the repo today, and its long description drops the Fly.io deployment claim and replaces "best-of-N with an early-exit quality bar" with the epsilon-greedy planner loop and composite reward (ATS fit, semantic similarity, faithfulness check against the graph).
- **`lastCommit` refreshed** on all eight projects from each repo's GitHub `pushed_at`. Not rendered anywhere — it is sync-pipeline metadata — but it was stale.
- Bumped the `site.js?v=` cache-bust from 11 to 12 across all four pages.
- Verified in Chromium: the five-bullet Agos card, the new blog paragraph, the link-less Portfolio Live Editor card, ARTie showing only "View on GitHub", and the refreshed ARTie blurb on the homepage tile. No console errors.

### Portfolio Live Editor removed; homepage hero updated

- **data/site.js:** deleted the `portfolio-editor` entry from `PROJECTS` (7 projects remain, 5 personal). The `portfolio_editor` repo is private, so the card had no working links; per the user it comes off the site entirely rather than sitting there link-less. `data/projects-auto.json` still carries a `portfolio_editor` row, which is harmless — `scripts/merge-projects.js` maps over the existing `PROJECTS` array and never adds entries, so an unmatched auto row is ignored.
- **Sync-proofed the cleared URLs.** `merge-projects.js` owns `url`, so the next `npm run sync` would have restored the dead fly.dev and Streamlit links. Added `"url"` to `lockedFields` on `ca-real-estate`, `diginetica-ecomm`, and `ecommerce-intent` (the first and third had no `lockedFields` key at all; `ats-resume` already locked it).
- **`PROFILE.shortBio`** — the homepage hero paragraph — now leads with the current role instead of the degree: "AI Engineer at **Agos**, building the deterministic kernels behind a voice agent, and an M.S. Data Science candidate at **UC San Diego** on a Math + Econ foundation. I build systems that can show their work — and the benchmarks that can prove them wrong."
- **index.html:** the Currently card's hardcoded "— Updated Apr 2026" stamp refreshed to "Aug 2026".
- Left `PROFILE.role` as "Data Scientist" — it sets the page `<title>` and the site's overall positioning, and the resume is still targeted at data science roles.
- Bumped the `site.js?v=` cache-bust from 12 to 13 across all four pages.
- Verified in Chromium: the new hero copy and timestamp, and the projects grid at 7 of 7 / Personal 5 with the Portfolio Live Editor card gone. No console errors.

### Agos copy recentred on memory layers + self-evolving agents

Every mention of Agos across the site now says the same two things — memory layers for agents, and building agents that evolve themselves — instead of enumerating kernels. All in `data/site.js` unless noted.

- **`PROFILE.shortBio`** (homepage hero): "AI Engineer at **Agos**, where I build memory layers for agents and work on agents that evolve themselves…"
- **`PROFILE.currently`**: "Agent memory systems at **Agos**" → "Agent memory & self-evolving agents at **Agos**".
- **`PROFILE.bio`** (About sidebar): the Agos paragraph now opens "my work centers on two things: the memory layer an agent reasons over — what it admits, what it keeps, and what it can prove it was told — and building agents that evolve themselves, along with the harnesses that measure whether that evolution is real."
- **`EXPERIENCES.agos`**: blurb rewritten to the same two-pillar framing. The bullets are still five but regrouped — two on memory (the kernel itself, then the LongMemEval lab that benchmarks it), two on self-evolution (the recursion harness, the evolution lab), and ContractKit reframed as the thing that keeps both honest. Dropped the context/property-kernel bullet, which was off-pillar. Skills chip "Knowledge graphs" → "Agent memory".
- **Blog post `joining-agos`**: opening line now names both areas; the "since then the work has widened" paragraph became "The second half of the work is self-evolution" and drops the context/property kernels; "The other half of the job is proving any of that" retitled to "Proving any of that is its own job" so there is only one "other half"; sign-off and blurb updated; tag "retrieval" → "self-evolving agents".

**index.html — Currently card separator.** `.currently-text` is a wrapping flex row and the `·` was its own flex item, so the longer Agos string pushed the separator onto the start of the second line as a stray leading dot. The separator is now rendered inside the preceding `.currently-line` span, so it always trails its own item and can never lead a wrapped line. Also refreshed the no-JS fallback markup, which still hardcoded the old "MS Data Science / Predictive modeling at IDX Exchange" pair in the old order.

- Bumped the `site.js?v=` cache-bust from 13 to 14 across all four pages.
- Verified in Chromium: the hero paragraph, the Currently card wrapping correctly, the About timeline card, and the blog post. No console errors.

### Graduation photo added to the hero reel

- **imgs/grad-photo.jpg:** converted from the 4.6 MB, 2513×1414 `grad_photo.png` in Downloads to a 1200×675 progressive JPEG at quality 86 (124 KB), in line with the other hero images.
- **data/site.js:** appended a fifth entry to `PROFILE.photos` — label "Graduation day", place "UC San Diego". It uses `"fit": "contain"` for the same reason the MLH × DigitalOcean shot does: the frame is 4:5 and this is a 16:9 group photo whose subjects span the full width, so a center crop would cut the outer two people out. Letterboxing is heavier here than on the MLH photo because the source is wider; cropping cannot fix that without losing people, since trimming the sky only makes the aspect more panoramic and leaves the subjects the same size at a width-constrained fit.
- Bumped the `site.js?v=` cache-bust from 14 to 15 across all four pages.
- Verified in Chromium: five dots in the indicator, the fifth slide renders letterboxed with everyone in frame, and the caption pair reads "Graduation day / UC San Diego". No console errors.

### Blog removed; bios rewritten for ML/DS; Agos recentred on process mining; offline-policy project added

- **Blog removed.** Deleted `blog.html`, the `blog` nav entry in `scripts/chrome.js`, the `POSTS` array in `data/site.js`, and the homepage "Latest post" band (markup, CSS, and script). `.strip` now carries its own bottom padding since the band that followed it is gone. The four posts remain in git history.
- **Agos recentred on visual process mining.** `EXPERIENCES.agos` blurb, bullets, and skills now describe the screen-recording process-mining benchmark (multimodal reconstruction scored under a six-way evidence-lane ablation, multi-agent synthetic ground truth, deterministic scoring harness) in the user's own wording. Memory-layer / self-evolution copy is gone from the site. `PROFILE.currently` and the no-JS fallback in `index.html` now read "Process mining from screen recordings at Agos"; the Currently stamp is "Sep 2026".
- **Bios rewritten.** `PROFILE.shortBio` (hero) and `PROFILE.bio` (About) drop the generic opener, the Math + Econ background, the side-project paragraph, the toolkit list, and the job-seeking close. Both now open with the role line and a broad scope — agentic frameworks, reinforcement learning, AI evaluation, and applied ML — and the About bio follows with one paragraph each on Agos and IDX.
- **IDX Exchange:** dropped the OpenClaw multi-agent assistant line from the experience blurb.
- **New project: Offline Policy Optimization for Chatbot Responses** (`offline-policy-optimization`, public repo). Contextual-bandit policy learning with IPS / SNIPS / doubly robust / FQE evaluation and a safety-gated action ranker. Personal category; description, blurb, url, and skills are locked against sync. Other unlisted repos were private or course/Agos work and were left off.
- Bumped the `site.js?v=` cache-bust from 15 to 16.
- Verified in Chromium: no Blog link in the nav, new hero and About copy, the three-bullet Agos card, and the new card on the projects page (8 projects). Only console errors are the pre-existing CORS failures from the Now widget's proxy on localhost.

### Dependabot alert #11 fixed (brace-expansion)

- **package-lock.json:** `npm audit fix` bumped the transitive dev dependency `brace-expansion` from 2.1.0 to 2.1.7 (via `elocuent` → `glob` → `minimatch`), clearing the high-severity DoS advisory (vulnerable `>=2.0.0 <2.1.2`). No `package.json` change; `npm audit` now reports 0 vulnerabilities. Nothing the live site loads is affected — this is a dev-only tooling dependency.
- **Lockfile catch-up:** the same `npm audit fix` run also added `@napi-rs/canvas` (0.1.100), `pdfjs-dist` (4.10.38), and `playwright` (1.63.0) to `package-lock.json`. All three were already declared as devDependencies in `package.json` but missing from the lockfile, so it had drifted; it now matches the manifest.
