// Date for footer
const date = new Date().getFullYear();
document.getElementById("date").textContent = date;

const svg = d3.select("svg");
const w = 800;
const h = 400;


const renderBar = (dataset) => {
  svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -220)
    .attr('y', 80)
    .text('Gross Domestic Product (GDP)');

  svg.append('text')
    .attr('x', w / 2 + 5)
    .attr('y', h + 55)
    .text('More Information: http://www.bea.gov/national/pdf/nipaguid.pdf')
    .attr('class', 'info');

  const xScale = d3.scaleTime()
    .domain([d3.min(dataset, (d) => new Date(d[0])), d3.max(dataset, (d) => new Date(d[0]))])
    .range([0, w]);


  const yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, (d) => d[1])])
    .range([0, h]);

  // create a tooltip
  const tooltip = d3.select(".chart")
    .append("div")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")


  svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("data-date", d => d[0])
    .attr("data-gdp", d => d[1])
    .attr("x", (d, i) => 60 + i * (w / 275))
    .attr("height", (d) => yScale(d[1]))
    .attr("y", (d) => h - yScale(d[1]))
    .attr("width", w / 275)
    .on("mouseover", (event, d) => {
      d3.select("#tooltip")
        .attr("data-date", d[0])
        .html(`<p>${formatYear(d[0])}</p> <p>${formatGdp(d[1])}</p>`)
        .style("visibility", "visible")
        .style("top", "460px")
        .style("left", (event.pageX + 28) + "px")
    })
    .on("mouseout", (d) => {
      d3.select("#tooltip")
        .style("visibility", "hidden")
    });

  const formatYear = (y) => {
    const year = y.substring(0, 4);
    const quarter = y.substring(5, 7);

    switch (quarter) {
      case "01":
        return year + " Q1";
      case "04":
        return year + " Q2";
      case "07":
        return year + " Q3";
      case "10":
        return year + " Q4";
      default:
        console.log("We don't know this quarter!");
        return;
    }
  }

  const formatGdp = (gdp) => {
    return "$" + gdp.toLocaleString() + " Billion";
  }

  const xAxis = d3.axisBottom(xScale);

  svg.append("g")
    .attr("transform", `translate(60, ${h})`)
    .attr("id", "x-axis")
    .attr("class", "tick")
    .call(xAxis);

  const yAxisScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, (d) => d[1])])
    .range([h, 0]);

  const yAxis = d3.axisLeft(yAxisScale);

  svg.append("g")
    .attr("transform", `translate(60, 0)`)
    .attr("id", "y-axis")
    .attr("class", "tick")
    .call(yAxis);

}

document.addEventListener("DOMContentLoaded", () => {
  fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
    .then(request => request.json())
    .then(data => {
      renderBar(data.data);
    });
});