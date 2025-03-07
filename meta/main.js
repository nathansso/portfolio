import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

// Global variables
let data = [];
let commits = [];
let filteredCommits = [];
let selectedCommits = [];
let xScale, yScale;
let commitProgress = 100;
// Ordinal scale for file type colors (using Tableau10 scheme)
let fileTypeColors = d3.scaleOrdinal(d3.schemeTableau10);
// Initialize timeScale with only the range; the domain will be set after commits are processed.
let timeScale = d3.scaleTime().range([0, 100]);
let commitMaxTime; // Will be computed later

// Filter commits by comparing commit.datetime with commitMaxTime
function filterCommitsByTime() {
  filteredCommits = commits.filter(commit => commit.datetime < commitMaxTime);
}

// Load CSV data and call displayStats once ready
async function loadData() {
  try {
    data = await d3.csv(
      'https://nathansso.github.io/portfolio/meta/loc.csv',
      (row) => ({
        ...row,
        line: +row.line,
        depth: +row.depth,
        length: +row.length, // line length in characters
        date: new Date(row.date + 'T00:00' + row.timezone),
        datetime: new Date(row.datetime)
      })
    );

    displayStats();
    filteredCommits = commits;
    timeScale.domain([d3.min(commits, d => d.datetime), d3.max(commits, d => d.datetime)]);
    commitMaxTime = timeScale.invert(commitProgress);
    d3.select('#selectedTime').text(
      commitMaxTime.toLocaleString('en', { dateStyle: 'long', timeStyle: 'short' })
    );
    // Create the SVG once and then update it on slider changes.
    initScatterplot();
    updateScatterplot(filteredCommits);
    updateFileDetails();
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

// Process commits and add a hidden 'lines' property
function processCommits() {
  commits = d3.groups(data, d => d.commit).map(([commit, lines]) => {
    const first = lines[0];
    const commitObj = {
      id: commit,
      url: `https://github.com/vis-society/lab-7/commit/${commit}`,
      author: first.author,
      date: first.date,
      time: first.time,
      timezone: first.timezone,
      datetime: first.datetime,
      hourFrac: first.datetime.getHours() + first.datetime.getMinutes() / 60,
      totalLines: lines.length
    };

    Object.defineProperty(commitObj, 'lines', {
      value: lines,
      writable: false,
      enumerable: false,
      configurable: false
    });

    return commitObj;
  });
}

// Create a helper to add a stat to our list
function addStat(dl, title, value) {
  dl.append('dt')
    .text(title)
    .attr('class', 'stat-title');
  dl.append('dd')
    .text(value)
    .attr('class', 'stat-value');
}

// Update summary stats based on the filtered commits
function displayStats() {
  processCommits();
  filteredCommits = commits;

  const statsContainer = d3.select('#stats').html('');
  const dl = statsContainer.append('dl').attr('class', 'stats');

  const avgLineLength = d3.mean(data, d => d.length);
  const longestLine = d3.greatest(data, d => d.length);
  const maxDepth = d3.max(data, d => d.depth);
  const numFiles = d3.group(data, d => d.file).size;
  const numDays = d3.group(data, d => d.date.toISOString().slice(0, 10)).size;
  const fileLengths = d3.rollups(data, v => v.length, d => d.file);
  const avgFileLength = d3.mean(fileLengths, d => d[1]);
  const fileDepths = d3.rollups(data, v => d3.max(v, d => d.depth), d => d.file);
  const avgFileDepth = d3.mean(fileDepths, d => d[1]);
  const longestFileEntry = d3.greatest(fileLengths, d => d[1]);
  const workByPeriod = d3.rollups(data, v => v.length, d =>
    d.datetime.toLocaleString('en', { dayPeriod: 'short' })
  );
  const busiestPeriod = d3.greatest(workByPeriod, d => d[1]);
  const workByWeekday = d3.rollups(data, v => v.length, d =>
    d.datetime.toLocaleString('en', { weekday: 'long' })
  );
  const busiestWeekday = d3.greatest(workByWeekday, d => d[1]);

  const stats = [
    { title: 'Lines of Code', value: data.length },
    { title: 'Number of Files', value: numFiles },
    { title: 'Number of days worked on site', value: numDays },
    { title: 'Busiest period', value: `${busiestPeriod[0]} with ${busiestPeriod[1]} entries` },
    { title: 'Busiest day of week', value: `${busiestWeekday[0]} with ${busiestWeekday[1]} entries` }
  ];

  stats.forEach(stat => addStat(dl, stat.title, stat.value));
}

/* ---------- Updated Scatterplot Functions ---------- */

// Initialize the SVG only once
function initScatterplot() {
  const width = 1000;
  const height = 600;
  const svg = d3.select('#chart').select('svg');
  if (svg.empty()) {
    d3.select('#chart')
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('overflow', 'visible')
      .append('g')
      .attr('class', 'plot-container');
  }
}

function updateScatterplot(filteredCommits) {
  const width = 1000;
  const height = 600;
  const margin = { top: 10, right: 10, bottom: 30, left: 20 };

  const usableArea = {
    top: margin.top,
    right: width - margin.right,
    bottom: height - margin.bottom,
    left: margin.left,
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom,
  };

  // Reuse the existing SVG and plot-container group.
  const svg = d3.select('#chart').select('svg');
  const container = svg.select('.plot-container');

  // Update scales
  xScale = d3.scaleTime()
    .domain(d3.extent(filteredCommits, d => d.datetime))
    .range([usableArea.left, usableArea.right])
    .nice();

  yScale = d3.scaleLinear().domain([0, 24])
    .range([usableArea.bottom, usableArea.top]);

  const [minLines, maxLines] = d3.extent(filteredCommits, d => d.totalLines);
  const rScale = d3.scaleSqrt()
    .domain([minLines, maxLines])
    .range([5, 15]);

  // Update gridlines and axes (create/update groups as needed)
  let grid = container.select('.gridlines');
  if (grid.empty()) {
    grid = container.append('g').attr('class', 'gridlines');
  }
  grid.attr('transform', `translate(${usableArea.left}, 0)`)
      .call(d3.axisLeft(yScale).tickFormat('').tickSize(-usableArea.width))
      .selectAll('.tick line')
      .attr('stroke', d3.scaleLinear().domain([0, 12, 24]).range(["#1f77b4", "#ff7f0e", "#1f77b4"]))
      .attr('stroke-opacity', 0.5);

  let xAxisG = container.select('.x-axis');
  if (xAxisG.empty()) {
    xAxisG = container.append('g').attr('class', 'x-axis');
  }
  xAxisG.attr('transform', `translate(0, ${usableArea.bottom})`)
        .call(d3.axisBottom(xScale));

  let yAxisG = container.select('.y-axis');
  if (yAxisG.empty()) {
    yAxisG = container.append('g').attr('class', 'y-axis');
  }
  yAxisG.attr('transform', `translate(${usableArea.left}, 0)`)
        .call(d3.axisLeft(yScale).tickFormat(d => String(d % 24).padStart(2, '0') + ':00'));

  // DATA JOIN for circles with key function (using commit id)
  const sortedCommits = d3.sort(filteredCommits, d => -d.totalLines);
  const circles = container.selectAll('circle')
    .data(sortedCommits, d => d.id);

  // EXIT: remove circles no longer needed
  circles.exit().remove();

  // ENTER: create new circles for new data points
  const circlesEnter = circles.enter()
    .append('circle')
    .attr('fill', 'steelblue')
    .attr('fill-opacity', 0.7)
    .attr('cx', d => xScale(d.datetime))
    .attr('cy', d => yScale(d.hourFrac))
    .attr('r', 0);

  // Merge enter and update selections
  circlesEnter.merge(circles)
    .on('mouseover', function (event, d) {
      d3.select(this).classed('selected', isCommitSelected(d));
      d3.select(this).style('fill-opacity', 1);
      updateTooltipContent(d);
      updateTooltipVisibility(true);
      updateTooltipPosition(event);
    })
    .on('mousemove', function (event) {
      updateTooltipPosition(event);
    })
    .on('mouseout', function (event, d) {
      d3.select(this).classed('selected', isCommitSelected(d));
      d3.select(this).style('fill-opacity', 0.7);
      updateTooltipVisibility(false);
    })
    .transition().duration(500)
    .attr('cx', d => xScale(d.datetime))
    .attr('cy', d => yScale(d.hourFrac))
    .attr('r', d => rScale(d.totalLines));

  brushSelector(usableArea);
  // Raise the dots layer
  container.selectAll('.dots, .overlay ~ *').raise();
}

/* ---------- Updated File Details with Sorting and Color by Technology ---------- */

function updateFileDetails() {
  // Obtain all lines from the filtered commits and group them by file
  let lines = filteredCommits.flatMap(d => d.lines);
  let files = d3.groups(lines, d => d.file)
    .map(([name, lines]) => ({ name, lines }));

  // Sort files by the number of lines (descending)
  files = d3.sort(files, d => -d.lines.length);

  // Clear previous file details
  d3.select('#files').selectAll('div').remove();

  // Bind data to file containers and create a new container for each file
  let filesContainer = d3.select('#files')
    .selectAll('div')
    .data(files)
    .enter()
    .append('div');

  // Append a <dt> element that includes both the file name (in <code>) 
  // and the total number of lines (in <small>) on a separate line.
  filesContainer.append('dt')
    .html(d => `<code>${d.name}</code><small>${d.lines.length} lines</small>`);

  // Append a <dd> element and within it, for each line in the file, add a <div class="line">
  // Each dot's background color is set using the fileTypeColors scale based on d.type.
  filesContainer.append('dd')
    .selectAll('div')
    .data(d => d.lines)
    .enter()
    .append('div')
    .attr('class', 'line')
    .style('background', d => fileTypeColors(d.type));
}

/* ---------- Remaining Functions ---------- */

function updateTooltipContent(commit) {
  const link = document.getElementById('commit-link');
  const date = document.getElementById('commit-date');
  const time = document.getElementById('commit-time');
  const author = document.getElementById('commit-author');
  const lines = document.getElementById('commit-lines');

  if (Object.keys(commit).length === 0) {
    link.textContent = '';
    date.textContent = '';
    time.textContent = '';
    author.textContent = '';
    lines.textContent = '';
    return;
  }

  link.href = commit.url;
  link.textContent = commit.id;
  date.textContent = commit.datetime.toLocaleDateString('en', { dateStyle: 'full' });
  time.textContent = commit.datetime.toLocaleTimeString('en', { timeStyle: 'short' });
  author.textContent = commit.author;
  lines.textContent = commit.totalLines;
}

function updateTooltipVisibility(isVisible) {
  const tooltip = document.getElementById('commit-tooltip');
  tooltip.style.visibility = isVisible ? 'visible' : 'hidden';
}

function updateTooltipPosition(event) {
  const tooltip = document.getElementById('commit-tooltip');
  tooltip.style.left = `${event.clientX + 10}px`;
  tooltip.style.top = `${event.clientY + 10}px`;
}

function brushSelector(usableArea) {
  const svg = d3.select('#chart').select('svg');
  const brush = d3.brush()
    .extent([[usableArea.left, usableArea.top], [usableArea.right, usableArea.bottom]])
    .on('start brush end', brushed);
  svg.call(brush);
}

function brushed(evt) {
  const selection = evt.selection;
  selectedCommits = !selection
    ? []
    : filteredCommits.filter(commit => {
        const min = { x: selection[0][0], y: selection[0][1] };
        const max = { x: selection[1][0], y: selection[1][1] };
        const x = xScale(commit.datetime);
        const y = yScale(commit.hourFrac);
        return x >= min.x && x <= max.x && y >= min.y && y <= max.y;
      });
  updateSelection();
  updateSelectionCount();
  updateLanguageBreakdown();
}

function isCommitSelected(commit) {
  return selectedCommits.includes(commit);
}

function updateSelection() {
  d3.selectAll('circle')
    .style('fill-opacity', d => filteredCommits.length ? (isCommitSelected(d) ? 1 : 0.1) : 0.7);
}

function updateSelectionCount() {
  const countElement = document.getElementById('selection-count');
  countElement.textContent = `${selectedCommits.length || 'No'} commits selected`;
  return selectedCommits;
}

function updateLanguageBreakdown() {
  const container = document.getElementById('language-breakdown');
  container.innerHTML = '';
  if (selectedCommits.length === 0) return;
  const lines = selectedCommits.flatMap(d => d.lines);
  const breakdown = d3.rollup(lines, v => v.length, d => d.type);
  breakdown.forEach((count, language) => {
    const dt = document.createElement('dt');
    dt.className = 'stat-title';
    dt.textContent = language;
    const dd = document.createElement('dd');
    dd.className = 'stat-value';
    const percent = d3.format('.1%')(count / lines.length);
    dd.textContent = `${count} lines (${percent})`;
    container.appendChild(dt);
    container.appendChild(dd);
  });
}

function updateTimeDisplay() {
  const timeSlider = document.getElementById('commit-progress');
  commitProgress = Number(timeSlider.value);
  commitMaxTime = timeScale.invert(commitProgress);
  d3.select('#selectedTime').text(
    commitMaxTime.toLocaleString('en', { dateStyle: 'long', timeStyle: 'short' })
  );
  filterCommitsByTime();
  updateScatterplot(filteredCommits);
  updateFileDetails();
}

document.addEventListener('DOMContentLoaded', loadData);
document.getElementById('commit-progress').addEventListener('input', updateTimeDisplay);
