// Satellite imagery from ESRI
var esri = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 17,
}
);

// Initialize Leaflet map
var map = L.map('map', {
    layers: [esri],
    maxZoom: 17,
    minZoom: 11,
});

// Scalebar
L.control.scale({maxWidth: 200}).addTo(map);

// Initialize layer control
var controller = L.control.layers(
    { 'Satellite imagery': esri },
    {},
    { collapsed: false }
).addTo(map);

/*
The following function update the view and the layers
of the map according to the city (i.e. ouagadougou or
dakar).
*/
function displayMap(city) {

    /*
    Remove all existing layers from the map, except if
    it has a non-null attribution. Here, only the Esri
    layer has an attribution.
    */
    map.eachLayer(function (layer) {
        var attribution = layer.getAttribution()
        if (attribution === null) {
            map.removeLayer(layer);
        };
    });

    controller.remove();

    // Coordinates dependending on the city
    switch (city) {
        case "ouagadougou":
            lon_min = -1.7152;
            lon_max = -1.3606;
            lat_min = 12.2165;
            lat_max = 12.4921;
            break;
        case "dakar":
            lon_min = -17.5534;
            lon_max = -17.0904;
            lat_min = 14.5950;
            lat_max = 14.8885;
            break;
    };

    var lon_center = lon_min + (lon_max - lon_min) / 2;
    var lat_center = lat_min + (lat_max - lat_min) / 2;

    // Center the view on the city
    map.setView([lat_center, lon_center], 11);
    map.setMaxBounds([
        [lat_min, lon_min],
        [lat_max, lon_max]
    ]);

    // Remote land cover TMS layer
    var landcover = L.tileLayer('https://data.yannforget.me/misc/tais/tiles/' + city + '_landcover/{z}/{x}/{y}.png', {
        tms: true,
        opacity: 1.0
    }).addTo(map);

    // Update layer control
    controller = L.control.layers(
        { 'Satellite Imagery': esri },
        { 'Land cover': landcover },
        { collapsed: false }
    ).addTo(map);

    /*
    Load land use data from landuse.geojson.
    Apply style on each feature depending on
    the "MAP_LABEL" property and update the
    map accordingly.
    */
    var promise = $.getJSON('../../data/grippa2018/' + city + '/landuse.geojson');
    promise.then(function (data) {

        var landuse = L.vectorGrid.slicer(data, {
            rendererFactory: L.canvas.tile,
            vectorTileLayerStyles: {
                sliced: function (properties) {
                    var p = properties.maplabel;
                    return {
                        fillColor:
                            p === "VEG" ? "#34a400" :
                            p === "BARE" ? "#f6edc5" :
                            p === "ACS" ? "#cf43cd" :
                            p === "PLAN" ? "#e56b36" :
                            p === "PLAN_LD" ? "#ffb83d" :
                            p === "UNPLAN_LD" ? "#f09da8" :
                            p === "UNPLAN" ? "#e31732" :
                            p === "AGRI" ? "#60da69" :
                            p === "DEPR" ? "#E31732" : "#b0b0b0",
                        fillOpacity: 1.0,
                        stroke: false,
                        fill: true,
                    }
                }
            },
            interactive: false,
            maxNativeZoom: 17,
            maxZoom: 17,
        });

        controller.addOverlay(landuse, 'Land use');

    });

    // Display only the relevant legend div
    switch (city) {
        case "ouagadougou":
            $("#legend-dakar").hide();
            $("#legend-ouagadougou").show();
            break;
        case "dakar":
            $("#legend-ouagadougou").hide();
            $("#legend-dakar").show();
            break;
    };

};

// Load Ouagadougou map by default.
displayMap("ouagadougou");
