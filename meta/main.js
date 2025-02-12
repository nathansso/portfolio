let data = [];

async function loadData() {
  // Load the CSV and parse necessary fields
  data = await d3.csv('loc.csv', (row) => ({
    ...row,
    line: Number(row.line),    // Convert line to number
    depth: Number(row.depth),  // Convert depth to number
    length: Number(row.length), // Convert length to number
    date: new Date(row.date + 'T00:00' + row.timezone), // Combine date and timezone
    datetime: new Date(row.datetime), // Parse datetime
  }));

  // Process the commits after loading data
  processCommits();
}

// Function to process commits, add hidden 'lines' property
function processCommits() {
  commits = d3.groups(data, (d) => d.commit).map(([commit, lines]) => {
    let first = lines[0];
    let { author, date, time, timezone, datetime } = first;
    
    // Prepare the commit data
    let ret = {
      id: commit,
      url: 'https://github.com/vis-society/lab-7/commit/' + commit,
      author,
      date,
      time,
      timezone,
      datetime,
      hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
      totalLines: lines.length,
    };

    // Add the hidden 'lines' property
    Object.defineProperty(ret, 'lines', {
      value: lines,        // The value of 'lines' is the array of lines
      writable: false,     // Make 'lines' read-only
      enumerable: false,   // Make 'lines' hidden when iterating over the object
      configurable: false  // Prevent further modification
    });

    return ret;
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  console.log(commits); // Logs the commits array with the hidden 'lines' property
});
