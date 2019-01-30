const dataset = fetch(
    'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json'
)
    .then(res => res.json())
    .then(res => drawGraph(res))

const tooltip = d3
    .select('.chart-container')
    .append('div')
    .style('border', `1px solid var(--color-primary-dark)`)
    .style('border-radius', '4px')
    .style('padding', '2px')
    .style('position', 'absolute')
    .style('z-index', '10')
    .style('visibility', 'hidden')
    .attr('id', 'tooltip')

const heading = d3.select('.chart-container').append('heading')
heading
    .append('h1')
    .attr('id', 'title')
    .text('Video Game Sales')
heading
    .append('h2')
    .attr('id', 'description')
    .text('Top 100 Most Sold Video Games Grouped by Platform')

const svg = d3
    .select('.chart-container')
    .append('svg')
    .attr('width', w)
    .attr('height', h + padding.top + padding.bottom)

function drawGraph(data) {}
