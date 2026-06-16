// ============================================================
// media.js — Cálculo y visualización de la Media Aritmética
// ============================================================
// Este archivo contiene TODAS las funciones relacionadas con
// la media: cálculo matemático, tabla HTML y gráfico Chart.js.
//
// Funciones públicas:
//   - calcularMedia(...)       → calcula y muestra la tabla HTML
//   - dibujarGraficoMedia(...) → dibuja el gráfico Chart.js
//
// Orden de carga en el HTML:
//   1. chart.js (CDN)
//   2. datos.js o social_media_200.js  → fuentes de datos
//   3. media.js                        → este archivo
//   4. media_pagina.js                 → controlador de página
// ============================================================


// ------------------------------------------------------------
// VARIABLE GLOBAL
// ------------------------------------------------------------
// Guarda la instancia activa del gráfico Chart.js para poder
// destruirla antes de crear una nueva. Chart.js no permite
// reutilizar un <canvas> sin destruir el gráfico anterior.
// ------------------------------------------------------------
let instanciaGraficoMedia = null;


// ------------------------------------------------------------
// CONSTANTE: TIPO DE GRÁFICO
// ------------------------------------------------------------
// Define el tipo de gráfico para TODA la sección Media.
// Cambiar este valor afecta tanto el ejemplo interactivo como
// el ejercicio práctico.
//
// Opciones válidas:
//   'bar'           → Barras verticales
//   'barHorizontal' → Barras horizontales
//   'line'          → Línea continua
//   'doughnut'      → Dona (agrupa en rangos por cuartiles)
//   'pie'           → Pastel
//   'radar'         → Telaraña
//   'polarArea'     → Área polar
// ------------------------------------------------------------
const TIPO_GRAFICO_MEDIA = 'bar';


// ============================================================
// FUNCIÓN: calcularMediaDesdeArregloNumerico
// ============================================================
// Núcleo matemático puro. Recibe un arreglo de números ya
// validados y devuelve todos los datos del cálculo de la media.
//
// Pasos del algoritmo:
//   1. Sumar todos los valores del arreglo
//   2. Contar cuántos valores hay
//   3. Dividir la suma entre la cantidad
//
// Parámetros:
//   listaNumeros → arreglo de números válidos (sin NaN)
//
// Devuelve: { sumaTotal, totalRegistros, media }
// ============================================================
function calcularMediaDesdeArregloNumerico(listaNumeros) {

    // PASO 1: Sumar todos los valores
    let sumaTotalAcumulada = 0;

    for (let posicionNumero = 0; posicionNumero < listaNumeros.length; posicionNumero++) {
        sumaTotalAcumulada = sumaTotalAcumulada + listaNumeros[posicionNumero];
    }

    // PASO 2: Contar la cantidad de valores
    let totalRegistrosValidos = listaNumeros.length;

    // PASO 3: Calcular el promedio
    let valorMediaCalculado = 0;

    if (totalRegistrosValidos > 0) {
        valorMediaCalculado = sumaTotalAcumulada / totalRegistrosValidos;
    }

    return {
        sumaTotal      : Number(sumaTotalAcumulada.toFixed(2)),
        totalRegistros : totalRegistrosValidos,
        media          : Number(valorMediaCalculado.toFixed(2))
    };
}


// ============================================================
// FUNCIÓN PÚBLICA: calcularMedia
// ============================================================
// Recorre un arreglo de objetos, extrae los valores numéricos
// de una propiedad específica, calcula la media y genera
// una tabla HTML con la fórmula y el resultado.
//
// Parámetros:
//   listaDeDatos       → arreglo de objetos
//   propiedadNumerica  → nombre de la propiedad numérica a analizar
//   idContenedorTabla  → id del elemento HTML donde mostrar la tabla
//                        (pasar null si NO se quiere tabla)
//   propiedadEtiqueta  → nombre de la propiedad de texto para la tabla
//
// Devuelve el objeto con: { sumaTotal, totalRegistros, media }
// ============================================================
function calcularMedia(listaDeDatos, propiedadNumerica, idContenedorTabla, propiedadEtiqueta) {

    // PASO 1: Filtrar registros con valor numérico válido
    let registrosValidos = [];

    for (let posicionRegistro = 0; posicionRegistro < listaDeDatos.length; posicionRegistro++) {
        let valorNumerico = Number(listaDeDatos[posicionRegistro][propiedadNumerica]);
        if (!isNaN(valorNumerico)) {
            registrosValidos.push(listaDeDatos[posicionRegistro]);
        }
    }

    // PASO 2: Extraer solo los números para el cálculo
    let listaSoloNumeros = [];

    for (let posicionNumero = 0; posicionNumero < registrosValidos.length; posicionNumero++) {
        listaSoloNumeros.push(Number(registrosValidos[posicionNumero][propiedadNumerica]));
    }

    // PASO 3: Calcular la media con la función interna
    let resultadoMedia = calcularMediaDesdeArregloNumerico(listaSoloNumeros);

    // PASO 4: (sin ordenamiento — la media no requiere orden)

    // PASO 5: Generar tabla HTML (solo si se recibió un id de contenedor)
    if (typeof idContenedorTabla === 'string' && idContenedorTabla.length > 0) {

        let elementoContenedor = document.getElementById(idContenedorTabla);

        if (elementoContenedor) {

            let contenidoEstructuraHTML = '';
            contenidoEstructuraHTML += '<p><strong>Datos registrados — ' + propiedadNumerica + '</strong></p>';
            contenidoEstructuraHTML += '<table class="tabla-interactiva">';

            let nombreColumnaIdentificador = propiedadEtiqueta || 'Ítem';
            contenidoEstructuraHTML += '<tr>';
            contenidoEstructuraHTML += '<th>#</th>';
            contenidoEstructuraHTML += '<th>' + nombreColumnaIdentificador + '</th>';
            contenidoEstructuraHTML += '<th>Valor</th>';
            contenidoEstructuraHTML += '<th>¿Sobre la media?</th>';
            contenidoEstructuraHTML += '</tr>';

            // Genera una fila por cada registro
            for (let posicionFila = 0; posicionFila < registrosValidos.length; posicionFila++) {

                let valorFilaNumerico  = Number(registrosValidos[posicionFila][propiedadNumerica]);
                let sobreLaMedia       = valorFilaNumerico >= resultadoMedia.media;
                let marcaSobreMedia    = sobreLaMedia ? '▲ sobre' : '▼ bajo';
                let estiloFilaMedia    = sobreLaMedia
                    ? ' style="background:#dcfce7;"'   // verde claro = sobre la media
                    : ' style="background:#fee2e2;"';  // rojo claro  = bajo la media

                let textoEtiquetaFila = propiedadEtiqueta
                    ? registrosValidos[posicionFila][propiedadEtiqueta]
                    : 'Dato ' + (posicionFila + 1);

                contenidoEstructuraHTML += '<tr' + estiloFilaMedia + '>';
                contenidoEstructuraHTML += '<td>' + (posicionFila + 1) + '</td>';
                contenidoEstructuraHTML += '<td>' + textoEtiquetaFila + '</td>';
                contenidoEstructuraHTML += '<td>' + valorFilaNumerico + '</td>';
                contenidoEstructuraHTML += '<td>' + marcaSobreMedia + '</td>';
                contenidoEstructuraHTML += '</tr>';
            }

            contenidoEstructuraHTML += '</table>';

            // Caja con el proceso de cálculo
            contenidoEstructuraHTML += '<div class="detalle-calculo">';
            contenidoEstructuraHTML += 'Total de datos: ' + resultadoMedia.totalRegistros + '<br>';
            contenidoEstructuraHTML += 'Suma total: <strong>' + resultadoMedia.sumaTotal + '</strong><br>';
            contenidoEstructuraHTML += 'Fórmula: Media = Suma ÷ Cantidad<br>';
            contenidoEstructuraHTML += 'Operación: ' + resultadoMedia.sumaTotal + ' ÷ ' + resultadoMedia.totalRegistros + ' = <strong>' + resultadoMedia.media.toFixed(2) + '</strong>';
            contenidoEstructuraHTML += '</div>';

            contenidoEstructuraHTML += '<div class="caja-resultado">';
            contenidoEstructuraHTML += '📘 Media aritmética: <strong>' + resultadoMedia.media.toFixed(2) + '</strong>';
            contenidoEstructuraHTML += '</div>';

            elementoContenedor.innerHTML = contenidoEstructuraHTML;
        }
    }

    // PASO 6: Devolver el resultado del cálculo
    return resultadoMedia;
}


// ============================================================
// FUNCIÓN: prepararDatosParaGraficoMedia
// ============================================================
// Transforma el arreglo de registros en los arreglos paralelos
// que Chart.js necesita para dibujar el gráfico.
//
// Si el tipo es 'doughnut' o 'pie', agrupa los datos en 4 rangos
// por cuartiles. Para el resto de tipos, genera un punto por
// cada registro, coloreando verde los que están sobre la media
// y azul los que están por debajo.
// ============================================================
function prepararDatosParaGraficoMedia(listaDeDatos, propiedadNumerica) {

    // ── MODO DONA / PIE: agrupar en 4 rangos por cuartiles ──
    if (TIPO_GRAFICO_MEDIA === 'doughnut' || TIPO_GRAFICO_MEDIA === 'pie') {

        let soloNumerosParaCuartiles = [];

        for (let posicionRegistro = 0; posicionRegistro < listaDeDatos.length; posicionRegistro++) {
            let valorExtraido = Number(listaDeDatos[posicionRegistro][propiedadNumerica]);
            if (!isNaN(valorExtraido)) {
                soloNumerosParaCuartiles.push(valorExtraido);
            }
        }

        soloNumerosParaCuartiles.sort(function(numeroA, numeroB) { return numeroA - numeroB; });

        let valorCuartilPrimero = soloNumerosParaCuartiles[Math.floor(soloNumerosParaCuartiles.length * 0.25)] || 0;
        let valorCuartilSegundo = soloNumerosParaCuartiles[Math.floor(soloNumerosParaCuartiles.length * 0.50)] || 0;
        let valorCuartilTercero = soloNumerosParaCuartiles[Math.floor(soloNumerosParaCuartiles.length * 0.75)] || 0;

        let cantidadRangoAlto      = 0;
        let cantidadRangoMedioAlto = 0;
        let cantidadRangoMedioBajo = 0;
        let cantidadRangoBajo      = 0;

        for (let posicionClasif = 0; posicionClasif < listaDeDatos.length; posicionClasif++) {
            let valorClasificado = Number(listaDeDatos[posicionClasif][propiedadNumerica]);
            if (!isNaN(valorClasificado)) {
                if      (valorClasificado > valorCuartilTercero) { cantidadRangoAlto++;      }
                else if (valorClasificado > valorCuartilSegundo) { cantidadRangoMedioAlto++; }
                else if (valorClasificado > valorCuartilPrimero) { cantidadRangoMedioBajo++; }
                else                                             { cantidadRangoBajo++;      }
            }
        }

        // Calculamos la media real para mostrarla en el plugin central
        let listaNumerosCompleta = [];
        for (let pos = 0; pos < listaDeDatos.length; pos++) {
            let v = Number(listaDeDatos[pos][propiedadNumerica]);
            if (!isNaN(v)) { listaNumerosCompleta.push(v); }
        }
        let resultadoMediaDona = calcularMediaDesdeArregloNumerico(listaNumerosCompleta);

        return {
            arregloEtiquetas: [
                'Alto (> '     + valorCuartilTercero + ')',
                'Medio-Alto (' + valorCuartilSegundo + ' – ' + valorCuartilTercero + ')',
                'Medio-Bajo (' + valorCuartilPrimero + ' – ' + valorCuartilSegundo + ')',
                'Bajo (≤ '     + valorCuartilPrimero + ')'
            ],
            arregloValoresGrafico: [cantidadRangoAlto, cantidadRangoMedioAlto, cantidadRangoMedioBajo, cantidadRangoBajo],
            arregloColoresGrafico: ['#2ecc71', '#3498db', '#f1c40f', '#e74c3c'],
            arregloLineaMedia:     [],
            valorMediaFinal:       resultadoMediaDona.media
        };
    }

    // ── RESTO DE TIPOS: un punto por cada registro ──
    let registrosValidosFiltrados = [];

    for (let posicionFiltro = 0; posicionFiltro < listaDeDatos.length; posicionFiltro++) {
        let valorFiltrado = Number(listaDeDatos[posicionFiltro][propiedadNumerica]);
        if (!isNaN(valorFiltrado)) {
            registrosValidosFiltrados.push(listaDeDatos[posicionFiltro]);
        }
    }

    let soloNumerosGrafico = [];
    for (let posicionOrden = 0; posicionOrden < registrosValidosFiltrados.length; posicionOrden++) {
        soloNumerosGrafico.push(Number(registrosValidosFiltrados[posicionOrden][propiedadNumerica]));
    }

    let resultadoMediaGrafico = calcularMediaDesdeArregloNumerico(soloNumerosGrafico);

    // Detectar propiedad de texto para etiquetas
    let propiedadTextoDetectada = null;

    if (registrosValidosFiltrados.length > 0) {
        let propiedadesDelObjeto = Object.keys(registrosValidosFiltrados[0]);

        for (let posicionPropiedad = 0; posicionPropiedad < propiedadesDelObjeto.length; posicionPropiedad++) {
            let nombrePropiedad = propiedadesDelObjeto[posicionPropiedad];

            if (nombrePropiedad !== propiedadNumerica &&
                typeof registrosValidosFiltrados[0][nombrePropiedad] === 'string') {
                propiedadTextoDetectada = nombrePropiedad;
                break;
            }
        }
    }

    let arregloEtiquetasGrafico = [];
    let arregloValoresGrafico   = [];
    let arregloColoresGrafico   = [];
    let arregloLineaMediaGrafico = [];

    for (let posicionPunto = 0; posicionPunto < registrosValidosFiltrados.length; posicionPunto++) {
        let valorPuntoActual = Number(registrosValidosFiltrados[posicionPunto][propiedadNumerica]);

        arregloEtiquetasGrafico.push(
            propiedadTextoDetectada
                ? registrosValidosFiltrados[posicionPunto][propiedadTextoDetectada]
                : 'Dato ' + (posicionPunto + 1)
        );

        arregloValoresGrafico.push(valorPuntoActual);

        // Verde = sobre la media, Azul = bajo la media
        arregloColoresGrafico.push(
            valorPuntoActual >= resultadoMediaGrafico.media
                ? 'rgba(34, 197, 94, 0.75)'    // verde = sobre la media
                : 'rgba(99, 144, 241, 0.75)'   // azul  = bajo la media
        );

        arregloLineaMediaGrafico.push(resultadoMediaGrafico.media);
    }

    return {
        arregloEtiquetas:      arregloEtiquetasGrafico,
        arregloValoresGrafico: arregloValoresGrafico,
        arregloColoresGrafico: arregloColoresGrafico,
        arregloLineaMedia:     arregloLineaMediaGrafico,
        valorMediaFinal:       resultadoMediaGrafico.media
    };
}


// ============================================================
// FUNCIÓN: crearPluginMarcadorMedia
// ============================================================
// Crea un plugin personalizado de Chart.js que dibuja el valor
// de la media en el centro del canvas.
//
// Solo tiene efecto visual en gráficos de tipo 'doughnut' y 'pie'.
// ============================================================
function crearPluginMarcadorMedia(valorMediaPlugin, idUnicoPlugin) {

    return {
        id: idUnicoPlugin || 'pluginMarcadorMedia',

        afterDraw: function(instanciaGrafico) {

            if (TIPO_GRAFICO_MEDIA !== 'doughnut' && TIPO_GRAFICO_MEDIA !== 'pie') { return; }

            let centroX  = instanciaGrafico.width  / 2;
            let centroY  = instanciaGrafico.height / 2;
            let contexto = instanciaGrafico.ctx;

            contexto.save();

            contexto.font         = 'bold 28px Arial';
            contexto.textAlign    = 'center';
            contexto.textBaseline = 'middle';
            contexto.fillStyle    = '#2c3e50';
            contexto.fillText(valorMediaPlugin.toFixed(2), centroX, centroY - 14);

            contexto.strokeStyle = '#2563EB';
            contexto.lineWidth   = 3;
            contexto.beginPath();
            contexto.moveTo(centroX - 28, centroY + 8);
            contexto.lineTo(centroX + 28, centroY + 8);
            contexto.stroke();

            contexto.font      = 'bold 11px Arial';
            contexto.fillStyle = '#2563EB';
            contexto.fillText('MEDIA', centroX, centroY + 26);

            contexto.restore();
        }
    };
}


// ============================================================
// FUNCIÓN: obtenerConfiguracionGraficoMedia
// ============================================================
// Construye y devuelve el objeto 'options' que Chart.js usa
// para configurar el comportamiento y apariencia del gráfico.
// ============================================================
function obtenerConfiguracionGraficoMedia(textoTituloGrafico) {

    let esBarraHorizontal = (TIPO_GRAFICO_MEDIA === 'barHorizontal');
    let requiereEjes      = (TIPO_GRAFICO_MEDIA === 'bar' || esBarraHorizontal);

    return {
        responsive:          true,
        maintainAspectRatio: false,
        indexAxis:           esBarraHorizontal ? 'y' : 'x',

        animations: (TIPO_GRAFICO_MEDIA === 'bar' || esBarraHorizontal)
            ? {
                [esBarraHorizontal ? 'x' : 'y']: {
                    duration: 10,
                    easing:   'easeInOutQuart',
                    delay: function(contextoAnimacion) {
                        return contextoAnimacion.dataIndex * 10;
                    }
                }
            }
            : {
                animateRotate: true,
                animateScale:  true,
                duration:      1000,
                easing:        'easeInOutQuart'
            },

        plugins: {
            legend: {
                position: 'bottom'
            },
            title: {
                display: true,
                text:    textoTituloGrafico
            },
            tooltip: {
                enabled:       true,
                displayColors: false,
                callbacks: {
                    title: function() { return ''; },
                    label: function(contextoTooltip) {
                        let nombreItem = contextoTooltip.label || '';
                        let ejeValor   = esBarraHorizontal ? 'x' : 'y';
                        let valorItem  = Number(contextoTooltip.parsed[ejeValor]).toFixed(2);
                        return nombreItem + ': ' + valorItem;
                    }
                }
            }
        },

        scales: requiereEjes
            ? { [esBarraHorizontal ? 'x' : 'y']: { beginAtZero: true } }
            : {}
    };
}


// ============================================================
// FUNCIÓN PÚBLICA: dibujarGraficoMedia
// ============================================================
// Función principal de visualización. Orquesta todo el proceso
// de creación del gráfico Chart.js en el canvas indicado.
//
// Flujo interno:
//   1. Busca el canvas en el DOM
//   2. Destruye el gráfico anterior si existe
//   3. Prepara los datos (etiquetas, colores, línea de referencia)
//   4. Construye el objeto 'data' con uno o dos datasets
//   5. Crea la instancia de Chart.js con todos los parámetros
//   6. Guarda la instancia y la devuelve
//
// Parámetros:
//   listaDeDatos       → arreglo de objetos con los datos
//   propiedadNumerica  → nombre de la propiedad numérica
//   idCanvasDestino    → id del elemento <canvas> en el HTML
//   textoTitulo        → título del gráfico
//
// Devuelve: la instancia del gráfico Chart.js creado
// ============================================================
function dibujarGraficoMedia(listaDeDatos, propiedadNumerica, idCanvasDestino, textoTitulo) {

    let elementoCanvasMedia = document.getElementById(idCanvasDestino);
    if (!elementoCanvasMedia) { return null; }

    elementoCanvasMedia.style.height    = '350px';
    elementoCanvasMedia.style.maxHeight = '350px';

    // PASO 1 y 2: Destruir gráfico anterior si existe
    if (instanciaGraficoMedia !== null) {
        try {
            instanciaGraficoMedia.destroy();
        } catch(errorDestruccion) {}
        instanciaGraficoMedia = null;
    }

    // PASO 3: Preparar los datos
    let datosPreparados = prepararDatosParaGraficoMedia(listaDeDatos, propiedadNumerica);

    // PASO 4: Construir datasets
    let textoTituloDefinitivo = textoTitulo || ('Media: ' + datosPreparados.valorMediaFinal.toFixed(2));

    let arregloDatasetsGrafico = [
        {
            label:           'Valor (' + propiedadNumerica + ')',
            data:            datosPreparados.arregloValoresGrafico,
            backgroundColor: datosPreparados.arregloColoresGrafico,
            borderColor:     datosPreparados.arregloColoresGrafico,
            borderWidth:     1,
            hoverOffset:     10
        }
    ];

    let esGraficoTipoBarra = (TIPO_GRAFICO_MEDIA === 'bar' || TIPO_GRAFICO_MEDIA === 'barHorizontal');

    // Agregar línea de referencia de la media en gráficos de barras
    if (esGraficoTipoBarra && datosPreparados.arregloLineaMedia.length > 0) {
        arregloDatasetsGrafico.push({
            label:       'Media (' + datosPreparados.valorMediaFinal.toFixed(2) + ')',
            data:        datosPreparados.arregloLineaMedia,
            type:        'line',
            borderColor: 'rgba(37, 99, 235, 1)',
            borderWidth: 2,
            pointRadius: 0,
            fill:        false
        });
    }

    // PASO 5: Crear el gráfico
    instanciaGraficoMedia = new Chart(elementoCanvasMedia.getContext('2d'), {

        type: TIPO_GRAFICO_MEDIA === 'barHorizontal' ? 'bar' : TIPO_GRAFICO_MEDIA,

        data: {
            labels:   datosPreparados.arregloEtiquetas,
            datasets: arregloDatasetsGrafico
        },

        options: obtenerConfiguracionGraficoMedia(textoTituloDefinitivo),

        plugins: [ crearPluginMarcadorMedia(datosPreparados.valorMediaFinal, 'pluginMedia_' + idCanvasDestino) ]
    });

    // PASO 6: Devolver la instancia creada
    return instanciaGraficoMedia;
}