import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

// Global variables
let data = [];
let commits = [];
let selectedCommits = [];
let currentVisibleCommits = [];
let xScale, yScale;
let fileTypeColors = d3.scaleOrdinal(d3.schemeTableau10);
let fileDataGlobal = [];  // Aggregated file data

// Container for commit narratives
const commitItemsContainer = d3.select('#items-container-commits');

/* ---------- Commit Narrative Functions (Unchanged) ---------- */
function renderItems() {
  commitItemsContainer.selectAll('div.item')
    .data(commits)
    .join('div')
    .attr('class', 'item')
    .html((d, i) => {
      const fileCount = d3.rollups(d.lines, v => v.length, d => d.file).length;
      return `<p>
        On ${d.datetime.toLocaleString("en", { dateStyle: "full", timeStyle: "short" })}, I made
        <a href="${d.url}" target="_blank">
          ${i > 0 ? 'another glorious commit' : 'my first commit, and it was glorious'}
        </a>. I edited ${d.totalLines} lines across ${fileCount} files.
      </p>`;
    });
}

function updateView() {
  const containerEl = document.getElementById('scroll-container-commits');
  const containerRect = containerEl.getBoundingClientRect();
  const visibleCommits = [];
  d3.selectAll('#items-container-commits .item').each(function(d) {
    const rect = this.getBoundingClientRect();
    if (rect.bottom >= containerRect.top && rect.top <= containerRect.bottom) {
      visibleCommits.push(d);
    }
  });
  currentVisibleCommits = visibleCommits;
  if (visibleCommits.length > 0) {
    const maxVisibleDatetime = d3.max(visibleCommits, d => d.datetime);
    const chartCommits = commits.filter(d => d.datetime <= maxVisibleDatetime);
    updateScatterplot(chartCommits);
    updateFileDetails(chartCommits); // (for commit summary, if needed)
  } else {
    updateScatterplot([]);
    updateFileDetails([]);
  }
}
document.getElementById('scroll-container-commits').addEventListener('scroll', updateView);

/* ---------- Scatterplot, Tooltip, and Brush Functions (Unchanged) ---------- */
function initScatterplot() {
  const width = 800;
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

function updateScatterplot(chartCommits) {
  const width = 800;
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

  const svg = d3.select('#chart').select('svg');
  const container = svg.select('.plot-container');

  xScale = d3.scaleTime()
    .domain(d3.extent(chartCommits, d => d.datetime))
    .range([usableArea.left, usableArea.right])
    .nice();
  yScale = d3.scaleLinear().domain([0, 24])
    .range([usableArea.bottom, usableArea.top]);

  const [minLines, maxLines] = d3.extent(chartCommits, d => d.totalLines);
  const rScale = d3.scaleSqrt()
    .domain([minLines, maxLines])
    .range([5, 15]);

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

  const sortedCommits = d3.sort(chartCommits, d => -d.totalLines);
  const circles = container.selectAll('circle')
    .data(sortedCommits, d => d.id);
  circles.exit().remove();
  const circlesEnter = circles.enter()
    .append('circle')
    .attr('fill', 'steelblue')
    .attr('fill-opacity', 0.7)
    .attr('cx', d => xScale(d.datetime))
    .attr('cy', d => yScale(d.hourFrac))
    .attr('r', 0);
  circlesEnter.merge(circles)
    .on('mouseover', function(event, d) {
      d3.select(this).classed('selected', isCommitSelected(d));
      d3.select(this).style('fill-opacity', 1);
      updateTooltipContent(d);
      updateTooltipVisibility(true);
      updateTooltipPosition(event);
    })
    .on('mousemove', function(event) {
      updateTooltipPosition(event);
    })
    .on('mouseout', function(event, d) {
      d3.select(this).classed('selected', false);
      if (selectedCommits.length === 0) {
        d3.select(this).style('fill-opacity', 0.7);
      } else {
        d3.select(this).style('fill-opacity', isCommitSelected(d) ? 1 : 0.1);
      }
      updateTooltipVisibility(false);
    })
    .transition().duration(500)
    .attr('cx', d => xScale(d.datetime))
    .attr('cy', d => yScale(d.hourFrac))
    .attr('r', d => rScale(d.totalLines));

  brushSelector(usableArea);
  container.selectAll('.dots, .overlay ~ *').raise();
}

/* ---------- File Details (Commit File Aggregation) ---------- */
function updateFileDetails(chartCommits) {
  let lines = chartCommits.flatMap(d => d.lines);
  let files = d3.groups(lines, d => d.file)
    .map(([name, lines]) => ({ name, lines }));
  files = d3.sort(files, d => -d.lines.length);
  const dl = d3.select('#files');
  const dtSelection = dl.selectAll('dt')
    .data(files, d => d.name);
  dtSelection.exit().remove();
  dtSelection.join('dt')
    .html(d => `<code>${d.name}</code><small>${d.lines.length} lines</small>`);
  
  const ddSelection = dl.selectAll('dd')
    .data(files, d => d.name);
  ddSelection.exit().remove();
  ddSelection.join('dd')
    .html(d => d.lines.map(line => `<div class="line" style="background: ${fileTypeColors(line.type)}"></div>`).join(''));
}

/* ---------- New File Sizes Scrolly Functions ---------- */
// Compute aggregated file data from commits. Each file is grouped by file name,
// total lines counted, and sorted chronologically (earliest commit first).
function computeFileData() {
  const allLines = commits.flatMap(d => d.lines);
  let files = d3.groups(allLines, d => d.file)
    .map(([file, lines]) => ({
      file: file,
      lines: lines,
      totalLines: lines.length,
      firstCommitDate: d3.min(lines, d => d.datetime)
    }));
  files.sort((a, b) => a.firstCommitDate - b.firstCommitDate);
  fileDataGlobal = files;
  return files;
}

// Render the file narratives in the scrolly box. Each entry is right-aligned.
function renderFileSizes() {
  const files = computeFileData();
  d3.select("#items-container-files")
    .selectAll("div.file-entry")
    .data(files, d => d.file)
    .join("div")
    .attr("class", "file-entry")
    .html(d => `<p class="file-name">${d.file}</p>
                <p class="file-lines">${d.totalLines} lines</p>`);
  updateFileSizesDots(files);
}

// Update the dot visualization next to the file narratives.
// Each file's dots are displayed in vertical columns that grow upward.
// When a column reaches max height, new dots are added to a new column to the right.
function updateFileSizesDots(files) {
  // Get the available width of the dot container
  const dotContainer = d3.select("#file-dots");
  const containerWidth = dotContainer.node().clientWidth;
  
  // Define constants
  const MAX_HEIGHT = 200; // Increased maximum height
  const MAX_DOTS_PER_COLUMN = 20; // Increased dots per column
  const DOT_SIZE = 6; // Fixed dot size for all dots
  const individualGap = 2; // Gap between dots within a group
  const groupGap = 10; // Gap between file groups
  const columnGap = 2; // Gap between columns within a group
  
  // Determine which file entries are visible
  const containerEl = document.getElementById('scroll-container-files');
  const containerRect = containerEl.getBoundingClientRect();
  const entries = d3.selectAll('#items-container-files .file-entry').nodes();
  let lastVisibleIndex = -1;
  
  entries.forEach((entry, i) => {
    const rect = entry.getBoundingClientRect();
    if (rect.bottom >= containerRect.top && rect.top <= containerRect.bottom) {
      lastVisibleIndex = i;
    }
  });
  
  let visibleFiles = [];
  if (lastVisibleIndex >= 0) {
    visibleFiles = files.slice(0, lastVisibleIndex + 1);
  }
  
  // Clear the dot container
  dotContainer.html("");
  dotContainer.style("height", "auto"); // Allow container to expand vertically as needed
  
  if (visibleFiles.length === 0) return;
  
  // Calculate width needed for each file group
  const fileGroups = visibleFiles.map(fileData => {
    const totalDots = fileData.totalLines;
    const columnsNeeded = Math.ceil(totalDots / MAX_DOTS_PER_COLUMN);
    const groupWidth = (DOT_SIZE * columnsNeeded) + (columnGap * (columnsNeeded - 1));
    return { 
      file: fileData.file, 
      data: fileData, 
      columnsNeeded, 
      groupWidth 
    };
  });
  
  // Calculate how many groups can fit in a row
  const calculateRowLayout = (groups, containerWidth, groupGap) => {
    let rows = [[]];
    let currentRowWidth = 0;
    
    groups.forEach(group => {
      // Check if adding this group exceeds container width
      if (currentRowWidth + group.groupWidth + (rows[rows.length - 1].length > 0 ? groupGap : 0) > containerWidth) {
        // Start a new row
        rows.push([group]);
        currentRowWidth = group.groupWidth;
      } else {
        // Add to current row
        rows[rows.length - 1].push(group);
        currentRowWidth += group.groupWidth + (rows[rows.length - 1].length > 1 ? groupGap : 0);
      }
    });
    
    return rows;
  };
  
  const rows = calculateRowLayout(fileGroups, containerWidth, groupGap);
  
  // Create a container for each row
  rows.forEach((rowGroups, rowIndex) => {
    const rowContainer = dotContainer.append("div")
      .attr("class", "file-dots-row")
      .style("display", "flex")
      .style("flex-direction", "row")
      .style("gap", groupGap + "px")
      .style("margin-bottom", rowIndex < rows.length - 1 ? "20px" : "0");
    
    // Create file groups within this row
    rowGroups.forEach(groupInfo => {
      const fileData = groupInfo.data;
      const totalDots = fileData.totalLines;
      
      // Create the file group container
      let group = rowContainer.append("div")
        .attr("class", "file-dot-group")
        .style("display", "flex")
        .style("flex-direction", "row")
        .style("gap", columnGap + "px");
      
      // Create columns of dots that grow upward
      let currentColumn;
      
      for (let i = 0; i < totalDots; i++) {
        // Start a new column if needed
        if (i % MAX_DOTS_PER_COLUMN === 0) {
          currentColumn = group.append("div")
            .style("display", "flex")
            .style("flex-direction", "column-reverse") // Stack from bottom up
            .style("gap", individualGap + "px");
        }
        
        // Add a dot to the current column
        currentColumn.append("div")
          .attr("class", "dot")
          .style("width", DOT_SIZE + "px")
          .style("height", DOT_SIZE + "px")
          .style("background", fileTypeColors(fileData.lines[i].type))
          .style("flex-shrink", "0");
      }
    });
  });
}

// Update dots on scroll of the file narratives scrolly box.
document.getElementById('scroll-container-files').addEventListener('scroll', function() {
  updateFileSizesDots(fileDataGlobal);
});

/* ---------- Tooltip and Brush Functions (Unchanged) ---------- */
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
  if (!selection) {
    selectedCommits = [];
    updateSelection();
    updateSelectionCount();
    updateLanguageBreakdown();
    return;
  }
  const selected = currentVisibleCommits.filter(commit => {
    const min = { x: selection[0][0], y: selection[0][1] };
    const max = { x: selection[1][0], y: selection[1][1] };
    const x = xScale(commit.datetime);
    const y = yScale(commit.hourFrac);
    return x >= min.x && x <= max.x && y >= min.y && y <= max.y;
  });
  selectedCommits = selected;
  updateSelection();
  updateSelectionCount();
  updateLanguageBreakdown();
}

function isCommitSelected(commit) {
  return selectedCommits.includes(commit);
}

function updateSelection() {
  if (selectedCommits.length === 0) {
    d3.selectAll('circle').style('fill-opacity', 0.7);
  } else {
    d3.selectAll('circle')
      .style('fill-opacity', d => (isCommitSelected(d) ? 1 : 0.1));
  }
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

/* ---------- Data Loading and Initialization ---------- */
async function loadData() {
  try {
    data = await d3.csv(
      'https://nathansso.github.io/portfolio/meta/loc.csv',
      (row) => ({
        ...row,
        line: +row.line,
        depth: +row.depth,
        length: +row.length,
        date: new Date(row.date + 'T00:00' + row.timezone),
        datetime: new Date(row.datetime)
      })
    );

    displayStats();
    processCommits();
    renderItems();
    updateView();
    initScatterplot();
    // Render the file sizes section after commits are processed.
    renderFileSizes();
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

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
  commits.sort((a, b) => a.datetime - b.datetime);
}

function addStat(dl, title, value) {
  dl.append('dt')
    .text(title)
    .attr('class', 'stat-title');
  dl.append('dd')
    .text(value)
    .attr('class', 'stat-value');
}

function displayStats() {
  const statsContainer = d3.select('#stats').html('');
  const dl = statsContainer.append('dl').attr('class', 'stats');

  const numFiles = d3.group(data, d => d.file).size;
  const numDays = d3.group(data, d => d.date.toISOString().slice(0, 10)).size;
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

document.addEventListener('DOMContentLoaded', loadData);