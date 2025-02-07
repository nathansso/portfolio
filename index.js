import { fetchJSON, renderProjects } from './global.js';
import { fetchGitHubData } from './global.js';

async function loadProjects() {
    try {
        const projects = await fetchJSON('https://nathansso.github.io/portfolio/lib/projects.json');

        if (!Array.isArray(projects) || projects.length === 0) {
            console.error("No projects found.");
            return;
        }

        const latestProjects = projects.slice(0, 3);
        const projectsContainer = document.querySelector('.projects');

        if (!projectsContainer) {
            console.error("Projects container not found.");
            return;
        }

        renderProjects(latestProjects, projectsContainer, 'h2');
    } catch (error) {
        console.error("Error loading projects:", error);
    }
}

// Load projects when the page loads
loadProjects();

async function loadGitHubProfile() {
    try {
        const profile = await fetchGitHubData('nathansso');
        const profileStats = document.getElementById('profile-stats');

        if (!profileStats) {
            console.error("Profile stats container not found.");
            return;
        }

        profileStats.innerHTML = `
            <p>Public Repos: ${profile.public_repos}</p>
            <p>Followers: ${profile.followers}</p>
            <p>Following: ${profile.following}</p>
        `;
    } catch (error) {
        console.error("Error loading GitHub profile:", error);
    }
}

// Load GitHub profile data when the page loads
loadGitHubProfile();
