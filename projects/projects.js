import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

let selectedIndex = -1;
let filteredProjects = [];

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

        return projects;

    } catch (error) {
        console.error('Error loading projects:', error);
        return [];
    }
}

// Function to render the pie chart
function renderPieChart(projectsGiven) {
    const svg = d3.select('#projects-pie-plot');
    svg.selectAll('*').remove(); // Clear previous chart

    let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

    let rolledData = d3.rollups(
        projectsGiven,
        (v) => v.length,
        (d) => d.year,
    );

    let data = rolledData.map(([year, count]) => {
        return { value: count, label: year };
    });

    let sliceGenerator = d3.pie().value((d) => d.value);

    let arcData = sliceGenerator(data);

    let arcs = arcData.map((d) => arcGenerator(d));

    let colors = d3.scaleOrdinal(d3.schemeTableau10);

    arcs.forEach((arc, i) => {
        svg.append('path')
            .attr('d', arc)
            .attr('fill', colors(i))
            .attr('class', selectedIndex === i ? 'selected' : '')
            .on('click', () => {
                selectedIndex = selectedIndex === i ? -1 : i;
                renderPieChart(projectsGiven);
                filterProjectsByYear(projectsGiven, selectedIndex === -1 ? null : data[i].label);
            });
    });

    let legend = d3.select('.legend');
    legend.selectAll('*').remove(); // Clear previous legend
    data.forEach((d, idx) => {
        legend.append('li')
            .attr('class', `legend-item ${selectedIndex === idx ? 'selected' : ''}`)
            .attr('style', `--color: ${colors(idx)}`)
            .html(`<span class="swatch" style="background-color: ${colors(idx)}; border-radius: 50%;"></span> ${d.label} <em>(${d.value})</em>`)
            .on('click', () => {
                selectedIndex = selectedIndex === idx ? -1 : idx;
                renderPieChart(projectsGiven);
                filterProjectsByYear(projectsGiven, selectedIndex === -1 ? null : d.label);
            });
    });
}

function filterProjectsByYear(projects, year) {
    const projectsContainer = document.querySelector('.projects');
    if (year === null) {
        filteredProjects = projects;
        renderProjects(projects, projectsContainer, 'h2');
    } else {
        filteredProjects = projects.filter(project => project.year === year);
        renderProjects(filteredProjects, projectsContainer, 'h2');
    }
}

// Load projects when the page loads
let allProjects = [];
loadProjects().then(projects => {
    allProjects = projects;
    filteredProjects = projects;
    renderPieChart(projects);
});

let query = '';
let searchInput = document.querySelector('.searchBar');
searchInput.addEventListener('input', (event) => {
    query = event.target.value.toLowerCase();
    const searchFilteredProjects = filteredProjects.filter(project => 
        project.description.toLowerCase().includes(query) || 
        project.title.toLowerCase().includes(query)
    );
    const projectsContainer = document.querySelector('.projects');
    renderProjects(searchFilteredProjects, projectsContainer, 'h2');
    renderPieChart(searchFilteredProjects);
});

