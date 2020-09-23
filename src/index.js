// Date for footer
const date = new Date().getFullYear();
document.getElementById("date").textContent = date;

// Selecting the SVG
const svg = d3.select("svg");

const renderBar = (dataset) => {
  // setting fixed values
  const w = 800;
  const h = 400;
  const barWidth = w / dataset.length;
  const padding = 60;

  // Adding Y axis text or legend
  svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -220)
    .attr('y', 80)
    .text('Gross Domestic Product (GDP)');

  // Adding some additional info next to X axis
  svg.append('text')
    .attr('x', w / 2 + 5)
    .attr('y', h + padding - 5)
    .text('More Information: http://www.bea.gov/national/pdf/nipaguid.pdf')
    .attr('class', 'info');

  // Scaling the our x data
  const xScale = d3.scaleTime()
    .domain([d3.min(dataset, (d) => new Date(d[0])), d3.max(dataset, (d) => new Date(d[0]))])
    .range([0, w]);

  // Scaling our y data 
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, (d) => d[1])])
    .range([h, 0]);

  // creating a tooltip
  const tooltip = d3.select(".chart")
    .append("div")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")

  // Creating our bars based on the data 
  svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("data-date", d => d[0])
    .attr("data-gdp", d => d[1])
    .attr("x", (d, i) => padding + i * (barWidth))
    .attr("y", (d) => yScale(d[1]))
    .attr("height", (d) => h - yScale(d[1]))
    .attr("width", barWidth)
    // Adding mouseover effect
    .on("mouseover", (event, d) => {
      d3.select("#tooltip")
        .attr("data-date", d[0])
        .html(`<p>${formatYear(d[0])}</p> <p>${formatGdp(d[1])}</p>`)
        .style("visibility", "visible")
        .style("top", "460px")
        .style("left", (event.pageX + 28) + "px")
    })
    // Removing mouseover effect
    .on("mouseout", (d) => {
      d3.select("#tooltip")
        .style("visibility", "hidden")
    });

  // Formatting the year for displaying in a tooltip
  const formatYear = (y) => {
    const year = y.substring(0, 4);
    const quarter = y.substring(5, 7);

    // Deciding the quarter
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

  // Formatting our GDP
  const formatGdp = (gdp) => {
    return "$" + gdp.toLocaleString() + " Billion";
  }

  // Creating xAxis
  const xAxis = d3.axisBottom(xScale);

  // Positioning our xAxis
  svg.append("g")
    .attr("transform", `translate(${padding}, ${h})`)
    .attr("id", "x-axis")
    .attr("class", "tick")
    .call(xAxis);

  // Creating yAxis
  const yAxis = d3.axisLeft(yScale);

  // Positioning yAxis 
  svg.append("g")
    .attr("transform", `translate(${padding}, 0)`)
    .attr("id", "y-axis")
    .attr("class", "tick")
    .call(yAxis);

}

// Retrieving our data from the api
document.addEventListener("DOMContentLoaded", () => {
  fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
    .then(res => res.json())
    .then(data => {

      // Calling our function with the data retrieved from the API 
      renderBar(data.data);
    });
});