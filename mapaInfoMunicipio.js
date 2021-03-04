var myMap = L.map('mapid', {
    center: [-5.00891349418116, -45.43778011911654],
    zoom: 6,
});

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiYWJpc2Fpc2VhdGkiLCJhIjoiY2trc2NkbXJ2MTE1dTJ3cGE4eXZrZHRxZSJ9.XsH2LScNnH8Wid9ok_thVw'

}).addTo(myMap);
  
fetch(
    "/js/geojson/area-municipios-ma-br.geojson"
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var layer = new L.GeoJSON(data, {
        // A Function that will be called once for each
        // created Feature, after it has been created and styled
        onEachFeature: function (feature, layer) {
          layer.on("mouseover", function (e) {
            // bindPopup
            getVoivodeshipName(feature, layer);
            // show voivodeship
            
           
            // style
            this.setStyle({
              fillColor: "#eb4034",
              weight: 2,
              color: "#eb4034",
              fillOpacity: 0.7
            });
          });
          layer.on("mouseout", function () {
           
            // style
            this.setStyle({
              fillColor: "#3388ff",
              weight: 2,
              color: "#3388ff",
              fillOpacity: 0.2
            });
          });
          layer.on("click", function () {
            // adding the province name to the visible div
            addTextToDiv(feature.properties.name);
          });
        }
      }).addTo(map);
    });
  