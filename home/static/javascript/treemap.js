
$(document).ready(function() {
    $('#data-selector').change(function() {
        var newData = $("input[name='optradio']:checked").val();
        var tileValue = document.getElementById("graphStyle").value;
        console.log(tileValue);
        getData(newData, tileValue);
    });

    var urlVideo = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";
    var urlGames = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";
    var urlKick = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json";
    const descGames = "Top 100 most sold video games grouped by platform";
    const descVideo = "Top 100 highest grossing movies grouped by genre";
    const descKick = "Top 100 most plegded kickstarter campaigns grouped by category";
    const tileMethod = [d3.treemapBinary, d3.treemapSquarify, d3.treemapSliceDice, d3.treemapSlice, d3.treemapDice];

    // 1. Select the data

    function getData (type, tileValue) {
        $('#container').empty();
        $('#legend').empty();
        var url = "";
        var subtitle = "";
        var tile = tileMethod[tileValue];

        if (type === 'movies') {
            url = urlVideo;
            subtitle = descVideo;
        }
        else if (type === 'games') {
            url = urlGames;
            subtitle = descGames;
        }
        else {
            url = urlKick;
            subtitle = descKick;
        }

        fetch (url)
            .then (response => {
                if (!response.ok) {
                    throw new Error('Network error');
                }
                return response.json();
            })
            .then (data => {
                console.log(data);
                makeChart(data, subtitle, tile);
            });
    }

    function makeChart (data, subtitle, tile) {

        // 2. Append svg-object for the heatmap to a div in your webpage
        // (here we use a div with id=container)

        var width = 960;
        var height = 600;
        var border = 1;
        var margin = {left: 10, top: 10, bottom: 10, right: 10};

        // Specify the color scale
        const color = d3.scaleOrdinal((d3.schemeCategory10).concat(d3.schemeAccent));
    
        $("#title").text(data.name);
        var description = d3.select('#description');
        description.html(subtitle);

        // Create the svg
        const svg = d3.select("#container")
                  .append("svg")
                  .attr("id", "svg")
                  .attr("width", width)
                  .attr("height", height)
                  .style("border", border+"px solid black");

        console.log("Tile :", tile);
        // Compute the layout
        var treemap = d3.treemap()
                .size([width, height])
                .tile(tile)
                .paddingInner(border)
                .round(true),
            root = d3.hierarchy(data)
                .sum(d => d.value)
                .sort((a, b) => b.value - a.value);

        var nodes = root.descendants();
        treemap(root);

        // Add the cells
        var cells = svg.selectAll("g")
                .data(nodes)
                .enter()
                .append("g")
                .attr("transform", d =>"translate("+d.x0+","+d.y0+")");
        cells.append("rect")
                .attr("class", "tile")
                .attr("id", d => d.data.category+"."+d.data.name)
                .attr("data-name", d => d.data.name)
                .attr("data-category", d => d.children?"":d.data.category)
                .attr("data-value", d => d.children?"":d.data.value)
                .style("width", d => d.x1 - d.x0)
                .style("height", d => d.y1 - d.y0)
                .style("fill", d => d.children?null:color(d.data.category));

        // Add text to the cells
        cells.append("text")
                .selectAll("tspan")
                .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
                .enter()
                .append("tspan")
                .attr("class", "cellText")
                .attr("x", 4)
                .attr("y", (d, i) => 13 + i * 11)
                .text(d => d);

        // create Tooltip
        var tooltip = d3.select("body")
                .append("div")
                .attr("id", "tooltip")
                .style("position", "absolute")
                .style("visibility", "hidden");

        svg.selectAll("rect").on("mouseover", function(d) {
            return tooltip.html(d3.select(this).attr("data-name")+", "
                +d3.select(this).attr("data-category")+"<br/>"
                +"Value: "+d3.select(this).attr("data-value"))
                .attr("data-value", d3.select(this).attr("data-value"))
                .style("visibility", "visible")
            })
            .on("mousemove", () => tooltip.style("top", (event.pageY-10)+"px")
                .style("left",(event.pageX+10)+"px"))
            .on("mouseout", () => tooltip.style("visibility", "hidden"));
    
        // LEGEND      
        var legendVals = d3.set(nodes.filter(e => !e.children)
                            .map(e => e.data.category)).values();

        var leg = d3.select('#legend')
                .append('svg')
                .attr('height', 200)
                .attr('width', 400);
  
        var legendRectSize = 20;  

        // legend groups
        var g = leg.selectAll('rect')
            .data(legendVals)
            .enter()
            .append('g')
                .attr('transform', (d,i) => {
                    return 'translate('+(i % 3) * 150 +','+ Math.floor(i/3) * legendRectSize +')'
                }) 
  
        g.append('rect')
            .attr('class', 'legend-item')
            .attr('width', legendRectSize)
            .attr('height', legendRectSize)
            .style('stroke', 'white')
            .attr('fill', (d, i) => color(legendVals[i]))
  
        g.append('text')
            .text((d, i) => legendVals[i])
            .attr('y', legendRectSize * .7 )
            .attr('x', legendRectSize + 10)
    }
    // Ininial load the data
    var val1 = $("input[name='optradio']:checked").val();
    var tileValue = document.getElementById("graphStyle").value;
    getData(val1, tileValue);
});


