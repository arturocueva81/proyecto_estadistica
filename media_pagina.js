// ============================================================
// media_pagina.js — Controlador de página para Media Aritmética
// ============================================================
// Conecta las funciones de media.js con:
//   - media.html      → ejemplo interactivo con datos de estudiantes
//   - ejPractico.html → ejercicio práctico con datos de redes sociales
//
// Orden de carga en el HTML:
//   1. chart.js (CDN)
//   2. datos.js              → DATOSESTUDIANTES
//   3. social_media_200.js   → SOCIAL_MEDIA_USAGE
//   4. media.js              → calcularMedia, dibujarGraficoMedia
//   5. media_pagina.js       → este archivo
// ============================================================


// ============================================================
// BLOQUE 1: FUENTES DE DATOS
// ============================================================

// Devuelve el arreglo de estudiantes desde datos.js
// Ejemplo de objeto: { nombre: 'Ana', calificacion: 15 }
function obtenerListaEstudiantes() {
    return DATOSESTUDIANTES.estudiantes;
}

// Devuelve el arreglo de redes sociales desde social_media_200.js
// Ejemplo de objeto: { User_ID: 1, App: 'Instagram', Daily_Minutes_Spent: 45 }
// Devuelve [] si la variable global no está disponible
function obtenerListaRedesSociales() {
    if (typeof SOCIAL_MEDIA_USAGE === 'undefined' || !SOCIAL_MEDIA_USAGE.datos_redes) {
        return [];
    }
    return SOCIAL_MEDIA_USAGE.datos_redes;
}


// ============================================================
// BLOQUE 2: CONSTANTES DEL EJERCICIO PRÁCTICO
// ============================================================

// Propiedad numérica del dataset de redes sociales que se va a promediar
const PROPIEDAD_NUMERICA_EJERCICIO = 'Daily_Minutes_Spent';

// Propiedad de texto usada como etiqueta en tablas y gráficos
const PROPIEDAD_ETIQUETA_EJERCICIO = 'App';


// ============================================================
// BLOQUE 3: TOGGLE — TABLA EJEMPLO INTERACTIVO (media.html)
// ============================================================

function toggleEjemploMedia() {

    let contenedorResultado = document.getElementById('resultado-media');
    let botonAccion         = document.getElementById('btn-ejemplo-media');

    if (!contenedorResultado || !botonAccion) { return; }

    // --- MOSTRAR: el contenedor está oculto, lo mostramos ---
    if (contenedorResultado.classList.contains('oculto')) {

        // PASO 3 y 4: calcula la media Y construye la tabla HTML
        calcularMedia(
            obtenerListaEstudiantes(),  // PASO 1: arreglo de estudiantes
            'calificacion',             // PASO 2: propiedad numérica
            'resultado-media',          // PASO 4: id del contenedor de la tabla
            'nombre'                    // etiqueta de texto para la columna izquierda
        );

        contenedorResultado.classList.remove('oculto');
        botonAccion.textContent = '✖ Ocultar Ejemplo';

    // --- OCULTAR: el contenedor está visible, lo ocultamos ---
    } else {
        contenedorResultado.classList.add('oculto');
        botonAccion.textContent = '▶ Calcular Media';
    }
}


// ============================================================
// BLOQUE 4: TOGGLE — GRÁFICO EJEMPLO INTERACTIVO (media.html)
// ============================================================

function toggleGraficoMedia() {

    let contenedorGrafico = document.getElementById('contenedor-grafico-media');
    let botonAccion       = document.getElementById('btn-grafico-media');

    if (!contenedorGrafico || !botonAccion) { return; }

    // --- OCULTAR: el gráfico está visible, lo ocultamos ---
    if (!contenedorGrafico.classList.contains('oculto')) {

        contenedorGrafico.classList.add('oculto');
        botonAccion.textContent = '📊 Ver Gráfico de Barras';

        // Liberamos la memoria del gráfico activo (variable de media.js)
        if (typeof instanciaGraficoMedia !== 'undefined' && instanciaGraficoMedia !== null) {
            try { instanciaGraficoMedia.destroy(); } catch(errorDestruccion) {}
            instanciaGraficoMedia = null;
        }
        return;
    }

    // --- MOSTRAR: el gráfico está oculto, lo mostramos ---
    contenedorGrafico.classList.remove('oculto');
    botonAccion.textContent = '✖ Ocultar Gráfico';

    // Reemplazamos el canvas para evitar el error "Canvas already in use" de Chart.js
    let canvasExistente = document.getElementById('graficaMedia');
    if (!canvasExistente) { return; }

    let canvasFresco  = document.createElement('canvas');
    canvasFresco.id   = 'graficaMedia';
    canvasExistente.parentNode.replaceChild(canvasFresco, canvasExistente);

    // Esperamos 50ms para que el navegador registre el nuevo canvas en el DOM
    setTimeout(function() {
        dibujarGraficoMedia(
            obtenerListaEstudiantes(),              // PASO 1: arreglo de estudiantes
            'calificacion',                         // PASO 2: propiedad numérica
            'graficaMedia',                         // id del canvas destino
            'Calificaciones de Estudiantes — Media' // título visible en el gráfico
        );
    }, 50);
}


// ============================================================
// BLOQUE 5: AGRUPACIÓN POR APP (ejPractico.html)
// ============================================================
// Agrupa los 200 registros por nombre de App y calcula
// la media de PROPIEDAD_NUMERICA_EJERCICIO para cada grupo.
// Devuelve: [{ App: 'Instagram', mediaMinutos: 45.2 }, ...]
// ============================================================

function agruparRegistrosPorApp() {

    let todosLosRegistros = obtenerListaRedesSociales();

    // Objeto temporal donde cada clave es un nombre de App
    // y su valor es un arreglo con todos sus registros
    let registrosAgrupadosPorApp = {};

    for (let posicionRegistro = 0; posicionRegistro < todosLosRegistros.length; posicionRegistro++) {
        let registroActual  = todosLosRegistros[posicionRegistro];
        let nombreAppActual = registroActual[PROPIEDAD_ETIQUETA_EJERCICIO] || 'Sin nombre';

        // Si esta App no tiene grupo todavía, creamos su arreglo vacío
        if (!registrosAgrupadosPorApp[nombreAppActual]) {
            registrosAgrupadosPorApp[nombreAppActual] = [];
        }

        registrosAgrupadosPorApp[nombreAppActual].push(registroActual);
    }

    // Extraemos los nombres de las Apps y los ordenamos alfabéticamente
    let nombresDeApps = [];
    for (let nombreApp in registrosAgrupadosPorApp) {
        nombresDeApps.push(nombreApp);
    }
    nombresDeApps.sort();

    // Para cada App calculamos su media y construimos el arreglo final
    let resumenMediaPorApp = [];

    for (let posicionApp = 0; posicionApp < nombresDeApps.length; posicionApp++) {
        let nombreAppActual      = nombresDeApps[posicionApp];
        let registrosDeLaApp     = registrosAgrupadosPorApp[nombreAppActual];

        // Solo calculamos (sin tabla): pasamos null en idContenedor
        let resultadoMediaApp = calcularMedia(registrosDeLaApp, PROPIEDAD_NUMERICA_EJERCICIO, null, null);

        resumenMediaPorApp.push({
            App:          nombreAppActual,
            mediaMinutos: resultadoMediaApp.media
        });
    }

    return resumenMediaPorApp;
}


// ============================================================
// BLOQUE 6: TOGGLE — TABLA EJERCICIO PRÁCTICO (ejPractico.html)
// ============================================================

function toggleEjercicioPractico() {

    let contenedorTablaEjercicio = document.getElementById('resultado-ejercicio');
    let botonAccion              = document.getElementById('btn-ejercicio-practico');

    if (!contenedorTablaEjercicio || !botonAccion) { return; }

    // --- MOSTRAR ---
    if (contenedorTablaEjercicio.classList.contains('oculto')) {

        // Obtenemos el resumen agrupado: [{ App, mediaMinutos }, ...]
        let resumenPorApp = agruparRegistrosPorApp();

        // Mostramos la tabla usando 'mediaMinutos' como propiedad numérica
        calcularMedia(
            resumenPorApp,
            'mediaMinutos',          // propiedad numérica del resumen
            'resultado-ejercicio',   // id del contenedor de la tabla
            'App'                    // propiedad de texto para la columna izquierda
        );

        contenedorTablaEjercicio.classList.remove('oculto');
        botonAccion.textContent = '✖ Ocultar Tabla';

    // --- OCULTAR ---
    } else {
        contenedorTablaEjercicio.classList.add('oculto');
        botonAccion.textContent = '▶ Calcular Media por App';
    }
}


// ============================================================
// BLOQUE 7: TOGGLE — GRÁFICO EJERCICIO PRÁCTICO (ejPractico.html)
// ============================================================

// Instancia separada para el gráfico del ejercicio práctico
// (independiente de instanciaGraficoMedia de media.js)
let instanciaGraficoEjercicioPractico = null;

function toggleGraficoEjercicio() {

    let contenedorGraficoEjercicio = document.getElementById('contenedor-grafico-ejercicio');
    let botonAccion                = document.getElementById('btn-grafico-ejercicio');

    if (!contenedorGraficoEjercicio || !botonAccion) { return; }

    // --- OCULTAR ---
    if (!contenedorGraficoEjercicio.classList.contains('oculto')) {

        contenedorGraficoEjercicio.classList.add('oculto');
        botonAccion.textContent = '📊 Ver Gráfico Comparativo';

        if (instanciaGraficoEjercicioPractico !== null) {
            try { instanciaGraficoEjercicioPractico.destroy(); } catch(errorDestruccion) {}
            instanciaGraficoEjercicioPractico = null;
        }
        return;
    }

    // --- MOSTRAR ---
    contenedorGraficoEjercicio.classList.remove('oculto');
    botonAccion.textContent = '✖ Ocultar Gráfico';

    // Liberamos instancia previa si quedó activa
    if (instanciaGraficoEjercicioPractico !== null) {
        try { instanciaGraficoEjercicioPractico.destroy(); } catch(errorDestruccion) {}
        instanciaGraficoEjercicioPractico = null;
    }

    // Reemplazamos el canvas para evitar conflictos de Chart.js
    let canvasExistente = document.getElementById('graficaEjercicio');
    if (!canvasExistente) { return; }

    let canvasFresco = document.createElement('canvas');
    canvasFresco.id  = 'graficaEjercicio';
    canvasExistente.parentNode.replaceChild(canvasFresco, canvasExistente);

    setTimeout(function() {
        let resumenPorApp = agruparRegistrosPorApp();

        instanciaGraficoEjercicioPractico = dibujarGraficoMedia(
            resumenPorApp,
            'mediaMinutos',   // propiedad numérica del resumen agrupado
            'graficaEjercicio',
            'Media de ' + PROPIEDAD_NUMERICA_EJERCICIO + ' por App'
        );
    }, 50);
}


// ============================================================
// BLOQUE 8: PREVIEW DEL DATASET (ejPractico.html)
// ============================================================
// Muestra los primeros 10 registros del dataset en la tabla
// con id #cuerpo-tabla-preview al cargar la página.
// ============================================================

function cargarVistaPreviaDataset() {

    let cuerpoTablaPreview = document.getElementById('cuerpo-tabla-preview');
    if (!cuerpoTablaPreview) { return; } // No estamos en ejPractico.html

    let todosLosRegistros    = obtenerListaRedesSociales();
    let filasGeneradasHTML   = '';
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

// Se ejecuta automáticamente cuando el HTML termina de cargarse
document.addEventListener('DOMContentLoaded', function() {
    cargarVistaPreviaDataset();
});