
var url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"

// 1. Select the data

fetch (url)
    .then (response => {
        if (!response.ok) {
            throw new Error('Network error');
        }
        return response.json();
    })
    .then (data => {
        makeChart(data);
    });

function getColor (temp, colors) {
    if (temp < 2.8)
        return colors[0];
    else if (temp < 3.9)
    {
        return colors[1];
    }
    else if (temp < 5.0)
    {
        return colors[2];
    }
    else if (temp < 6.1)
    {
        return colors[3];
    }
    else if (temp < 7.2)
    {
        return colors[4];
    }
    else if (temp < 8.3)
    {
        return colors[5];
    }
    else if (temp < 9.4)
    {
        return colors[6];
    }
    else if (temp < 10.5)
    {
        return colors[7];
    }
    else if (temp < 11.6)
    {
        return colors[8];
    }
    else if (temp < 12.7)
    {
        return colors[9];
    }
    else
    {
        return colors[10];
    }
}

function makeChart (data) {

    // 2. Append svg-object for the heatmap to a div in your webpage
    // (here we use a div with id=container)

    var width = 1500;
    var height = 520;
    var margin = {left: 90, top: 70, bottom: 70, right: 20};

    const svg = d3.select("#container")
                  .append("svg")
                  .attr("id", "svg")
                  .attr("width", width)
                  .attr("height", height)

    // 3. Define scales to translate domains of the data to the range of the svg
    var xMin = d3.min(data.monthlyVariance, (d) => d.year);
    var xMax = d3.max(data.monthlyVariance, (d) => d.year);
    console.log ("Min " + xMin);
    console.log ("max" + xMax);

    const baseTemp = data.baseTemperature

    const months = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];

    const colors = ["#1B5E20","#388E3C","#4CAF50","#81C784","#C8E6C9",
            "#FFE0B2","#FFB74D","#FF9800","#F57C00","#E65100","#DD2C00"];


    var xScale = d3.scaleLinear()
                    .domain([xMin, xMax])
                    .range([margin.left, width - margin.right])
    
    var yScale = d3.scaleBand()
                   .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
                   .range([height-margin.bottom, margin.top]);

    // 4. Draw and transform/translate horizontal and vertical axes
    // With tickFormat, you can format the output.

    var xAxis = d3.axisBottom().scale(xScale)
        .tickFormat(d3.format(".0f"));

    var yAxis = d3.axisLeft().scale(yScale)
        .tickValues(yScale.domain())
        .tickFormat (function(d) { 
            return months[d];
        });

    svg.append("g")
       .attr("transform", "translate(0, "+ (height - margin.bottom) + ")")
       .attr("id", "x-axis")
       .call(xAxis);

    svg.append("g")
       .attr("transform", "translate("+ (margin.left)+", 0)")
       .attr("id", "y-axis")
       .call(yAxis)

    // Draw the rects, representing the heatmap
    // First, set the size of the rects
    const widthRect = parseFloat((width - margin.left - margin.right) / (xMax - xMin));
    const heightRect = yScale.bandwidth();

    const tooltip = d3.select("body")
                      .append("div")
                      .attr("id", "tooltip")
                      .style("visibility", "hidden")

    svg.selectAll("rect")
        .data(data.monthlyVariance)
        .enter()
        .append("rect")
        .attr("class", "cell")
        .attr("x", (d) => { 
            return xScale(d.year);
        })
        .attr("y", (d) => {
            return yScale(d.month - 1);
        })
        .attr("width", widthRect)
        .attr("height", heightRect)
        .attr("data-month", (d) => d.month - 1)
        .attr("data-year", (d) => d.year)
        .attr("data-temp", (d) => d.variance + baseTemp)
        .attr("fill", (d, i) => {
            const temp = parseFloat(d.variance + baseTemp);
            return getColor(temp, colors)
        })
        .on("mouseover", function(d){
           tooltip.style("visibility", "visible")
                  .style("left", event.pageX+10+"px")
                  .style("top", event.pageY-30+"px")
                  .attr("id", "tooltip")
                  .attr("data-year", d.year)
                  .html(months[d.month -1] + " " + d.year + "<br>" +
                    "Temperature: " + (d.variance + baseTemp).toFixed(1))
                })
       .on("mouseout", function(){
           tooltip.style("visibility", "hidden")
       })

    // 6. Finalize chart by adding title and axes labels

    svg.append("text")
        .attr("x", margin.left + (width - margin.left - margin.right) / 2)
        .attr("y", margin.top * 0.33)
        .attr("id", "title")
        .text("Monthly global land-surface temperature");

    svg.append("text")
        .attr("x", margin.left + (width - margin.left - margin.right) / 3)
        .attr("y", margin.top * 0.66)
        .attr("id", "description")
        .text(xMin + " - " + xMax + ", Base temperature: " + baseTemp);

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
         .text("Month");

    // Add the legend
    // Add the rects for each color

    var xScaleLegend = d3.scaleLinear()
                    .domain([0, 10])
                    .range([margin.left + 40, width / 4]);

    var xAxisLegend = d3.axisBottom().scale(xScaleLegend)
        .tickFormat(function (d, i) {
            const legendLabel = (2.8 + (1.1*(i)));
            return legendLabel.toFixed(1);
        });

    svg.append("g")
       .attr("transform", "translate(0, "+ (height - 20) + ")")
       .attr("id", "x-axislegend")
       .call(xAxisLegend);

    svg.selectAll("legrect")
      .data(colors)
      .enter()
      .append("rect")
      .attr("x", (d,i)=>{
        return xScaleLegend(i-1);
      })
      .attr("y", (d) => {
        return height - 50;
      })
      .attr("width", 50)
      .attr("height", 30)
      .style("fill",(d,i)=>{            
            return colors[i];            
      });
 
}

