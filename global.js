console.log('NAVIGATION READY!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

const ARE_WE_HOME = document.documentElement.classList.contains('home');

// Updated pages configuration with directory-style paths
const pages = [
  { url: '', title: 'Home' },          // Home points to root
  { url: 'projects/', title: 'Projects' },
  { url: 'resume/', title: 'Resume' },
  { url: 'contact/', title: 'Contact' },
  { url: 'meta/', title: 'Meta' },
  { url: 'https://github.com/nathansso', title: 'GitHub', external: true }
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

// Contact form handling (unchanged)
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.contact-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    location.href = `${form.action}?${new URLSearchParams(data)}`;
  });
});

// JSON fetching helper
export async function fetchJSON(url) {
  try {
    console.log(`Fetching: ${url}`); // Add this line
    const response = await fetch(url);
    
    console.log('Response status:', response.status); // Add this
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    return await response.json();
  } catch (error) {
    console.error('Fetch failed for URL:', url, error);
    return null;
  }
}
// Project rendering function
export function renderProjects(projects, container, headingTag = 'h3') {
  container.innerHTML = projects.map(project => `
    <div class="project">
      <${headingTag}>${project.title}</${headingTag}>
      ${project.year ? `<p class="year">Year: ${project.year}</p>` : ''}
      ${project.image ? `<img src="${project.image}" alt="${project.title}" class="project-image">` : ''}
      <p>${project.description}</p>
      ${project.url ? `<a href="${project.url}" target="_blank">View Project</a>` : ''}
    </div>
  `).join('');
}

// GitHub data fetcher
export async function fetchGitHubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}