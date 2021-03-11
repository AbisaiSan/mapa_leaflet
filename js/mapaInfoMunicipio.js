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

/*VARIAVEIS GLOBAIS*/

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
                    

                    const descricao = detalhe[0].valor; // ? detalhe.descricao : "(Projeto não identificado)";

                    const select = document.querySelector("#projetoSelect");
                    const option = document.createElement("option");
                    option.value = `${proj.id}`;
                    nomeProjetoCsv = `${descricao}`;   

                    option.text = nomeProjetoCsv;
                    select.appendChild(option);

                   
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
        descProgramaCsv = elementoDescricaoPrograma.innerText;
        
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
            var valRow = '';
            var valCol = '';

            detalhesPrograma.forEach((valColuna) => {

                /*INTEIRANDO VALOR DA LINHA NA TABELA*/
                row = valColuna.coluna;
                var valorColFormatado = row.replace("_", " ");
                valRow += `<th style=" text-transform: capitalize;">${valorColFormatado}</th>`

                /*INTEIRANDO VALOR DA COLUNA NA TABELA*/

                valCol += `<td>${valColuna.valor}</td>`

            })

            valRow += '<th>Baixar PDF</th>';
            valRow += '<th>Baixar CSV</th>';

            valCol += `<td title="Clique aqui para baixar PDF"><button onclick='CriaPDF()'><i style="font-size: 30px;" class="far fa-file-pdf"></i></button></td>`
            valCol += `<td title="Clique aqui para baixar CSV"><button onclick='gerarCsv()'><i style="font-size: 30px;" class="far fa-file-excel"></i></button></td>`

            document.querySelector('#valorLinha').innerHTML = valRow;
            document.querySelector('#valorColuna').innerHTML = valCol;

            /*AQUI EU PEGO OS VALORES DA DATA DE INICIO DO PROJETO E O TOTAL DE BENEFICIADOS
            //jOGO DENTRO DAS MINHAS VARIAVEIS GLOBAIS*/
            const beneficiarios = detalhes.filter(det => det.coluna == "beneficiarios")[0]["valor"];
            const dataInicio = detalhes.filter(det => det.coluna == "data_inicio")[0]["valor"];
            //Essa variavel recebe o valor e uso ela na função de gerarCsv
            dataInicioProgramaCsv = `${dataInicio}`;
            //Essa variavel recebe o valor e uso ela na função de gerarCsv
            NbeneficiadosCsv = `${beneficiarios}`
    
        });

}

/*Aqui vai o funcionamento da seleção de eixo e municipio*/

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


/*PEGAR VALOR DO EIXO e PROGRAMA PARA USAR NA FUNÇÃO gerarCsv*/

/*Valor do eixo*/
var select = document.querySelector('#eixoSelect');
select.addEventListener('change', function () {
    var option = this.selectedOptions[0];
    var texto = option.textContent;

    eixoMunicipioCsv = texto;
    
});

/*Valor do PROGRAMA*/
var programaSelecionadoCsv = document.querySelector('#programaSelect');
programaSelecionadoCsv.addEventListener('change', function () {
    var optionProg = this.selectedOptions[0];
    var textoProg = optionProg.textContent;

    programaMunicipioCsv = textoProg;
   
});


/*MINHA FUNÇÃO PARA GERAR O CSV, ELA RECEBE OS VALORES DAS VARIAVEIS QUE DEFINI EM ESCOPO GLOBAL E CARREGA OS DADOS NO DOCUMENTO*/
function gerarCsv() {

    var csv = '"Municipio"; Eixo; Programa; Descrição do Programa; Projeto; Data de inicio do projeto; N° Beneficiados; \n';

    csv += nomeMunicipioCsv;
    csv += ';' + eixoMunicipioCsv;
    csv += ';' + programaMunicipioCsv;
    csv += ';' + descProgramaCsv;
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

/*FUNÇÃO PARA O DONWLOAD DOS DADOS COMO PDF*/

function CriaPDF() {
    var minhaTabela = document.getElementById('conteudoPdf').innerHTML;
    var style = "<style>";
    style = style + "table {width: 100%;font: 20px Calibri;}";
    style = style + "table, th, td {border: solid 1px #DDD; border-collapse: collapse;";
    style = style + "padding: 2px 3px;text-align: center;}";
    style = style + "</style>";
    // CRIA UM OBJETO WINDOW
    var win = window.open('', '', 'height=700,width=700');
    win.document.write('<html><head>');
    win.document.write('<title>Promunicipios</title>');   // <title> CABEÇALHO DO PDF.
    win.document.write(style);  // INCLUI UM ESTILO NA TAB HEAD
    win.document.write('</head>');
    win.document.write('<body>');
    win.document.write(minhaTabela); // O CONTEUDO DA TABELA DENTRO DA TAG BODY
    win.document.write('</body></html>');
    win.document.close(); 	// FECHA A JANELA
    win.print(); // IMPRIME O CONTEUDO
}