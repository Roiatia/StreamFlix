async function fetchStatsItems(endpoint) {
  const response = await fetch(endpoint);
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error((data && data.error) || 'Could not load statistics.');
  }

  return data.items || [];
}

function renderBarChart(selector, data) {
  const width = 520;
  const height = 320;
  const margin = { top: 20, right: 20, bottom: 80, left: 50 };

  d3.select(selector).html('');

  const svg = d3.select(selector)
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  const x = d3.scaleBand()
    .domain(data.map(d => d.label))
    .range([margin.left, width - margin.right])
    .padding(0.25);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)])
    .nice()
    .range([height - margin.bottom, margin.top]);

  svg.append('g')
    .attr('transform', `translate(0, ${height - margin.bottom})`)
    .call(d3.axisBottom(x))
    .selectAll('text')
    .attr('transform', 'rotate(-35)')
    .style('text-anchor', 'end')
    .style('fill', '#ccc')
    .style('font-size', '11px');

  svg.append('g')
    .attr('transform', `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(y).ticks(5))
    .selectAll('text')
    .style('fill', '#ccc');

  svg.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', d => x(d.label))
    .attr('y', d => y(d.value))
    .attr('width', x.bandwidth())
    .attr('height', d => y(0) - y(d.value))
    .attr('rx', 5)
    .attr('fill', '#e50914');

  svg.selectAll('.value-label')
    .data(data)
    .enter()
    .append('text')
    .attr('class', 'value-label')
    .attr('x', d => x(d.label) + x.bandwidth() / 2)
    .attr('y', d => y(d.value) - 6)
    .attr('text-anchor', 'middle')
    .attr('fill', '#fff')
    .style('font-size', '12px')
    .text(d => d.value);
}

function showChartMessage(selector, message) {
  d3.select(selector).html(`<div class="empty-state"><p>${message}</p></div>`);
}

// loads one chart independently so a failure/empty result on one endpoint
// doesn't take down the other charts on the page
async function loadChart(selector, endpoint, emptyMessage) {
  try {
    const items = await fetchStatsItems(endpoint);

    if (!items.length) {
      showChartMessage(selector, emptyMessage);
      return;
    }

    renderBarChart(selector, items);
  } catch (error) {
    console.error(`Could not load chart for ${endpoint}:`, error);
    showChartMessage(selector, error.message);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  drawStatsCanvas();

  loadChart('#genreChart', '/api/stats/content-by-genre', 'No genre data available.');
  loadChart('#typeChart', '/api/stats/content-by-type', 'No type data available.');
  loadChart('#viewsByContentChart', '/api/stats/views-by-content', 'No watch history yet.');
  loadChart('#viewsByGenreChart', '/api/stats/views-by-genre', 'No watch history yet.');
});

function drawStatsCanvas() {
  const canvas = document.getElementById('statsCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#141414';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#e50914';
  ctx.fillRect(20, 22, 70, 45);

  ctx.fillStyle = '#ffffff';
  ctx.font = '20px Arial';
  ctx.fillText('StreamFlix Statistics', 105, 50);
}
