import { fetchJSON, renderProjects, fetchGitHubData } from './global.js';

async function loadProjects() {
  try {
    // Use a relative path to fetch the JSON file
    const projects = await fetchJSON('lib/projects.json');
    const container = document.querySelector('.projects');
    
    if (projects?.length > 0) {
      // Show only first 3 projects
      const latestProjects = projects.slice(0, 3);
      renderProjects(latestProjects, container, 'h3');
    } else {
      container.innerHTML = '<p>Check back soon for new projects!</p>';
    }
  } catch (error) {
    console.error('Project load failed:', error);
    document.querySelector('.projects').innerHTML = `
      <p>Error loading projects. Please refresh the page.</p>
    `;
  }
}

async function loadGitHubStats() {
  try {
    const statsContainer = document.getElementById('profile-stats');
    const data = await fetchGitHubData('nathansso');
    
    if (data) {
      statsContainer.innerHTML = `
        <div class="github-stats">
          <p>Repositories: ${data.public_repos}</p>
          <p>Followers: ${data.followers}</p>
          <p>Following: ${data.following}</p>
        </div>
      `;
    }
  } catch (error) {
    console.error('GitHub stats error:', error);
    document.getElementById('profile-stats').innerHTML = `
      <p>GitHub stats currently unavailable</p>
    `;
  }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
  loadProjects();
  loadGitHubStats();
});
