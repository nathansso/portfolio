console.log('NAVIGATION READY!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

const ARE_WE_HOME = document.documentElement.classList.contains('home');

// Updated pages configuration with directory-style paths
const pages = [
  { url: '', title: 'Home' },
  { url: 'projects/', title: 'Projects' },
  { url: 'resume/', title: 'Resume' },
];

// Create navigation element
const nav = document.createElement('nav');
document.body.prepend(nav);

// Generate navigation links
pages.forEach(p => {
  const a = document.createElement('a');
  let urlPath = p.url;
  
  // Handle external links differently
  if (!p.external) {
    // Adjust paths based on current location
    if (!ARE_WE_HOME) {
      urlPath = p.url === '' ? '../index.html' : `../${p.url}`;
    } else {
      urlPath = p.url === '' ? 'index.html' : p.url;
    }
  }

  a.href = urlPath;
  a.textContent = p.title;
  
  // Add external link attributes
  if (p.external) {
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  }

  // Add current page indicator
  a.classList.toggle(
    'current',
    !p.external && 
    window.location.pathname.endsWith(urlPath.replace('../', ''))
  );

  nav.appendChild(a);
});

// Color scheme selector (unchanged)
document.body.insertAdjacentHTML(
  'afterbegin',
  `<label class="color-scheme">
    Theme:
    <select>
      <option value="light dark">Automatic</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </label>`
);

// Color scheme logic (unchanged)
const select = document.querySelector('.color-scheme select');

function updateColorScheme(scheme) {
  document.documentElement.style.setProperty('color-scheme', scheme);
  localStorage.colorScheme = scheme;
}

function updateAutomaticText() {
  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const automaticOption = select.querySelector('option[value="light dark"]');
  automaticOption.textContent = `Automatic (${isDarkMode ? 'Dark' : 'Light'})`;
}

select.addEventListener('input', (e) => updateColorScheme(e.target.value));
window.matchMedia('(prefers-color-scheme: dark)').addListener(updateAutomaticText);

if (localStorage.colorScheme) {
  updateColorScheme(localStorage.colorScheme);
  select.value = localStorage.colorScheme;
} else {
  updateColorScheme("light dark");
}

// JSON fetching helper
export async function fetchJSON(url) {
  try {
    console.log(`Fetching: ${url}`);
    const response = await fetch(url);
    
    console.log('Response status:', response.status);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    return await response.json();
  } catch (error) {
    console.error('Fetch failed for URL:', url, error);
    return null;
  }
}

const GITHUB_USERNAME = 'nathansso';

export function renderProjects(projects, container, headingTag) {
  const pathPrefix = document.documentElement.classList.contains('home') ? '' : '../';

  const githubIcon = `<svg class="github-icon" viewBox="0 0 16 16" aria-hidden="true" fill="currentColor">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
      0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13
      -.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66
      .07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15
      -.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27
      .68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12
      .51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48
      0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8
      c0-4.42-3.58-8-8-8z"/>
  </svg>`;

  container.innerHTML = projects.map(project => {
    const repoUrl = project.repo
      ? `https://github.com/${GITHUB_USERNAME}/${project.repo}`
      : null;
    const projectUrl = project.url?.replace(/\.git$/, '') || null;
    const showProjectUrl = projectUrl && projectUrl !== repoUrl;

    const links = [];
    if (showProjectUrl) {
      links.push(`<a href="${projectUrl}" target="_blank" rel="noopener noreferrer" class="project-link-url">View Project</a>`);
    }
    if (repoUrl) {
      links.push(`<a href="${repoUrl}" target="_blank" rel="noopener noreferrer" class="project-link-github" aria-label="GitHub repository">${githubIcon} GitHub</a>`);
    }

    const linksHtml = links.length
      ? `<div class="project-links">${links.join('')}</div>`
      : '';

    const skills = project.skills || [];
    let skillsHtml = '';
    if (skills.length) {
      const visible = skills.slice(0, 5);
      const hidden = skills.slice(5);
      const visiblePills = visible.map(s => `<span class="skill-pill">#${s}</span>`).join('');
      const hiddenPills = hidden.map(s => `<span class="skill-pill skill-pill--hidden">#${s}</span>`).join('');
      const expandBtn = hidden.length
        ? `<button class="skill-expand-btn">+${hidden.length} skills</button>`
        : '';
      skillsHtml = `<div class="skill-pills">${visiblePills}${hiddenPills}${expandBtn}</div>`;
    }

    let dateHtml = '';
    if (project.lastCommit) {
      const [y, m] = project.lastCommit.split('-').map(Number);
      const label = new Date(y, m - 1).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      dateHtml = `<time class="project-date" datetime="${project.lastCommit}">${label}</time>`;
    }

    return `
      <div class="project">
        <${headingTag}>${project.title}</${headingTag}>
        ${dateHtml}
        <img src="${pathPrefix}${project.image}"
             alt="${project.title}"
             class="project-image"
             onerror="this.style.display='none'">
        <p>${project.description}</p>
        ${linksHtml}
        ${skillsHtml}
      </div>`;
  }).join('');
}

document.addEventListener('click', (e) => {
  const btn = e.target.closest('.skill-expand-btn');
  if (!btn) return;
  const pills = btn.closest('.skill-pills');
  if (btn.classList.contains('skill-collapse-btn')) {
    Array.from(pills.querySelectorAll('.skill-pill')).slice(5).forEach(p => p.classList.add('skill-pill--hidden'));
    btn.textContent = `+${pills.querySelectorAll('.skill-pill--hidden').length} skills`;
    btn.classList.remove('skill-collapse-btn');
  } else {
    pills.querySelectorAll('.skill-pill--hidden').forEach(p => p.classList.remove('skill-pill--hidden'));
    btn.textContent = 'show less';
    btn.classList.add('skill-collapse-btn');
  }
});

// GitHub data fetcher
export async function fetchGitHubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}
