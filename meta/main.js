import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

// Global variables
let data = [];
let commits = [];
let filteredCommits = [];
let selectedCommits = [];
let xScale, yScale;
let commitProgress = 100;
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
    data = await d3.csv('https://nathansso.github.io/portfolio/meta/loc.csv', (row) => ({
      ...row,
      line: +row.line,
      depth: +row.depth,
      length: +row.length, // line length in characters
      date: new Date(row.date + 'T00:00' + row.timezone),
      datetime: new Date(row.datetime)
    }));

    // Process commits and update summary stats
    displayStats();

    // Now that commits have been processed, set filteredCommits to all commits initially
    filteredCommits = commits;

    // Update the timeScale domain using all commits' datetime values
    timeScale.domain([d3.min(commits, d => d.datetime), d3.max(commits, d => d.datetime)]);
    commitMaxTime = timeScale.invert(commitProgress);

    // Update the UI's time display
    d3.select('#selectedTime').text(
      commitMaxTime.toLocaleString('en', { dateStyle: 'long', timeStyle: 'short' })
    );

    // Build the initial scatterplot using all commits (i.e. filteredCommits)
    updateScatterplot(filteredCommits);
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

// Update summary stats based on the filtered commits
function displayStats() {
  // Process commits first and then set filteredCommits to all commits initially
  processCommits();
  filteredCommits = commits;

  // Select the container (the div with id "stats") and clear any previous content
  const statsContainer = d3.select('#stats').html('');

  // Create the <dl> container with our custom class for styling
  const dl = statsContainer.append('dl')
    .attr('class', 'stats');

  // Compute stats (you can choose to use data for some metrics)
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

  // Batch DOM updates for stats; note we now use filteredCommits for commit count.
  const stats = [
    { title: 'Lines of Code', value: data.length },
    { title: 'Commits', value: filteredCommits.length },
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

// Updated scatterplot function that builds the chart using filteredCommits
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

  // Clear any existing svg
  d3.select('svg').remove();
  const svg = d3
    .select('#chart')
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .style('overflow', 'visible');

  // Use filteredCommits for the xScale domain
  xScale = d3
    .scaleTime()
    .domain(d3.extent(filteredCommits, d => d.datetime))
    .range([0, width])
    .nice();

  yScale = d3.scaleLinear().domain([0, 24]).range([height, 0]);

  xScale.range([usableArea.left, usableArea.right]);
  yScale.range([usableArea.bottom, usableArea.top]);

  // Use filteredCommits for rScale domain
  const [minLines, maxLines] = d3.extent(filteredCommits, d => d.totalLines);
  const rScale = d3
    .scaleSqrt()
    .domain([minLines, maxLines])
    .range([5, 15]);

  // Remove any existing groups from svg before re-drawing
  svg.selectAll('g').remove();
  const dots = svg.append('g').attr('class', 'dots');

  // Add gridlines BEFORE the axes
  const gridlines = svg
    .append('g')
    .attr('class', 'gridlines')
    .attr('transform', `translate(${usableArea.left}, 0)`);

  gridlines.call(d3.axisLeft(yScale).tickFormat('').tickSize(-usableArea.width));

  const gridColorScale = d3
    .scaleLinear()
    .domain([0, 12, 24])
    .range(["#1f77b4", "#ff7f0e", "#1f77b4"]);

  gridlines
    .selectAll('.tick line')
    .attr('stroke', d => gridColorScale(d))
    .attr('stroke-opacity', 0.5);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale).tickFormat(d => String(d % 24).padStart(2, '0') + ':00');

  svg
    .append('g')
    .attr('transform', `translate(0, ${usableArea.bottom})`)
    .call(xAxis);

  svg
    .append('g')
    .attr('transform', `translate(${usableArea.left}, 0)`)
    .call(yAxis);

  const sortedCommits = d3.sort(filteredCommits, d => -d.totalLines);

  dots.selectAll('circle')
    .data(sortedCommits)
    .join('circle')
    .attr('cx', d => xScale(d.datetime))
    .attr('cy', d => yScale(d.hourFrac))
    .transition()
      .duration(500)
      .attr('r', d => rScale(d.totalLines))
    .on('mouseenter', function (event, d) {
      d3.select(event.currentTarget).classed('selected', isCommitSelected(d));
      d3.select(event.currentTarget).style('fill-opacity', 1);
      updateTooltipContent(d);
      updateTooltipVisibility(true);
      updateTooltipPosition(event);
    })
    .on('mousemove', event => {
      updateTooltipPosition(event);
    })
    .on('mouseleave', function (event, d) {
      d3.select(event.currentTarget).classed('selected', isCommitSelected(d));
      d3.select(event.currentTarget).style('fill-opacity', 0.7);
      updateTooltipVisibility(false);
    });

  // Call the brush selector
  brushSelector(usableArea);

  d3.select(svg.node()).selectAll('.dots, .overlay ~ *').raise();
}

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
  const svg = d3.select('svg');
  const brush = d3.brush()
    .extent([
      [usableArea.left, usableArea.top],
      [usableArea.right, usableArea.bottom]
    ])
    .on('start brush end', brushed);
  svg.call(brush);
}

// Use filteredCommits in the brushed function
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

// Update time display and filter commits when slider changes
function updateTimeDisplay() {
  const timeSlider = document.getElementById('commit-progress');
  commitProgress = Number(timeSlider.value);
  commitMaxTime = timeScale.invert(commitProgress);
  d3.select('#selectedTime').text(
    commitMaxTime.toLocaleString('en', { dateStyle: 'long', timeStyle: 'short' })
  );
  filterCommitsByTime();
  updateScatterplot(filteredCommits);
}

// Run loadData when the DOM is ready and set slider event listener
document.addEventListener('DOMContentLoaded', loadData);
document.getElementById('commit-progress').addEventListener('input', updateTimeDisplay);


