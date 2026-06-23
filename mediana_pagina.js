// ============================================================
// mediana_pagina.js — Controlador de página para Mediana
// ============================================================
// Conecta las funciones de mediana.js con:
//   - mediana.html    → ejemplo interactivo con datos de estudiantes
//   - ejPractico.html → ejercicio práctico con datos de redes sociales
//
// Orden de carga en el HTML:
//   1. chart.js (CDN)
//   2. datos.js              → DATOSESTUDIANTES
//   3. social_media_200.js   → SOCIAL_MEDIA_USAGE
//   4. mediana.js            → calcularMediana, dibujarGraficoMediana
//   5. mediana_pagina.js     → este archivo
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
// NOTA: se usan nombres únicos con sufijo _MEDIANA para evitar
// el error "has already been declared" cuando este archivo se
// carga junto a media_pagina.js o moda_pagina.js en ejPractico.html
// ============================================================

// Propiedad numérica del dataset de redes sociales que se va a analizar
const PROPIEDAD_NUMERICA_EJERCICIO_MEDIANA = 'Daily_Minutes_Spent';

// Propiedad de texto usada como etiqueta en tablas y gráficos
const PROPIEDAD_ETIQUETA_EJERCICIO_MEDIANA = 'App';


// ============================================================
// BLOQUE 3: TOGGLE — TABLA EJEMPLO INTERACTIVO (mediana.html)
// ============================================================

function toggleEjemploMediana() {

    let contenedorResultado = document.getElementById('resultado-mediana');
    let botonAccion         = document.getElementById('btn-ejemplo-mediana');

    if (!contenedorResultado || !botonAccion) { return; }

    // --- MOSTRAR: el contenedor está oculto, lo mostramos ---
    if (contenedorResultado.classList.contains('oculto')) {

        // PASO 3 y 4: calcula la mediana Y construye la tabla HTML ordenada
        calcularMediana(
            obtenerListaEstudiantes(),  // PASO 1: arreglo de estudiantes
            'calificacion',             // PASO 2: propiedad numérica
            'resultado-mediana',        // PASO 4: id del contenedor de la tabla
            'nombre'                    // etiqueta de texto para la columna izquierda
        );

        contenedorResultado.classList.remove('oculto');
        botonAccion.textContent = '✖ Ocultar Ejemplo';

    // --- OCULTAR: el contenedor está visible, lo ocultamos ---
    } else {
        contenedorResultado.classList.add('oculto');
        botonAccion.textContent = '▶ Calcular Mediana';
    }
}


// ============================================================
// BLOQUE 4: TOGGLE — GRÁFICO EJEMPLO INTERACTIVO (mediana.html)
// ============================================================

function toggleGraficoMediana() {

    let contenedorGrafico = document.getElementById('contenedor-grafico-mediana');
    let botonAccion       = document.getElementById('btn-grafico-mediana');

    if (!contenedorGrafico || !botonAccion) { return; }

    // --- OCULTAR: el gráfico está visible, lo ocultamos ---
    if (!contenedorGrafico.classList.contains('oculto')) {

        contenedorGrafico.classList.add('oculto');
        botonAccion.textContent = '📊 Ver Gráfico';

        // Liberamos la memoria del gráfico activo (variable de mediana.js)
        if (typeof instanciaGraficoMediana !== 'undefined' && instanciaGraficoMediana !== null) {
            try { instanciaGraficoMediana.destroy(); } catch(errorDestruccion) {}
            instanciaGraficoMediana = null;
        }
        return;
    }

    // --- MOSTRAR: el gráfico está oculto, lo mostramos ---
    contenedorGrafico.classList.remove('oculto');
    botonAccion.textContent = '✖ Ocultar Gráfico';

    // Reemplazamos el canvas para evitar el error "Canvas already in use" de Chart.js
    let canvasExistente = document.getElementById('graficaMediana');
    if (!canvasExistente) { return; }

    let canvasFresco  = document.createElement('canvas');
    canvasFresco.id   = 'graficaMediana';
    canvasExistente.parentNode.replaceChild(canvasFresco, canvasExistente);

    // Esperamos 50ms para que el navegador registre el nuevo canvas en el DOM
    setTimeout(function() {
        dibujarGraficoMediana(
            obtenerListaEstudiantes(),              // PASO 1: arreglo de estudiantes
            'calificacion',                         // PASO 2: propiedad numérica
            'graficaMediana',                       // id del canvas destino
            'Calificaciones de Estudiantes — Mediana' // título visible en el gráfico
        );
    }, 50);
}


// ============================================================
// BLOQUE 5: AGRUPACIÓN POR APP Y CÁLCULO DE MEDIANA (ejPractico.html)
// ============================================================
// Agrupa los 200 registros por nombre de App y calcula
// la mediana de PROPIEDAD_NUMERICA_EJERCICIO_MEDIANA para cada grupo.
// Devuelve: [{ App: 'Instagram', medianaMinutos: 45 }, ...]
// ============================================================

function agruparRegistrosPorAppMediana() {

    let todosLosRegistros = obtenerListaRedesSociales();

    // Objeto temporal donde cada clave es un nombre de App
    // y su valor es un arreglo con todos sus registros
    let registrosAgrupadosPorApp = {};

    for (let posicionRegistro = 0; posicionRegistro < todosLosRegistros.length; posicionRegistro++) {
        let registroActual  = todosLosRegistros[posicionRegistro];
        let nombreAppActual = registroActual[PROPIEDAD_ETIQUETA_EJERCICIO_MEDIANA] || 'Sin nombre';

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

    // Para cada App calculamos su mediana y construimos el arreglo final
    let resumenMedianaPorApp = [];

    for (let posicionApp = 0; posicionApp < nombresDeApps.length; posicionApp++) {
        let nombreAppActual      = nombresDeApps[posicionApp];
        let registrosDeLaApp     = registrosAgrupadosPorApp[nombreAppActual];

        // Solo calculamos (sin tabla): pasamos null en idContenedor
        let resultadoMedianaApp = calcularMediana(registrosDeLaApp, PROPIEDAD_NUMERICA_EJERCICIO_MEDIANA, null, null);

        resumenMedianaPorApp.push({
            App:            nombreAppActual,
            medianaMinutos: resultadoMedianaApp.mediana
        });
    }

    return resumenMedianaPorApp;
}


// ============================================================
// BLOQUE 6: TOGGLE — TABLA EJERCICIO PRÁCTICO (ejPractico.html)
// ============================================================

function toggleEjercicioPracticoMediana() {

    let contenedorTablaEjercicio = document.getElementById('resultado-ejercicio-mediana');
    let botonAccion              = document.getElementById('btn-ejercicio-practico-mediana');

    if (!contenedorTablaEjercicio || !botonAccion) { return; }

    // --- MOSTRAR ---
    if (contenedorTablaEjercicio.classList.contains('oculto')) {

        // Obtenemos el resumen agrupado: [{ App, medianaMinutos }, ...]
        let resumenPorApp = agruparRegistrosPorAppMediana();

        // Mostramos la tabla usando 'medianaMinutos' como propiedad numérica
        calcularMediana(
            resumenPorApp,
            'medianaMinutos',           // propiedad numérica del resumen
            'resultado-ejercicio-mediana', // id del contenedor de la tabla
            'App'                       // propiedad de texto para la columna izquierda
        );

        contenedorTablaEjercicio.classList.remove('oculto');
        botonAccion.textContent = '✖ Ocultar Tabla';

    // --- OCULTAR ---
    } else {
        contenedorTablaEjercicio.classList.add('oculto');
        botonAccion.textContent = '▶ Calcular Mediana por App';
    }
}


// ============================================================
// BLOQUE 7: TOGGLE — GRÁFICO EJERCICIO PRÁCTICO (ejPractico.html)
// ============================================================

// Instancia separada para el gráfico del ejercicio práctico
// (independiente de instanciaGraficoMediana de mediana.js)
let instanciaGraficoEjercicioPracticoMediana = null;

function toggleGraficoEjercicioMediana() {

    let contenedorGraficoEjercicio = document.getElementById('contenedor-grafico-ejercicio-mediana');
    let botonAccion                = document.getElementById('btn-grafico-ejercicio-mediana');

    if (!contenedorGraficoEjercicio || !botonAccion) { return; }

    // --- OCULTAR ---
    if (!contenedorGraficoEjercicio.classList.contains('oculto')) {

        contenedorGraficoEjercicio.classList.add('oculto');
        botonAccion.textContent = '📊 Ver Gráfico Comparativo';

        if (instanciaGraficoEjercicioPracticoMediana !== null) {
            try { instanciaGraficoEjercicioPracticoMediana.destroy(); } catch(errorDestruccion) {}
            instanciaGraficoEjercicioPracticoMediana = null;
        }
        return;
    }

    // --- MOSTRAR ---
    contenedorGraficoEjercicio.classList.remove('oculto');
    botonAccion.textContent = '✖ Ocultar Gráfico';

    // Liberamos instancia previa si quedó activa
    if (instanciaGraficoEjercicioPracticoMediana !== null) {
        try { instanciaGraficoEjercicioPracticoMediana.destroy(); } catch(errorDestruccion) {}
        instanciaGraficoEjercicioPracticoMediana = null;
    }

    // Reemplazamos el canvas para evitar conflictos de Chart.js
    let canvasExistente = document.getElementById('graficaEjercicioMediana');
    if (!canvasExistente) { return; }

    let canvasFresco = document.createElement('canvas');
    canvasFresco.id  = 'graficaEjercicioMediana';
    canvasExistente.parentNode.replaceChild(canvasFresco, canvasExistente);

    setTimeout(function() {
        let resumenPorApp = agruparRegistrosPorAppMediana();

        let selectorGrafico = document.getElementById('select-grafico-mediana');
        let tipoElegido = selectorGrafico ? selectorGrafico.value : null;

        instanciaGraficoEjercicioPracticoMediana = dibujarGraficoMediana(
            resumenPorApp,
            'medianaMinutos',   // propiedad numérica del resumen agrupado
            'graficaEjercicioMediana',
            'Mediana de ' + PROPIEDAD_NUMERICA_EJERCICIO_MEDIANA + ' por App',
            tipoElegido
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

    // Evento para ocultar el gráfico al cambiar el tipo en el combo box
    let selectorGrafico = document.getElementById('select-grafico-mediana');
    if (selectorGrafico) {
        selectorGrafico.addEventListener('change', function() {
            let contenedorGrafico = document.getElementById('contenedor-grafico-ejercicio-mediana');
            let botonAccion = document.getElementById('btn-grafico-ejercicio-mediana');

            if (contenedorGrafico && botonAccion) {
                if (!contenedorGrafico.classList.contains('oculto')) {
                    contenedorGrafico.classList.add('oculto');
                    botonAccion.textContent = '📊 Ver Gráfico de Distribución';

                    // Limpiar la instancia previa si existe
                    if (instanciaGraficoEjercicioPracticoMediana !== null) {
                        try { instanciaGraficoEjercicioPracticoMediana.destroy(); } catch(error) {}
                        instanciaGraficoEjercicioPracticoMediana = null;
                    }
                }
            }
        });
    }
});