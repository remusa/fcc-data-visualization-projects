const EDUCATION_FILE =
    'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json'
const COUNTY_FILE =
    'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json'

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

const w = 960
const h = 600

const heading = d3.select('.chart-container').append('heading')
heading
    .append('h1')
    .attr('id', 'title')
    .text('United States Educational Attainment')
heading
    .append('h2')
    .attr('id', 'description')
    .html(
        `Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)`
    )

const unemployment = d3.map()
const path = d3.geoPath()

const svg = d3
    .select('.chart-container')
    .append('svg')
    .attr('width', w + 100)
    .attr('height', h + 60)

const x = d3
    .scaleLinear()
    .domain([2.6, 75.1])
    .rangeRound([600, 860])

const color = d3
    .scaleThreshold()
    .domain(d3.range(2.6, 75.1, (75.1 - 2.6) / 8))
    .range(d3.schemeGreens[9])

const g = svg
    .append('g')
    .attr('class', 'key')
    .attr('id', 'legend')
    .attr('transform', 'translate(0,40)')

g.selectAll('rect')
    .data(
        color.range().map(function(d) {
            d = color.invertExtent(d)
            if (d[0] == null) d[0] = x.domain()[0]
            if (d[1] == null) d[1] = x.domain()[1]
            return d
        })
    )
    .enter()
    .append('rect')
    .attr('height', 8)
    .attr('x', function(d) {
        return x(d[0])
    })
    .attr('width', function(d) {
        return x(d[1]) - x(d[0])
    })
    .attr('fill', function(d) {
        return color(d[0])
    })

g.append('text')
    .attr('class', 'caption')
    .attr('x', x.range()[0])
    .attr('y', -6)
    .attr('fill', '#000')
    .attr('text-anchor', 'start')
    .attr('font-weight', 'bold')

g.call(
    d3
        .axisBottom(x)
        .tickSize(13)
        .tickFormat(function(x) {
            return Math.round(x) + '%'
        })
        .tickValues(color.domain())
)
    .select('.domain')
    .remove()

d3.queue()
    .defer(d3.json, COUNTY_FILE)
    .defer(d3.json, EDUCATION_FILE)
    .await(drawGraph)

function drawGraph(us, education) {
    // Map
    svg.append('g')
        .attr('class', 'counties')
        .selectAll('path')
        .data(topojson.feature(us, us.objects.counties).features)
        .enter()
        .append('path')
        .attr('class', 'county')
        .attr('data-fips', function(d) {
            return d.id
        })
        .attr('data-education', function(d) {
            const result = education.filter(function(obj) {
                return obj.fips == d.id
            })
            if (result[0]) {
                return result[0].bachelorsOrHigher
            }
            //could not find a matching fips id in the data
            console.log('could find data for: ', d.id)
            return 0
        })
        .attr('fill', function(d) {
            const result = education.filter(function(obj) {
                return obj.fips == d.id
            })
            if (result[0]) {
                return color(result[0].bachelorsOrHigher)
            }
            //could not find a matching fips id in the data
            return color(0)
        })
        .attr('d', path)
        .on('mouseover', function(d) {
            tooltip.style('opacity', 0.9)
            tooltip
                .html(function() {
                    const result = education.filter(function(obj) {
                        return obj.fips == d.id
                    })
                    if (result[0]) {
                        return (
                            result[0]['area_name'] +
                            ', ' +
                            result[0]['state'] +
                            ': ' +
                            result[0].bachelorsOrHigher +
                            '%'
                        )
                    }
                    //could not find a matching fips id in the data
                    return 0
                })
                .attr('data-education', function() {
                    const result = education.filter(function(obj) {
                        return obj.fips == d.id
                    })
                    if (result[0]) {
                        return result[0].bachelorsOrHigher
                    }
                    //could not find a matching fips id in the data
                    return 0
                })
                .style('left', d3.event.pageX + 10 + 'px')
                .style('top', d3.event.pageY - 28 + 'px')
        })
        .on('mouseout', function(d) {
            tooltip.style('opacity', 0)
        })

    svg.append('path')
        .datum(
            topojson.mesh(us, us.objects.states, function(a, b) {
                return a !== b
            })
        )
        .attr('class', 'states')
        .attr('d', path)
}
