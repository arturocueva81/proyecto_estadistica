// ============================================================
// mediana.js — Cálculo y visualización de la Mediana
// ============================================================
// Este archivo contiene TODAS las funciones relacionadas con
// la mediana: cálculo matemático, tabla HTML y gráfico Chart.js.
//
// Funciones públicas:
//   - calcularMediana(...)       → calcula y muestra la tabla HTML
//   - dibujarGraficoMediana(...) → dibuja el gráfico Chart.js
//
// Orden de carga en el HTML:
//   1. chart.js (CDN)
//   2. datos.js o social_media_200.js  → fuentes de datos
//   3. mediana.js                      → este archivo
//   4. mediana_pagina.js               → controlador de página
// ============================================================


// ------------------------------------------------------------
// VARIABLE GLOBAL
// ------------------------------------------------------------
// Guarda la instancia activa del gráfico Chart.js para poder
// destruirla antes de crear una nueva. Chart.js no permite
// reutilizar un <canvas> sin destruir el gráfico anterior.
// ------------------------------------------------------------
let instanciaGraficoMediana = null;


// ------------------------------------------------------------
// CONSTANTE: TIPO DE GRÁFICO
// ------------------------------------------------------------
// Define el tipo de gráfico para TODA la sección Mediana.
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
const TIPO_GRAFICO_MEDIANA = 'barHorizontal';


// ============================================================
// FUNCIÓN: calcularMedianaDesdeArregloNumerico
// ============================================================
// Núcleo matemático puro. Recibe un arreglo de números ya
// validados y devuelve todos los datos del cálculo de la mediana.
//
// Pasos del algoritmo:
//   1. Copiar el arreglo para no modificar el original
//   2. Ordenar la copia de menor a mayor
//   3. Calcular la posición central con Math.floor
//   4. Determinar si la cantidad es par o impar
//   5. Si es PAR  → promediar los dos valores centrales
//   6. Si es IMPAR → tomar el valor exacto del centro
//
// Parámetros:
//   listaNumeros → arreglo de números válidos (sin NaN)
//
// Devuelve: {
//   listaNumerosOrdenados,
//   posicionCentro,
//   cantidadEsPar,
//   mediana
// }
// ============================================================
function calcularMedianaDesdeArregloNumerico(listaNumeros) {

    // PASO 1: Copiar el arreglo para no alterar el original
    let listaNumerosOrdenados = listaNumeros.slice();

    // PASO 2: Ordenar de menor a mayor
    listaNumerosOrdenados.sort(function(numeroA, numeroB) {
        return numeroA - numeroB;
    });

    // PASO 3: Calcular la posición central
    let posicionCentro = Math.floor(listaNumerosOrdenados.length / 2);

    // PASO 4: Determinar si la cantidad es par o impar
    let cantidadEsPar = (listaNumerosOrdenados.length % 2 === 0);

    // PASO 5 y 6: Calcular la mediana según paridad
    let valorMedianaCalculado = 0;

    if (cantidadEsPar) {
        // Cantidad PAR: promedio de los dos valores centrales
        let valorCentroIzquierdo = listaNumerosOrdenados[posicionCentro - 1];
        let valorCentroDerecho   = listaNumerosOrdenados[posicionCentro];
        valorMedianaCalculado    = (valorCentroIzquierdo + valorCentroDerecho) / 2;
    } else {
        // Cantidad IMPAR: valor exacto del centro
        valorMedianaCalculado = listaNumerosOrdenados[posicionCentro];
    }

    return {
        listaNumerosOrdenados : listaNumerosOrdenados,
        posicionCentro        : posicionCentro,
        cantidadEsPar         : cantidadEsPar,
        mediana               : Number(valorMedianaCalculado.toFixed(2))
    };
}


// ============================================================
// FUNCIÓN PÚBLICA: calcularMediana
// ============================================================
// Recorre un arreglo de objetos, extrae los valores numéricos
// de una propiedad específica, calcula la mediana y genera
// una tabla HTML ordenada con la marca del valor central.
//
// Parámetros:
//   listaDeDatos       → arreglo de objetos
//   propiedadNumerica  → nombre de la propiedad numérica a analizar
//   idContenedorTabla  → id del elemento HTML donde mostrar la tabla
//                        (pasar null si NO se quiere tabla)
//   propiedadEtiqueta  → nombre de la propiedad de texto para la tabla
//
// Devuelve el objeto con: { listaNumerosOrdenados, posicionCentro, cantidadEsPar, mediana }
// ============================================================
function calcularMediana(listaDeDatos, propiedadNumerica, idContenedorTabla, propiedadEtiqueta) {

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

    // PASO 3: Calcular la mediana con la función interna
    let resultadoMediana = calcularMedianaDesdeArregloNumerico(listaSoloNumeros);

    // PASO 4: Ordenar los objetos de menor a mayor para la tabla
    let registrosOrdenados = registrosValidos.slice();

    registrosOrdenados.sort(function(objetoA, objetoB) {
        return Number(objetoA[propiedadNumerica]) - Number(objetoB[propiedadNumerica]);
    });

    // PASO 5: Generar tabla HTML (solo si se recibió un id de contenedor)
    if (typeof idContenedorTabla === 'string' && idContenedorTabla.length > 0) {

        let elementoContenedor = document.getElementById(idContenedorTabla);

        if (elementoContenedor) {

            let contenidoEstructuraHTML = '';
            contenidoEstructuraHTML += '<p><strong>Datos ordenados de menor a mayor — ' + propiedadNumerica + '</strong></p>';
            contenidoEstructuraHTML += '<table class="tabla-interactiva">';

            let nombreColumnaIdentificador = propiedadEtiqueta || 'Ítem';
            contenidoEstructuraHTML += '<tr>';
            contenidoEstructuraHTML += '<th>#</th>';
            contenidoEstructuraHTML += '<th>' + nombreColumnaIdentificador + '</th>';
            contenidoEstructuraHTML += '<th>Valor</th>';
            contenidoEstructuraHTML += '<th>¿Centro?</th>';
            contenidoEstructuraHTML += '</tr>';

            // Genera una fila por cada registro ordenado
            for (let posicionFila = 0; posicionFila < registrosOrdenados.length; posicionFila++) {

                let marcaCentroFila = '';

                // Cantidad IMPAR: solo hay un centro exacto
                if (!resultadoMediana.cantidadEsPar &&
                    posicionFila === resultadoMediana.posicionCentro) {
                    marcaCentroFila = '⬅ centro';
                }

                // Cantidad PAR: hay dos valores centrales
                if (resultadoMediana.cantidadEsPar &&
                    (posicionFila === resultadoMediana.posicionCentro - 1 ||
                     posicionFila === resultadoMediana.posicionCentro)) {
                    marcaCentroFila = '⬅ centro';
                }

                let textoEtiquetaFila = propiedadEtiqueta
                    ? registrosOrdenados[posicionFila][propiedadEtiqueta]
                    : 'Dato ' + (posicionFila + 1);

                let valorFilaNumerico = Number(registrosOrdenados[posicionFila][propiedadNumerica]);
                let estiloFilaCentro  = marcaCentroFila ? ' style="background:#fee2e2; font-weight:bold;"' : '';

                contenidoEstructuraHTML += '<tr' + estiloFilaCentro + '>';
                contenidoEstructuraHTML += '<td>' + (posicionFila + 1) + '</td>';
                contenidoEstructuraHTML += '<td>' + textoEtiquetaFila + '</td>';
                contenidoEstructuraHTML += '<td>' + valorFilaNumerico + '</td>';
                contenidoEstructuraHTML += '<td>' + marcaCentroFila + '</td>';
                contenidoEstructuraHTML += '</tr>';
            }

            contenidoEstructuraHTML += '</table>';

            // Caja con el proceso de cálculo
            contenidoEstructuraHTML += '<div class="detalle-calculo">';
            contenidoEstructuraHTML += 'Total de datos: ' + resultadoMediana.listaNumerosOrdenados.length + '<br>';

            if (resultadoMediana.cantidadEsPar) {
                let valorCentroIzquierdo = resultadoMediana.listaNumerosOrdenados[resultadoMediana.posicionCentro - 1];
                let valorCentroDerecho   = resultadoMediana.listaNumerosOrdenados[resultadoMediana.posicionCentro];
                contenidoEstructuraHTML += 'Cantidad de datos: par<br>';
                contenidoEstructuraHTML += 'Valores centrales: <strong>' + valorCentroIzquierdo + '</strong> y <strong>' + valorCentroDerecho + '</strong><br>';
                contenidoEstructuraHTML += 'Mediana = (' + valorCentroIzquierdo + ' + ' + valorCentroDerecho + ') / 2';
            } else {
                contenidoEstructuraHTML += 'Cantidad de datos: impar<br>';
                contenidoEstructuraHTML += 'Posición central: ' + (resultadoMediana.posicionCentro + 1) + '<br>';
                contenidoEstructuraHTML += 'Valor en esa posición: <strong>' + resultadoMediana.mediana + '</strong>';
            }

            contenidoEstructuraHTML += '</div>';

            contenidoEstructuraHTML += '<div class="caja-resultado">';
            contenidoEstructuraHTML += '📗 Mediana: <strong>' + resultadoMediana.mediana.toFixed(2) + '</strong>';
            contenidoEstructuraHTML += '</div>';

            elementoContenedor.innerHTML = contenidoEstructuraHTML;
        }
    }

    // PASO 6: Devolver el resultado del cálculo
    return resultadoMediana;
}


// ============================================================
// FUNCIÓN: prepararDatosParaGraficoMediana
// ============================================================
// Transforma el arreglo de registros en los arreglos paralelos
// que Chart.js necesita para dibujar el gráfico.
//
// Si el tipo es 'doughnut' o 'pie', agrupa los datos en 4 rangos
// por cuartiles. Para el resto de tipos, genera un punto por
// cada registro, coloreando el/los valor(es) central(es) en rojo.
// ============================================================
function prepararDatosParaGraficoMediana(listaDeDatos, propiedadNumerica, tipoGrafico) {

    let tipoActivo = tipoGrafico || TIPO_GRAFICO_MEDIANA;

    // ── MODO DONA / PIE: agrupar en 4 rangos por cuartiles ──
    if (tipoActivo === 'doughnut' || tipoActivo === 'pie') {

        let soloNumerosParaCuartiles = [];

        for (let posicionRegistro = 0; posicionRegistro < listaDeDatos.length; posicionRegistro++) {
            let valorExtraido = Number(listaDeDatos[posicionRegistro][propiedadNumerica]);
            if (!isNaN(valorExtraido)) {
                soloNumerosParaCuartiles.push(valorExtraido);
            }
        }

        soloNumerosParaCuartiles.sort(function(numeroA, numeroB) { return numeroA - numeroB; });

        let valorCuartilPrimero  = soloNumerosParaCuartiles[Math.floor(soloNumerosParaCuartiles.length * 0.25)] || 0;
        let valorCuartilSegundo  = soloNumerosParaCuartiles[Math.floor(soloNumerosParaCuartiles.length * 0.50)] || 0;
        let valorCuartilTercero  = soloNumerosParaCuartiles[Math.floor(soloNumerosParaCuartiles.length * 0.75)] || 0;

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

        return {
            arregloEtiquetas: [
                'Alto (> '     + valorCuartilTercero + ')',
                'Medio-Alto (' + valorCuartilSegundo + '  ' + valorCuartilTercero + ')',
                'Medio-Bajo (' + valorCuartilPrimero + '  ' + valorCuartilSegundo + ')',
                'Bajo (≤ '     + valorCuartilPrimero + ')'
            ],
            arregloValoresGrafico: [cantidadRangoAlto, cantidadRangoMedioAlto, cantidadRangoMedioBajo, cantidadRangoBajo],
            arregloColoresGrafico: ['#2ecc71', '#3498db', '#f1c40f', '#e74c3c'],
            arregloLineaMediana:   [],
            valorMedianaFinal:     valorCuartilSegundo
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

    registrosValidosFiltrados.sort(function(objetoA, objetoB) {
        return Number(objetoA[propiedadNumerica]) - Number(objetoB[propiedadNumerica]);
    });

    let soloNumerosOrdenadosGrafico = [];
    for (let posicionOrden = 0; posicionOrden < registrosValidosFiltrados.length; posicionOrden++) {
        soloNumerosOrdenadosGrafico.push(Number(registrosValidosFiltrados[posicionOrden][propiedadNumerica]));
    }

    let resultadoMedianaGrafico = calcularMedianaDesdeArregloNumerico(soloNumerosOrdenadosGrafico);

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

    let arregloEtiquetasGrafico    = [];
    let arregloValoresGrafico      = [];
    let arregloColoresGrafico      = [];
    let arregloLineaMedianaGrafico = [];

    for (let posicionPunto = 0; posicionPunto < registrosValidosFiltrados.length; posicionPunto++) {
        let valorPuntoActual = Number(registrosValidosFiltrados[posicionPunto][propiedadNumerica]);

        arregloEtiquetasGrafico.push(
            propiedadTextoDetectada
                ? registrosValidosFiltrados[posicionPunto][propiedadTextoDetectada]
                : 'Dato ' + (posicionPunto + 1)
        );

        arregloValoresGrafico.push(valorPuntoActual);

        let esPuntoDelCentro = false;

        if (!resultadoMedianaGrafico.cantidadEsPar &&
            posicionPunto === resultadoMedianaGrafico.posicionCentro) {
            esPuntoDelCentro = true;
        }
        if (resultadoMedianaGrafico.cantidadEsPar &&
            (posicionPunto === resultadoMedianaGrafico.posicionCentro - 1 ||
            posicionPunto === resultadoMedianaGrafico.posicionCentro)) {
            esPuntoDelCentro = true;
        }

        arregloColoresGrafico.push(
            esPuntoDelCentro
                ? 'rgba(239, 68, 68, 0.85)'   // rojo = valor central
                : 'rgba(34, 197, 94, 0.65)'   // verde = resto
        );

        arregloLineaMedianaGrafico.push(resultadoMedianaGrafico.mediana);
    }

    return {
        arregloEtiquetas:      arregloEtiquetasGrafico,
        arregloValoresGrafico: arregloValoresGrafico,
        arregloColoresGrafico: arregloColoresGrafico,
        arregloLineaMediana:   arregloLineaMedianaGrafico,
        valorMedianaFinal:     resultadoMedianaGrafico.mediana
    };
}


// ============================================================
// FUNCIÓN: crearPluginMarcadorMediana
// ============================================================
// Crea un plugin personalizado de Chart.js que dibuja el valor
// de la mediana en el centro del canvas.
//
// Solo tiene efecto visual en gráficos de tipo 'doughnut' y 'pie'.
// ============================================================
function crearPluginMarcadorMediana(valorMedianaPlugin, idUnicoPlugin, tipoGrafico) {

    let tipoActivo = tipoGrafico || TIPO_GRAFICO_MEDIANA;

    return {
        id: idUnicoPlugin || 'pluginMarcadorMediana',

        afterDraw: function(instanciaGrafico) {

            if (tipoActivo !== 'doughnut' && tipoActivo !== 'pie') { return; }

            let centroX = instanciaGrafico.width  / 2;
            let centroY = instanciaGrafico.height / 2;
            let contexto = instanciaGrafico.ctx;

            contexto.save();

            contexto.font         = 'bold 28px Arial';
            contexto.textAlign    = 'center';
            contexto.textBaseline = 'middle';
            contexto.fillStyle    = '#2c3e50';
            contexto.fillText(valorMedianaPlugin.toFixed(2), centroX, centroY - 14);

            contexto.strokeStyle = '#DC2626';
            contexto.lineWidth   = 3;
            contexto.beginPath();
            contexto.moveTo(centroX - 28, centroY + 8);
            contexto.lineTo(centroX + 28, centroY + 8);
            contexto.stroke();

            contexto.font      = 'bold 11px Arial';
            contexto.fillStyle = '#DC2626';
            contexto.fillText('MEDIANA', centroX, centroY + 26);

            contexto.restore();
        }
    };
}


// ============================================================
// FUNCIÓN: obtenerConfiguracionGraficoMediana
// ============================================================
// Construye y devuelve el objeto 'options' que Chart.js usa
// para configurar el comportamiento y apariencia del gráfico.
// ============================================================
function obtenerConfiguracionGraficoMediana(textoTituloGrafico, tipoGrafico) {

    let tipoActivo = tipoGrafico || TIPO_GRAFICO_MEDIANA;
    let esBarraHorizontal = (tipoActivo === 'barHorizontal');
    let requiereEjes = (tipoActivo === 'bar' || esBarraHorizontal);

    return {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: esBarraHorizontal ? 'y' : 'x',

        animations: (tipoActivo === 'bar' || esBarraHorizontal)
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
            ? {
                [esBarraHorizontal ? 'x' : 'y']: { beginAtZero: true }
              }
            : {}
    };
}


// ============================================================
// FUNCIÓN PÚBLICA: dibujarGraficoMediana
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
function dibujarGraficoMediana(listaDeDatos, propiedadNumerica, idCanvasDestino, textoTitulo, tipoGraficoOpcional) {

    let tipoActivo = tipoGraficoOpcional || TIPO_GRAFICO_MEDIANA;

    let elementoCanvasMediana = document.getElementById(idCanvasDestino);
    if (!elementoCanvasMediana) { return null; }

    elementoCanvasMediana.style.height    = '350px';
    elementoCanvasMediana.style.maxHeight = '350px';

    // PASO 1 y 2: Destruir gráfico anterior si existe
    if (instanciaGraficoMediana !== null) {
        try {
            instanciaGraficoMediana.destroy();
        } catch(errorDestruccion) {}
        instanciaGraficoMediana = null;
    }

    // PASO 3: Preparar los datos
    let datosPreparados = prepararDatosParaGraficoMediana(listaDeDatos, propiedadNumerica, tipoActivo);

    // PASO 4: Construir datasets
    let textoTituloDefinitivo = textoTitulo || ('Mediana: ' + datosPreparados.valorMedianaFinal.toFixed(2));

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

    let esGraficoTipoBarra = (tipoActivo === 'bar' || tipoActivo === 'barHorizontal');

    if (esGraficoTipoBarra && datosPreparados.arregloLineaMediana.length > 0) {
        arregloDatasetsGrafico.push({
            label:       'Mediana (' + datosPreparados.valorMedianaFinal.toFixed(2) + ')',
            data:        datosPreparados.arregloLineaMediana,
            type:        'line',
            borderColor: 'rgba(239, 68, 68, 1)',
            borderWidth: 2,
            pointRadius: 0,
            fill:        false
        });
    }

    // PASO 5: Crear el gráfico
    instanciaGraficoMediana = new Chart(elementoCanvasMediana.getContext('2d'), {

        type: tipoActivo === 'barHorizontal' ? 'bar' : tipoActivo,

        data: {
            labels:   datosPreparados.arregloEtiquetas,
            datasets: arregloDatasetsGrafico
        },

        options: obtenerConfiguracionGraficoMediana(textoTituloDefinitivo, tipoActivo),

        plugins: [ crearPluginMarcadorMediana(datosPreparados.valorMedianaFinal, 'pluginMed_' + idCanvasDestino, tipoActivo) ]
    });

    // PASO 6: Devolver la instancia creada
    return instanciaGraficoMediana;
}