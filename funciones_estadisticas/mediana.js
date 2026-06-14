// ============================================================
// mediana.js — Cálculo y visualización de la Mediana
// ============================================================
// Este archivo contiene TODAS las funciones relacionadas con
// la mediana: cálculo, tabla HTML y gráfico Chart.js.
//
// Funciones públicas (se llaman desde estadistica.js):
//   - calcularMediana(...)       → calcula y muestra la tabla
//   - dibujarGraficoMediana(...) → dibuja el gráfico Chart.js
//
// Funciones internas (solo se usan dentro de este archivo):
//   - _calcularMedianaDesdeNumeros(...)  → núcleo matemático
//   - _prepararDatosGraficoMediana(...) → prepara etiquetas y colores
//   - _pluginLineaMediana(...)          → dibuja la línea central
//   - _opcionesGraficoMediana(...)      → devuelve la configuración
// ============================================================


// ------------------------------------------------------------
// VARIABLE GLOBAL: instanciaGraficoMediana
// ------------------------------------------------------------
// Guarda la referencia al gráfico Chart.js que está activo.
// Se necesita para poder DESTRUIRLO antes de crear uno nuevo,
// porque Chart.js no permite reutilizar un <canvas> sin antes
// destruir el gráfico anterior.
//
// IMPORTANTE: esta es la ÚNICA declaración de esta variable
// en todo el proyecto. NO repetirla en estadistica.js.
// ------------------------------------------------------------
let instanciaGraficoMediana = null;


// ------------------------------------------------------------
// CONSTANTE: TIPO_GRAFICO_MEDIANA
// ------------------------------------------------------------
// Define qué tipo de gráfico se dibuja en TODA la sección Mediana.
// Cambiar este valor afecta tanto el gráfico del ejemplo
// interactivo como el del ejercicio práctico.
//
// Opciones válidas:
//   'bar'           → Barras verticales (con línea de mediana)
//   'barHorizontal' → Barras horizontales (con línea de mediana)
//   'line'          → Línea continua (ideal para datos ordenados)
//   'radar'         → Telaraña (compara posiciones relativas)
//   'polarArea'     → Área polar (radio = valor)
//   'doughnut'      → Dona (agrupa en 4 rangos por cuartiles)
//   'pie'           → Pastel (igual que dona, sin hueco)
// ------------------------------------------------------------
const TIPO_GRAFICO_MEDIANA = 'barHorizontal';


// ============================================================
// FUNCIÓN INTERNA: _calcularMedianaDesdeNumeros
// ============================================================
// Núcleo matemático puro. Recibe un arreglo de números ya
// validados y devuelve todos los datos del cálculo de la mediana.
//
// Pasos del algoritmo:
//   1. Copia el arreglo para no modificar el original
//   2. Ordena la copia de menor a mayor
//   3. Calcula la posición central con Math.floor
//   4. Si la cantidad es PAR  → promedia los dos valores centrales
//   5. Si la cantidad es IMPAR → toma el valor exacto del centro
//
// Parámetros:
//   arregloNumeros → arreglo de números ya validados (sin NaN)
//
// Devuelve un objeto: {
//   listaNumerosOrdenados,  → copia ordenada del arreglo
//   posicionCentro,         → índice del centro (Math.floor)
//   cantidadEsPar,          → true si la cantidad es par
//   mediana                 → resultado final redondeado a 2 dec.
// }
// ============================================================
function _calcularMedianaDesdeNumeros(arregloNumeros) {

    // --- PASO 1: Copiar el arreglo para no alterar el original ---
    // slice() sin parámetros crea una copia superficial del arreglo.
    // Es importante porque sort() modifica el arreglo directamente,
    // y no queremos alterar los datos que llegaron como parámetro.
    let listaNumerosOrdenados = arregloNumeros.slice();

    // --- PASO 2: Ordenar de menor a mayor ---
    // sort() recorre el arreglo comparando pares de números.
    // La función (a - b) le dice cómo comparar:
    //   negativo → a va antes que b (a es menor)
    //   positivo → b va antes que a (b es menor)
    //   cero     → son iguales, no importa el orden
    listaNumerosOrdenados.sort(function(numeroA, numeroB) {
        return numeroA - numeroB;
    });

    // --- PASO 3: Calcular la posición central ---
    // Math.floor() redondea hacia abajo (elimina decimales).
    // Dividimos la longitud entre 2 para encontrar el índice del centro.
    //   5 elementos → Math.floor(5/2) = Math.floor(2.5) = 2
    //   4 elementos → Math.floor(4/2) = Math.floor(2.0) = 2
    let posicionCentro = Math.floor(listaNumerosOrdenados.length / 2);

    // --- PASO 4: Determinar si la cantidad es par o impar ---
    // El operador % (módulo) devuelve el RESTO de la división.
    //   6 % 2 = 0 → par    |    5 % 2 = 1 → impar
    let cantidadEsPar = (listaNumerosOrdenados.length % 2 === 0);

    // --- PASO 5: Calcular la mediana según paridad ---
    let valorMedianaCalculado = 0;

    if (cantidadEsPar) {
        // Cantidad PAR: promedio de los dos valores centrales.
        // Ejemplo: [2, 5, 8, 10] → posicionCentro = 2
        //   centro izquierdo: índice 1 → valor 5
        //   centro derecho:   índice 2 → valor 8
        //   mediana = (5 + 8) / 2 = 6.5
        valorMedianaCalculado = (listaNumerosOrdenados[posicionCentro - 1] + listaNumerosOrdenados[posicionCentro]) / 2;
    } else {
        // Cantidad IMPAR: el valor exacto del centro.
        // Ejemplo: [2, 5, 8] → posicionCentro = 1 → mediana = 5
        valorMedianaCalculado = listaNumerosOrdenados[posicionCentro];
    }

    // toFixed(2) redondea a 2 decimales (devuelve texto).
    // Number() convierte ese texto de vuelta a número.
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
//   arregloObjetos     → arreglo de objetos con los datos
//                        Ejemplo: [{nombre:'Ana', nota:15}, ...]
//   nombreColumnaNum   → nombre de la propiedad numérica a analizar
//                        Ejemplo: 'nota' o 'Daily_Minutes_Spent'
//   idContenedorTabla  → id del elemento HTML donde mostrar la tabla
//                        Pasar null si NO se quiere generar tabla
//   nombreColumnaLabel → nombre de la propiedad de texto para la tabla
//                        Ejemplo: 'nombre' o 'App'
//
// Devuelve el objeto de _calcularMedianaDesdeNumeros:
//   { listaNumerosOrdenados, posicionCentro, cantidadEsPar, mediana }
// ============================================================
function calcularMediana(arregloObjetos, nombreColumnaNum, idContenedorTabla, nombreColumnaLabel) {

    // --- PASO 1: Filtrar registros con valor numérico válido ---
    // No todos los objetos del arreglo tienen garantizado un número
    // en la columna indicada. Este bucle descarta los que no sirven.
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
    // _calcularMedianaDesdeNumeros necesita un arreglo de números puros,
    // no de objetos. Este bucle extrae solo los valores numéricos.
    let soloNumerosExtraidos = [];

    for (let indiceExtraccion = 0; indiceExtraccion < registrosConNumero.length; indiceExtraccion++) {
        soloNumerosExtraidos.push(Number(registrosConNumero[indiceExtraccion][nombreColumnaNum]));
    }

    // --- PASO 3: Calcular la mediana con la función interna ---
    let resultadoMediana = _calcularMedianaDesdeNumeros(soloNumerosExtraidos);

    // --- PASO 4: Ordenar los objetos de menor a mayor ---
    // Hacemos una copia para no alterar el arreglo original.
    // La tabla mostrará los datos en orden ascendente, igual que
    // el algoritmo de la mediana los procesa internamente.
    let registrosOrdenadosAscendente = registrosConNumero.slice();

    registrosOrdenadosAscendente.sort(function(objetoA, objetoB) {
        return Number(objetoA[nombreColumnaNum]) - Number(objetoB[nombreColumnaNum]);
    });

    // --- PASO 5: Generar tabla HTML (solo si se recibió un id de contenedor) ---
    // Si idContenedorTabla es null o vacío, se salta este bloque completamente.
    if (typeof idContenedorTabla === 'string' && idContenedorTabla.length > 0) {

        let elementoContenedor = document.getElementById(idContenedorTabla);

        if (elementoContenedor) {

            let codigoTablaHTML = '';
            codigoTablaHTML += '<p><strong>Datos ordenados de menor a mayor — ' + nombreColumnaNum + '</strong></p>';

            // Abre la tabla con la clase CSS que le da estilo
            codigoTablaHTML += '<table class="tabla-interactiva">';

            // Encabezados: número de fila, etiqueta, valor y marca de centro
            codigoTablaHTML += '<tr>';
            codigoTablaHTML += '<th>#</th>';
            codigoTablaHTML += '<th>' + (nombreColumnaLabel || 'Ítem') + '</th>';
            codigoTablaHTML += '<th>Valor</th>';
            codigoTablaHTML += '<th>¿Centro?</th>';
            codigoTablaHTML += '</tr>';

            // Genera una fila por cada registro ordenado
            for (let indiceFila = 0; indiceFila < registrosOrdenadosAscendente.length; indiceFila++) {

                // Determina si esta fila es el valor central (la mediana)
                let marcaCentroFila = '';

                // Cantidad IMPAR: solo hay un centro exacto
                if (!resultadoMediana.cantidadEsPar &&
                    indiceFila === resultadoMediana.posicionCentro) {
                    marcaCentroFila = '⬅ centro';
                }

                // Cantidad PAR: hay dos valores centrales
                if (resultadoMediana.cantidadEsPar &&
                    (indiceFila === resultadoMediana.posicionCentro - 1 ||
                    indiceFila === resultadoMediana.posicionCentro)) {
                    marcaCentroFila = '⬅ centro';
                }

                // Etiqueta de la fila: usa la columna de texto si existe, o "Dato N"
                let textoEtiquetaFila = nombreColumnaLabel
                    ? registrosOrdenadosAscendente[indiceFila][nombreColumnaLabel]
                    : 'Dato ' + (indiceFila + 1);

                let valorFilaNumerico = Number(registrosOrdenadosAscendente[indiceFila][nombreColumnaNum]);

                // Resalta en rojo las filas del centro para identificarlas visualmente
                let estiloFilaCentro = marcaCentroFila ? ' style="background:#fee2e2; font-weight:bold;"' : '';

                codigoTablaHTML += '<tr' + estiloFilaCentro + '>';
                codigoTablaHTML += '<td>' + (indiceFila + 1) + '</td>';
                codigoTablaHTML += '<td>' + textoEtiquetaFila + '</td>';
                codigoTablaHTML += '<td>' + valorFilaNumerico + '</td>';
                codigoTablaHTML += '<td>' + marcaCentroFila + '</td>';
                codigoTablaHTML += '</tr>';
            }

            codigoTablaHTML += '</table>';

            // Caja estilo consola que muestra el proceso de cálculo
            codigoTablaHTML += '<div class="detalle-calculo">';
            codigoTablaHTML += 'Total de datos: ' + resultadoMediana.listaNumerosOrdenados.length + '<br>';

            if (resultadoMediana.cantidadEsPar) {
                // Cantidad PAR: muestra los dos valores centrales y la fórmula del promedio
                let valorCentroIzquierdo = resultadoMediana.listaNumerosOrdenados[resultadoMediana.posicionCentro - 1];
                let valorCentroDerecho   = resultadoMediana.listaNumerosOrdenados[resultadoMediana.posicionCentro];
                codigoTablaHTML += 'Cantidad de datos: par<br>';
                codigoTablaHTML += 'Valores centrales: <strong>' + valorCentroIzquierdo + '</strong> y <strong>' + valorCentroDerecho + '</strong><br>';
                codigoTablaHTML += 'Mediana = (' + valorCentroIzquierdo + ' + ' + valorCentroDerecho + ') / 2';
            } else {
                // Cantidad IMPAR: muestra la posición y el valor exacto del centro
                codigoTablaHTML += 'Cantidad de datos: impar<br>';
                codigoTablaHTML += 'Posición central: ' + (resultadoMediana.posicionCentro + 1) + '<br>';
                codigoTablaHTML += 'Valor en esa posición: <strong>' + resultadoMediana.mediana + '</strong>';
            }

            codigoTablaHTML += '</div>';

            // Caja destacada con el resultado final
            codigoTablaHTML += '<div class="caja-resultado">';
            codigoTablaHTML += '📗 Mediana: <strong>' + resultadoMediana.mediana.toFixed(2) + '</strong>';
            codigoTablaHTML += '</div>';

            // Inserta todo el HTML generado dentro del contenedor en la página
            elementoContenedor.innerHTML = codigoTablaHTML;
        }
    }

    // Devuelve el objeto con todos los datos del cálculo
    return resultadoMediana;
}


// ============================================================
// FUNCIÓN INTERNA: _prepararDatosGraficoMediana
// ============================================================
// Transforma el arreglo de registros en los arreglos paralelos
// que Chart.js necesita para dibujar el gráfico:
//   - arregloEtiquetas[]     → textos del eje X/Y o de la leyenda
//   - arregloValoresGrafico[]→ números que determinan el tamaño de cada barra/sector
//   - arregloColoresGrafico[]→ color de cada barra o sector
//   - arregloLineaMediana[]  → arreglo con el valor de la mediana repetido (para la línea)
//   - valorMedianaFinal      → valor numérico de la mediana ya calculada
//
// El resultado cambia según TIPO_GRAFICO_MEDIANA:
//   Dona / Pie  → agrupa todos los datos en 4 rangos por cuartiles
//   Resto       → un punto por cada registro, coloreado vs la mediana
//                 (rojo = valor central, verde = resto)
//
// Parámetros:
//   arregloRegistros → arreglo de objetos con los datos
//   nombreColumnaNum → nombre de la propiedad numérica
// ============================================================
function _prepararDatosGraficoMediana(arregloRegistros, nombreColumnaNum) {

    // ── MODO DONA / PIE: agrupar datos en 4 rangos por cuartiles ──
    // Los cuartiles dividen los datos ordenados en 4 grupos iguales:
    //   Q1 = valor en la posición 25% → separa el 25% más bajo
    //   Q2 = valor en la posición 50% → es la mediana
    //   Q3 = valor en la posición 75% → separa el 25% más alto
    if (TIPO_GRAFICO_MEDIANA === 'doughnut' || TIPO_GRAFICO_MEDIANA === 'pie') {

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

        return {
            arregloEtiquetas: [
                'Alto (> '     + valorCuartil3 + ')',
                'Medio-Alto (' + valorCuartil2 + '  ' + valorCuartil3 + ')',
                'Medio-Bajo (' + valorCuartil1 + '  ' + valorCuartil2 + ')',
                'Bajo (≤ '     + valorCuartil1 + ')'
            ],
            arregloValoresGrafico: [contadorRangoAlto, contadorRangoMedioAlto, contadorRangoMedioBajo, contadorRangoBajo],
            arregloColoresGrafico: ['#2ecc71', '#3498db', '#f1c40f', '#e74c3c'],
            arregloLineaMediana:   [],
            valorMedianaFinal:     valorCuartil2   // Q2 = mediana
        };
    }

    // ── RESTO DE TIPOS: un punto por cada registro ──────────────
    // Filtra y ordena los registros de menor a mayor para que
    // las barras aparezcan en orden ascendente en el gráfico.
    let registrosValidosFiltrados = [];

    for (let indiceFiltro = 0; indiceFiltro < arregloRegistros.length; indiceFiltro++) {
        let valorFiltrado = Number(arregloRegistros[indiceFiltro][nombreColumnaNum]);
        if (!isNaN(valorFiltrado)) {
            registrosValidosFiltrados.push(arregloRegistros[indiceFiltro]);
        }
    }

    // Ordena los registros válidos de menor a mayor
    registrosValidosFiltrados.sort(function(objetoA, objetoB) {
        return Number(objetoA[nombreColumnaNum]) - Number(objetoB[nombreColumnaNum]);
    });

    // Calcula la mediana sobre los registros ya ordenados
    let soloNumerosOrdenadosGrafico = [];
    for (let indiceOrden = 0; indiceOrden < registrosValidosFiltrados.length; indiceOrden++) {
        soloNumerosOrdenadosGrafico.push(Number(registrosValidosFiltrados[indiceOrden][nombreColumnaNum]));
    }
    let resultadoMedianaGrafico = _calcularMedianaDesdeNumeros(soloNumerosOrdenadosGrafico);

    // Busca la primera propiedad de texto del objeto para usarla como etiqueta
    let nombreColumnaTextoDetectada = null;

    if (registrosValidosFiltrados.length > 0) {
        let propiedadesDelObjeto = Object.keys(registrosValidosFiltrados[0]);

        for (let indiceProp = 0; indiceProp < propiedadesDelObjeto.length; indiceProp++) {
            let nombrePropActual = propiedadesDelObjeto[indiceProp];

            if (nombrePropActual !== nombreColumnaNum &&
                typeof registrosValidosFiltrados[0][nombrePropActual] === 'string') {
                nombreColumnaTextoDetectada = nombrePropActual;
                break;
            }
        }
    }

    // Arreglos que se irán llenando en el bucle siguiente
    let arregloEtiquetasGrafico  = [];
    let arregloValoresGrafico    = [];
    let arregloColoresGrafico    = [];
    let arregloLineaMedianaGrafico = [];

    for (let indicePunto = 0; indicePunto < registrosValidosFiltrados.length; indicePunto++) {
        let valorPuntoActual = Number(registrosValidosFiltrados[indicePunto][nombreColumnaNum]);

        // Etiqueta: usa la columna de texto si existe, o "Dato N"
        arregloEtiquetasGrafico.push(
            nombreColumnaTextoDetectada
                ? registrosValidosFiltrados[indicePunto][nombreColumnaTextoDetectada]
                : 'Dato ' + (indicePunto + 1)
        );

        arregloValoresGrafico.push(valorPuntoActual);

        // Determina si este punto es el valor central (la mediana)
        let esPuntoDelCentro = false;

        if (!resultadoMedianaGrafico.cantidadEsPar &&
            indicePunto === resultadoMedianaGrafico.posicionCentro) {
            esPuntoDelCentro = true;
        }
        if (resultadoMedianaGrafico.cantidadEsPar &&
            (indicePunto === resultadoMedianaGrafico.posicionCentro - 1 ||
            indicePunto === resultadoMedianaGrafico.posicionCentro)) {
            esPuntoDelCentro = true;
        }

        // Rojo para el/los valor(es) central(es), verde para el resto
        arregloColoresGrafico.push(
            esPuntoDelCentro
                ? 'rgba(239, 68, 68, 0.85)'   // rojo = valor central
                : 'rgba(34, 197, 94, 0.65)'   // verde = resto
        );

        // La línea de referencia repite el valor de la mediana en cada posición
        // para que Chart.js la dibuje como una línea recta
        arregloLineaMedianaGrafico.push(resultadoMedianaGrafico.mediana);
    }

    return {
        arregloEtiquetas:     arregloEtiquetasGrafico,
        arregloValoresGrafico: arregloValoresGrafico,
        arregloColoresGrafico: arregloColoresGrafico,
        arregloLineaMediana:   arregloLineaMedianaGrafico,
        valorMedianaFinal:     resultadoMedianaGrafico.mediana
    };
}


// ============================================================
// FUNCIÓN INTERNA: _pluginLineaMediana
// ============================================================
// Crea y devuelve un PLUGIN personalizado de Chart.js.
//
// ¿Qué hace?
//   Para los tipos 'doughnut' y 'pie', dibuja el valor de la
//   mediana en el centro del canvas. Para los demás tipos,
//   no dibuja nada porque la línea de referencia ya se maneja
//   como un segundo dataset.
//
// Parámetros:
//   valorMedianaPlugin → número con la mediana ya calculada
//   idUnicoPlugin      → identificador único del plugin (evita conflictos
//                        si hay varios gráficos en la misma página)
// ============================================================
function _pluginLineaMediana(valorMedianaPlugin, idUnicoPlugin) {

    return {

        // 'id' identifica el plugin. Chart.js lo usa internamente.
        id: idUnicoPlugin || 'pluginLineaMediana',

        // 'afterDraw' es el HOOK: Chart.js llama a esta función
        // automáticamente cada vez que termina de renderizar el gráfico.
        afterDraw: function(chartInstancia) {

            // Solo actúa en dona y pastel (los únicos con espacio central vacío)
            if (TIPO_GRAFICO_MEDIANA !== 'doughnut' && TIPO_GRAFICO_MEDIANA !== 'pie') { return; }

            // Centro geométrico del canvas
            let coordenadaCentroX = chartInstancia.width  / 2;
            let coordenadaCentroY = chartInstancia.height / 2;

            let contextoCanvas = chartInstancia.ctx;

            // save() guarda el estado actual del contexto para restaurarlo después
            contextoCanvas.save();

            // --- Dibuja el número grande con el valor de la mediana ---
            contextoCanvas.font         = 'bold 28px Arial';
            contextoCanvas.textAlign    = 'center';
            contextoCanvas.textBaseline = 'middle';
            contextoCanvas.fillStyle    = '#2c3e50';
            contextoCanvas.fillText(valorMedianaPlugin.toFixed(2), coordenadaCentroX, coordenadaCentroY - 14);

            // --- Dibuja la línea roja decorativa debajo del número ---
            contextoCanvas.strokeStyle = '#DC2626';
            contextoCanvas.lineWidth   = 3;
            contextoCanvas.beginPath();
            contextoCanvas.moveTo(coordenadaCentroX - 28, coordenadaCentroY + 8);
            contextoCanvas.lineTo(coordenadaCentroX + 28, coordenadaCentroY + 8);
            contextoCanvas.stroke();

            // --- Dibuja la etiqueta "MEDIANA" debajo de la línea ---
            contextoCanvas.font      = 'bold 11px Arial';
            contextoCanvas.fillStyle = '#DC2626';
            contextoCanvas.fillText('MEDIANA', coordenadaCentroX, coordenadaCentroY + 26);

            // restore() recupera el estado guardado con save()
            contextoCanvas.restore();
        }
    };
}


// ============================================================
// FUNCIÓN INTERNA: _opcionesGraficoMediana
// ============================================================
// Construye y devuelve el objeto 'options' que Chart.js usa
// para configurar el comportamiento y apariencia del gráfico.
//
// Parámetros:
//   textTituloGrafico → texto que aparece como título del gráfico
// ============================================================
function _opcionesGraficoMediana(textTituloGrafico) {

    // Detecta si el tipo es barras horizontales
    let esBarraHorizontal = (TIPO_GRAFICO_MEDIANA === 'barHorizontal');

    // Solo los gráficos de barras necesitan configurar los ejes
    let requiereConfiguracionEjes = (TIPO_GRAFICO_MEDIANA === 'bar' || esBarraHorizontal);

    return {

        // responsive: true → el gráfico se redimensiona automáticamente
        responsive: true,

        // maintainAspectRatio: false → permite controlar la altura con CSS
        maintainAspectRatio: false,

        // indexAxis: 'y' → barras horizontales; 'x' → barras verticales
        indexAxis: esBarraHorizontal ? 'y' : 'x',

        // Animación de cascada: cada barra aparece con un pequeño retraso
        // respecto a la anterior, creando un efecto visual de "despliegue".
        animations: (TIPO_GRAFICO_MEDIANA === 'bar' || esBarraHorizontal)
            ? {
                [esBarraHorizontal ? 'x' : 'y']: {
                    duration: 10,
                    easing:   'easeInOutQuart',

                    // delay: función que calcula el retraso de cada barra.
                    // contextoAnimacion.dataIndex → número de la barra (0, 1, 2...)
                    // Cada barra espera 80ms más que la anterior (efecto cascada).
                    delay: function(contextoAnimacion) {
                        return contextoAnimacion.dataIndex * 10;
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

            legend: {
                position: 'bottom'
            },

            title: {
                display: true,
                text:    textTituloGrafico
            },

            // Tooltip personalizado: muestra el nombre del ítem y su valor
            tooltip: {
                enabled:       true,
                displayColors: false,

                callbacks: {

                    // Sin encabezado en el tooltip
                    title: function() { return ''; },

                    // Texto principal: "Nombre: valor"
                    label: function(contextoTooltip) {
                        let nombreItemTooltip = contextoTooltip.label || '';
                        let ejeValorTooltip   = esBarraHorizontal ? 'x' : 'y';
                        let valorItemTooltip  = Number(contextoTooltip.parsed[ejeValorTooltip]).toFixed(2);
                        return nombreItemTooltip + ': ' + valorItemTooltip;
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
// FUNCIÓN PÚBLICA: dibujarGraficoMediana
// ============================================================
// Función principal de visualización. Orquesta todo el proceso
// de creación del gráfico Chart.js en el canvas indicado.
//
// Flujo interno:
//   1. Busca el canvas en el DOM
//   2. Destruye el gráfico anterior si existe
//   3. Llama a _prepararDatosGraficoMediana() para obtener etiquetas/colores
//   4. Construye el objeto 'data' con uno o dos datasets:
//        - Dataset 1: barras/sectores con los valores
//        - Dataset 2 (solo en barras): línea recta de referencia de la mediana
//   5. Crea la instancia de Chart.js con todos los parámetros
//   6. Guarda la instancia en instanciaGraficoMediana y la devuelve
//
// Parámetros:
//   arregloRegistros   → arreglo de objetos con los datos
//   nombreColumnaNum   → nombre de la propiedad numérica a graficar
//   idCanvas           → id del elemento <canvas> en el HTML
//   textTitulo         → texto que aparece como título del gráfico
//   nombreColumnaLabel → (opcional) nombre de la columna de etiquetas;
//                        si no se pasa, se detecta automáticamente
//
// Devuelve: la instancia del gráfico Chart.js creado
// ============================================================
function dibujarGraficoMediana(arregloRegistros, nombreColumnaNum, idCanvas, textTitulo, nombreColumnaLabel) {

    // Busca el elemento <canvas> en el HTML usando su id
    let elementoCanvasMediana = document.getElementById(idCanvas);

    // Si no existe el canvas, no puede dibujar nada → sale con null
    if (!elementoCanvasMediana) { return null; }

    // Fija la altura del canvas con CSS para que el gráfico no quede aplastado.
    // Con maintainAspectRatio:false, Chart.js respeta este valor.
    elementoCanvasMediana.style.height    = '350px';
    elementoCanvasMediana.style.maxHeight = '350px';

    // --- Destruye el gráfico anterior si existe ---
    // Chart.js lanza un error si se intenta crear un gráfico nuevo
    // sobre un canvas que ya tiene uno activo. Por eso se destruye primero.
    if (instanciaGraficoMediana !== null) {
        try {
            instanciaGraficoMediana.destroy();
        } catch(errorAlDestruir) {
            // Si destroy() falla, el try/catch evita que el error
            // detenga la ejecución del resto del código
        }
        instanciaGraficoMediana = null;
    }

    // Llama a la función interna que prepara etiquetas, valores y colores
    let datosPreparadosGrafico = _prepararDatosGraficoMediana(arregloRegistros, nombreColumnaNum);

    // Si no se recibió título, genera uno automático con el valor de la mediana
    let textoTituloDefinitivo = textTitulo || ('Mediana: ' + datosPreparadosGrafico.valorMedianaFinal.toFixed(2));

    // ── Construye el arreglo de datasets ────────────────────────
    // Dataset 1: siempre presente — barras o sectores con los valores
    let arregloDatasetsGrafico = [
        {
            label:           'Valor (' + nombreColumnaNum + ')',
            data:            datosPreparadosGrafico.arregloValoresGrafico,
            backgroundColor: datosPreparadosGrafico.arregloColoresGrafico,
            borderColor:     datosPreparadosGrafico.arregloColoresGrafico,
            borderWidth:     1,
            hoverOffset:     10   // solo aplica a pie/doughnut
        }
    ];

    // Dataset 2: solo para tipos de barra — línea recta de referencia.
    // Se agrega como un segundo dataset de tipo 'line' dentro del gráfico
    // de barras, creando un gráfico MIXTO (barras + línea).
    let esGraficoTipoBarra = (TIPO_GRAFICO_MEDIANA === 'bar' || TIPO_GRAFICO_MEDIANA === 'barHorizontal');

    if (esGraficoTipoBarra && datosPreparadosGrafico.arregloLineaMediana.length > 0) {
        arregloDatasetsGrafico.push({
            label:       'Mediana (' + datosPreparadosGrafico.valorMedianaFinal.toFixed(2) + ')',
            data:        datosPreparadosGrafico.arregloLineaMediana,
            type:        'line',                      // gráfico mixto: línea sobre barras
            borderColor: 'rgba(239, 68, 68, 1)',      // rojo intenso
            borderWidth: 2,
            pointRadius: 0,                           // oculta los puntos de la línea
            fill:        false                        // no rellena el área bajo la línea
        });
    }

    // ============================================================
    // CREACIÓN DEL GRÁFICO CON CHART.JS
    // ============================================================
    instanciaGraficoMediana = new Chart(elementoCanvasMediana.getContext('2d'), {

        // 'barHorizontal' es un valor propio de este proyecto.
        // Chart.js no lo reconoce, así que se convierte a 'bar'.
        // La orientación horizontal se controla con indexAxis:'y' en options.
        type: TIPO_GRAFICO_MEDIANA === 'barHorizontal' ? 'bar' : TIPO_GRAFICO_MEDIANA,

        data: {
            labels:   datosPreparadosGrafico.arregloEtiquetas,
            datasets: arregloDatasetsGrafico
        },

        options: _opcionesGraficoMediana(textoTituloDefinitivo),

        // Plugin personalizado: dibuja el valor de la mediana en el centro
        // del canvas (solo tiene efecto visual en pie/doughnut).
        plugins: [ _pluginLineaMediana(datosPreparadosGrafico.valorMedianaFinal, 'pluginMed_' + idCanvas) ]
    });

    return instanciaGraficoMediana;
}