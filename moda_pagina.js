// ============================================================
// moda_pagina.js — Controlador de página para Moda
// ============================================================
// Conecta las funciones de moda.js con:
//   - moda.html     → ejemplo interactivo con datos de estudiantes
//   - ejPractico.html → ejercicio práctico con datos de redes sociales
//
// Orden de carga en el HTML:
//   1. chart.js (CDN)
//   2. datos.js              → DATOSESTUDIANTES
//   3. social_media_200.js   → SOCIAL_MEDIA_USAGE
//   4. moda.js               → calcularModa, dibujarGraficoModa
//   5. moda_pagina.js        → este archivo
// ============================================================


// ============================================================
// BLOQUE 1: FUENTES DE DATOS
// ============================================================

function obtenerListaEstudiantes() {
    return DATOSESTUDIANTES.estudiantes;
}

function obtenerListaRedesSociales() {
    if (typeof SOCIAL_MEDIA_USAGE === 'undefined' || !SOCIAL_MEDIA_USAGE.datos_redes) {
        return [];
    }
    return SOCIAL_MEDIA_USAGE.datos_redes;
}


// ============================================================
// BLOQUE 2: CONSTANTES DEL EJERCICIO PRÁCTICO
// ============================================================

const PROPIEDAD_NUMERICA_EJERCICIO_MODA = 'Daily_Minutes_Spent';
const PROPIEDAD_ETIQUETA_EJERCICIO_MODA = 'App';


// ============================================================
// BLOQUE 3: TOGGLE — TABLA EJEMPLO INTERACTIVO (moda.html)
// ============================================================

function toggleEjemploModa() {

    let contenedorResultado = document.getElementById('resultado-moda');
    let botonAccion         = document.getElementById('btn-ejemplo-moda');

    if (!contenedorResultado || !botonAccion) { return; }

    if (contenedorResultado.classList.contains('oculto')) {

        calcularModa(
            obtenerListaEstudiantes(),
            'calificacion',
            'resultado-moda',
            'nombre'
        );

        contenedorResultado.classList.remove('oculto');
        botonAccion.textContent = '✖ Ocultar Ejemplo';

    } else {
        contenedorResultado.classList.add('oculto');
        botonAccion.textContent = '▶ Calcular Moda';
    }
}


// ============================================================
// BLOQUE 4: TOGGLE — GRÁFICO EJEMPLO INTERACTIVO (moda.html)
// ============================================================

function toggleGraficoModa() {

    let contenedorGrafico = document.getElementById('contenedor-grafico-moda');
    let botonAccion       = document.getElementById('btn-grafico-moda');

    if (!contenedorGrafico || !botonAccion) { return; }

    if (!contenedorGrafico.classList.contains('oculto')) {

        contenedorGrafico.classList.add('oculto');
        botonAccion.textContent = '📊 Ver Gráfico';

        if (typeof instanciaGraficoModa !== 'undefined' && instanciaGraficoModa !== null) {
            try { instanciaGraficoModa.destroy(); } catch(errorDestruccion) {}
            instanciaGraficoModa = null;
        }
        return;
    }

    contenedorGrafico.classList.remove('oculto');
    botonAccion.textContent = '✖ Ocultar Gráfico';

    let canvasExistente = document.getElementById('graficaModa');
    if (!canvasExistente) { return; }

    let canvasFresco = document.createElement('canvas');
    canvasFresco.id  = 'graficaModa';
    canvasExistente.parentNode.replaceChild(canvasFresco, canvasExistente);

    setTimeout(function() {
        dibujarGraficoModa(
            obtenerListaEstudiantes(),
            'calificacion',
            'graficaModa',
            'Calificaciones de Estudiantes — Moda'
        );
    }, 50);
}


// ============================================================
// BLOQUE 5: AGRUPACIÓN POR APP Y CÁLCULO DE MODA
// ============================================================
// Devuelve: [{ App, modaMinutos, frecuenciaModa, totalRegistros }, ...]
// ============================================================

function agruparRegistrosPorAppModa() {

    let todosLosRegistros = obtenerListaRedesSociales();
    let registrosAgrupadosPorApp = {};

    for (let posicionRegistro = 0; posicionRegistro < todosLosRegistros.length; posicionRegistro++) {
        let registroActual  = todosLosRegistros[posicionRegistro];
        let nombreAppActual = registroActual[PROPIEDAD_ETIQUETA_EJERCICIO_MODA] || 'Sin nombre';

        if (!registrosAgrupadosPorApp[nombreAppActual]) {
            registrosAgrupadosPorApp[nombreAppActual] = [];
        }

        registrosAgrupadosPorApp[nombreAppActual].push(registroActual);
    }

    let nombresDeApps = [];
    for (let nombreApp in registrosAgrupadosPorApp) {
        nombresDeApps.push(nombreApp);
    }
    nombresDeApps.sort();

    let resumenModaPorApp = [];

    for (let posicionApp = 0; posicionApp < nombresDeApps.length; posicionApp++) {
        let nombreAppActual  = nombresDeApps[posicionApp];
        let registrosDeLaApp = registrosAgrupadosPorApp[nombreAppActual];

        let resultadoModaApp = calcularModa(
            registrosDeLaApp,
            PROPIEDAD_NUMERICA_EJERCICIO_MODA,
            null,
            null
        );

        resumenModaPorApp.push({
            App:            nombreAppActual,
            modaMinutos:    resultadoModaApp.modas,
            frecuenciaModa: resultadoModaApp.frecuenciaMaxima,
            totalRegistros: registrosDeLaApp.length
        });
    }

    return resumenModaPorApp;
}


// ============================================================
// BLOQUE 6: TOGGLE — TABLA EJERCICIO PRÁCTICO (ejPractico.html)
// ============================================================

function toggleEjercicioPracticoModa() {

    let contenedorTablaEjercicio = document.getElementById('resultado-ejercicio-moda');
    let botonAccion              = document.getElementById('btn-ejercicio-practico-moda');

    if (!contenedorTablaEjercicio || !botonAccion) { return; }

    // --- MOSTRAR ---
    if (contenedorTablaEjercicio.classList.contains('oculto')) {

        // Obtenemos los 200 registros sin agrupar
        let todosLosRegistros = obtenerListaRedesSociales();

        // Usamos la función de moda.js para calcular la frecuencia de todo el dataset
        // Pasamos null como id de contenedor para que no genere la tabla automática
        let resultadoModaGeneral = calcularModa(
            todosLosRegistros, 
            PROPIEDAD_NUMERICA_EJERCICIO_MODA, 
            null, 
            null
        );

        // Extraemos la lista de frecuencias calculada y la ordenamos de MAYOR a MENOR frecuencia
        let listaFrecuencias = resultadoModaGeneral.listaFrecuencias;
        listaFrecuencias.sort(function(a, b) {
            return b.conteo - a.conteo; // Orden descendente por frecuencia
        });

        let contenidoHTML = '';
        contenidoHTML += '<p><strong>Frecuencia de Minutos Diarios (Dataset Completo)</strong></p>';
        contenidoHTML += '<table class="tabla-interactiva">';
        contenidoHTML += '<tr>';
        contenidoHTML += '<th>#</th>';
        contenidoHTML += '<th>Minutos Diarios (Valor)</th>';
        contenidoHTML += '<th>Frecuencia (veces repetido)</th>';
        contenidoHTML += '<th>¿Es la Moda?</th>';
        contenidoHTML += '</tr>';

        // Mostramos los 10 valores más frecuentes para no saturar la tabla
        let limiteFilas = 10;
        for (let i = 0; i < limiteFilas && i < listaFrecuencias.length; i++) {
            let item = listaFrecuencias[i];
            let esModaReal = (item.conteo === resultadoModaGeneral.frecuenciaMaxima);
            
            // Estilo para resaltar la moda
            let estiloFila = esModaReal ? ' style="background:#dbeafe; font-weight:bold;"' : '';
            let marcaModa = esModaReal ? '⬅ MODA' : '';

            contenidoHTML += '<tr' + estiloFila + '>';
            contenidoHTML += '<td>' + (i + 1) + '</td>';
            contenidoHTML += '<td>' + item.valor + ' minutos</td>';
            contenidoHTML += '<td>' + item.conteo + '</td>';
            contenidoHTML += '<td>' + marcaModa + '</td>';
            contenidoHTML += '</tr>';
        }

        contenidoHTML += '</table>';

        // Caja de detalle con el resultado final
        contenidoHTML += '<div class="caja-resultado" style="margin-top:15px;">';
        contenidoHTML += '📙 El tiempo de uso más común es: <strong>' + resultadoModaGeneral.modas.join(', ') + ' minutos</strong> ';
        contenidoHTML += '(repetido ' + resultadoModaGeneral.frecuenciaMaxima + ' veces).';
        contenidoHTML += '</div>';

        contenedorTablaEjercicio.innerHTML = contenidoHTML;
        contenedorTablaEjercicio.classList.remove('oculto');
        botonAccion.textContent = '✖ Ocultar Tabla';

    // --- OCULTAR ---
    } else {
        contenedorTablaEjercicio.classList.add('oculto');
        botonAccion.textContent = '▶ Calcular Moda de Minutos';
    }
}

// ============================================================
// BLOQUE 7: TOGGLE — GRÁFICO EJERCICIO PRÁCTICO (ejPractico.html)
// ============================================================
// IMPORTANTE: este gráfico usa el dataset COMPLETO para mostrar
// la distribución de frecuencias de Daily_Minutes_Spent.
// La barra más alta representa el valor más común (la moda).
// ============================================================

let instanciaGraficoEjercicioPracticoModa = null;

function toggleGraficoEjercicioModa() {

    let contenedorGraficoEjercicio = document.getElementById('contenedor-grafico-ejercicio-moda');
    let botonAccion                = document.getElementById('btn-grafico-ejercicio-moda');

    if (!contenedorGraficoEjercicio || !botonAccion) { return; }

    // --- OCULTAR ---
    if (!contenedorGraficoEjercicio.classList.contains('oculto')) {

        contenedorGraficoEjercicio.classList.add('oculto');
        botonAccion.textContent = '📊 Ver Gráfico';

        if (instanciaGraficoEjercicioPracticoModa !== null) {
            try { instanciaGraficoEjercicioPracticoModa.destroy(); } catch(e) {}
            instanciaGraficoEjercicioPracticoModa = null;
        }
        return;
    }

    // --- MOSTRAR ---
    contenedorGraficoEjercicio.classList.remove('oculto');
    botonAccion.textContent = '✖ Ocultar Gráfico';

    if (instanciaGraficoEjercicioPracticoModa !== null) {
        try { instanciaGraficoEjercicioPracticoModa.destroy(); } catch(e) {}
        instanciaGraficoEjercicioPracticoModa = null;
    }

    let canvasExistente = document.getElementById('graficaEjercicioModa');
    if (!canvasExistente) { return; }

    let canvasFresco = document.createElement('canvas');
    canvasFresco.id  = 'graficaEjercicioModa';
    canvasExistente.parentNode.replaceChild(canvasFresco, canvasExistente);

    setTimeout(function() {
        let todosLosRegistros = obtenerListaRedesSociales();

        instanciaGraficoEjercicioPracticoModa = dibujarGraficoModa(
            todosLosRegistros,
            'Daily_Minutes_Spent',
            'graficaEjercicioModa',
            'Moda de Daily_Minutes_Spent en el dataset completo'
        );
    }, 50);
}


// ============================================================
// BLOQUE 8: PREVIEW DEL DATASET (ejPractico.html)
// ============================================================

function cargarVistaPreviaDataset() {

    let cuerpoTablaPreview = document.getElementById('cuerpo-tabla-preview');
    if (!cuerpoTablaPreview) { return; }

    let todosLosRegistros  = obtenerListaRedesSociales();
    let filasGeneradasHTML = '';
    let LIMITE_FILAS_PREVIEW = 10;

    for (let posicionFila = 0; posicionFila < LIMITE_FILAS_PREVIEW && posicionFila < todosLosRegistros.length; posicionFila++) {
        let registroFila = todosLosRegistros[posicionFila];

        filasGeneradasHTML += '<tr>';
        filasGeneradasHTML += '<td>' + (posicionFila + 1)          + '</td>';
        filasGeneradasHTML += '<td>' + registroFila.User_ID         + '</td>';
        filasGeneradasHTML += '<td>' + registroFila.App             + '</td>';
        filasGeneradasHTML += '<td>' + registroFila.Daily_Minutes_Spent + '</td>';
        filasGeneradasHTML += '<td>' + registroFila.Posts_Per_Day   + '</td>';
        filasGeneradasHTML += '<td>' + registroFila.Likes_Per_Day   + '</td>';
        filasGeneradasHTML += '<td>' + registroFila.Follows_Per_Day + '</td>';
        filasGeneradasHTML += '</tr>';
    }

    cuerpoTablaPreview.innerHTML = filasGeneradasHTML;
}

document.addEventListener('DOMContentLoaded', function() {
    cargarVistaPreviaDataset();
});