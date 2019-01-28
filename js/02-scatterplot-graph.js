const dataset = fetch(
    'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
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

function drawGraph(data) {
    const w = 800
    const h = 400

    const color = d3.scaleOrdinal(d3.schemeCategory10)

    /*
    {
        "Time": "36:50",
        "Place": 1,
        "Seconds": 2210,
        "Name": "Marco Pantani",
        "Year": 1995,
        "Nationality": "ITA",
        "Doping": "Alleged drug use during 1995 due to high hematocrit levels",
        "URL": "https://en.wikipedia.org/wiki/Marco_Pantani#Alleged_drug_use"
    }
    */

    const timeFormat = d3.timeFormat('%M:%S')

    const TIME = []
    const YEARS = []

    for (const d of data) {
        const time = d['Time'].split(':')
        TIME.push(new Date(Date.UTC(1970, 0, 1, 0, time[0], time[1])))
        YEARS.push(Number.parseInt(d['Year']))
    }

    data.forEach(d => {
        d.Place = +d.Place
        const parsedTime = d.Time.split(':')
        d.Time = new Date(Date.UTC(1970, 0, 1, 0, parsedTime[0], parsedTime[1]))
    })

    const svg = d3
        .select('.chart-container')
        .append('svg')
        .attr('width', w + 100) // + 100
        .attr('height', h + 60) // + 60

    // X-Axis label
    svg.append('text')
        .attr('x', w / 2 + 70)
        .attr('y', h + 50)
        .text('Year')

    // Y-Axis label
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -200)
        .attr('y', 80)
        .text('Time in Minutes')

    // X-Axis
    const xMin = d3.min(data, d => d.Year - 1)
    const xMax = d3.max(data, d => d.Year + 1)
    const xScale = d3
        .scaleLinear()
        .domain([xMin, xMax])
        .range([0, w])
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'))

    svg.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', `translate(0, ${h})`)

    // Y-Axis
    const yMin = d3.min(TIME)
    const yMax = d3.max(TIME)
    const yScale = d3
        .scaleTime()
        .domain([yMin, yMax])
        // .domain(d3.extent(data, d => d.Time))
        .range([0, h])
    const yAxis = d3.axisLeft(yScale).tickFormat(timeFormat)

    svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', 'translate(30, 0)')

    // Scatterplot
    svg.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('data-xvalue', (d, i) => d.Year)
        .attr('data-yvalue', (d, i) => d.Time.toISOString())
        .attr('cx', (d, i) => xScale(d.Year))
        .attr('cy', (d, i) => yScale(d.Time))
        .attr('r', 5)
        .style('fill', d => color(d.Doping != ''))

        // Tooltips
        .on('mouseover', (d, i) =>
            tooltip.style('visibility', 'visible').attr('data-year', YEARS[i])
                .text(`Additional information:
                ${Object.values(d)}`)
        )
        .on('mousemove', () => {
            tooltip
                .style('top', `${d3.event.pageY - 20}px`)
                .style('left', `${d3.event.pageX + 10}px`)
        })
        .on('mouseout', () => tooltip.style('visibility', 'hidden'))

    // Legend
    const legend = svg
        .selectAll('.legend')
        .data(color.domain())
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('id', 'legend')
        .attr('transform', (d, i) => 'translate(0,' + (h / 2 - i * 20) + ')')

    legend
        .append('rect')
        .attr('x', w - 18)
        .attr('width', 18)
        .attr('height', 18)
        .style('fill', color)

    legend
        .append('text')
        .attr('x', w - 24)
        .attr('y', 9)
        .attr('dy', '.35em')
        .style('text-anchor', 'end')
        .text(d =>
            d ? 'Riders with doping allegations' : 'No doping allegations'
        )
}
