/**
 * "Now" activity widget — Last.fm · Steam · GitHub
 * All API calls go through the Cloudflare Worker proxy; no keys in client code.
 * Call initNowWidget() once on page load.
 */

// ─── Configuration ────────────────────────────────────────────────────────────
const CONFIG = {
  // Cloudflare Worker URL — set after deploying cloudflare-worker/now-proxy.js
  // e.g. 'https://now-proxy.YOUR_SUBDOMAIN.workers.dev'
  proxyUrl: 'https://now-proxy.noliversauce.workers.dev',
  pollMs:   30_000,  // 30 s — driven by Last.fm scrobble cadence
};

// ─── State ────────────────────────────────────────────────────────────────────
const S = {
  music:  { active: false, track: null, artist: null, artUrl: null },
  gaming: { active: false, game:  null, artUrl: null },
  coding: { active: false, repo:  null, pushedAt: null },
};

// ─── Entry point ──────────────────────────────────────────────────────────────
export function initNowWidget() {
  const widget = document.getElementById('now-widget');
  if (!widget) return;

  setupHover(widget);
  setupThemeObserver();

  if (CONFIG.proxyUrl) {
    fetchProxy();
    setInterval(fetchProxy, CONFIG.pollMs);
  }
}

// ─── Hover / touch expand ─────────────────────────────────────────────────────
function setupHover(widget) {
  const trigger = widget.querySelector('.now-trigger');

  function setExpanded(val) {
    if (val) {
      widget.setAttribute('data-expanded', '');
      trigger.setAttribute('aria-expanded', 'true');
    } else {
      widget.removeAttribute('data-expanded');
      trigger.setAttribute('aria-expanded', 'false');
    }
  }

  // All devices: click trigger toggles panel
  trigger.addEventListener('click', () => setExpanded(!widget.hasAttribute('data-expanded')));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && widget.hasAttribute('data-expanded')) {
      setExpanded(false);
      trigger.focus();
    }
  });

  document.addEventListener('click', (e) => {
    if (widget.hasAttribute('data-expanded') && !widget.contains(e.target)) {
      setExpanded(false);
    }
  });
}

// ─── Theme change → re-resolve accent color ───────────────────────────────────
function setupThemeObserver() {
  new MutationObserver(() => {
    const widget = document.getElementById('now-widget');
    if (widget) setWidgetState(widget, widget.dataset.nowState || 'idle');
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}

// ─── Proxy fetch (all three sources in one request) ───────────────────────────
async function fetchProxy() {
  try {
    const res  = await fetch(CONFIG.proxyUrl);
    if (!res.ok) throw new Error(`proxy ${res.status}`);
    const json = await res.json();

    if (json.music) {
      S.music = {
        active: json.music.active  ?? false,
        track:  json.music.track   ?? null,
        artist: json.music.artist  ?? null,
        artUrl: json.music.artUrl  ?? null,
      };
    }
    if (json.steam) {
      S.gaming = {
        active: json.steam.active  ?? false,
        game:   json.steam.game    ?? null,
        artUrl: json.steam.artUrl  ?? null,
      };
    }
    if (json.github) {
      S.coding = {
        active:   json.github.active    ?? false,
        repo:     json.github.repo      ?? null,
        pushedAt: json.github.pushedAt  ? new Date(json.github.pushedAt) : null,
      };
    }
  } catch (err) {
    console.debug('[now] proxy:', err.message);
  }
  updateDOM();
}

// ─── DOM updates ──────────────────────────────────────────────────────────────
function updateDOM() {
  const widget = document.getElementById('now-widget');
  if (!widget) return;

  const dominant = S.gaming.active ? 'gaming'
                 : S.music.active  ? 'music'
                 : S.coding.active ? 'coding'
                 : 'idle';

  setWidgetState(widget, dominant);
  updateMusicRow();
  updateGamingRow();
  updateCodingRow();
  updateArt(widget, dominant);
  updateFooter();
}

function setWidgetState(widget, state) {
  widget.dataset.nowState = state;
  widget.style.setProperty('--now-accent', resolveAccent(state));
}

function resolveAccent(state) {
  const s = getComputedStyle(document.documentElement);
  switch (state) {
    case 'gaming': return s.getPropertyValue('--cat-internship').trim();
    case 'coding': return s.getPropertyValue('--cat-research').trim();
    case 'idle':   return s.getPropertyValue('--ink-faint').trim();
    default:       return s.getPropertyValue('--accent').trim(); // music
  }
}

function updateMusicRow() {
  const row    = document.getElementById('now-row-music');
  const label  = row?.querySelector('.now-row-label');
  const track  = document.getElementById('now-music-track');
  const artist = document.getElementById('now-music-artist');
  if (!row) return;

  row.dataset.active    = String(S.music.active);
  track.textContent     = S.music.track  ?? '—';
  artist.textContent    = S.music.artist ?? '';
  if (label) label.textContent = S.music.active ? 'music' : 'last heard';
}

function updateGamingRow() {
  const row   = document.getElementById('now-row-gaming');
  const label = row?.querySelector('.now-row-label');
  const name  = document.getElementById('now-game-name');
  if (!row) return;

  row.dataset.active = String(S.gaming.active);
  name.textContent   = S.gaming.game ?? '—';
  if (label) label.textContent = S.gaming.active ? 'gaming' : 'last played';
}

function updateCodingRow() {
  const row  = document.getElementById('now-row-coding');
  const repo = document.getElementById('now-repo-name');
  const desc = document.getElementById('now-repo-desc');
  if (!row) return;

  row.dataset.active = String(S.coding.active);
  if (S.coding.active && S.coding.repo) {
    repo.textContent = S.coding.repo;
    desc.textContent = S.coding.pushedAt ? `pushed ${relativeTime(S.coding.pushedAt)}` : '';
  } else {
    repo.textContent = '—';
    desc.textContent = '';
  }
}

function updateArt(widget, dominant) {
  const artEl  = widget.querySelector('.now-art');
  const artImg = widget.querySelector('.now-art-img');
  if (!artEl || !artImg) return;

  const src = dominant === 'music'  ? S.music.artUrl
            : dominant === 'gaming' ? S.gaming.artUrl
            : null;

  if (src && artImg.getAttribute('data-src') !== src) {
    artImg.setAttribute('data-src', src);
    artImg.src   = src;
    artImg.onerror = () => { artEl.style.display = 'none'; };
    artImg.onload  = () => { artEl.style.display = ''; };
    artEl.style.display = '';
  } else if (!src) {
    artEl.style.display = 'none';
  }
}

function updateFooter() {
  const el = document.getElementById('now-updated');
  if (el) el.textContent = `updated ${relativeTime(new Date())}`;
}

// ─── Utilities ────────────────────────────────────────────────────────────────
function relativeTime(date) {
  const sec = Math.floor((Date.now() - date) / 1000);
  if (sec < 5)    return 'just now';
  if (sec < 60)   return `${sec}s ago`;
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  return `${Math.floor(sec / 3600)}h ago`;
}
