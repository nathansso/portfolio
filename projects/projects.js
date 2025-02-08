import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";


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

// SVG Pie Chart code
const svg = d3.select('#projects-pie-plot');

let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

let data = [1, 2, 3, 4, 5, 5];
let sliceGenerator = d3.pie();
let arcData = sliceGenerator(data);
let arcs = arcData.map((d) => arcGenerator(d));

let colors = d3.scaleOrdinal(d3.schemeTableau10);

arcs.forEach((arc,i) => {
    svg.append('path').attr('d', arc).attr('fill', colors(i));
  })