
/*AQUI EU PEGO OS ARQUIVOS GEOJSON, E TRATO ELES.
PRIMEIRO TODOS OS MUNICIPIOS E DEPOIS OS PINS PARA CADA MUNICIPIO*/

function loadDadosMunicipios(){

    fetch("/js/geojson/area-municipios-ma-br.geojson")
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        L.geoJSON(data).addTo(map);
     
    
    fetch("/js/geojson/pins-municipios-ma-br.geojson")
    .then(function(response) {
        return response.json();
    })
    .then(function(pins) {
        L.geoJSON(pins).addTo(map);
        
        /*AQUI EU JOGO DENTRO DE GPSMARKER OS PINS
        VIA ONEACHFEATURE PEGO OS DADOS DO GEOJSON E TRABALHO COM ELES
        PARA O EFEITO DE OVER E EXIBIÇÃO DO POPUP*/

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

//ADICIONO O MEU GEOJSON DENTRO DE GEOLAYER E ADICIONO AO MAPA  
geoLayer = L.geoJson(data).addTo(map),

// AQUI DEFINO AS CORES DO MEU MAPA, POSSO DEFINIR UMA COR OU VARIAS
//color scale from http://colorbrewer2.org
colors = ['#db4a52'];

// AQUI DEFINO O ESTILO
geoLayer.setStyle({
    width: 735,
    height: 860,
    fillOpacity: 1,
    color: 'white',
    weight: 1,

});

updateColors();

// AQUI SETO A COR DE FORMA RANDOMICA, SE NA VARIAVEL COLORS TIVER APENAS UMA COR
// O MAPA TERÁ APENAS ELA, MAS SE DEFINIR MAIS CORES, O MAPA TERA ESSAS CORES..
// E IRÁ ALTERAR DE FORMA RANDOMICA AS CORES EM CADA MUNICIPIO DO MAPA.
function updateColors() {

    geoLayer.eachLayer(function(layer) {
        var col = colors[~~(Math.random() * colors.length)];
        layer.setStyle({ fillColor: col });
    });

    setTimeout(updateColors, 1500);
}


});
    
}

loadDadosMunicipios()


/*CHAMADA DO LEAFLET*/
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
