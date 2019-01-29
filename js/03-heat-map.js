const dataset = fetch(
    'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json'
)
    .then(res => res.json())
    .then(res => drawGraph(res))

const tooltip = d3
    .select('.chart-container')
    .append('div')
    .style('border', `1px solid const(--color-primary-dark)`)
    .style('border-radius', '4px')
    .style('padding', '2px')
    .style('position', 'absolute')
    .style('z-index', '10')
    .style('visibility', 'hidden')
    .attr('id', 'tooltip')

const colorbrewer = {
    RdYlBu: {
        3: ['#fc8d59', '#ffffbf', '#91bfdb'],
        4: ['#d7191c', '#fdae61', '#abd9e9', '#2c7bb6'],
        5: ['#d7191c', '#fdae61', '#ffffbf', '#abd9e9', '#2c7bb6'],
        6: ['#d73027', '#fc8d59', '#fee090', '#e0f3f8', '#91bfdb', '#4575b4'],
        7: [
            '#d73027',
            '#fc8d59',
            '#fee090',
            '#ffffbf',
            '#e0f3f8',
            '#91bfdb',
            '#4575b4',
        ],
        8: [
            '#d73027',
            '#f46d43',
            '#fdae61',
            '#fee090',
            '#e0f3f8',
            '#abd9e9',
            '#74add1',
            '#4575b4',
        ],
        9: [
            '#d73027',
            '#f46d43',
            '#fdae61',
            '#fee090',
            '#ffffbf',
            '#e0f3f8',
            '#abd9e9',
            '#74add1',
            '#4575b4',
        ],
        10: [
            '#a50026',
            '#d73027',
            '#f46d43',
            '#fdae61',
            '#fee090',
            '#e0f3f8',
            '#abd9e9',
            '#74add1',
            '#4575b4',
            '#313695',
        ],
        11: [
            '#a50026',
            '#d73027',
            '#f46d43',
            '#fdae61',
            '#fee090',
            '#ffffbf',
            '#e0f3f8',
            '#abd9e9',
            '#74add1',
            '#4575b4',
            '#313695',
        ],
    },
    RdBu: {
        3: ['#ef8a62', '#f7f7f7', '#67a9cf'],
        4: ['#ca0020', '#f4a582', '#92c5de', '#0571b0'],
        5: ['#ca0020', '#f4a582', '#f7f7f7', '#92c5de', '#0571b0'],
        6: ['#b2182b', '#ef8a62', '#fddbc7', '#d1e5f0', '#67a9cf', '#2166ac'],
        7: [
            '#b2182b',
            '#ef8a62',
            '#fddbc7',
            '#f7f7f7',
            '#d1e5f0',
            '#67a9cf',
            '#2166ac',
        ],
        8: [
            '#b2182b',
            '#d6604d',
            '#f4a582',
            '#fddbc7',
            '#d1e5f0',
            '#92c5de',
            '#4393c3',
            '#2166ac',
        ],
        9: [
            '#b2182b',
            '#d6604d',
            '#f4a582',
            '#fddbc7',
            '#f7f7f7',
            '#d1e5f0',
            '#92c5de',
            '#4393c3',
            '#2166ac',
        ],
        10: [
            '#67001f',
            '#b2182b',
            '#d6604d',
            '#f4a582',
            '#fddbc7',
            '#d1e5f0',
            '#92c5de',
            '#4393c3',
            '#2166ac',
            '#053061',
        ],
        11: [
            '#67001f',
            '#b2182b',
            '#d6604d',
            '#f4a582',
            '#fddbc7',
            '#f7f7f7',
            '#d1e5f0',
            '#92c5de',
            '#4393c3',
            '#2166ac',
            '#053061',
        ],
    },
}

function drawGraph(data) {
    data.monthlyVariance.forEach(val => {
        val.month -= 1
    })

    const fontSize = 16
    const w = 5 * Math.ceil(data.monthlyVariance.length / 12) //1500;
    const h = 33 * 12 //400;
    const padding = {
        left: 9 * fontSize,
        right: 9 * fontSize,
        top: 1 * fontSize,
        bottom: 8 * fontSize,
    }

    const heading = d3.select('.chart-container').append('heading')
    heading
        .append('h1')
        .attr('id', 'title')
        .text('Monthly Global Land-Surface Temperature')
    heading
        .append('h2')
        .attr('id', 'description')
        .html(
            data.monthlyVariance[0].year +
                ' - ' +
                data.monthlyVariance[data.monthlyVariance.length - 1].year +
                ': base temperature ' +
                data.baseTemperature +
                '&#8451;'
        )

    const svg = d3
        .select('.chart-container')
        .append('svg')
        .attr('width', w + padding.left + padding.right) // + 100
        .attr('height', h + padding.top + padding.bottom) // + 60

    const legendColors = colorbrewer.RdYlBu[11].reverse()
    const legendWidth = 400
    const legendHeight = 300 / legendColors.length

    const variance = data.monthlyVariance.map(function(val) {
        return val.variance
    })
    const minTemp = data.baseTemperature + Math.min.apply(null, variance)
    const maxTemp = data.baseTemperature + Math.max.apply(null, variance)

    const legendThreshold = d3
        .scaleThreshold()
        .domain(
            (function(min, max, count) {
                const array = []
                const step = (max - min) / count
                const base = min
                for (let i = 1; i < count; i++) {
                    array.push(base + i * step)
                }
                return array
            })(minTemp, maxTemp, legendColors.length)
        )
        .range(legendColors)

    const legendX = d3
        .scaleLinear()
        .domain([minTemp, maxTemp])
        .range([0, legendWidth])

    const legendXAxis = d3
        .axisBottom(legendX)
        .tickSize(10, 0)
        .tickValues(legendThreshold.domain())
        .tickFormat(d3.format('.1f'))

    const legend = svg
        .append('g')
        .attr('class', 'legend')
        .attr('id', 'legend')
        .attr(
            'transform',
            (d, i) => 'translate(0,' + (h - 2 * legendHeight) + ')'
        )

    legend
        .append('g')
        .selectAll('rect')
        .data(
            legendThreshold.range().map(function(color) {
                const d = legendThreshold.invertExtent(color)
                if (d[0] == null) d[0] = legendX.domain()[0]
                if (d[1] == null) d[1] = legendX.domain()[1]
                return d
            })
        )
        .enter()
        .append('rect')
        .style('fill', function(d, i) {
            return legendThreshold(d[0])
        })
        .attr({
            x: function(d, i) {
                return legendX(d[0])
            },
            y: 0,
            width: function(d, i) {
                return legendX(d[1]) - legendX(d[0])
            },
            height: legendHeight,
        })

    legend
        .append('g')
        .attr('transform', 'translate(' + 0 + ',' + legendHeight + ')')
        .call(legendXAxis)

    // X-Axis label
    svg.append('text')
        .attr('x', w / 2 + 70)
        .attr('y', h + 50)
        .text('Years')

    // Y-Axis label
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -200)
        .attr('y', 80)
        .text('Months')

    // X-Axis
    const xScale = d3
        .scaleBand()
        .domain(data.monthlyVariance.map(val => val.year))
        .rangeRound([0, w])
    const xAxis = d3
        .axisBottom(xScale)
        .tickValues(xScale.domain().filter(year => year % 10 === 0))
        .tickFormat(year => {
            const date = new Date(0)
            date.setUTCFullYear(year)
            return d3.timeFormat('%Y')(date)
        })
        .tickSize(10, 1)

    svg.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', `translate(0, ${h})`)
        .append('text')
        .style('text-anchor', 'middle')

    // Y-Axis
    const yScale = d3
        .scaleBand()
        .domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
        .rangeRound([0, h])
    const yAxis = d3
        .axisLeft(yScale)
        .tickValues(yScale.domain())
        .tickFormat(month => {
            const date = new Date(0)
            date.setUTCMonth(month)
            return d3.timeFormat('%B')(date)
        })
        .tickSize(10, 1)

    svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', `translate(0,0)`)
        .append('text')
        .style('text-anchor', 'middle')

    // Map
    svg.append('g')
        .classed('map', true)
        .selectAll('rect')
        .data(data.monthlyVariance)
        .enter()
        .append('rect')
        .attr('class', 'cell')
        .attr('data-temp', d => data.baseTemperature + d.variance)
        .attr('data-month', d => d.month)
        .attr('data-year', d => d.year)
        .attr('x', d => xScale(d.year))
        .attr('width', d => xScale.bandwidth())
        .attr('y', d => yScale(d.month))
        .attr('height', d => yScale.bandwidth())
        .attr('fill', d => legendThreshold(data.baseTemperature + d.variance))

        // Tooltips
        .on('mouseover', (d, i) =>
            tooltip
                .style('visibility', 'visible')
                .attr('data-year', d.year)
                .text(`Month ${d.year} - ${d.month}`)
        )
        .on('mousemove', () => {
            tooltip
                .style('top', `${d3.event.pageY - 20}px`)
                .style('left', `${d3.event.pageX + 10}px`)
        })
        .on('mouseout', () => tooltip.style('visibility', 'hidden'))
}
