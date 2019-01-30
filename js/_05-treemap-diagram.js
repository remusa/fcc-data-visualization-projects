const dataset = fetch(
    'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json'
)
    .then(res => res.json())
    .then(res => drawGraph(res))

const width = 800
const height = 400

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
    .attr('width', width)
    .attr('height', height + padding.top + padding.bottom)

function fader(color) {
    return d3.interpolateRgb(color, '#fff')(0.2)
}
const color = d3.scaleOrdinal(d3.schemeCategory20.map(fader))
const format = d3.format(',d')

const treemap = d3
    .treemap()
    .size([width, height])
    .paddingInner(1)

// TODO: User Story #7: My tree map should have a legend with corresponding id="legend".
// TODO: User Story #8: My legend should have rect elements with a corresponding class="legend-item".
// TODO: User Story #9: The rect elements in the legend should use at least 2 different fill colors.

function drawGraph(data) {
    const root = d3
        .hierarchy(data)
        .eachBefore(d => {
            d.data.id = (d.parent ? d.parent.data.id + '.' : '') + d.data.name
        })
        .sum(d => d.value)
        .sort((a, b) => b.height - a.height || b.value - a.value)

    treemap(root)

    const cell = svg
        .selectAll('g')
        .data(root.leaves())
        .enter()
        .append('g')
        .attr('class', 'group')
        .attr('transform', d => 'translate(' + d.x0 + ',' + d.y0 + ')')

    const tile = cell
        .append('rect')
        .attr('id', d => d.data.id)
        .attr('class', 'tile')
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        .attr('data-name', d => d.data.name)
        .attr('data-category', d => d.data.category)
        .attr('data-value', function(d) {
            return d.data.value
        })
        .attr('fill', function(d) {
            return color(d.data.category)
        })
        .on('mouseover', (d, i) =>
            tooltip
                .style('visibility', 'visible')
                .attr('data-value', d.data.value)
                // .text(`Month ${d.year} - ${d.month}`)
                .html(
                    'Name: ' +
                        d.data.name +
                        '<br>Category: ' +
                        d.data.category +
                        '<br>Value: ' +
                        d.data.value
                )
        )
        .on('mousemove', () => {
            tooltip
                .style('top', `${d3.event.pageY - 20}px`)
                .style('left', `${d3.event.pageX + 10}px`)
        })
        .on('mouseout', () => tooltip.style('visibility', 'hidden'))

    cell.append('text')
        .attr('class', 'tile-text')
        .selectAll('tspan')
        .data(function(d) {
            return d.data.name.split(/(?=[A-Z][^A-Z])/g)
        })
        .enter()
        .append('tspan')
        .attr('x', 4)
        .attr('y', (d, i) => 13 + i * 10
        )
        .text((d) => d)

    var categories = root.leaves().map((nodes)=> {
        return nodes.data.category
    })
    categories = categories.filter((category, index, self) =>{
        return self.indexOf(category) === index
    })
    var legend = d3.select('#legend')
    var legendWidth = +legend.attr('width')
    const LEGEND_OFFSET = 10
    const LEGEND_RECT_SIZE = 15
    const LEGEND_H_SPACING = 150
    const LEGEND_V_SPACING = 10
    const LEGEND_TEXT_X_OFFSET = 3
    const LEGEND_TEXT_Y_OFFSET = -2
    var legendElemsPerRow = Math.floor(legendWidth / LEGEND_H_SPACING)

    var legendElem = legend
        .append('g')
        .attr('transform', 'translate(60,' + LEGEND_OFFSET + ')')
        .selectAll('g')
        .data(categories)
        .enter()
        .append('g')
        .attr(
            'transform',
            (d, i) =>
            'translate(' +
                (i % legendElemsPerRow) * LEGEND_H_SPACING +
                ',' +
                (Math.floor(i / legendElemsPerRow) * LEGEND_RECT_SIZE +
                    LEGEND_V_SPACING * Math.floor(i / legendElemsPerRow)) +
                ')'
        ))

    legendElem
        .append('rect')
        .attr('width', LEGEND_RECT_SIZE)
        .attr('height', LEGEND_RECT_SIZE)
        .attr('class', 'legend-item')
        .attr('fill', d => color(d))

    legendElem
        .append('text')
        .attr('x', LEGEND_RECT_SIZE + LEGEND_TEXT_X_OFFSET)
        .attr('y', LEGEND_RECT_SIZE + LEGEND_TEXT_Y_OFFSET)
        .text(d => d)
}
