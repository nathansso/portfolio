import { fetchJSON, renderProjects } from './global.js';
import { fetchGitHubData } from './global.js';

async function loadProjects() {
    try {
        const projects = await fetchJSON('../lib/projects.json');

        if (!Array.isArray(projects) || projects.length === 0) {
            console.error("No projects found or invalid data format.");
            return;
        }

        const latestProjects = projects.slice(0, 3);
        const projectsContainer = document.querySelector('.projects');

        if (!projectsContainer) {
            console.error("Error: .projects container not found.");
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
        const githubData = await fetchGitHubData('nathansso');

        if (!githubData) {
            console.error("Error: No GitHub data retrieved.");
            return;
        }

        const profileStats = document.querySelector('#profile-stats');

        if (!profileStats) {
            console.error("Error: #profile-stats element not found.");
            return;
        }

        profileStats.innerHTML = `
            <dl>
                <dt>Public Repos:</dt><dd>${githubData.public_repos ?? 'N/A'}</dd>
                <dt>Public Gists:</dt><dd>${githubData.public_gists ?? 'N/A'}</dd>
                <dt>Followers:</dt><dd>${githubData.followers ?? 'N/A'}</dd>
                <dt>Following:</dt><dd>${githubData.following ?? 'N/A'}</dd>
            </dl>
        `;
    } catch (error) {
        console.error("Error loading GitHub profile:", error);
    }
}

// Load GitHub profile data when the page loads
loadGitHubProfile();
