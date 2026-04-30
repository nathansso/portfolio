import { fetchJSON, renderProjects } from '../global.js';

let allProjects = [];

async function loadProjects() {
    try {
        const projects = await fetchJSON('../lib/projects.json');
        projects.forEach(project => {
            if (!project.hasOwnProperty('url')) project.url = null;
        });
        const container = document.querySelector('.projects');
        if (projects && projects.length > 0) {
            renderProjects(projects, container, 'h2');
        } else {
            container.innerHTML = '<p>No projects found.</p>';
        }
        return projects;
    } catch (error) {
        console.error('Error loading projects:', error);
        return [];
    }
}

loadProjects().then(projects => {
    allProjects = projects;
});

document.querySelector('.searchBar').addEventListener('input', (event) => {
    const query = event.target.value.toLowerCase().trim();
    const container = document.querySelector('.projects');
    const results = query
        ? allProjects.filter(p => (p.skills || []).some(s => s.toLowerCase().includes(query)))
        : allProjects;
    renderProjects(results, container, 'h2');
});
