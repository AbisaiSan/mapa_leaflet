var myMap = L.map('mapid', {
    center: [-5.00891349418116, -45.43778011911654],
    zoom: 5.5,
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

            onEachFeature: function (feature, layer) {

                layer.on("mouseover", function () {
                    // style
                    this.setStyle({
                        fillColor: "#3388ff",
                        weight: 2,
                        color: "#3388ff",
                        fillOpacity: 0.2
                    });
                });

            }
        }).addTo(myMap);
    });



/*SCRIPTS PARA TRAZERS OS DADOS DO MUNICIPIO*/

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const eixoId = urlParams.get('eixo');
const municipioId = urlParams.get('municipio');

/*LISTAR TUDO QUE HÁ EM PROGRAMAS*/

async function getL() {
    try {
        const response = await fetch(`http://api.homologacao.promunicipios.ma.gov.br/api/projeto/municipio/${municipioId}`)
        //console.log('ok funcionou')
        const data = await response.json()
        show1(data)
      

    } catch (error) {
        console.error(error)
    }
}

getL()


function show1(eixos) {

    let lista_eixos = ''
    for (let municipio of eixos) {

        lista_eixos += `<option >${municipio.nome}</option>`
        // console.log(lista_eixos)
    }
    // document.querySelector('#selectEixo').innerHTML = lista_eixos
}


var nomeMunicipioCsv;
var eixoMunicipioCsv;
var programaMunicipioCsv;
var descProgramaCsv;
var nomeProjetoCsv;
var dataInicioProgramaCsv;
var NbeneficiadosCsv;

const todosOsProjetos = fetch(`http://api.homologacao.promunicipios.ma.gov.br/api/projeto/municipio/${municipioId}`)
    .then(data => data.json())
    .then(projetos => projetos);

const descricaoPrograma = (programaId) => todosOsProjetos
    .then(projetos => projetos.filter(proj => proj.programa.id == programaId)[0]["programa"]["descricao"]);

const detalhesProjeto = (projetoId) => todosOsProjetos
    .then(projetos => projetos.filter(proj => proj.id == projetoId)[0]["detalhes"]);

const carregarProgramas = (eixoId) => {
    todosOsProjetos.then(data => {
        const projetos = data.map(proj => proj.programa).filter(prog => prog.eixo.id == eixoId);

        let programasUnicos = [];
        projetos.forEach(proj => {
            if (!programasUnicos.some(prog => prog.id == proj.id)) {
                programasUnicos.push(proj);
            }
        })
        programasUnicos.forEach(prog => {
            const select = document.querySelector("#programaSelect");
            const option = document.createElement("option");
            option.value = `${prog.id}`;
            option.text = `${prog.nome}`;

            select.appendChild(option);
        });
    });
};

const carregarProjetos = (programaId) => {
    todosOsProjetos.then(data => {
        const projetos = data.filter(prog => prog.programa.id == programaId);

        let projetosUnicos = [];
        projetos.forEach(proj => {
            if (!projetosUnicos.some(prog => prog.id == proj.id)) {
                projetosUnicos.push(proj);
            }
        })

        projetosUnicos.forEach(proj => {
            fetch(`http://api.homologacao.promunicipios.ma.gov.br/api/detalhe/projeto/${proj.id}`)
                .then(data => data.json())
                .then(detalhe => {
                    //console.log(detalhe)

                    const descricao = detalhe[0].valor; // ? detalhe.descricao : "(Projeto não identificado)";

                    const select = document.querySelector("#projetoSelect");
                    const option = document.createElement("option");
                    option.value = `${proj.id}`;
                    nomeProjetoCsv = `${descricao}`;

                    option.text = nomeProjetoCsv;
                    select.appendChild(option);

                    //console.log(descProgramaCsv)
                })
        });
    });
};

const selecionarEixo = (selectElement) => {
    const selectProgramas = document.querySelector("#programaSelect");
    let length = selectProgramas.options.length;
    for (i = length - 1; i >= 1; i--) {
        selectProgramas.options[i] = null;
    }

    const eixoSelectionadoId = selectElement.value;

    

    carregarProgramas(eixoSelectionadoId);

    
    
};

const selecionarPrograma = (selectElement) => {
    const programaSelectionadoId = selectElement.value;

    const elementoDescricaoPrograma = document.querySelector("#descricaoPrograma");
    descricaoPrograma(programaSelectionadoId).then(desc => {
        elementoDescricaoPrograma.innerHTML = `${desc}`;
        // console.log(elementoDescricaoPrograma)
    });

    const selectProjetos = document.querySelector("#projetoSelect");
    let length = selectProjetos.options.length;
    for (i = length - 1; i >= 1; i--) {
        selectProjetos.options[i] = null;
    }

    carregarProjetos(programaSelectionadoId);
};

const selecionarProjeto = (selectElement) => {
    const projetoSelecionadoId = selectElement.value;
    detalhesProjeto(projetoSelecionadoId)
        .then(detalhes => {

            const detalhesPrograma = detalhes;

            var row = '';
            var valRow ='';
            var valCol ='';

            detalhesPrograma.forEach((valColuna)=>{
                console.log(valColuna)
                
                /*INTEIRANDO VALOR DA LINHA NA TABELA*/
                row = valColuna.coluna;
                var valorColFormatado = row.replace("_", " " );
                valRow +=`<th style=" text-transform: capitalize;">${valorColFormatado}</th>`

                /*INTEIRANDO VALOR DA COLUNA NA TABELA*/

                valCol += `<td>${valColuna.valor}</td>`

            })

            valRow += '<th>Baixar PDF</th>';
            valRow += '<th>Baixar CSV</th>';

            valCol += '<td title="Clique aqui para baixar PDF"> <i style="font-size: 30px;" class="far fa-file-pdf"></i></td>'
            valCol += `<td title="Clique aqui para baixar CSV"><button onclick='gerarCsv()'><i style="font-size: 30px;" class="far fa-file-excel"></i></button></td>`

            document.querySelector('#testeTr').innerHTML = valRow;
            document.querySelector('#teste1').innerHTML = valCol;
            
           
            // .then(detalhes => {
            //     const nome = detalhes.filter(det => det.coluna == "descricao")[0]["valor"];
            //     const beneficiarios = detalhes.filter(det => det.coluna == "beneficiarios")[0]["valor"];
            //     const dataInicio = detalhes.filter(det => det.coluna == "data_inicio")[0]["valor"];

            //     document.querySelector("#nomeProjeto").innerHTML = `${nome}`;

            //     dataInicioProgramaCsv = `${dataInicio}`;
            //     document.querySelector("#dataInicio").innerHTML = dataInicioProgramaCsv;

            //     NbeneficiadosCsv = `${beneficiarios}`
            //     document.querySelector("#beneficiados").innerHTML = NbeneficiadosCsv;

            // });

        });

}


const selectEixo = document.querySelector("#eixoSelect");

const municipioNome = document.querySelector("#municipioNome");

fetch('http://api.homologacao.promunicipios.ma.gov.br/api/eixo')
    .then(data => data.json())
    .then(eixoList => eixoList.forEach(eixo => {
        const option = document.createElement("option");
        option.value = `${eixo.id}`;
        option.text = `${eixo.nome}`;

        selectEixo.appendChild(option);

       

    }))
    .then(_ => {
        if (eixoId) selectEixo.value = eixoId;

    })

fetch(`http://api.homologacao.promunicipios.ma.gov.br/api/municipio/id/${municipioId}`)
    .then(data => data.json())
    .then(municipio => {
        nomeMunicipioCsv = `${municipio.nome}`;
        municipioNome.innerHTML = nomeMunicipioCsv;

    });


carregarProgramas(eixoId);

/*PEGAR VALOR DO EIXO*/
var items = document.getElementById('eixoSelect'); 
items.addEventListener('change', function(e){
    if (e.target.id == 'eixoSelect') alert(e.target.value.innerText); 
});



function gerarCsv() {

    var csv = '"Municipio"; Programa; Descrição do Programa; Projeto; Data de inicio do projeto; N° Beneficiados; \n';

    csv += nomeMunicipioCsv;
    csv += ';' + 'Nome do programa';
    csv += ';' + 'desc do Programa';
    csv += ';' + nomeProjetoCsv;
    csv += ';' + dataInicioProgramaCsv;
    csv += ';' + NbeneficiadosCsv;

    csv += '\n';

    var universalBOM = "\uFEFF";
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(universalBOM + csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'promunicipios.csv';
    hiddenElement.click();
};

