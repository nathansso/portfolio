import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

// Global variables
let data = [];
let commits = [];
let xScale, yScale;

// Load CSV data and call displayStats once ready
async function loadData() {
  try {
    data = await d3.csv('https://nathansso.github.io/portfolio/meta/loc.csv', (row) => ({
      ...row,
      line: +row.line,
      depth: +row.depth,
      length: +row.length, // line length in characters
      date: new Date(row.date + 'T00:00' + row.timezone),
      datetime: new Date(row.datetime)
    }));

    // Once data is loaded, display the stats
    displayStats();
    createScatterplot();
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

    // Add hidden property 'lines'
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

function displayStats() {
  // Process commits first
  processCommits();

  // Select the container (the div with id "stats") and clear any previous content
  const statsContainer = d3.select('#stats').html('');

  // Create the <dl> container with our custom class for styling
  const dl = statsContainer.append('dl')
    .attr('class', 'stats');

  // Cache results of expensive operations
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

  // Batch DOM updates
  const stats = [
    { title: 'Lines of Code', value: data.length },
    { title: 'Commits', value: commits.length },
    { title: 'Average Line Length', value: avgLineLength.toFixed(2) + ' characters' },
    { title: 'Longest Line', value: `Line ${longestLine.line} in ${longestLine.file} with ${longestLine.length} characters` },
    { title: 'Maximum Depth', value: maxDepth },
    { title: 'Number of Files', value: numFiles },
    { title: 'Number of days worked on site', value: numDays },
    { title: 'Average file length', value: avgFileLength.toFixed(2) + ' lines' },
    { title: 'Average file depth', value: avgFileDepth.toFixed(2) },
    { title: 'Longest file (by lines)', value: `${longestFileEntry[0]} with ${longestFileEntry[1]} lines` },
    { title: 'Busiest period', value: `${busiestPeriod[0]} with ${busiestPeriod[1]} entries` },
    { title: 'Busiest day of week', value: `${busiestWeekday[0]} with ${busiestWeekday[1]} entries` }
  ];

  stats.forEach(stat => addStat(dl, stat.title, stat.value));
}

function createScatterplot() {
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

  const svg = d3
    .select('#chart')
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .style('overflow', 'visible');

  xScale = d3
    .scaleTime()
    .domain(d3.extent(commits, (d) => d.datetime))
    .range([0, width])
    .nice();

  yScale = d3.scaleLinear().domain([0, 24]).range([height, 0]);

  xScale.range([usableArea.left, usableArea.right]);
  yScale.range([usableArea.bottom, usableArea.top]);

  const [minLines, maxLines] = d3.extent(commits, (d) => d.totalLines);

  const rScale = d3
    .scaleSqrt()
    .domain([minLines, maxLines])
    .range([5, 15]); // adjust these values based on your experimentation

  const dots = svg.append('g').attr('class', 'dots');

  // Add gridlines BEFORE the axes
  const gridlines = svg
    .append('g')
    .attr('class', 'gridlines')
    .attr('transform', `translate(${usableArea.left}, 0)`);

  // Create gridlines as an axis with no labels and full-width ticks
  gridlines.call(d3.axisLeft(yScale).tickFormat('').tickSize(-usableArea.width));

  // Define a color scale for the gridlines: blue at night, orange at midday.
  // Here, 0 and 24 (night hours) are blue, and 12 (noon) is orange.
  const gridColorScale = d3
    .scaleLinear()
    .domain([0, 12, 24])
    .range(["#1f77b4", "#ff7f0e", "#1f77b4"]);

  // Style each gridline using our color scale and reduce opacity for subtlety
  gridlines
    .selectAll('.tick line')
    .attr('stroke', (d) => gridColorScale(d))
    .attr('stroke-opacity', 0.5);

  // Create the axes
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3
    .axisLeft(yScale)
    .tickFormat((d) => String(d % 24).padStart(2, '0') + ':00');
  // Add X axis
  svg
    .append('g')
    .attr('transform', `translate(0, ${usableArea.bottom})`)
    .call(xAxis);

  // Add Y axis
  svg
    .append('g')
    .attr('transform', `translate(${usableArea.left}, 0)`)
    .call(yAxis);

  const sortedCommits = d3.sort(commits, (d) => -d.totalLines);

  dots
    .selectAll('circle')
    .data(sortedCommits)
    .join('circle')
    .attr('cx', (d) => xScale(d.datetime))
    .attr('cy', (d) => yScale(d.hourFrac))
    .attr('r', (d) => rScale(d.totalLines))
    .attr('fill', 'steelblue')
    .style('fill-opacity', 0.7) // Add transparency for overlapping dots
    .on('mouseenter', function (event, d) {
      d3.select(event.currentTarget).style('fill-opacity', 1); // Full opacity on hover
      updateTooltipContent(d);
      updateTooltipVisibility(true);
      updateTooltipPosition(event);
    })
    .on('mousemove', (event) => {
      updateTooltipPosition(event);
    })
    .on('mouseleave', function () {
      d3.select(event.currentTarget).style('fill-opacity', 0.7); // Restore transparency
      updateTooltipVisibility(false);
    });

  // Call the brush selector
  brushSelector(usableArea);

  // Raise dots and everything after overlay
  d3.select(svg.node()).selectAll('.dots, .overlay ~ *').raise();
}

function updateTooltipContent(commit) {
  const link = document.getElementById('commit-link');
  const date = document.getElementById('commit-date');
  const time = document.getElementById('commit-time');
  const author = document.getElementById('commit-author');
  const lines = document.getElementById('commit-lines');

  if (Object.keys(commit).length === 0){
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
  const svg = d3.select('svg');
  const brush = d3.brush()
  .extent([
      [usableArea.left, usableArea.top],
      [usableArea.right, usableArea.bottom]
    ])
    .on('start brush end', brushed);
  svg.call(brush);
}

let brushSelection = null;

function brushed(event) {
  brushSelection = event.selection;
  updateSelection();
  updateSelectionCount();
  updateLanguageBreakdown();
  }

function isCommitSelected(commit){
  if (!brushSelection)
     return false;
  const [[x0, y0], [x1, y1]] = brushSelection;
  const x = xScale(commit.datetime);
  const y = yScale(commit.hourFrac);
  return x >= Math.min(x0, x1) && x <= Math.max(x0, x1) &&
         y >= Math.min(y0, y1) && y <= Math.max(y0, y1);
}

function updateSelection(){
  d3.selectAll('circle')
    .style('fill-opacity', (d) => brushSelection ? (isCommitSelected(d) ? 1 : 0.1) : 0.7);
}

function updateSelectionCount(){
  const selectedCommits = brushSelection
  ? commits.filter(isCommitSelected)
  : [];

  const countElement = document.getElementById('selection-count');
  countElement.textContent = `${
    selectedCommits.length || 'No'
  } commits selected`;

  return selectedCommits;
}


function updateLanguageBreakdown() {
  const selectedCommits = brushSelection ? commits.filter(isCommitSelected) : [];
  const container = document.getElementById('language-breakdown');
  container.innerHTML = ''; // Clear existing content

  if (selectedCommits.length === 0) return;

  // Flatten lines from selected commits
  const lines = selectedCommits.flatMap(d => d.lines);
  const breakdown = d3.rollup(lines, v => v.length, d => d.type);

  // Append each language's stats
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

// Run loadData when the DOM is ready
document.addEventListener('DOMContentLoaded', loadData);



