var url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"

fetch (url)
    .then (response => {
        if (!response.ok) {
            throw new Error('Network error');
        }
        return response.json();
    })
    .then (data => {
        makeBarChart(data);
    });

function makeBarChart (data) {

    // 2. Append svg-object for the scatter plot chart to a div in your webpage
    // (here we use a div with id=container)
    var width = 700;
    var height = 500;
    var margin = {left: 90, top: 70, bottom: 50, right: 20};

    let keys = ["No Doping Allegation", "Doping Allegation"];
    var size = 20;

    var color = d3.scaleOrdinal()
       .domain(keys)
       .range(d3.schemeDark2);

    const svg = d3.select("#container")
                  .append("svg")
                  .attr("id", "svg")
                  .attr("width", width)
                  .attr("height", height)

    // 3. Define scales to translate domains of the data to the range of the svg
    var xMin = d3.min(data, (d) => d["Year"]);
    var xMax = d3.max(data, (d) => d["Year"]);

    let minutes = d3.timeParse("%M:%S")
    var yMin = minutes(d3.min(data, (d) => d["Time"]));
    var yMax = minutes(d3.max(data, (d) => d["Time"]));

    var xScale = d3.scaleLinear()
                    .domain([(xMin - 1), (xMax + 1)])
                    .range([margin.left, width - margin.right])

    var yScale = d3.scaleTime()
                    .domain([yMax, yMin])
                    .range([height - margin.bottom, margin.top])
                    .nice()

    // 4. Draw and transform/translate horizontal and vertical axes
    // With tickFormat, you can format the output.

    var xAxis = d3.axisBottom().scale(xScale)
                    .tickFormat(d3.format(".0f"));
    var yAxis = d3.axisLeft().scale(yScale)
                    .tickFormat(d3.timeFormat("%M:%S"));

    svg.append("g")
       .attr("transform", "translate(0, "+ (height - margin.bottom) + ")")
       .attr("id", "x-axis")
       .call(xAxis);

    svg.append("g")
       .attr("transform", "translate("+ (margin.left)+", 0)")
       .attr("id", "y-axis")
       .call(yAxis);

    // 5. Draw the individual circles

    const tooltip = d3.select("body")
                      .append("div")
                      .attr("id", "tooltip")
                      .style("visibility", "hidden")

    svg.selectAll("circle")
       .data(data)
       .enter()
       .append("circle")
       .attr("cx", (d) => xScale(d["Year"]))
       .attr("cy", (d) => yScale(minutes(d["Time"])))
       .attr("r", 5)
       .attr("class", "dot")
       .attr("data-xvalue", (d) => d["Year"])
       .attr("data-yvalue", (d) => minutes(d["Time"]))
       .style("fill", (d) => {
            if (d["Doping"] == "") {
               return color(keys[0])
            }
            else {
                return color(keys[1])
            }
       })
       .on("mouseover", function(d){
           tooltip.style("visibility", "visible")
                  .style("left", event.pageX+10+"px")
                  .style("top", event.pageY-30+"px")
                  .attr("id", "tooltip")
                  .attr("data-year", d["Year"])
                  .html( d["Name"] + ", " + d["Nationality"] + "<br>" 
                    + "Year: " + d["Year"] + " Time: " + d["Time"] + "<br>" + "<br>" 
                    + d["Doping"])
       })
       .on("mouseout", function(){
           tooltip.style("visibility", "hidden")
       })

    // 6. Finalize chart by adding title and axes labels
    svg.append("text")
        .attr("x", margin.left + (width - margin.left - margin.right) / 2)
        .attr("y", height - margin.bottom / 5)
        .attr("class", "label")
        .text("Year");

    svg.append("text")
         .attr("y", margin.left/4)
         .attr("x", -height/2)
         .attr("transform", "rotate(-90)")
         .attr("class", "label")
         .text("Time in minutes");

    svg.append("text")
        .attr("x", margin.left + (width - margin.left - margin.right) / 2)
        .attr("y", margin.top / 2)
        .attr("id", "title")
        .text("Doping in proffessional bicycle racing");

    svg.append("text")
        .attr("x", width / 3)
        .attr("y", margin.top - 10)
        .attr("id", "subtitle")
        .text("35 fastests times up to Alpe d'Huez");

    // Add the legend
    // Add one dot in the legend for each category
    svg.selectAll("mydots")
       .data(keys)
       .enter()
       .append("rect")
            .attr("x", width - 125)
            .attr("y", (d,i) => {return 100 + i*(size+5)})
            .attr("id", "legend")
            .attr("width", size)
            .attr("height", size)
            .attr("fill", (d) => { return color(d)});

    // Add one description at each dot
    svg.selectAll("mylabels")
       .data(keys)
       .enter()
       .append("text")
            .attr("x", width - 100)
            .attr("y", (d, i) => { return 100 + i*(size+5) + (size/2)})
            .text((d) => {return d})
            .attr("text-anchor", "left")
            .style("font-size", "10px")
            .style("alignment-baseline", "middle");
}
