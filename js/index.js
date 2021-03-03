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



	/*AQUI EU PEGO OS ARQUIVOS GEOJSON, E TRATO ELES.
	PRIMEIRO TODOS OS MUNICIPIOS E DEPOIS OS PINS PARA CADA MUNICIPIO*/
	function loadDadosMunicipios() {
		/*Obtenho o meu geojson local no caso area-municipios.. e data está recebendo todos os valores*/
		fetch("/js/geojson/area-municipios-ma-br.geojson")
		.then(function (response) {
		return response.json();
		})
		.then(function (data)  {
		L.geoJSON(data).addTo(map);

	//
	// Adicionando o nome da cidade para exibir ao lado
	function addTextoDiv(text) {
		const nomeMunicipio = document.querySelector(".nomeMunicipio");
		nomeMunicipio.textContent = text;
	}

	
/*Pegando api eixos*/
async function getEixos() {
    try {
        const response = await fetch('http://api.homologacao.promunicipios.ma.gov.br/api/eixo')
            //console.log('ok funcionou')
        const data = await response.json()
        show1(data)
    } catch (error) {
        console.error(error)
    }
}

getEixos()

/*Listando eixos e jogando no front*/
function show1(eixos) {
    
    let lista_eixos = ''
    for (let eixo of eixos) {
        lista_eixos += `<p>${eixo.nome}</p>`
    }
    document.querySelector('#listEixos').innerHTML = lista_eixos
}

	//Busco no geojson uma propriedade ele verifica e pega o que eu quero no caso 'name'. 
	//meu paramento layer chama o popup jogando nele o nome do municipio
	function getDados(feature, layer) {
		if (feature.properties && feature.properties.name) {
		layer.bindPopup(feature.properties.name);
		}
	}
	/*Obtenho o meu geojson local pins-municipios que me trás os pins e coordenada de cada municipio*/
	fetch("/js/geojson/pins-municipios-ma-br.geojson")
		.then(function (response) {
		return response.json();
		})
		.then(function (pins) {

	/*AQUI EU JOGO DENTRO DE layer OS PINS
	VIA ONEACHFEATURE PEGO OS DADOS DO GEOJSON E TRABALHO COM ELES
	PARA O EFEITO DE OVER E EXIBIÇÃO DO POPUP*/
	var layer = new L.GeoJSON(data, {

		onEachFeature: function (feature, layer) {
		layer.on("mouseover", function (e) {

		getDados(feature, layer);

		addTextoDiv(feature.properties.name);

		this.openPopup();
		// Estilo do mouseover
		this.setStyle({
			fillColor: "#ffea00",
			weight: 2,
			color: "#ffea00",
			fillOpacity: 1
			});
		});

	layer.on("mouseout", function () {
	this.closePopup();

	this.setStyle({
		fillColor: "#db4a52",
		weight: 2,
		color: "#ffff",
		fillOpacity: 0.2
		});
	});

layer.on("click", function () {
	
//adding the province name to the visible div
addTextoDiv(feature.properties.name);

});
}
}).addTo(map);

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

		geoLayer.eachLayer(function (layer) {
		var col = colors[~~(Math.random() * colors.length)];
		layer.setStyle({ fillColor: col });
		});

		setTimeout(updateColors, 1500);
		}


	});

	}

	loadDadosMunicipios()


