// ============================================================
//  gen-thumbs.js — automatic thumbnail generator
// ------------------------------------------------------------
//  Produces preview images for entries that have no manual
//  `image`, writing PNGs into imgs/auto/ and a manifest into
//  data/thumbs.js (id -> path). The site pages read that
//  manifest as the fallback thumbnail.
//
//   • Live sites (project `url`, reading `link`)   -> Playwright screenshot
//   • Papers / PDFs (reading type "paper", arXiv)  -> first-page render
//
//  Usage:
//    npm run thumbs                # generate only what's missing
//    npm run thumbs -- --force     # regenerate everything
//    npm run thumbs -- --dry-run   # print the work plan and exit
//
//  One-time setup (heavy dev deps, installed on demand):
//    npm install
//    npx playwright install chromium
// ============================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { PROJECTS, READING } from '../data/site.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT     = path.resolve(__dirname, '..');
const OUT_DIR  = path.join(ROOT, 'imgs', 'auto');
const MANIFEST = path.join(ROOT, 'data', 'thumbs.js');

const args  = process.argv.slice(2);
const FORCE = args.includes('--force');
const DRY   = args.includes('--dry-run') || args.includes('--plan');

// Card thumbs display at ~16:10 — shoot at that ratio so screenshots aren't cropped oddly.
const SITE_W = 1200, SITE_H = 750;
const PDF_W  = 1000; // render width for paper first pages (portrait; cover-cropped in the UI)

// ---------- URL helpers ----------
const isGithub  = (u) => /(^|\/\/)(www\.)?github\.com\//i.test(u);
const isPdfLike = (u) => /arxiv\.org\/(abs|pdf)\//i.test(u) || /\.pdf($|\?)/i.test(u);
function toPdfUrl(u) {
  const m = u.match(/arxiv\.org\/(?:abs|pdf)\/([\w.\/-]+?)(?:v\d+)?(?:\.pdf)?(?:$|[?#])/i);
  return m ? `https://arxiv.org/pdf/${m[1]}` : u;
}

// ---------- Build the work plan ----------
function plan() {
  const jobs = [];
  for (const p of PROJECTS) {
    if (p.image || !p.url || isGithub(p.url)) continue; // manual image wins; skip repo pages
    jobs.push(isPdfLike(p.url)
      ? { id: p.id, kind: 'pdf',  url: toPdfUrl(p.url), src: 'project' }
      : { id: p.id, kind: 'site', url: p.url,          src: 'project' });
  }
  for (const r of READING) {
    if (r.image || !r.link) continue;
    jobs.push((r.type === 'paper' || isPdfLike(r.link))
      ? { id: r.id, kind: 'pdf',  url: toPdfUrl(r.link), src: 'reading' }
      : { id: r.id, kind: 'site', url: r.link,           src: 'reading' });
  }
  return jobs;
}

// ---------- Renderers ----------
async function shootSite(browser, url, outPath) {
  const page = await browser.newPage({ viewport: { width: SITE_W, height: SITE_H } });
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
    await page.waitForTimeout(1500); // let late paint / fonts settle
    await page.screenshot({ path: outPath, clip: { x: 0, y: 0, width: SITE_W, height: SITE_H } });
  } finally {
    await page.close();
  }
}

async function shootPdf(url, outPath) {
  const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const { createCanvas } = await import('@napi-rs/canvas');

  // Point pdf.js at its bundled standard fonts, or Times/Helvetica glyphs render blank.
  const require = createRequire(import.meta.url);
  const pdfjsDir = path.dirname(require.resolve('pdfjs-dist/package.json'));
  const standardFontDataUrl = path.join(pdfjsDir, 'standard_fonts') + path.sep;

  const res = await fetch(url, { redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0 gen-thumbs' } });
  if (!res.ok) throw new Error(`fetch ${res.status}`);
  const data = new Uint8Array(await res.arrayBuffer());

  const doc  = await getDocument({ data, isEvalSupported: false, standardFontDataUrl }).promise;
  const page = await doc.getPage(1);
  const base = page.getViewport({ scale: 1 });
  const viewport = page.getViewport({ scale: PDF_W / base.width });

  const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: ctx, viewport, canvas }).promise;

  fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
  await doc.destroy();
}

// ---------- Manifest (always mirrors imgs/auto/) ----------
function writeManifest() {
  const files = fs.existsSync(OUT_DIR)
    ? fs.readdirSync(OUT_DIR).filter(f => f.toLowerCase().endsWith('.png'))
    : [];
  const map = {};
  for (const f of files.sort()) map[path.basename(f, path.extname(f))] = `imgs/auto/${f}`;

  const body = Object.entries(map)
    .map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)}`)
    .join(',\n');

  fs.writeFileSync(MANIFEST,
    '// AUTO-GENERATED by scripts/gen-thumbs.js — do not edit by hand.\n' +
    '// Maps an entry id -> its generated thumbnail path (relative to the site root).\n' +
    '// A manual `image` on the entry always wins; this is the fallback.\n' +
    '// Regenerate with: npm run thumbs\n' +
    `export const THUMBS = {${body ? '\n' + body + '\n' : ''}};\n`);
  return Object.keys(map).length;
}

// ---------- Main ----------
async function main() {
  const jobs = plan();
  console.log(`Planned ${jobs.length} thumbnail job(s):`);
  for (const j of jobs) console.log(`  [${j.kind.padEnd(4)}] ${j.id}  ←  ${j.url}`);
  if (DRY) return;

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const todo = jobs.filter(j => FORCE || !fs.existsSync(path.join(OUT_DIR, `${j.id}.png`)));
  const skipped = jobs.length - todo.length;
  if (skipped) console.log(`Skipping ${skipped} already-generated (use --force to redo).`);

  let browser = null;
  if (todo.some(j => j.kind === 'site')) {
    const { chromium } = await import('playwright');
    browser = await chromium.launch();
  }

  let ok = 0, fail = 0;
  for (const j of todo) {
    const out = path.join(OUT_DIR, `${j.id}.png`);
    try {
      if (j.kind === 'site') await shootSite(browser, j.url, out);
      else                   await shootPdf(j.url, out);
      console.log(`  ✓ ${j.id}`);
      ok++;
    } catch (e) {
      console.warn(`  ✗ ${j.id}: ${e.message}`);
      fail++;
    }
  }
  if (browser) await browser.close();

  const total = writeManifest();
  console.log(`\nDone. ${ok} generated, ${fail} failed, ${skipped} skipped. Manifest has ${total} entr${total === 1 ? 'y' : 'ies'}.`);
  console.log(`Wrote ${path.relative(ROOT, MANIFEST)} and imgs/auto/*.png — commit those to publish.`);
}

main().catch(e => { console.error(e); process.exit(1); });
