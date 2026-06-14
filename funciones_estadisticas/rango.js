// ============================================================
// rango.js — Cálculo y visualización del Rango
// ============================================================
// Este archivo contiene TODAS las funciones relacionadas con
// el rango: cálculo, tabla HTML y gráfico Chart.js.
//
// Funciones públicas (se llaman desde estadistica.js):
//   - calcularRango(...)         → calcula y muestra la tabla
//   - dibujarGraficoRango(...)   → dibuja el gráfico Chart.js
//
// Funciones internas (solo se usan dentro de este archivo):
//   - _calcularRangoDesdeNumeros(...) → núcleo matemático
//   - _prepararDatosGraficoRango(...) → prepara etiquetas y datasets
//   - _opcionesGraficoRango(...)      → devuelve la configuración
// ============================================================


// ------------------------------------------------------------
// VARIABLE GLOBAL: instanciaGraficoRango
// ------------------------------------------------------------
// Guarda la referencia al gráfico Chart.js que está activo.
// Se necesita para poder DESTRUIRLO antes de crear uno nuevo,
// porque Chart.js no permite reutilizar un <canvas> sin antes
// destruir el gráfico anterior.
//
// IMPORTANTE: esta es la ÚNICA declaración de esta variable
// en todo el proyecto. NO repetirla en estadistica.js.
// ------------------------------------------------------------
let instanciaGraficoRango = null;


// ------------------------------------------------------------
// CONSTANTE: TIPO_GRAFICO_RANGO
// ------------------------------------------------------------
// Define qué tipo de gráfico se dibuja en TODA la sección Rango.
// Cambiar este valor afecta tanto el gráfico del ejemplo
// interactivo como el del ejercicio práctico.
// ------------------------------------------------------------
let TIPO_GRAFICO_RANGO = 'bar';


// ============================================================
// FUNCIÓN INTERNA: _calcularRangoDesdeNumeros
// ============================================================
// Núcleo matemático puro. Recibe un arreglo de números ya
// validados, encuentra el valor más pequeño (mínimo) y el más
// grande (máximo), y devuelve la diferencia entre ambos (rango).
//
// Parámetros:
//   arregloNumeros → arreglo de números ya validados (sin NaN)
//                   Ejemplo: [ 15, 22, 18, 30, 25 ]
//
// Devuelve un objeto: {
//   valorMinimo → número más pequeño
//   valorMaximo → número más grande
//   valorRango  → diferencia entre ambos
// }
// ============================================================
function _calcularRangoDesdeNumeros(arregloNumeros) {

    // Si no hay números, devolvemos estructura vacía para evitar errores
    if (arregloNumeros.length === 0) {
        return {
            valorMinimo: null,
            valorMaximo: null,
            valorRango:  null
        };
    }

    // Inicializamos min y max con el primer elemento del arreglo
    let valorMinimo = arregloNumeros[0];
    let valorMaximo = arregloNumeros[0];

    // ── PASO 1: Recorrer el arreglo comparando cada número ────────────────
    // Empezamos desde el índice 1 porque el índice 0 ya está en min y max.
    for (let indiceComparacion = 1; indiceComparacion < arregloNumeros.length; indiceComparacion++) {

        let numeroActual = arregloNumeros[indiceComparacion];

        // IF: si el número actual es menor que el mínimo guardado, lo reemplazamos
        if (numeroActual < valorMinimo) {
            valorMinimo = numeroActual;
        }

        // IF: si el número actual es mayor que el máximo guardado, lo reemplazamos
        if (numeroActual > valorMaximo) {
            valorMaximo = numeroActual;
        }
    }

    // ── PASO 2: Calcular el rango ─────────────────────────────────────────
    // El rango es la distancia entre el extremo superior y el inferior.
    let valorRango = valorMaximo - valorMinimo;

    return {
        valorMinimo: valorMinimo,
        valorMaximo: valorMaximo,
        valorRango:  valorRango
    };
}


// ============================================================
// FUNCIÓN PÚBLICA: calcularRango
// ============================================================
// Recorre un arreglo de objetos, extrae los valores numéricos
// de una propiedad específica, calcula el rango y genera una
// tabla HTML con todos los registros y el resumen del cálculo.
//
// Parámetros:
//   arregloObjetos     → arreglo de objetos con los datos
//   nombreColumnaNum   → nombre de la propiedad numérica a analizar
//   idContenedorTabla  → id del elemento HTML donde mostrar la tabla
//   nombreColumnaLabel → nombre de la propiedad para etiquetar filas
//
// Devuelve: { valorMinimo, valorMaximo, valorRango }
// ============================================================
function calcularRango(arregloObjetos, nombreColumnaNum, idContenedorTabla, nombreColumnaLabel) {

    // --- PASO 1: Extraer objetos válidos y sus números en un solo recorrido ---
    // Recorremos todos los objetos, convertimos la propiedad a número y
    // descartamos los que no sean numéricos (NaN).
    let arregloObjetosValidos = [];
    let arregloNumerosExtraidos = [];

    for (let indiceExtraccion = 0; indiceExtraccion < arregloObjetos.length; indiceExtraccion++) {

        let valorNumerico = Number(arregloObjetos[indiceExtraccion][nombreColumnaNum]);

        // IF: isNaN() devuelve true si NO es número. Con ! (negación) preguntamos
        // "si SÍ es un número válido", entonces lo guardamos.
        if (!isNaN(valorNumerico)) {
            arregloObjetosValidos.push(arregloObjetos[indiceExtraccion]);
            arregloNumerosExtraidos.push(valorNumerico);
        }
    }

    // --- PASO 2: Calcular el rango con el núcleo matemático ---
    let resultadoRango = _calcularRangoDesdeNumeros(arregloNumerosExtraidos);

    // --- PASO 3: Generar tabla HTML (solo si se recibió un id de contenedor) ---
    if (typeof idContenedorTabla === 'string' && idContenedorTabla.length > 0) {

        let elementoContenedor = document.getElementById(idContenedorTabla);

        if (elementoContenedor) {

            // ── Construimos el HTML de la tabla fila por fila ──
            let codigoHTML = '';

            // Título de la tabla
            codigoHTML += '<p><strong>Cálculo del Rango (campo analizado: ' + nombreColumnaNum + ')</strong></p>';

            // Encabezado de la tabla
            codigoHTML += '<table class="tabla-interactiva">';
            codigoHTML += '<tr>';
            codigoHTML += '<th>#</th>';

            // IF: si se recibió una columna para etiquetar, agregamos su encabezado
            if (nombreColumnaLabel) {
                codigoHTML += '<th>' + nombreColumnaLabel + '</th>';
            }

            codigoHTML += '<th>' + nombreColumnaNum + '</th>';
            codigoHTML += '</tr>';

            // FOR: una fila por cada objeto válido encontrado
            for (let indiceFila = 0; indiceFila < arregloObjetosValidos.length; indiceFila++) {

                let objetoActual = arregloObjetosValidos[indiceFila];
                let numeroActual = arregloNumerosExtraidos[indiceFila];

                codigoHTML += '<tr>';
                codigoHTML += '<td>' + (indiceFila + 1) + '</td>';

                // IF: si existe columna de etiqueta, mostramos su valor
                if (nombreColumnaLabel) {
                    codigoHTML += '<td>' + objetoActual[nombreColumnaLabel] + '</td>';
                }

                codigoHTML += '<td>' + numeroActual + '</td>';
                codigoHTML += '</tr>';
            }

            codigoHTML += '</table>';

            // ── Resumen del cálculo debajo de la tabla ──
            codigoHTML += '<div class="detalle-calculo">';
            codigoHTML += 'Total de datos analizados: <strong>' + arregloNumerosExtraidos.length + '</strong><br>';
            codigoHTML += 'Valor mínimo: <strong>' + resultadoRango.valorMinimo + '</strong><br>';
            codigoHTML += 'Valor máximo: <strong>' + resultadoRango.valorMaximo + '</strong><br>';
            codigoHTML += 'Rango = Máximo − Mínimo = ';
            codigoHTML += resultadoRango.valorMaximo + ' − ' + resultadoRango.valorMinimo;
            codigoHTML += ' = <strong>' + resultadoRango.valorRango + '</strong>';
            codigoHTML += '</div>';

            // ── Caja de resultado final ──
            codigoHTML += '<div class="caja-resultado">';
            codigoHTML += '📏 Rango: <strong>' + resultadoRango.valorRango + '</strong>';
            codigoHTML += '</div>';

            // Insertamos todo el HTML construido dentro del contenedor en la página
            elementoContenedor.innerHTML = codigoHTML;
        }
    }

    return resultadoRango;
}


// ============================================================
// FUNCIÓN INTERNA: _prepararDatosGraficoRango
// ============================================================
// Transforma el arreglo de registros en los arreglos que
// Chart.js necesita para dibujar el gráfico del rango:
//   - arregloEtiquetasGrafico[] → textos del eje X
//   - arregloValoresBarras[]    → alturas de las barras azules
//   - arregloLineaMinimo[]      → línea roja punteada en el mínimo
//   - arregloLineaMaximo[]      → línea verde punteada en el máximo
//
// Parámetros:
//   arregloRegistros    → arreglo de objetos con los datos
//   nombreColumnaNum    → nombre de la propiedad numérica
//   nombreColumnaLabel  → nombre de la propiedad para etiquetar
// ============================================================
function _prepararDatosGraficoRango(arregloRegistros, nombreColumnaNum, nombreColumnaLabel) {

    // Extraemos objetos válidos y sus números (igual que en calcularRango)
    let arregloObjetosValidos = [];
    let arregloNumerosExtraidos = [];

    for (let indiceExtraccion = 0; indiceExtraccion < arregloRegistros.length; indiceExtraccion++) {
        let valorNumerico = Number(arregloRegistros[indiceExtraccion][nombreColumnaNum]);
        if (!isNaN(valorNumerico)) {
            arregloObjetosValidos.push(arregloRegistros[indiceExtraccion]);
            arregloNumerosExtraidos.push(valorNumerico);
        }
    }

    let resultadoRango = _calcularRangoDesdeNumeros(arregloNumerosExtraidos);

    // Arreglos que se irán llenando en el bucle siguiente
    let arregloEtiquetasGrafico = [];
    let arregloValoresBarras    = [];
    let arregloLineaMinimo      = [];
    let arregloLineaMaximo      = [];

    // FOR: recorre cada objeto válido para construir los 4 arreglos paralelos
    for (let indiceDato = 0; indiceDato < arregloObjetosValidos.length; indiceDato++) {

        let objetoActual = arregloObjetosValidos[indiceDato];

        // IF: si existe columna de etiqueta, la usamos; si no, usamos "Dato N"
        let etiquetaActual = nombreColumnaLabel
            ? objetoActual[nombreColumnaLabel]
            : 'Dato ' + (indiceDato + 1);

        arregloEtiquetasGrafico.push(etiquetaActual);
        arregloValoresBarras.push(arregloNumerosExtraidos[indiceDato]);

        // Las líneas de referencia repiten el mismo valor en todas las posiciones
        arregloLineaMinimo.push(resultadoRango.valorMinimo);
        arregloLineaMaximo.push(resultadoRango.valorMaximo);
    }

    return {
        arregloEtiquetasGrafico: arregloEtiquetasGrafico,
        arregloValoresBarras:    arregloValoresBarras,
        arregloLineaMinimo:      arregloLineaMinimo,
        arregloLineaMaximo:      arregloLineaMaximo,
        valorMinimo:             resultadoRango.valorMinimo,
        valorMaximo:             resultadoRango.valorMaximo,
        valorRango:              resultadoRango.valorRango
    };
}


// ============================================================
// FUNCIÓN INTERNA: _opcionesGraficoRango
// ============================================================
// Construye y devuelve el objeto 'options' que Chart.js usa
// para configurar el comportamiento y apariencia del gráfico.
//
// Parámetros:
//   textTituloGrafico    → texto del título del gráfico
//   datosPreparados      → objeto devuelto por _prepararDatosGraficoRango
// ============================================================
function _opcionesGraficoRango(textTituloGrafico, datosPreparados) {

    return {

        // responsive: true → el gráfico se redimensiona automáticamente
        responsive: true,

        // maintainAspectRatio: false → permite controlar la altura con CSS
        maintainAspectRatio: false,

        // Animación de cascada: solo las barras (dataset 0) se retrasan.
        // Las líneas de mínimo y máximo (datasets 1 y 2) aparecen de inmediato.
        animations: {
            y: {
                duration: 10,
                easing:   'easeInOutQuart',
                delay: function(contextoAnimacion) {
                    if (contextoAnimacion.datasetIndex === 0) {
                        return contextoAnimacion.dataIndex * 50;
                    }
                    return 0;
                }
            }
        },

        plugins: {
            legend: { position: 'top' },

            title: {
                display: true,
                text:    textTituloGrafico
            },

            // Tooltip personalizado: identifica si el cursor está sobre
            // una barra, la línea del mínimo o la línea del máximo.
            tooltip: {
                enabled:       true,
                displayColors: false,

                callbacks: {

                    // Sin encabezado en el tooltip
                    title: function() { return ''; },

                    // Texto principal: cambia según el dataset
                    label: function(contextoTooltip) {
                        let textoEtiqueta = contextoTooltip.label || '';
                        let valorEjeY     = contextoTooltip.parsed.y;

                        // IF: dataset 0 = barras de datos
                        if (contextoTooltip.datasetIndex === 0) {
                            return textoEtiqueta + ': ' + valorEjeY;
                        }

                        // IF: dataset 1 = línea del mínimo
                        if (contextoTooltip.datasetIndex === 1) {
                            return 'Límite inferior (mínimo): ' + valorEjeY;
                        }

                        // IF: dataset 2 = línea del máximo
                        if (contextoTooltip.datasetIndex === 2) {
                            return 'Límite superior (máximo): ' + valorEjeY;
                        }

                        return textoEtiqueta + ': ' + valorEjeY;
                    }
                }
            }
        },

        scales: {
            // y: eje de los valores numéricos (barras y líneas)
            y: {
                beginAtZero: true
            }
        }
    };
}


// ============================================================
// FUNCIÓN PÚBLICA: dibujarGraficoRango
// ============================================================
// Función principal de visualización. Orquesta todo el proceso
// de creación del gráfico Chart.js en el canvas indicado.
// Dibuja barras azules con los datos y dos líneas punteadas:
// una roja en el mínimo y una verde en el máximo.
//
// Flujo interno:
//   1. Busca el canvas en el DOM
//   2. Destruye el gráfico anterior si existe
//   3. Llama a _prepararDatosGraficoRango() para obtener datos
//   4. Construye los 3 datasets (barras, línea min, línea max)
//   5. Crea la instancia de Chart.js con todas las opciones
//   6. Guarda la instancia en instanciaGraficoRango y la devuelve
//
// Parámetros:
//   arregloRegistros    → arreglo de objetos con los datos
//   nombreColumnaNum    → nombre de la propiedad numérica a graficar
//   nombreColumnaLabel  → nombre de la propiedad para etiquetar el eje X
//   idCanvas            → id del elemento <canvas> en el HTML
//   textTitulo          → texto que aparece como título del gráfico
//
// Devuelve: la instancia del gráfico Chart.js creado
// ============================================================
function dibujarGraficoRango(arregloRegistros, nombreColumnaNum, nombreColumnaLabel, idCanvas, textTitulo) {

    // Busca el elemento <canvas> en el HTML usando su id
    let elementoCanvasRango = document.getElementById(idCanvas);

    // Si no existe el canvas, no puede dibujar nada → sale con null
    if (!elementoCanvasRango) { return null; }

    // Fija la altura del canvas con CSS para que el gráfico no quede aplastado
    elementoCanvasRango.style.height    = '350px';
    elementoCanvasRango.style.maxHeight = '350px';

    // --- Destruye el gráfico anterior si existe ---
    if (instanciaGraficoRango !== null) {
        try {
            instanciaGraficoRango.destroy();
        } catch (errorAlDestruir) {
            // Si destroy() falla, el try/catch evita que el error
            // detenga la ejecución del resto del código
        }
        instanciaGraficoRango = null;
    }

    // Obtiene el contexto 2D del canvas (el "pincel" que usa Chart.js)
    let contextoCanvas = elementoCanvasRango.getContext('2d');

    // Llama a la función interna que prepara etiquetas, barras y líneas
    let datosPreparadosGrafico = _prepararDatosGraficoRango(
        arregloRegistros,
        nombreColumnaNum,
        nombreColumnaLabel
    );

    // Si no se recibió título, genera uno automático con los valores calculados
    let textoTituloDefinitivo = textTitulo || (
        'Rango: ' + datosPreparadosGrafico.valorRango +
        ' (min ' + datosPreparadosGrafico.valorMinimo +
        ' — max ' + datosPreparadosGrafico.valorMaximo + ')'
    );

    // ── Construye los 3 datasets ──────────────────────────────────

    // Dataset 0: barras azules con los valores originales
    let datasetBarras = {
        label:           nombreColumnaNum,
        data:            datosPreparadosGrafico.arregloValoresBarras,
        backgroundColor: 'rgba(22, 151, 249, 0.6)',
        borderColor:     'rgba(22, 151, 249, 1)',
        borderWidth:     1,
        order:           2   // z-index: las barras quedan detrás de las líneas
    };

    // Dataset 1: línea roja punteada en el valor mínimo
    let datasetLineaMinimo = {
        label:      'Mínimo (' + datosPreparadosGrafico.valorMinimo + ')',
        data:       datosPreparadosGrafico.arregloLineaMinimo,
        type:       'line',
        borderColor: 'rgba(247, 85, 85, 0.9)',
        borderWidth: 2,
        borderDash: [6, 4],   // punteado: 6px pintado, 4px vacío
        pointRadius: 0,       // sin puntos, solo la línea
        fill:        false,
        order:       1       // z-index: las líneas quedan encima de las barras
    };

    // Dataset 2: línea verde punteada en el valor máximo
    let datasetLineaMaximo = {
        label:       'Máximo (' + datosPreparadosGrafico.valorMaximo + ')',
        data:        datosPreparadosGrafico.arregloLineaMaximo,
        type:        'line',
        borderColor: 'rgba(50, 200, 100, 0.9)',
        borderWidth: 2,
        borderDash: [6, 4],
        pointRadius: 0,
        fill:        false,
        order:       1
    };

    // ============================================================
    // CREACIÓN DEL GRÁFICO CON CHART.JS
    // ============================================================
    instanciaGraficoRango = new Chart(contextoCanvas, {

        type: TIPO_GRAFICO_RANGO,

        data: {
            labels:   datosPreparadosGrafico.arregloEtiquetasGrafico,
            datasets: [datasetBarras, datasetLineaMinimo, datasetLineaMaximo]
        },

        options: _opcionesGraficoRango(textoTituloDefinitivo, datosPreparadosGrafico)
    });

    return instanciaGraficoRango;
}