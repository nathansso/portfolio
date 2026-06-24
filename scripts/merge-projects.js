#!/usr/bin/env node
/**
 * Merges auto-synced project data (data/projects-auto.json) into the
 * PROJECTS array in data/site.js, updating only the fields that the
 * sync pipeline owns: description, skills, url, lastCommit.
 *
 * Editorial fields (id, category, experienceId, blurb, course, date, image)
 * are never touched.
 *
 * A project may pin any auto-owned field by listing it in a "lockedFields"
 * array (e.g. "lockedFields": ["description", "skills"]); locked fields keep
 * their hand-curated value in site.js and are never overwritten by the sync.
 *
 * Matching is done by repo name — handles both string and array repo values.
 *
 * Usage:
 *   node scripts/merge-projects.js
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const AUTO_PATH = resolve(ROOT, 'data/projects-auto.json');
const SITE_PATH = resolve(ROOT, 'data/site.js');
const START_MARKER = '// PROJECTS_AUTO_START';
const END_MARKER = '// PROJECTS_AUTO_END';
const AUTO_FIELDS = ['description', 'skills', 'url', 'lastCommit'];

async function main() {
  if (!existsSync(AUTO_PATH)) {
    console.log('data/projects-auto.json not found — nothing to merge.');
    process.exit(0);
  }

  const auto = JSON.parse(readFileSync(AUTO_PATH, 'utf-8'));

  // Build lookup: repo name → auto entry (handles array or string repo field)
  const autoByRepo = {};
  for (const entry of auto) {
    const repos = Array.isArray(entry.repo) ? entry.repo : entry.repo ? [entry.repo] : [];
    for (const r of repos) autoByRepo[r] = entry;
  }

  // Dynamic-import site.js to get the live PROJECTS array
  const siteUrl = pathToFileURL(SITE_PATH).href + '?ts=' + Date.now();
  const { PROJECTS } = await import(siteUrl);

  let mergedCount = 0;
  const merged = PROJECTS.map(p => {
    const repos = Array.isArray(p.repo) ? p.repo : p.repo ? [p.repo] : [];
    const autoEntry = repos.map(r => autoByRepo[r]).find(Boolean);
    if (!autoEntry) return p;

    const locked = new Set(Array.isArray(p.lockedFields) ? p.lockedFields : []);
    const updated = { ...p };
    for (const field of AUTO_FIELDS) {
      if (locked.has(field)) continue;
      if (autoEntry[field] !== undefined && autoEntry[field] !== null) {
        updated[field] = autoEntry[field];
      }
    }
    mergedCount++;
    return updated;
  });

  // Replace PROJECTS content between markers in site.js
  const src = readFileSync(SITE_PATH, 'utf-8');
  const startIdx = src.indexOf(START_MARKER);
  const endIdx = src.indexOf(END_MARKER);
  if (startIdx === -1 || endIdx === -1) {
    console.error('PROJECTS_AUTO_START / PROJECTS_AUTO_END markers not found in data/site.js');
    process.exit(1);
  }

  const before = src.slice(0, startIdx + START_MARKER.length);
  const after = src.slice(endIdx);
  const newSrc = `${before}\nexport const PROJECTS = ${JSON.stringify(merged, null, 2)};\n${after}`;

  writeFileSync(SITE_PATH, newSrc, 'utf-8');
  console.log(`Merged auto data into ${mergedCount} of ${PROJECTS.length} projects in data/site.js`);
}

main().catch(err => { console.error(err.message); process.exit(1); });
