import { fetchJSON, renderProjects } from '../global.js';


async function loadProjects() {
    try {
        const projects = await fetchJSON('../lib/projects.json');

        const projectsContainer = document.querySelector('.projects');
        const titleContainer = document.querySelector('.projects-title');

        // Ensure titleContainer exists before updating it
        if (!titleContainer) {
            console.error("Error: .projects-title element not found.");
            return;
        }

        // Update the title with project count
        titleContainer.textContent = `${projects.length} Projects`;

        // Check if projects exist before rendering
        if (projects && Array.isArray(projects) && projects.length > 0) {
            renderProjects(projects, projectsContainer, 'h2');
        } else {
            projectsContainer.innerHTML = '<p>No projects found.</p>';
        }

    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

// Load projects when the page loads
loadProjects();
