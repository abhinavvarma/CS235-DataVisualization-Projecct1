function bubbleChart(criteria) {
    var width = 960,
        height = 960,
        maxRadius = 20,
        columnForColors = "Disaster_type",
        columnForRadius = criteria;

    function barChartData(disaster_type, criteria) {
        var data_set = getDataSet()[getUrlParameter("country")];
        var list = [];
        for (var key in data_set) {
            var val = 0;
            var disasters = data_set[key];
            for (var index in disasters) {
                var disaster = disasters[index];
                if (disaster['Disaster_type'] == disaster_type) {
                    val = disaster[criteria];
                    break;
                }
            }

            list.push([key, val])
        }

        return list;
    }

    function chart(selection) {
        var data = selection.datum();
        var div = selection,
            svg = div.selectAll('svg');
        svg.attr('width', width).attr('height', height);

        var tooltip = selection
            .append("div")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("color", "white")
            .style("padding", "8px")
            .style("background-color", "#626D71")
            .style("border-radius", "6px")
            .style("text-align", "center")
            .style("font-family", "monospace")
            .style("width", "400px")
            .text("");


        var simulation = d3.forceSimulation(data)
            .force("charge", d3.forceManyBody().strength([-50]))
            .force("x", d3.forceX())
            .force("y", d3.forceY())
            .on("tick", ticked);

        function ticked(e) {
            node.attr("cx", function(d) {
                return d.x;
            })
                .attr("cy", function(d) {
                    return d.y;
                });
        }

        var colorCircles = d3.scaleOrdinal(d3.schemeCategory10);
        var scaleRadius = d3.scaleLinear().domain([d3.min(data, function(d) {
            return +d[columnForRadius];
        }), d3.max(data, function(d) {
            return +d[columnForRadius];
        })]).range([5, 20])

        var node = svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr('r', function(d) {
                return scaleRadius(d[columnForRadius])
            })
            .style("fill", function(d) {
                return colorCircles(d[columnForColors])
            })
            .attr('transform', 'translate(' + [width / 2, height / 2] + ')')
            .on("mouseover", function(d) {
                tooltip.html(d[columnForColors] + "<br>" + d[columnForRadius] + "  " + criteria);
                return tooltip.style("visibility", "visible");
            })
            .on("mousemove", function() {
                return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
            })
            .on("mouseout", function() {

                return tooltip.style("visibility", "hidden");
            });
    }

    chart.width = function(value) {
        if (!arguments.length) {
            return width;
        }
        width = value;
        return chart;
    };

    chart.height = function(value) {
        if (!arguments.length) {
            return height;
        }
        height = value;
        return chart;
    };


    chart.columnForColors = function(value) {
        if (!arguments.columnForColors) {
            return columnForColors;
        }
        columnForColors = value;
        return chart;
    };

    chart.columnForRadius = function(value) {
        if (!arguments.columnForRadius) {
            return columnForRadius;
        }
        columnForRadius = value;
        return chart;
    };

    return chart;
}

function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

function updateMap() {
    var year = $("#yearSlider").val();
    var category = $("#category").val();
    var country_name = getUrlParameter("country");
    $("#yearDisplay").text(year);
    $("#svg").empty();

    var data = getDataSet();
    data = data[country_name][year];
    console.log(data)
    if (data == undefined) {
        var chart = bubbleChart(category).width(600).height(400);
        d3.select('#chart').datum([]).call(chart);
    }
    else {
        // selection.datum() returns the bound datum for the first element in the selection and
        //  doesn't join the specified array of data with the selected elements
        var chart = bubbleChart(category).width(600).height(400);
        d3.select('#chart').datum(data).call(chart);
    }
}

$('document').ready(function(){
    updateMap();
});