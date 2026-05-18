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

## GitHub Project Board

The **Portfolio Improvements** project (number 1, owner `nathansso`) tracks all site work. Use these slash commands to manage it:

| Command | Usage | Purpose |
|---|---|---|
| `/projects` | `/projects` | Full board view grouped by status |
| `/ready` | `/ready` | Issues in Todo (ready to start) |
| `/issue` | `/issue 14` | Full details + board status for one issue |
| `/start` | `/start 14` | Move issue to In Progress |
| `/done` | `/done 14` | Move to Done and close the issue |
| `/new-issue` | `/new-issue Fix nav bug` | Create issue, add to board as Todo |

**Project IDs (for direct API use):**
- Project ID: `PVT_kwHOCpdM7s4BXZ3l`
- Status field ID: `PVTSSF_lAHOCpdM7s4BXZ3lzhSm69c`
- Todo: `f75ad846` | In Progress: `47fc9ee4` | Done: `98236657`

### When a new issue is created

1. Add it to the project board immediately.
2. Assess its dependencies against all open issues. Append a `## Dependencies` section to the issue body listing any blockers by number (e.g. `Blocked by #11`), or `None` if unblocked.
3. Re-evaluate the ordering of all Todo issues — issues with no blockers and whose unblocking would unblock others should be prioritized higher.

### Issue workflow (when starting work on an issue)

1. **Enter plan mode.** Draft a concrete implementation plan: which files change, what the approach is, and any open questions.
2. **Ask for feedback.** Present the plan and wait for the user's thoughts before writing any code. Revise until the plan is approved.
3. **Implement.** Exit plan mode and make the changes.
4. **Verify.** Serve the site locally and confirm the feature works in a browser. If a `tests/` file covers the behavior, run it.
5. **Confirm with the user.** Ask: "Issue #N is implemented — should I mark it as Done on the project board?"
6. **On confirmation:** run `/done N`, then re-evaluate remaining Todo issues for any that are newly unblocked and reorder accordingly.

### Routine dependency maintenance

After any issue moves to Done, scan all remaining Todo issues and update their `## Dependencies` sections to reflect what has been unblocked. Issues that become fully unblocked should be noted as ready to start.

---

## Progress Tracking

A `progress.md` file tracks all changes made in this project. **`progress.md` must be updated as part of every commit — never commit without it.**

Workflow:
1. Make code changes.
2. Append an entry to `progress.md` describing what changed and why.
3. Stage both the code changes and `progress.md` together and commit in a single commit.
4. Push to the remote branch.
5. Run `/compact` to keep conversation context manageable.

When a new feature is added, create a corresponding test in `tests/`.
