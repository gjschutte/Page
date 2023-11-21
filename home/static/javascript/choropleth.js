
// For getting all the data, we will need two requests. 
const urlList = {
    education: "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json",
	map: "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json"
};

// Data will be saved to two arrays
let eduData = [];
let mapData = [];
// Because AJAX is asynchronous, to track if the data transfer is completed
let readyCount = 0;

// Make the data requests when the page has loaded
document.addEventListener("DOMContentLoaded", function() {
    for (const property in urlList) {
        let request = new XMLHttpRequest();
        request.open("GET", urlList[property], true);
        request.send();

        // Receive the data
        request.onload = function() {
            if (property == "education") {
                eduData = JSON.parse(request.responseText);
                readyCount += 1;
            }
            else if (property == "map") {
                mapData = JSON.parse(request.responseText);
                readyCount += 1;
            }

            // Check that all the data has been received
            if (readyCount === Object.keys(urlList).length) {
                buildChart();
            };
        }; // End onload
    } // End For

    const buildChart = function () {

        const padding = {left: 20, top: 40, bottom: 20, right: 80};
        const width = 1000 + padding.left + padding.right;
        const height = 600 + padding.top + padding.bottom;

        // Variables for the legend
        const legendRectCount = 10; // How many rects in the legend
        const legendRectHeight = (height - padding.top - padding.bottom) / legendRectCount;
        const legendRectWidth = 10;
        const legendSpacing = 55 // Space between colors and the text

		// Set the colors
        // Note that the three colours have the same hue and lightness, 
        // only their saturation values are different:
		const minColor = "#dae6f2"; // hsl(208, 10, 95)
		const pivotColor = "#6db4f2"; // hsl(208, 55, 95)
		const maxColor = "#0081f2"; // hsl(208, 100, 95)
		const stateBorderColor = "orange";

        // Create the svg
        const svg = d3.select("#container")
                    .append ("svg")
                    .attr("id", "chart")
                    .attr("width", width)
                    .attr("height", height);

        // Add a title
        svg.append("text")
            .text("Higher Education Rates by US county")
            .attr("id", "title")
            .attr("transform", "translate(" + width / 2 + ", " + padding.top + ")")
            .attr("text-anchor", "middle");

        // Add a description
        svg.append("text")
            .text("Adults age > 25 with a bachelor's degree or higher (2010-2014)")
            .attr("id", "description")
            .attr("transform", "translate(" + width / 2 + ", " + 1.7 * padding.top + ")")
            .attr("text-anchor", "middle");

        // let the colors progress very granuarly, based on the data
        const eduMin = d3.min(eduData, (d) => d.bachelorsOrHigher);
        const eduMean = d3.mean(eduData, (d) => d.bachelorsOrHigher);
        const eduMax = d3.max(eduData, (d) => d.bachelorsOrHigher);

        const colorScale = d3.scaleLinear()
                    .domain ([eduMin, eduMean, eduMax]) // middle value for better result
                    .range ([minColor, pivotColor, maxColor]); // pivot color to match te pivot value in the domain.
                    
        // We need the data from two sets of data. In order to prevent 
        // unnecessary filtering, store the data in a temporary variable

        // Store the most recent eduData in a variable. Default, first one.
        let recentEduData = [eduData[0]];
        // Create a function to return the eduData for a given county
        const fetchEduData = function(d, keyName) {
            // if the object in recentEduData doesn't match the ID, update
            if (recentEduData[0].fips != d.id) {
                recentEduData = eduData.filter( (val) => val.fips == d.id);
            }
            return recentEduData[0][keyName];
        };

        // Create the tooltip
        const toolTipBox = d3.select("#container")
            .append("div")
            .attr("id", "tooltip");

        // Create a function to put together the content for the tooltip
        const toolTipContent = function(d) {
            let currentCounty = eduData.filter( (val) => val.fips == d.id) [0];
            let area_name = currentCounty.area_name;
            let state = currentCounty.state;
            let fips = d.id;
            let eduLevel = currentCounty.bachelorsOrHigher;

            return area_name + ", " + state + "<br>" + eduLevel + "%";
        };

        // Create the legend
        // First, create a group for all the legend elements
        const legend = svg
            .append("g")
            .attr("id", "legend")
            .attr("transform", "translate(" + (width - padding.left - padding.right) + ", " + (height - padding.bottom) + ")");
        
        // Populate the group. Create a function that can dynamically create the limits for each of the steps
        const legendData = function () {
            let arr = [eduMin]
            let stepSize = (eduMax - eduMean) / legendRectCount;
            for (i = 1; i <= legendRectCount - 1; i++) {
                arr.push( parseFloat( (i + stepSize + eduMin).toFixed(1) ))
            };
            arr.push(eduMax);
            return arr;
        };

        // Build the legend
        // First, place the rectangles
        legend.selectAll("rect")
            .data( legendData().slice(0, -1) )
            .enter()
            .append("rect")
            .attr("id", "legend-rect")
            .attr("y", (d, i) => i * ( -legendRectHeight) - legendRectHeight) // adding upwards
            .attr("width", legendRectWidth)
            .attr("height", legendRectHeight)
            .attr("fill", (d) => colorScale(d) )
            .attr("stroke", "white"); // see one rect change to the next

        // Then place the labels
        legend.append("g")
            .attr("id", "legend-axis")
            .selectAll("text")
            .data( legendData() )
            .enter()
            .append("text")
            .attr("id", "legend-label")
            .text( (d) => d + "%")
            .attr("y", (d, i) => i * (-legendRectHeight) )
            .attr("transform", "translate(" + legendSpacing + ", 0)");

        // Create the Choropleth chart. Use topoJSON, an extension of GeoJSON.
        // Because the data is already in a suitable format, no furhter transformation.

        // Path generator:
        const geoPathMaker = d3.geoPath()
            //.projection(null)
        ;

        // With the path generator, crate a container for all the counties,
        // using a group
        const counties = svg
            .append("g")
            .attr("id", "counties")
            .attr("transform", "translate(" + padding.left + ", " + padding.top + ")");

        // Also a container group for all the states
        const states = svg
            .append("g")
            .attr("id", "states")
            .attr("transform", "translate(" + padding.left + ", " + padding.top + ")");

        // Load all the county data in the county group
        counties
            .selectAll("path")
            .data( topojson.feature(mapData, mapData.objects.counties).features )
            .enter()
            .append("path")  // Add path elements (line segments) to create the map
            .attr("class", "county")
            .attr("d", geoPathMaker ) //defiened earlier
            .attr("data-fips", (d) => d.id ) // fips (in eduData) and id
                // (in mapData) are the unique id's to match between the 
                // two sets, so we can just return d.id, instea of fips
            .attr("data-education", (d) => fetchEduData(d, "bachelorsOrHigher" ))
            .attr("fill", (d) => colorScale ( fetchEduData(d, "bachelorsOrHigher") ))
            .on("mouseover", (d, i) => {
                toolTipBox
                    .style("top", d3.event.pageY + 10 + "px")
                    .style("left", d3.event.pageX + 10 + "px")
                    .attr("data-education", fetchEduData(d, "bachelorsOrHigher"))
                    .style("background", colorScale(fetchEduData(d, "bachelorsOrHigher")) )
                    .style("visibility", "visible")
                    .html( toolTipContent(d) );
            })
            .on("mouseout", (d, i) => {
                toolTipBox
                    .style("visibility", "hidden");
            });
        
        // Also place the elements for the state borders
        states
            .selectAll("path")
            .data( topojson.feature(mapData, mapData.objects.states).features )
            .enter()
            .append("path")
            .attr("class", "state")
            .attr("d", geoPathMaker)
            .attr("fill", "none") // so the states are transparent
            .attr("stroke", "orange"); // so we can identify the states
        
    };
});
