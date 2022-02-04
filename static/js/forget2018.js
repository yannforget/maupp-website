var base_url = '../../raster_products/tiles/yforget/'

var mapbox = L.tileLayer(
    'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
    {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 15,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoieWFubmZvcmdldCIsImEiOiJjamgzYXR1d3UwZDN6MnhtcjBnYno3cDBwIn0.-niyuGtiqe_osXNIevrb5Q'
    }
);

var esri = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 15,
    }
);

var map = L.map('map', {
    layers: [esri,mapbox],
    maxZoom: 15,
    minZoom: 11
});

L.control.scale({maxWidth: 200}).addTo(map);

var controller = L.control.layers(
    { 'Satellite imagery': esri, 'OpenStreetMap': mapbox },
    {},
    { collapsed: false }
).addTo(map);

function displayMap(city) {

    map.eachLayer(function (layer) {
        var attribution = layer.getAttribution()
        if (attribution === null) {
            map.removeLayer(layer);
        };
    });

    controller.remove();

    $.getJSON('../../data/forget2018/bounds/' + city + '.json', function (bounds) {

        var lat_center = bounds.lat_min + (bounds.lat_max - bounds.lat_min) / 2;
        var lon_center = bounds.lon_min + (bounds.lon_max - bounds.lon_min) / 2;

        map.setView([lat_center, lon_center], 11);
        map.setMaxBounds([
            [bounds.lat_min, bounds.lon_min],
            [bounds.lat_max, bounds.lon_max]
        ]);
    });

    var results = new L.tileLayer(base_url + city + '/result_tiles/{z}/{x}/{y}.png', { tms: true, opacity: 0.7 });
    var train = new L.tileLayer(base_url + city + '/train_tiles/{z}/{x}/{y}.png', { tms: true, opacity: 0.7 });
    var test = new L.tileLayer(base_url + city + '/test_tiles/{z}/{x}/{y}.png', { tms: true, opacity: 0.7 });

    controller = L.control.layers(
        { 'Satellite imagery': esri, 'OpenStreetMap': mapbox },
        { 'Results': results, 'Training dataset': train, 'Validation dataset': test },
        { collapsed: false }
    ).addTo(map);

};

displayMap("antananarivo");
