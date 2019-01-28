const dataset = fetch(
    'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json'
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

    data.monthlyVariance.forEach(val => {
        val.month -= 1
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
        .text('Months')

    // Y-Axis label
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -200)
        .attr('y', 80)
        .text('Years')

    // TODO: User Story #2: My heat map should have a description with a corresponding id="description".
    svg.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        // TODO: User Story #3: My heat map should have an x-axis with a corresponding id="x-axis".

    // TODO: User Story #4: My heat map should have a y-axis with a corresponding id="y-axis".

    // TODO: User Story #5: My heat map should have rect elements with a class="cell" that represent the data.

    // TODO: User Story #6: There should be at least 4 different fill colors used for the cells.

    // TODO: User Story #7: Each cell will have the properties data-month, data-year, data-temp containing their corresponding month, year, and temperature values.

    // TODO: User Story #8: The data-month, data-year of each cell should be within the range of the data.

    // TODO: User Story #9: My heat map should have cells that align with the corresponding month on the y-axis.

    // TODO: User Story #10: My heat map should have cells that align with the corresponding year on the x-axis.

    // TODO: User Story #11: My heat map should have multiple tick labels on the y-axis with the full month name.

    // TODO: User Story #12: My heat map should have multiple tick labels on the x-axis with the years between 1754 and 2015.

    // TODO: User Story #16: I can mouse over an area and see a tooltip with a corresponding id="tooltip" which displays more information about the area.

        // TODO: User Story #17: My tooltip should have a data-year property that corresponds to the data-year of the active area.
        // Tooltips
        .on(
            'mouseover',
            (d, i) =>
                tooltip
                    .style('visibility', 'visible')
                    .attr('data-year', YEARS[i])
            //         .text(`Additional information:
            // ${Object.values(d)}`)
        )
        .on('mousemove', () => {
            tooltip
                .style('top', `${d3.event.pageY - 20}px`)
                .style('left', `${d3.event.pageX + 10}px`)
        })
        .on('mouseout', () => tooltip.style('visibility', 'hidden'))

    // TODO: User Story #13: My heat map should have a legend with a corresponding id="legend".
    // const legend = svg
    //     .selectAll('.legend')
    //     .data(color.domain())
    //     .enter()
    //     .append('g')
    //     .attr('class', 'legend')
    //     .attr('id', 'legend')
    //     .attr('transform', (d, i) => 'translate(0,' + (h / 2 - i * 20) + ')')
    // TODO: User Story #14: My legend should contain rect elements.
    // legend
    //     .append('rect')
    //     .attr('x', w - 18)
    //     .attr('width', 18)
    //     .attr('height', 18)
    //     .style('fill', color)

    // TODO: User Story #15: The rect elements in the legend should use at least 4 different fill colors.
}
