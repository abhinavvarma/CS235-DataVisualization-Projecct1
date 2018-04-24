var containerWrapId = "containerWrap";
var containerId = "container";

function yearSlider() {
    var yearSlider = new rSlider({
        target: '#yearSlider',
        values: [2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015],
        range: false,
        tooltip: true,
        scale: true,
        labels: true,
        set: [2010],
        onChange: updateMap
    });
}

function loadMap(series, category) {
    // Datamaps expect data in format:
    // { "USA": { "fillColor": "#42a844", numberOfWhatever: 75},
    //   "FRA": { "fillColor": "#8dc386", numberOfWhatever: 43 } }
    var dataset = {};

    // We need to colorize every country based on "numberOfWhatever"
    // colors should be uniq for every value.
    // For this purpose we create palette(using min/max series-value)
    var onlyValues = series.map(function(obj){
        if (obj[1] === 0)
            return 0;
        var val = Math.log(obj[1]);
        console.log("numberOfWhatever: " + obj[1] + " Fun: " + val);
        return val;
    });
    var minValue = Math.min.apply(null, onlyValues),
        maxValue = Math.max.apply(null, onlyValues);

    // create color palette function
    // color can be whatever you wish
    var paletteScale = d3.scale.linear()
        .domain([minValue,maxValue])
        .range(["#EFEFFF","#02386F"]); // blue color

    // fill dataset in appropriate format
    series.forEach(function(item, i){ //
        // item example value ["USA", 70]
        var iso = item[0],
            value = item[1];
        dataset[iso] = { numberOfThings: value, fillColor: paletteScale(onlyValues[i]) };
    });

    // render map
    new Datamap({
        element: document.getElementById('container'),
        projection: 'mercator', // big world map
        // countries don't listed in dataset will be painted with this color
        fills: { defaultFill: '#F5F5F5' },
        data: dataset,
        done: function(datamap) {
            datamap.svg.selectAll('.datamaps-subunit').on('click', function (geography) {
                var country = geography.id;
                window.location = "page2.html?country=" + country;
            });
        },
        geographyConfig: {
            borderColor: '#DEDEDE',
            highlightBorderWidth: 2,
            // don't change color on mouse hover
            highlightFillColor: function(geo) {
                return geo['fillColor'] || '#F5F5F5';
            },
            // only change border
            highlightBorderColor: '#B7B7B7',
            // show desired information in tooltip
            popupTemplate: function(geo, data) {
                // don't show tooltip if country don't present in dataset
                if (!data) { return ; }
                // tooltip content
                return ['<div class="hoverinfo">',
                    '<strong>', geo.properties.name, '</strong>',
                    '<br>' + category + ': <strong>', data.numberOfThings, '</strong>',
                    '</div>'].join('');
            }
        }
    });
}

function getSeriesFromDataset(dataset, year, category) {
    var series = [];
    dataset.forEach(function (t) {
        if (t.Year === year)
            series.push([t.ISO, t[category]])
    });

    return series;
}

function updateMap() {
    var year = $("#yearSlider").val();
    year = parseInt(year);
    var category = $("#category").val();
    var dataset = getDataSet();

    var $containerWrap = $("#" + containerWrapId);
    $containerWrap.empty();
    var $mapContainer = $containerWrap.append("<div id='" + containerId + "'></div>");

    var series = getSeriesFromDataset(dataset, year, category);
    loadMap(series, category);
}

$('document').ready(function(){
    yearSlider();
    updateMap();
});