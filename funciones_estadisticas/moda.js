// ============================================================
// moda.js — Cálculo y visualización de la Moda
// ============================================================
// Este archivo contiene TODAS las funciones relacionadas con
// la moda: conteo de frecuencias, tabla HTML y gráfico Chart.js.
//
// Funciones públicas:
//   - calcularModa(...)       → calcula y muestra la tabla HTML
//   - dibujarGraficoModa(...) → dibuja el gráfico Chart.js
//
// Orden de carga en el HTML:
//   1. chart.js (CDN)
//   2. datos.js o social_media_200.js  → fuentes de datos
//   3. moda.js                         → este archivo
//   4. moda_pagina.js                  → controlador de página
// ============================================================


// ------------------------------------------------------------
// VARIABLE GLOBAL
// ------------------------------------------------------------
// Guarda la instancia activa del gráfico Chart.js para poder
// destruirla antes de crear una nueva.
// ------------------------------------------------------------
let instanciaGraficoModa = null;


// ------------------------------------------------------------
// CONSTANTE: TIPO DE GRÁFICO
// ------------------------------------------------------------
// Define el tipo de gráfico para TODA la sección Moda.
//
// Opciones válidas:
//   'doughnut'      → Dona (Recomendado para frecuencias)
//   'pie'           → Pastel
//   'bar'           → Barras verticales
//   'barHorizontal' → Barras horizontales
//   'polarArea'     → Área polar
// ------------------------------------------------------------
const TIPO_GRAFICO_MODA = 'barHorizontal';


// ============================================================
// FUNCIÓN: calcularModaDesdeArregloNumerico
// ============================================================
// Núcleo matemático puro. Recibe números y cuenta sus repeticiones.
//
// Pasos del algoritmo:
//   1. Crear un mapa de frecuencias (objeto de conteo)
//   2. Encontrar cuál es el número máximo de repeticiones
//   3. Identificar qué valor o valores alcanzan ese máximo
//
// Parámetros:
//   listaNumeros → arreglo de números válidos
//
// Devuelve: { listaConteos, modas, frecuenciaMaxima }
// ============================================================
function calcularModaDesdeArregloNumerico(listaNumeros) {

    let conteosMap = {};
    let frecuenciaMaxima = 0;
    let modasResultantes = [];

    // PASO 1: Contar frecuencias
    for (let i = 0; i < listaNumeros.length; i++) {
        let numero = listaNumeros[i];
        conteosMap[numero] = (conteosMap[numero] || 0) + 1;

        // PASO 2: Actualizar la frecuencia máxima detectada
        if (conteosMap[numero] > frecuenciaMaxima) {
            frecuenciaMaxima = conteosMap[numero];
        }
    }

    // PASO 3: Identificar la o las modas (valores con frecuencia máxima)
    for (let numero in conteosMap) {
        if (conteosMap[numero] === frecuenciaMaxima) {
            modasResultantes.push(Number(numero));
        }
    }

    // Convertir el mapa a un arreglo ordenado para la tabla/gráfico
    let listaFrecuencias = [];
    for (let valor in conteosMap) {
        listaFrecuencias.push({
            valor: Number(valor),
            conteo: conteosMap[valor]
        });
    }
    
    listaFrecuencias.sort((a, b) => a.valor - b.valor);

    return {
        listaFrecuencias: listaFrecuencias,
        modas:            modasResultantes,
        frecuenciaMaxima: frecuenciaMaxima
    };
}


// ============================================================
// FUNCIÓN PÚBLICA: calcularModa
// ============================================================
// Procesa datos de un arreglo de objetos y genera la tabla.
// ============================================================
function calcularModa(listaDeDatos, propiedadNumerica, idContenedorTabla, propiedadEtiqueta) {

    // PASO 1: Filtrar registros con valor numérico válido
    let registrosValidos = [];
    for (let i = 0; i < listaDeDatos.length; i++) {
        let valor = Number(listaDeDatos[i][propiedadNumerica]);
        if (!isNaN(valor)) { registrosValidos.push(listaDeDatos[i]); }
    }

    // PASO 2: Extraer solo los números
    let listaSoloNumeros = registrosValidos.map(reg => Number(reg[propiedadNumerica]));

    // PASO 3: Calcular moda con la función interna
    let resultadoModa = calcularModaDesdeArregloNumerico(listaSoloNumeros);

    // PASO 4: Generar tabla HTML
    if (typeof idContenedorTabla === 'string' && idContenedorTabla.length > 0) {
        let elementoContenedor = document.getElementById(idContenedorTabla);
        if (elementoContenedor) {
            let html = '';
            html += '<p><strong>Distribución de Frecuencias — ' + propiedadNumerica + '</strong></p>';
            html += '<table class="tabla-interactiva">';
            html += '<tr><th>Valor</th><th>Frecuencia (veces)</th><th>¿Es Moda?</th></tr>';

            for (let f = 0; f < resultadoModa.listaFrecuencias.length; f++) {
                let item = resultadoModa.listaFrecuencias[f];
                let esModa = (item.conteo === resultadoModa.frecuenciaMaxima);
                let estilo = esModa ? ' style="background:#dbeafe; font-weight:bold;"' : '';

                html += '<tr' + estilo + '>';
                html += '<td>' + item.valor + '</td>';
                html += '<td>' + item.conteo + '</td>';
                html += '<td>' + (esModa ? '⬅ moda' : '') + '</td>';
                html += '</tr>';
            }
            html += '</table>';

            // PASO 5: Insertar cajas de detalle y resultado
            html += '<div class="detalle-calculo">';
            html += 'Total datos: ' + listaSoloNumeros.length + '<br>';
            html += 'Frecuencia más alta: <strong>' + resultadoModa.frecuenciaMaxima + '</strong> repeticiones';
            html += '</div>';

            html += '<div class="caja-resultado">';
            html += '📙 Moda: <strong>' + resultadoModa.modas.join(', ') + '</strong>';
            html += '</div>';

            elementoContenedor.innerHTML = html;
        }
    }

    // PASO 6: Devolver resultado
    return resultadoModa;
}


// ============================================================
// FUNCIÓN: prepararDatosParaGraficoModa
// ============================================================
function prepararDatosParaGraficoModa(listaDeDatos, propiedadNumerica) {
    
    let listaSoloNumeros = [];
    for (let i = 0; i < listaDeDatos.length; i++) {
        let v = Number(listaDeDatos[i][propiedadNumerica]);
        if (!isNaN(v)) { listaSoloNumeros.push(v); }
    }

    let calculo = calcularModaDesdeArregloNumerico(listaSoloNumeros);

    let etiquetas = [];
    let valores = [];
    let colores = [];

    // Colores base para la dona/barras
    let paletaColores = [
        '#3498db', '#e74c3c', '#2ecc71', '#f1c40f', '#9b59b6', '#34495e', '#1abc9c'
    ];

    for (let i = 0; i < calculo.listaFrecuencias.length; i++) {
        let item = calculo.listaFrecuencias[i];
        etiquetas.push('Valor ' + item.valor);
        valores.push(item.conteo);

        // Si es moda, usamos un azul fuerte, si no, un color de la paleta con transparencia
        if (item.conteo === calculo.frecuenciaMaxima) {
            colores.push('rgba(37, 99, 235, 0.9)'); // Azul destacado
        } else {
            colores.push(paletaColores[i % paletaColores.length] + '80'); // Color con transparencia
        }
    }

    return {
        arregloEtiquetas: etiquetas,
        arregloValoresGrafico: valores,
        arregloColoresGrafico: colores,
        modasFinales: calculo.modas,
        maximaFreq: calculo.frecuenciaMaxima
    };
}


// ============================================================
// FUNCIÓN PÚBLICA: dibujarGraficoModa
// ============================================================
function dibujarGraficoModa(listaDeDatos, propiedadNumerica, idCanvasDestino, textoTitulo, tipoGraficoOpcional) {

    let tipoActivo = tipoGraficoOpcional || TIPO_GRAFICO_MODA;

    let elementoCanvas = document.getElementById(idCanvasDestino);
    if (!elementoCanvas) return null;

    elementoCanvas.style.height = '350px';

    // PASO 1 y 2: Destruir anterior
    if (instanciaGraficoModa !== null) {
        try { instanciaGraficoModa.destroy(); } catch(e) {}
        instanciaGraficoModa = null;
    }

    // PASO 3: Preparar datos
    let datos = prepararDatosParaGraficoModa(listaDeDatos, propiedadNumerica);

    // PASO 4: Configurar datasets
    let configDatasets = [{
        label: 'Frecuencia',
        data: datos.arregloValoresGrafico,
        backgroundColor: datos.arregloColoresGrafico,
        borderColor: datos.arregloColoresGrafico,
        borderWidth: 1,
        hoverOffset: 15
    }];

    // PASO 5: Crear instancia de Chart.js
    instanciaGraficoModa = new Chart(elementoCanvas.getContext('2d'), {
        type: tipoActivo === 'barHorizontal' ? 'bar' : tipoActivo,
        data: {
            labels: datos.arregloEtiquetas,
            datasets: configDatasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: tipoActivo === 'barHorizontal' ? 'y' : 'x',
            plugins: {
                legend: { position: 'bottom' },
                title: {
                    display: true,
                    text: textoTitulo || ('Moda: ' + datos.modasFinales.join(', '))
                }
            },
            scales: (tipoActivo === 'bar' || tipoActivo === 'barHorizontal') 
                    ? { y: { beginAtZero: true, ticks: { stepSize: 1 } } } 
                    : {}
        }
    });

    // PASO 6: Devolver instancia
    return instanciaGraficoModa;
}