import 'dotenv/config';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECTS_PATH = resolve(__dirname, '../lib/projects.json');
const GITHUB_USERNAME = 'nathansso';
const TOKEN = process.env.GITHUB_TOKEN;

const PLACEHOLDER_IMAGE = 'https://vis-society.github.io/labs/2/images/empty.svg';

function githubHeaders() {
  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`;
  return headers;
}

async function githubFetch(endpoint) {
  const res = await fetch(`https://api.github.com${endpoint}`, { headers: githubHeaders() });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub API ${res.status} for ${endpoint}`);
  return res.json();
}

async function getReadmeSummary(repoName) {
  const data = await githubFetch(`/repos/${GITHUB_USERNAME}/${repoName}/readme`);
  if (!data) return null;

  const raw = Buffer.from(data.content, 'base64').toString('utf-8');
  const summary = raw
    .replace(/\[!\[.*?\]\(.*?\)\]\(.*?\)/g, '')       // badge links
    .replace(/!\[.*?\]\(.*?\)/g, '')                    // images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')            // links → text
    .replace(/^#+\s+.*/gm, '')                          // headings
    .replace(/^[-*_]{3,}$/gm, '')                       // horizontal rules
    .replace(/```[\s\S]*?```/g, '')                     // fenced code blocks
    .replace(/`[^`]+`/g, '')                            // inline code
    .replace(/[*_]{1,2}([^*_\n]+)[*_]{1,2}/g, '$1')   // bold/italic
    .replace(/^>\s+/gm, '')                             // blockquotes
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 25)
    .slice(0, 5)
    .join(' ')
    .replace(/\s{2,}/g, ' ')
    .slice(0, 500)
    .trim();

  return summary || null;
}

async function fetchAllRepos() {
  // /user/repos requires authentication and returns both public and private repos.
  // Falls back to /users/{name}/repos (public only) when no token is set.
  const endpoint = TOKEN
    ? `/user/repos?per_page=100&sort=updated&affiliation=owner`
    : `/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`;

  let page = 1;
  const all = [];
  while (true) {
    const batch = await githubFetch(`${endpoint}&page=${page}`);
    if (!batch || batch.length === 0) break;
    all.push(...batch);
    if (batch.length < 100) break;
    page++;
  }
  return all;
}

function toTitleCase(str) {
  return str.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

async function main() {
  if (!TOKEN) {
    console.warn('Warning: GITHUB_TOKEN not set — only public repos will be fetched and rate limit is 60 req/hour.');
    console.warn('Add a token with "repo" scope to .env to include private repos.');
  }

  const projects = JSON.parse(readFileSync(PROJECTS_PATH, 'utf-8'));
  const repos = await fetchAllRepos();
  console.log(`Found ${repos.length} public repos for ${GITHUB_USERNAME}`);

  const repoMap = Object.fromEntries(repos.map(r => [r.name, r]));

  // Index existing projects by their repo field
  const byRepo = {};
  projects.forEach((p, i) => { if (p.repo) byRepo[p.repo] = i; });

  let changed = 0;

  // --- Update projects that already have a repo field ---
  for (const [repoName, idx] of Object.entries(byRepo)) {
    const repo = repoMap[repoName];
    if (!repo) {
      console.warn(`  Repo "${repoName}" not found on GitHub — skipping`);
      continue;
    }

    const proj = projects[idx];
    process.stdout.write(`Syncing "${proj.title}" from ${repoName}...`);

    const summary = await getReadmeSummary(repoName);
    const newDesc = summary || repo.description || proj.description;
    const newUrl = repo.homepage || proj.url || `https://github.com/${GITHUB_USERNAME}/${repoName}`;

    proj.description = newDesc;
    proj.url = newUrl || null;
    changed++;
    console.log(' done');
  }

  // --- Add new repos not yet in projects.json ---
  const knownRepos = new Set(Object.keys(byRepo));
  for (const repo of repos) {
    if (repo.fork) continue;
    if (knownRepos.has(repo.name)) continue;
    if (!repo.description && !repo.homepage) continue;

    process.stdout.write(`Adding new repo "${repo.name}"...`);
    const summary = await getReadmeSummary(repo.name);
    const description = summary || repo.description;
    if (!description) { console.log(' skipped (no description)'); continue; }

    projects.push({
      title: toTitleCase(repo.name),
      year: new Date(repo.created_at).getFullYear(),
      image: PLACEHOLDER_IMAGE,
      description,
      url: repo.homepage || `https://github.com/${GITHUB_USERNAME}/${repo.name}`,
      repo: repo.name,
    });
    changed++;
    console.log(' done');
  }

  if (changed > 0) {
    writeFileSync(PROJECTS_PATH, JSON.stringify(projects, null, 4));
    console.log(`\nWrote ${changed} change(s) to lib/projects.json`);
  } else {
    console.log('\nNo changes.');
  }
}

main().catch(err => { console.error(err.message); process.exit(1); });
