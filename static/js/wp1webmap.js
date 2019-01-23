function displayMap(city) {

    if ("map" in window) {
        map.remove();
    };

    map = L.map('map', {
        maxZoom: 13,
        minZoom: 10
    });

    var baseUrl = "http://data.yannforget.me/maupp_v2.6/tiles/";

    $.getJSON(baseUrl + city + '/aoi.geojson', {}, function (feature) {

        var style = {
            "color": "#C43C39",
            "weight": 2,
            "opacity": 1,
            "fillOpacity": 0
        };

        var aoi = L.geoJSON(feature, { style: style }).addTo(map);
        var bounds = aoi.getBounds();
        map.setView(bounds.getCenter(), 10);
        map.setMaxBounds(bounds);

    });

    var esri = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
            maxZoom: 13,
        }
    );

    var osm = L.tileLayer('https://korona.geog.uni-heidelberg.de/tiles/roadsg/x={x}&y={y}&z={z}', {
        maxZoom: 13,
        attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    /*
    var osmToner = L.tileLayer(
        'http://a.tile.stamen.com/toner/{z}/{x}/{y}.png',
        {
            attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
            maxZoom: 13,
        }
    ).addTo(map);
    */

    baseLayers = { "Satellite": esri, "OpenStreetMap": osm }

    var bu2015 = new L.tileLayer(baseUrl + city + "/builtup_2015/{z}/{x}/{y}.png", { tms: true, opacity: 0.6, attribution: 'MAUPP' });
    var bu2010 = new L.tileLayer(baseUrl + city + "/builtup_2010/{z}/{x}/{y}.png", { tms: true, opacity: 0.6, attribution: 'MAUPP' });
    var bu2005 = new L.tileLayer(baseUrl + city + "/builtup_2005/{z}/{x}/{y}.png", { tms: true, opacity: 0.6, attribution: 'MAUPP' });
    var bu2000 = new L.tileLayer(baseUrl + city + "/builtup_2000/{z}/{x}/{y}.png", { tms: true, opacity: 0.6, attribution: 'MAUPP' });
    var bu1995 = new L.tileLayer(baseUrl + city + "/builtup_1995/{z}/{x}/{y}.png", { tms: true, opacity: 0.6, attribution: 'MAUPP' });
    var budate = new L.tileLayer(baseUrl + city + "/builtup_history/{z}/{x}/{y}.png", { tms: true, opacity: 0.8, attribution: 'MAUPP' });
    var expansion20002015 = new L.tileLayer(baseUrl + city + "/expansion_2000_2015/{z}/{x}/{y}.png", { tms: true, opacity: 0.8, attribution: 'MAUPP' });

    builtupOverlays = {
        "Built-Up Areas": {
            "2015": bu2015,
            "2010": bu2010,
            "2005": bu2005,
            "2000": bu2000,
            "1995": bu1995
        }
    };

    builtupHistOverlays = {
        "Built-Up Areas History": {
            "History": budate
        }
    };

    expansionOverlays = {
        "Urban Expansion": {
            "2000-2015": expansion20002015
        }
    };

    L.control.scale({maxWidth: 200}).addTo(map);
    map.addControl(new L.Control.Fullscreen());

    displayBuiltUp('builtupAreas');

};


function displayBuiltUp(layerType) {

    if (typeof (layerControl) != "undefined") {
        map.removeControl(layerControl);
    };

    if (typeof (legend) != "undefined") {
        map.removeControl(legend);
    };

    map.eachLayer(function (layer) {
        var attrib = layer.getAttribution();
        if (attrib == 'MAUPP') {
            map.removeLayer(layer);
        };
    });

    switch (layerType) {
        case "builtupAreas":
            var options = { collapsed: false, exclusiveGroups: ["Built-Up Areas"] };
            layerControl = L.control.groupedLayers(baseLayers, builtupOverlays, options);
            var colors = ["#C43C39"];
            var labels = ["Built-Up Areas"];
            builtupOverlays["Built-Up Areas"]["2015"].addTo(map);
            break;
        case "builtupHistory":
            var options = { collapsed: false, exclusiveGroups: ["Built-Up Areas History"] };
            layerControl = L.control.groupedLayers(baseLayers, builtupHistOverlays, options);
            var colors = ["#B30000", "#DA3B28", "#F2724A", "#FDA66D", "#FED49A"]
            var labels = ["1995", "2000", "2005", "2010", "2015"];
            builtupHistOverlays["Built-Up Areas History"]["History"].addTo(map);
            break;
        case "builtupExpansion":
            var options = { collapsed: false, exclusiveGroups: ["Urban Expansion"] };
            layerControl = L.control.groupedLayers(baseLayers, expansionOverlays, options);
            var colors = ["#333333", "#8D5A99", "#85B66F", "#C43C39"];
            var labels = ["Existing Built-Up", "Infill", "Extension", "Leapfrog"];
            expansionOverlays["Urban Expansion"]["2000-2015"].addTo(map);
            break;
    };

    map.getSize();
    layerControl.addTo(map);

    legend = L.control({ position: "bottomleft" });
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'legend');
        for (i = 0; i < colors.length; i++) {
            div.innerHTML += '<i style="background:' + colors[i] + '"></i> ' + labels[i] + '<br>';
        };
        return div;
    };
    legend.addTo(map);

};

map = L.map('map', {minZoom: 10, maxZoom: 13});

displayMap("windhoek");
