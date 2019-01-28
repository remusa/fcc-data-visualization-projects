const dataset = fetch(
    'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'
)
    .then(res => res.json())
    .then(res => res.data)
    .then(res => drawGraph(res))

const tooltip = d3
    .select('.chart-container')
    .append('div')
    //.style('opacity', 0)
    .style('border', `1px solid var(--color-primary-dark)`)
    .style('border-radius', '4px')
    .style('padding', '2px')
    .style('position', 'absolute')
    .style('z-index', '10')
    .style('visibility', 'hidden')
    .attr('id', 'tooltip')

function drawGraph(data) {
    const w = 800
    const h = 400
    const items = data.length
    const barW = w / items

    const GDP = data.map(d => d[1])
    const YEARS = data.map(d => Number.parseInt(d[0].split('-')[0]))

    const svg = d3
        .select('.chart-container')
        .append('svg')
        .attr('width', w + 100) // + 100
        .attr('height', h + 60) // + 60

    // X-Axis label
    svg.append('text')
        .attr('x', w / 2 + 120)
        .attr('y', h + 50)
        .text('Year')

    // Y-Axis label
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -200)
        .attr('y', 80)
        .text('Gross Domestic Product')

    // X-Axis
    const xMin = d3.min(YEARS)
    const xMax = d3.max(YEARS)
    const xScale = d3
        .scaleLinear()
        .domain([xMin, xMax])
        .range([0, w])
    const xAxis = d3.axisBottom(xScale)
    const xAxisGroup = svg
        .append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(60, 400)')

    // Y-Axis
    const yMax = d3.max(GDP)
    const yScale = d3
        .scaleLinear()
        .domain([0, yMax])
        .range([h, 0])
    const yAxis = d3.axisLeft(yScale)
    const yAxisGroup = svg
        .append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', 'translate(60, 0)')

    // Scale the Y-Axis values
    const linearScale = d3
        .scaleLinear()
        .domain([0, yMax])
        .range([0, h])
    const scaledGDP = GDP.map(d => linearScale(d))

    // Scale the X-Axis values
    const linearScaleX = d3
        .scaleLinear()
        .domain([xMin, xMax])
        .range([0, w])

    // const yearsDate = dataset.map(d => new Date(d[0]))

    //Bars
    svg.selectAll('rect')
        .data(scaledGDP)
        .enter()
        .append('rect')
        .attr('data-date', (d, i) => data[i][0])
        .attr('data-gdp', (d, i) => data[i][1])
        // TODO: The data-date attribute and its corresponding bar element should align with the corresponding value on the x-axis.
        .attr('x', (d, i) => linearScaleX(YEARS[i]))
        .attr('y', (d, i) => h - d)
        .attr('width', barW)
        .attr('height', d => d)
        .attr('fill', 'var(--color-primary)')
        .attr('class', 'bar')
        .attr('transform', 'translate(60, 0)')

        // Tooltips
        .on('mouseover', (d, i) =>
            tooltip
                .style('visibility', 'visible')
                //.style("opacity", 1)
                .attr('data-date', data[i][0])
                .text(`${GDP[i]} Billions`)
        )
        .on('mousemove', () =>
            tooltip
                .style('top', `${d3.event.pageY - 20}px`)
                .style('left', `${d3.event.pageX + 10}px`)
        )
        .on(
            'mouseout',
            () => tooltip.style('visibility', 'hidden')
            //.style("opacity", 0)
        )
}
