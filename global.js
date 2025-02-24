console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

const ARE_WE_HOME = document.documentElement.classList.contains('home');

let pages = [
  { url: 'index.html', title: 'Home' },
  { url: 'projects/index.html', title: 'Projects' },
  { url: 'resume/index.html', title: 'Resume' },
  { url: 'contact/index.html', title: 'Contact' },
  { url: 'meta/index.html', title: 'Meta' },
  { url: 'https://github.com/nathansso', title: 'GitHub', external: true }
];

let nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
  let url = p.url;
  
  url = !ARE_WE_HOME && !url.startsWith('http') ? '../' + url : url;

  let a = document.createElement('a');
  a.href = url;
  a.textContent = p.title;
  
  if (p.external) {
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  }

  a.classList.toggle(
    'current',
    a.host === location.host && a.pathname === location.pathname
  );
  
  nav.append(a);
}

document.body.insertAdjacentHTML(
  'afterbegin',
  `
    <label class="color-scheme">
        Theme:
        <select>
      <option value="light dark">Automatic</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>		</select>
    </label>`
);

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

select.addEventListener('input', function (event) {
  updateColorScheme(event.target.value);
});

updateAutomaticText();
window.matchMedia('(prefers-color-scheme: dark)').addListener(updateAutomaticText);

if ("colorScheme" in localStorage) {
  updateColorScheme(localStorage.colorScheme);
  select.value = localStorage.colorScheme;
} else {
  updateColorScheme("light dark");
}

document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('.contact-form');
  
  form?.addEventListener('submit', function(event) {
      event.preventDefault();
      
      const data = new FormData(form);
      let url = form.action + '?';
      
      for (let [name, value] of data) {
          if (url.slice(-1) !== '?') {
              url += '&';
          }
          url += `${name}=${encodeURIComponent(value)}`;
      }
      
      location.href = url;
  });
});

export async function fetchJSON(url) {
  try {
    const response = await fetch(url);

    console.log(response);

    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}

export function renderProjects(projects, container, headingTag) {
    container.innerHTML = ''; // Clear previous content

    projects.forEach(project => {
        const projectElement = document.createElement('div');
        projectElement.className = 'project';

        const titleElement = document.createElement(headingTag);
        titleElement.textContent = project.title;
        projectElement.appendChild(titleElement);

        const yearElement = document.createElement('p');
        yearElement.textContent = `Year: ${project.year}`;
        projectElement.appendChild(yearElement);

        const imageElement = document.createElement('img');
        imageElement.src = project.image;
        imageElement.alt = project.title;
        imageElement.className = 'project-image'; // Add a class for styling
        projectElement.appendChild(imageElement);

        const descriptionElement = document.createElement('p');
        descriptionElement.textContent = project.description;
        projectElement.appendChild(descriptionElement);

        if (project.url) {
            const urlElement = document.createElement('a');
            urlElement.href = project.url;
            urlElement.textContent = 'View Project';
            urlElement.target = '_blank';
            projectElement.appendChild(urlElement);
        }

        container.appendChild(projectElement);
    });
}

export async function fetchGitHubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}
