// ============================================================
// minMax.js — Cálculo y visualización del Mínimo y Máximo
// ============================================================
// Este archivo contiene TODAS las funciones relacionadas con
// el mínimo y el máximo: cálculo, tabla HTML y gráfico Chart.js.
//
// Funciones públicas (se llaman desde estadistica.js):
//   - calcularMinMax(...)       → calcula y muestra la tabla
//   - dibujarGraficoMinMax(...) → dibuja el gráfico Chart.js
//
// Funciones internas (solo se usan dentro de este archivo):
//   - _calcularMinMaxDesdeNumeros(...)  → núcleo matemático
//   - _prepararDatosGraficoMinMax(...) → prepara etiquetas y colores
//   - _opcionesGraficoMinMax(...)      → devuelve la configuración
// ============================================================


// ------------------------------------------------------------
// VARIABLE GLOBAL: instanciaGraficoMinMax
// ------------------------------------------------------------
// Guarda la referencia al gráfico Chart.js que está activo.
// Se necesita para poder DESTRUIRLO antes de crear uno nuevo,
// porque Chart.js no permite reutilizar un <canvas> sin antes
// destruir el gráfico anterior.
//
// IMPORTANTE: esta es la ÚNICA declaración de esta variable
// en todo el proyecto. NO repetirla en estadistica.js.
// ------------------------------------------------------------
let instanciaGraficoMinMax = null;


// ------------------------------------------------------------
// CONSTANTE: TIPO_GRAFICO_MINMAX
// ------------------------------------------------------------
// Define qué tipo de gráfico se dibuja en TODA la sección MinMax.
// Cambiar este valor afecta tanto el gráfico del ejemplo
// interactivo como el del ejercicio práctico.
//
// Opciones válidas:
//   'bar'           → Barras verticales (azul: mínimo | rojo: máximo)
//   'barHorizontal' → Barras horizontales (mismos colores)
//   'line'          → Línea continua con puntos destacados
//   'radar'         → Telaraña (compara posiciones relativas)
//   'polarArea'     → Área polar (radio = valor)
//   'doughnut'      → Dona (agrupa en 4 rangos por cuartiles)
//   'pie'           → Pastel (igual que dona, sin hueco)
// ------------------------------------------------------------
const TIPO_GRAFICO_MINMAX = 'radar';


// ============================================================
// FUNCIÓN INTERNA: _calcularMinMaxDesdeNumeros
// ============================================================
// Núcleo matemático puro. Recibe un arreglo de números ya
// validados y encuentra el más pequeño (mínimo) y el más
// grande (máximo) recorriendo el arreglo una sola vez.
//
// Idea: es como revisar una lista de notas anotando
// la nota más baja y la más alta que vas encontrando.
//
// Parámetros:
//   arregloNumeros → arreglo de números ya validados (sin NaN)
//                   Ejemplo: [ 5, 3, 8, 1, 9 ]
//
// Devuelve un objeto: {
//   valorMinimo    → el número más pequeño encontrado
//   valorMaximo    → el número más grande encontrado
//   posicionMinimo → índice donde está el mínimo en el arreglo
//   posicionMaximo → índice donde está el máximo en el arreglo
// }
// ============================================================
function _calcularMinMaxDesdeNumeros(arregloNumeros) {

    // Si no hay números, devolvemos null en todo para evitar errores
    if (arregloNumeros.length === 0) {
        return {
            valorMinimo:    null,
            valorMaximo:    null,
            posicionMinimo: null,
            posicionMaximo: null
        };
    }

    // Empezamos asumiendo que el primer número es tanto el mínimo
    // como el máximo. A medida que recorremos, iremos actualizando.
    let valorMinimo    = arregloNumeros[0];
    let valorMaximo    = arregloNumeros[0];
    let posicionMinimo = 0;  // índice 0 = primera posición
    let posicionMaximo = 0;

    // Recorremos desde el SEGUNDO elemento (índice 1)
    // porque el primero ya lo usamos como punto de partida
    for (let posicionActual = 1; posicionActual < arregloNumeros.length; posicionActual++) {

        // Guardamos el número de esta vuelta en una variable con nombre claro
        let numeroDeEstaVuelta = arregloNumeros[posicionActual];

        // ¿Este número es más pequeño que el mínimo que teníamos?
        // Si sí → actualizamos el mínimo y guardamos su posición
        if (numeroDeEstaVuelta < valorMinimo) {
            valorMinimo    = numeroDeEstaVuelta;
            posicionMinimo = posicionActual;
        }

        // ¿Este número es más grande que el máximo que teníamos?
        // Si sí → actualizamos el máximo y guardamos su posición
        if (numeroDeEstaVuelta > valorMaximo) {
            valorMaximo    = numeroDeEstaVuelta;
            posicionMaximo = posicionActual;
        }
    }

    return {
        valorMinimo:    valorMinimo,
        valorMaximo:    valorMaximo,
        posicionMinimo: posicionMinimo,
        posicionMaximo: posicionMaximo
    };
}


// ============================================================
// FUNCIÓN PÚBLICA: calcularMinMax
// ============================================================
// Recorre un arreglo de objetos, extrae los valores numéricos
// de una propiedad específica, calcula el mínimo y el máximo,
// y genera una tabla HTML con la marca de cada valor destacado.
//
// Parámetros:
//   arregloObjetos     → arreglo de objetos con los datos
//                        Ejemplo: [{nombre:'Ana', nota:15}, ...]
//   nombreColumnaNum   → nombre de la propiedad numérica a analizar
//                        Ejemplo: 'nota' o 'Daily_Minutes_Spent'
//   idContenedorTabla  → id del elemento HTML donde mostrar la tabla
//                        Pasar null si NO se quiere generar tabla
//   nombreColumnaLabel → nombre de la propiedad de texto para la tabla
//                        Ejemplo: 'nombre' o 'App'
//
// Devuelve el objeto de _calcularMinMaxDesdeNumeros más:
//   registroMinimo → objeto completo donde se encontró el mínimo
//   registroMaximo → objeto completo donde se encontró el máximo
// ============================================================
function calcularMinMax(arregloObjetos, nombreColumnaNum, idContenedorTabla, nombreColumnaLabel) {

    // --- PASO 1: Filtrar registros con valor numérico válido ---
    // No todos los objetos tienen garantizado un número en la columna
    // indicada. Este bucle descarta los que no sirven.
    let registrosConNumero = [];

    for (let indiceFiltro = 0; indiceFiltro < arregloObjetos.length; indiceFiltro++) {

        // Number() convierte el valor a número; devuelve NaN si no es válido.
        // isNaN() devuelve true si el valor NO es un número válido.
        // Con ! (negación): solo agrega si SÍ es un número válido.
        let valorNumerico = Number(arregloObjetos[indiceFiltro][nombreColumnaNum]);

        if (!isNaN(valorNumerico)) {
            registrosConNumero.push(arregloObjetos[indiceFiltro]);
        }
    }

    // --- PASO 2: Extraer solo los números para el cálculo ---
    // _calcularMinMaxDesdeNumeros necesita un arreglo de números puros,
    // no de objetos. Este bucle extrae solo los valores numéricos.
    let soloNumerosExtraidos = [];

    for (let indiceExtraccion = 0; indiceExtraccion < registrosConNumero.length; indiceExtraccion++) {
        soloNumerosExtraidos.push(Number(registrosConNumero[indiceExtraccion][nombreColumnaNum]));
    }

    // --- PASO 3: Calcular mínimo y máximo con la función interna ---
    let resultadoMinMax = _calcularMinMaxDesdeNumeros(soloNumerosExtraidos);

    // Guardamos también el objeto COMPLETO del mínimo y del máximo.
    // Esto permite mostrar el nombre u otros datos del registro destacado.
    resultadoMinMax.registroMinimo = registrosConNumero[resultadoMinMax.posicionMinimo] || null;
    resultadoMinMax.registroMaximo = registrosConNumero[resultadoMinMax.posicionMaximo] || null;

    // --- PASO 4: Generar tabla HTML (solo si se recibió un id de contenedor) ---
    // Si idContenedorTabla es null o vacío, se salta este bloque completamente.
    if (typeof idContenedorTabla === 'string' && idContenedorTabla.length > 0) {

        let elementoContenedor = document.getElementById(idContenedorTabla);

        if (elementoContenedor) {

            // Preparamos el texto entre paréntesis que acompaña al mínimo y al máximo
            // Ejemplo: " (Ana)" si el campo visible es 'nombre'
            let nombreDelMinimo = '';
            let nombreDelMaximo = '';

            if (nombreColumnaLabel && resultadoMinMax.registroMinimo) {
                nombreDelMinimo = ' (' + resultadoMinMax.registroMinimo[nombreColumnaLabel] + ')';
            }
            if (nombreColumnaLabel && resultadoMinMax.registroMaximo) {
                nombreDelMaximo = ' (' + resultadoMinMax.registroMaximo[nombreColumnaLabel] + ')';
            }

            // ── Construimos el HTML de la tabla fila por fila ──
            let codigoTablaHTML = '';

            // Título de la tabla
            codigoTablaHTML += '<p><strong>Búsqueda de mínimo y máximo';
            codigoTablaHTML += ' (campo analizado: ' + nombreColumnaNum + ')</strong></p>';

            // Encabezado de la tabla
            codigoTablaHTML += '<table class="tabla-interactiva">';
            codigoTablaHTML += '<tr>';
            codigoTablaHTML += '<th>#</th>';
            if (nombreColumnaLabel) {
                // Solo mostramos la columna de nombre si se indicó un campo visible
                codigoTablaHTML += '<th>' + nombreColumnaLabel + '</th>';
            }
            codigoTablaHTML += '<th>' + nombreColumnaNum + '</th>';
            codigoTablaHTML += '<th>¿Destacado?</th>';
            codigoTablaHTML += '</tr>';

            // Una fila por cada registro válido
            for (let numeroDeFila = 0; numeroDeFila < registrosConNumero.length; numeroDeFila++) {

                // Decidimos qué texto mostrar en la columna "¿Destacado?"
                let textoDestacado = '';  // por defecto, nada

                // Caso especial: el mismo registro es mínimo Y máximo (dataset de 1 elemento)
                if (numeroDeFila === resultadoMinMax.posicionMinimo && numeroDeFila === resultadoMinMax.posicionMaximo) {
                    textoDestacado = '⬅ mínimo y máximo';
                } else if (numeroDeFila === resultadoMinMax.posicionMinimo) {
                    textoDestacado = '⬅ mínimo';
                } else if (numeroDeFila === resultadoMinMax.posicionMaximo) {
                    textoDestacado = '⬅ máximo';
                }

                // Resaltamos en azul el mínimo y en rojo el máximo
                let estiloFilaDestacada = '';
                if (numeroDeFila === resultadoMinMax.posicionMinimo && numeroDeFila !== resultadoMinMax.posicionMaximo) {
                    estiloFilaDestacada = ' style="background:#dbeafe; font-weight:bold;"';  // azul claro = mínimo
                } else if (numeroDeFila === resultadoMinMax.posicionMaximo) {
                    estiloFilaDestacada = ' style="background:#fee2e2; font-weight:bold;"';  // rojo claro = máximo
                }

                codigoTablaHTML += '<tr' + estiloFilaDestacada + '>';
                codigoTablaHTML += '<td>' + (numeroDeFila + 1) + '</td>';

                if (nombreColumnaLabel) {
                    codigoTablaHTML += '<td>' + registrosConNumero[numeroDeFila][nombreColumnaLabel] + '</td>';
                }

                codigoTablaHTML += '<td>' + soloNumerosExtraidos[numeroDeFila] + '</td>';
                codigoTablaHTML += '<td>' + textoDestacado + '</td>';
                codigoTablaHTML += '</tr>';
            }

            codigoTablaHTML += '</table>';

            // ── Resumen del cálculo debajo de la tabla ──
            codigoTablaHTML += '<div class="detalle-calculo">';
            codigoTablaHTML += 'Total de datos analizados: <strong>' + soloNumerosExtraidos.length + '</strong><br>';
            codigoTablaHTML += 'Valor mínimo encontrado: <strong>' + resultadoMinMax.valorMinimo + '</strong>' + nombreDelMinimo + '<br>';
            codigoTablaHTML += 'Valor máximo encontrado: <strong>' + resultadoMinMax.valorMaximo + '</strong>' + nombreDelMaximo;
            codigoTablaHTML += '</div>';

            // ── Dos cajas de resultado lado a lado ──
            codigoTablaHTML += '<div style="display: flex; gap: 1rem; flex-wrap: wrap;">';

            codigoTablaHTML += '<div class="caja-resultado" style="flex: 1;">';
            codigoTablaHTML += '📉 Mínimo: <strong>' + resultadoMinMax.valorMinimo + '</strong>' + nombreDelMinimo;
            codigoTablaHTML += '</div>';

            codigoTablaHTML += '<div class="caja-resultado" style="flex: 1;">';
            codigoTablaHTML += '📈 Máximo: <strong>' + resultadoMinMax.valorMaximo + '</strong>' + nombreDelMaximo;
            codigoTablaHTML += '</div>';

            codigoTablaHTML += '</div>';

            // Insertamos todo el HTML construido dentro del contenedor en la página
            elementoContenedor.innerHTML = codigoTablaHTML;
        }
    }

    return resultadoMinMax;
}


// ============================================================
// FUNCIÓN INTERNA: _prepararDatosGraficoMinMax
// ============================================================
// Transforma el arreglo de registros en los arreglos paralelos
// que Chart.js necesita para dibujar el gráfico:
//   - arregloEtiquetas[]      → textos del eje X/Y o de la leyenda
//   - arregloValoresGrafico[] → números que determinan el tamaño de cada barra/sector
//   - arregloColoresGrafico[] → color de cada barra o sector
//   - posicionMinimo          → índice del mínimo (para el tooltip)
//   - posicionMaximo          → índice del máximo (para el tooltip)
//   - valorMinimoFinal        → valor numérico del mínimo
//   - valorMaximoFinal        → valor numérico del máximo
//
// El resultado cambia según TIPO_GRAFICO_MINMAX:
//   Dona / Pie → agrupa todos los datos en 4 rangos por cuartiles
//   Resto      → un punto por cada registro, coloreado según si es
//                mínimo (azul), máximo (rojo) o normal (gris)
//
// Parámetros:
//   arregloRegistros → arreglo de objetos con los datos
//   nombreColumnaNum → nombre de la propiedad numérica
// ============================================================
function _prepararDatosGraficoMinMax(arregloRegistros, nombreColumnaNum, tipoGrafico) {

    let tipoActivo = tipoGrafico || TIPO_GRAFICO_MINMAX;

    // ── MODO DONA / PIE: agrupar datos en 4 rangos por cuartiles ──
    // Los cuartiles dividen los datos ordenados en 4 grupos iguales:
    //   Q1 = valor en la posición 25% → separa el 25% más bajo
    //   Q2 = valor en la posición 50% → es la mediana
    //   Q3 = valor en la posición 75% → separa el 25% más alto
    if (tipoActivo === 'doughnut' || tipoActivo === 'pie') {

        // Extrae solo los valores numéricos válidos
        let soloNumerosParaCuartiles = [];
        for (let indiceNum = 0; indiceNum < arregloRegistros.length; indiceNum++) {
            let valorExtraido = Number(arregloRegistros[indiceNum][nombreColumnaNum]);
            if (!isNaN(valorExtraido)) {
                soloNumerosParaCuartiles.push(valorExtraido);
            }
        }

        // Ordena de menor a mayor para calcular cuartiles
        soloNumerosParaCuartiles.sort(function(numeroA, numeroB) { return numeroA - numeroB; });

        // Calcula los tres cuartiles usando posiciones del arreglo ordenado
        let valorCuartil1 = soloNumerosParaCuartiles[Math.floor(soloNumerosParaCuartiles.length * 0.25)] || 0;
        let valorCuartil2 = soloNumerosParaCuartiles[Math.floor(soloNumerosParaCuartiles.length * 0.50)] || 0;
        let valorCuartil3 = soloNumerosParaCuartiles[Math.floor(soloNumerosParaCuartiles.length * 0.75)] || 0;

        // Contadores para cada uno de los 4 rangos
        let contadorRangoAlto      = 0;
        let contadorRangoMedioAlto = 0;
        let contadorRangoMedioBajo = 0;
        let contadorRangoBajo      = 0;

        // Clasifica cada valor en su rango correspondiente
        for (let indiceClasif = 0; indiceClasif < arregloRegistros.length; indiceClasif++) {
            let valorClasificado = Number(arregloRegistros[indiceClasif][nombreColumnaNum]);
            if (!isNaN(valorClasificado)) {
                if      (valorClasificado > valorCuartil3) { contadorRangoAlto++;      }
                else if (valorClasificado > valorCuartil2) { contadorRangoMedioAlto++; }
                else if (valorClasificado > valorCuartil1) { contadorRangoMedioBajo++; }
                else                                       { contadorRangoBajo++;      }
            }
        }

        // El mínimo y el máximo reales del dataset (para el tooltip)
        let resultadoParaTooltip = _calcularMinMaxDesdeNumeros(soloNumerosParaCuartiles);

        return {
            arregloEtiquetas:     [
                'Alto (> '     + valorCuartil3 + ')',
                'Medio-Alto (' + valorCuartil2 + '  ' + valorCuartil3 + ')',
                'Medio-Bajo (' + valorCuartil1 + '  ' + valorCuartil2 + ')',
                'Bajo (≤ '     + valorCuartil1 + ')'
            ],
            arregloValoresGrafico: [contadorRangoAlto, contadorRangoMedioAlto, contadorRangoMedioBajo, contadorRangoBajo],
            arregloColoresGrafico: ['#e74c3c', '#3498db', '#f1c40f', '#2ecc71'],
            posicionMinimo:        null,
            posicionMaximo:        null,
            valorMinimoFinal:      resultadoParaTooltip.valorMinimo,
            valorMaximoFinal:      resultadoParaTooltip.valorMaximo
        };
    }

    // ── RESTO DE TIPOS: mostrar solo dos barras (Mínimo y Máximo) ──────────────
    // Filtramos los registros con valor numérico válido
    let registrosValidosFiltrados = [];

    for (let indiceFiltro = 0; indiceFiltro < arregloRegistros.length; indiceFiltro++) {
        let valorFiltrado = Number(arregloRegistros[indiceFiltro][nombreColumnaNum]);
        if (!isNaN(valorFiltrado)) {
            registrosValidosFiltrados.push(arregloRegistros[indiceFiltro]);
        }
    }

    // Extraemos los números y calculamos mínimo/máximo
    let soloNumerosParaGrafico = [];
    for (let indiceNum = 0; indiceNum < registrosValidosFiltrados.length; indiceNum++) {
        soloNumerosParaGrafico.push(Number(registrosValidosFiltrados[indiceNum][nombreColumnaNum]));
    }

    let resultadoCalculado = _calcularMinMaxDesdeNumeros(soloNumerosParaGrafico);

    // Solo dos barras: Mínimo (rojo) y Máximo (verde)
    let arregloEtiquetasGrafico  = ['Mínimo', 'Máximo'];
    let arregloValoresGrafico    = [resultadoCalculado.valorMinimo, resultadoCalculado.valorMaximo];
    let arregloColoresGrafico    = ['rgba(239, 68, 68, 0.8)', 'rgba(34, 197, 94, 0.8)'];

    return {
        arregloEtiquetas:     arregloEtiquetasGrafico,
        arregloValoresGrafico: arregloValoresGrafico,
        arregloColoresGrafico: arregloColoresGrafico,
        posicionMinimo:        0,
        posicionMaximo:        1,
        valorMinimoFinal:      resultadoCalculado.valorMinimo,
        valorMaximoFinal:      resultadoCalculado.valorMaximo
    };
}


// ============================================================
// FUNCIÓN INTERNA: _opcionesGraficoMinMax
// ============================================================
// Construye y devuelve el objeto 'options' que Chart.js usa
// para configurar el comportamiento y apariencia del gráfico.
//
// Parámetros:
//   textTituloGrafico  → texto que aparece como título del gráfico
//   datosPreparados    → objeto devuelto por _prepararDatosGraficoMinMax
//                        (necesario para el tooltip personalizado)
// ============================================================
function _opcionesGraficoMinMax(textTituloGrafico, datosPreparados, tipoGrafico) {

    let tipoActivo = tipoGrafico || TIPO_GRAFICO_MINMAX;

    // Detecta si el tipo es barras horizontales
    let esBarraHorizontal = (tipoActivo === 'barHorizontal');

    // Solo los gráficos de barras necesitan configurar los ejes
    let requiereConfiguracionEjes = (tipoActivo === 'bar' || esBarraHorizontal);

    return {

        // responsive: true → el gráfico se redimensiona automáticamente
        responsive: true,

        // maintainAspectRatio: false → permite controlar la altura con CSS
        maintainAspectRatio: false,

        // indexAxis: 'y' → barras horizontales; 'x' → barras verticales
        indexAxis: esBarraHorizontal ? 'y' : 'x',

        // Animación de cascada: cada barra aparece con un pequeño retraso
        animations: (tipoActivo === 'bar' || esBarraHorizontal)
            ? {
                [esBarraHorizontal ? 'x' : 'y']: {
                    duration: 600,
                    easing:   'easeInOutQuart',

                    // delay: cada barra espera 30ms más que la anterior
                    delay: function(contextoAnimacion) {
                        return contextoAnimacion.dataIndex * 30;
                    }
                }
            }
            : {
                // Para tipos circulares: animación de rotación y escala
                animateRotate: true,
                animateScale:  true,
                duration:      1000,
                easing:        'easeInOutQuart'
            },

        plugins: {

            legend: { position: 'bottom' },

            title: {
                display: true,
                text:    textTituloGrafico
            },

            // Tooltip personalizado: muestra el nombre, el valor
            // y si la barra es el mínimo o el máximo
            tooltip: {
                enabled:       true,
                displayColors: false,

                callbacks: {

                    // Sin encabezado en el tooltip
                    title: function() { return ''; },

                    // Texto principal: "Nombre: valor ← mínimo/máximo"
                    label: function(contextoTooltip) {

                        // contextoTooltip es el objeto que Chart.js nos pasa
                        // con información de la barra sobre la que está el mouse

                        let nombreItemTooltip = contextoTooltip.label || '';

                        // parsed.y = valor en barras verticales
                        // parsed.x = valor en barras horizontales
                        let ejeValorTooltip  = esBarraHorizontal ? 'x' : 'y';
                        let valorItemTooltip = Number(contextoTooltip.parsed[ejeValorTooltip]);

                        // dataIndex es la posición de la barra sobre la que está el mouse
                        let indicadorMinMax = '';
                        if (contextoTooltip.dataIndex === datosPreparados.posicionMinimo) {
                            indicadorMinMax = ' ← mínimo';
                        }
                        if (contextoTooltip.dataIndex === datosPreparados.posicionMaximo) {
                            indicadorMinMax = ' ← máximo';
                        }

                        return nombreItemTooltip + ': ' + valorItemTooltip + indicadorMinMax;
                    }
                }
            }
        },

        // Configuración de ejes (solo para tipos de barra)
        scales: requiereConfiguracionEjes
            ? {
                [esBarraHorizontal ? 'x' : 'y']: { beginAtZero: true }
              }
            : {}
    };
}


// ============================================================
// FUNCIÓN PÚBLICA: dibujarGraficoMinMax
// ============================================================
// Función principal de visualización. Orquesta todo el proceso
// de creación del gráfico Chart.js en el canvas indicado.
//
// Flujo interno:
//   1. Busca el canvas en el DOM
//   2. Destruye el gráfico anterior si existe
//   3. Llama a _prepararDatosGraficoMinMax() para obtener etiquetas/colores
//   4. Construye el objeto 'data' con el dataset de barras/sectores
//   5. Crea la instancia de Chart.js con todos los parámetros
//   6. Guarda la instancia en instanciaGraficoMinMax y la devuelve
//
// Parámetros:
//   arregloRegistros   → arreglo de objetos con los datos
//   nombreColumnaNum   → nombre de la propiedad numérica a graficar
//   idCanvas           → id del elemento <canvas> en el HTML
//   textTitulo         → texto que aparece como título del gráfico
//   nombreColumnaLabel → (opcional) nombre de la columna de etiquetas
//
// Devuelve: la instancia del gráfico Chart.js creado
// ============================================================
function dibujarGraficoMinMax(arregloRegistros, nombreColumnaNum, idCanvas, textTitulo, nombreColumnaLabel, tipoGraficoOpcional) {

    let tipoActivo = tipoGraficoOpcional || TIPO_GRAFICO_MINMAX;

    // Busca el elemento <canvas> en el HTML usando su id
    let elementoCanvasMinMax = document.getElementById(idCanvas);

    // Si no existe el canvas, no puede dibujar nada → sale con null
    if (!elementoCanvasMinMax) { return null; }

    // Fija la altura del canvas con CSS para que el gráfico no quede aplastado
    elementoCanvasMinMax.style.height    = '350px';
    elementoCanvasMinMax.style.maxHeight = '350px';

    // --- Destruye el gráfico anterior si existe ---
    // Chart.js lanza un error si se intenta crear un gráfico nuevo
    // sobre un canvas que ya tiene uno activo. Por eso se destruye primero.
    if (instanciaGraficoMinMax !== null) {
        try {
            instanciaGraficoMinMax.destroy();
        } catch (errorAlDestruir) {
            // Si destroy() falla, el try/catch evita que el error
            // detenga la ejecución del resto del código
        }
        instanciaGraficoMinMax = null;
    }

    // Llama a la función interna que prepara etiquetas, valores y colores
    let datosPreparadosGrafico = _prepararDatosGraficoMinMax(arregloRegistros, nombreColumnaNum, tipoActivo);

    // Si no se recibió título, genera uno automático con los valores
    let textoTituloDefinitivo = textTitulo || (
        'Mínimo: ' + datosPreparadosGrafico.valorMinimoFinal +
        ' | Máximo: ' + datosPreparadosGrafico.valorMaximoFinal
    );

    // ── Construye el arreglo de datasets ────────────────────────
    // Un solo dataset: barras o sectores con los valores
    // (MinMax no necesita una línea de referencia como la mediana)
    let arregloDatasetsGrafico = [
        {
            label:           nombreColumnaNum,
            data:            datosPreparadosGrafico.arregloValoresGrafico,
            backgroundColor: datosPreparadosGrafico.arregloColoresGrafico,
            borderColor:     datosPreparadosGrafico.arregloColoresGrafico,
            borderWidth:     1,
            hoverOffset:     10   // solo aplica a pie/doughnut
        }
    ];

    // ============================================================
    // CREACIÓN DEL GRÁFICO CON CHART.JS
    // ============================================================
    instanciaGraficoMinMax = new Chart(elementoCanvasMinMax.getContext('2d'), {

        // 'barHorizontal' es un valor propio de este proyecto.
        // Chart.js no lo reconoce, así que se convierte a 'bar'.
        // La orientación horizontal se controla con indexAxis:'y' en options.
        type: tipoActivo === 'barHorizontal' ? 'bar' : tipoActivo,

        data: {
            labels:   datosPreparadosGrafico.arregloEtiquetas,
            datasets: arregloDatasetsGrafico
        },

        // Pasamos datosPreparadosGrafico a las opciones para que el tooltip
        // pueda acceder a posicionMinimo y posicionMaximo
        options: _opcionesGraficoMinMax(textoTituloDefinitivo, datosPreparadosGrafico, tipoActivo)
    });

    return instanciaGraficoMinMax;
}