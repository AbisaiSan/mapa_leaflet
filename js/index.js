
function loadDadosMunicipios(){

    fetch("/js/geojson/area-municipios-ma-br.geojson")
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        L.geoJSON(data).addTo(map);
        for(var mun of data.features) {
            //console.log(mun.properties.name)
             ;
        }

    fetch("/js/geojson/pins-municipios-ma-br.geojson")
    .then(function(response) {
        return response.json();
    })
    .then(function(pins) {
        L.geoJSON(pins).addTo(map);
        
        
        gpsMarker = new L.geoJson(pins, {
        onEachFeature: function(Feature, layer) {
            
            if (Feature.properties && Feature.properties.Name) {
                layer.bindPopup(Feature.properties.Name, {closeButton: false, offset: L.point(0, -20)});
                layer.on('mouseover', function() { layer.openPopup(); });
                layer.on('mouseout', function() { layer.closePopup(); });
        }
    },
    pointToLayer: function (Feature, _latlng) {
        return L.circleMarker(_latlng);
    }
});

map.addLayer(gpsMarker);
map.fitBounds(gpsMarker.getBounds(), {padding: [0, 0]});


        
    });

//  add geojson  
geoLayer = L.geoJson(data).addTo(map),

// color scale from http://colorbrewer2.org
colors = ['#db4a52'];

// set base styles
geoLayer.setStyle({
    width: 735,
    height: 860,
    fillOpacity: 1,
    color: 'white',
    weight: 1,

});

updateColors();

// sets color of each layer randomly
function updateColors() {

    geoLayer.eachLayer(function(layer) {
        var col = colors[~~(Math.random() * colors.length)];
        layer.setStyle({ fillColor: col });
    });

    setTimeout(updateColors, 1500);
}

/*Mouse */



});
    
}

loadDadosMunicipios()



var map = new L.Map('map', {
    center: new L.LatLng(-5.00891349418116, -45.43778011911654),
    zoom: 6.5,
    zoomControl: false,
    dragging: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    tap: false
});
