// Shared site chrome (nav + footer + theme toggle).
// Imported as ES module by every page. Uses the data layer.

import { PROFILE } from '../data/site.js?v=1';

const PAGES = [
  { id: 'home',      href: 'index.html',    label: 'Home' },
  { id: 'about',     href: 'about.html',    label: 'About' },
  { id: 'projects',  href: 'projects.html', label: 'Projects' },
  { id: 'resume',    href: 'resume.html',   label: 'Résumé', resume: true },
];

export function renderNav(currentId) {
  const links = PAGES.map(p => `
    <li>
      <a class="nav-link${p.resume ? ' is-resume' : ''}"
         href="${p.href}"
         ${p.id === currentId ? 'aria-current="page"' : ''}>
        ${p.label}
      </a>
    </li>
  `).join('');

  return `
    <nav class="nav" id="site-nav" aria-label="Primary">
      <div class="nav-inner">
        <a class="nav-mark" href="index.html" aria-label="Home">nso</a>
        <ul class="nav-links">${links}</ul>
        <div style="display:flex; gap: 8px; align-items:center;">
          <button class="theme-toggle" id="theme-toggle" aria-label="Toggle theme">
            <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
          </button>
          <button class="nav-toggle" id="nav-toggle" aria-label="Menu" aria-expanded="false">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
          </button>
        </div>
      </div>
    </nav>
  `;
}

export function renderFooter() {
  return `
    <footer class="footer">
      <div class="footer-inner">
        <div>© ${new Date().getFullYear()} ${PROFILE.name}</div>
        <div style="display:flex; gap: 24px;">
          <a href="mailto:${PROFILE.email}">Email</a>
          <a href="https://github.com/${PROFILE.github}" target="_blank" rel="noopener">GitHub</a>
          <a href="https://linkedin.com/in/${PROFILE.linkedin}" target="_blank" rel="noopener">LinkedIn</a>
        </div>
      </div>
    </footer>
  `;
}

export function mountChrome(currentId) {
  const navHost = document.getElementById('site-nav-host');
  const footHost = document.getElementById('site-footer-host');
  if (navHost) navHost.outerHTML = renderNav(currentId);
  if (footHost) footHost.outerHTML = renderFooter();

  // Theme handling
  const KEY = 'nso-theme';
  const stored = localStorage.getItem(KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = stored || (prefersDark ? 'dark' : 'light');
  document.documentElement.dataset.theme = initial;

  const tt = document.getElementById('theme-toggle');
  if (tt) tt.addEventListener('click', () => {
    const cur = document.documentElement.dataset.theme;
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem(KEY, next);
  });

  // Mobile nav toggle
  const nt = document.getElementById('nav-toggle');
  const nav = document.getElementById('site-nav');
  if (nt && nav) nt.addEventListener('click', () => {
    const open = nav.dataset.open === 'true';
    nav.dataset.open = String(!open);
    nt.setAttribute('aria-expanded', String(!open));
  });
}
