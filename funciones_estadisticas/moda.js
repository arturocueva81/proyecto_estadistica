// ============================================================
// moda.js — Cálculo y visualización de la Moda
// ============================================================
// Este archivo contiene TODAS las funciones relacionadas con
// la moda: cálculo, tabla HTML y gráfico Chart.js.
//
// Funciones públicas (se llaman desde estadistica.js):
//   - calcularModa(...)       → calcula y muestra la tabla
//   - dibujarGraficoModa(...) → dibuja el gráfico Chart.js
//
// Funciones internas (solo se usan dentro de este archivo):
//   - _calcularModaDesdeNumeros(...)   → núcleo matemático
//   - _prepararDatosGraficoModa(...)   → prepara etiquetas y colores
//   - _opcionesGraficoModa(...)        → devuelve la configuración
// ============================================================


// ------------------------------------------------------------
// VARIABLE GLOBAL: instanciaGraficoModa
// ------------------------------------------------------------
// Guarda la referencia al gráfico Chart.js que está activo.
// Se necesita para poder DESTRUIRLO antes de crear uno nuevo,
// porque Chart.js no permite reutilizar un <canvas> sin antes
// destruir el gráfico anterior.
//
// IMPORTANTE: esta es la ÚNICA declaración de esta variable
// en todo el proyecto. NO repetirla en estadistica.js.
// ------------------------------------------------------------
let instanciaGraficoModa = null;


// ------------------------------------------------------------
// CONSTANTE: TIPO_GRAFICO_MODA
// ------------------------------------------------------------
// Define qué tipo de gráfico se dibuja en TODA la sección Moda.
// Cambiar este valor afecta tanto el gráfico del ejemplo
// interactivo como el del ejercicio práctico.
//
// Opciones válidas:
//   'bar'           → Barras verticales (azul = moda, rojo = resto)
//   'barHorizontal' → Barras horizontales (mismos colores)
//   'line'          → Línea de frecuencias con puntos destacados
//   'radar'         → Telaraña (compara frecuencias relativas)
//   'polarArea'     → Área polar (radio = frecuencia)
//   'doughnut'      → Dona (cada sector = un valor único)
//   'pie'           → Pastel (igual que dona, sin hueco)
// ------------------------------------------------------------
const TIPO_GRAFICO_MODA = 'barHorizontal';


// ============================================================
// FUNCIÓN INTERNA: _calcularModaDesdeNumeros
// ============================================================
// Núcleo matemático puro. Recibe un arreglo de números ya
// validados, cuenta cuántas veces aparece cada uno y encuentra
// el o los valores que más se repiten (la moda).
//
// Idea: es como contar cuántos estudiantes sacaron cada nota
// y anotar cuál nota fue la más frecuente.
//
// Parámetros:
//   arregloNumeros → arreglo de números ya validados (sin NaN)
//                   Ejemplo: [ 10, 8, 10, 7, 8, 10 ]
//
// Devuelve un objeto: {
//   conteos    → arreglo de { valor, conteo } ordenado de menor a mayor
//   modas      → arreglo con el o los valores más frecuentes
//   maxConteo  → cuántas veces se repite la moda
// }
// ============================================================
function _calcularModaDesdeNumeros(arregloNumeros) {

    // Si no hay números, devolvemos estructura vacía para evitar errores
    if (arregloNumeros.length === 0) {
        return {
            conteos:   [],
            modas:     [],
            maxConteo: 0
        };
    }

    // ── PASO 1: Contar cuántas veces aparece cada número ──────────────────
    // arregloConteos: cada elemento tiene la forma { valor: 10, conteo: 3 }

    let arregloConteos = [];

    // FOR EXTERNO: recorre cada número del arreglo original
    for (let indiceNumero = 0; indiceNumero < arregloNumeros.length; indiceNumero++) {

        let numeroActual = arregloNumeros[indiceNumero];

        // yaExiste: bandera para saber si este número ya está en arregloConteos
        let yaExiste = false;

        // FOR INTERNO: busca si el número actual ya fue contado antes
        for (let indiceConteo = 0; indiceConteo < arregloConteos.length; indiceConteo++) {

            // IF: si ya existe, sumamos 1 a su conteo
            if (arregloConteos[indiceConteo].valor === numeroActual) {
                arregloConteos[indiceConteo].conteo = arregloConteos[indiceConteo].conteo + 1;
                yaExiste = true;
            }
        }

        // IF: si no existía, lo agregamos con conteo = 1 (primera aparición)
        if (yaExiste === false) {
            arregloConteos.push({ valor: numeroActual, conteo: 1 });
        }
    }

    // ── PASO 2: Ordenar de menor a mayor por valor (para el gráfico) ──────
    // sort() compara dos objetos: si el resultado es negativo, A va antes que B
    arregloConteos.sort(function(objetoA, objetoB) {
        return objetoA.valor - objetoB.valor;
    });

    // ── PASO 3: Encontrar el conteo máximo ────────────────────────────────
    let conteoMaximo = 0;

    // FOR: recorre los conteos y guarda el más alto
    for (let indiceMax = 0; indiceMax < arregloConteos.length; indiceMax++) {

        // IF: si este conteo supera al máximo actual, lo reemplazamos
        if (arregloConteos[indiceMax].conteo > conteoMaximo) {
            conteoMaximo = arregloConteos[indiceMax].conteo;
        }
    }

    // ── PASO 4: Recopilar los valores que tienen el conteo máximo ─────────
    let arregloModas = [];

    // FOR: guarda todos los valores que empatan en el conteo máximo
    for (let indiceModa = 0; indiceModa < arregloConteos.length; indiceModa++) {

        // IF: si este valor se repite tantas veces como el máximo, es moda
        if (arregloConteos[indiceModa].conteo === conteoMaximo) {
            arregloModas.push(arregloConteos[indiceModa].valor);
        }
    }

    return {
        conteos:   arregloConteos,
        modas:     arregloModas,
        maxConteo: conteoMaximo
    };
}


// ============================================================
// FUNCIÓN PÚBLICA: calcularModa
// ============================================================
// Recorre un arreglo de objetos, extrae los valores numéricos
// de una propiedad específica, calcula la moda y genera una
// tabla HTML con la frecuencia de cada valor destacando la moda.
//
// Parámetros:
//   arregloObjetos     → arreglo de objetos con los datos
//                        Ejemplo: [{nombre:'Ana', nota:10}, ...]
//   nombreColumnaNum   → nombre de la propiedad numérica a analizar
//                        Ejemplo: 'nota' o 'Daily_Minutes_Spent'
//   idContenedorTabla  → id del elemento HTML donde mostrar la tabla
//                        Pasar null si NO se quiere generar tabla
//   nombreColumnaLabel → (no se usa en moda, se mantiene por consistencia
//                        con calcularMedia, calcularMediana, calcularMinMax)
//
// Devuelve: { conteos, modas, maxConteo }
// ============================================================
function calcularModa(arregloObjetos, nombreColumnaNum, idContenedorTabla, nombreColumnaLabel) {

    // --- PASO 1: Extraer solo los valores numéricos válidos ---
    // No todos los objetos tienen garantizado un número en la columna
    // indicada. Este bucle descarta los que no sirven.
    let arregloNumerosExtraidos = [];

    for (let indiceExtraccion = 0; indiceExtraccion < arregloObjetos.length; indiceExtraccion++) {

        // Number() convierte el valor a número; devuelve NaN si no es válido.
        // isNaN() devuelve true si el valor NO es un número válido.
        // Con ! (negación): solo agrega si SÍ es un número válido.
        let valorNumerico = Number(arregloObjetos[indiceExtraccion][nombreColumnaNum]);

        if (!isNaN(valorNumerico)) {
            arregloNumerosExtraidos.push(valorNumerico);
        }
    }

    // --- PASO 2: Calcular la moda con la función interna ---
    let resultadoModa = _calcularModaDesdeNumeros(arregloNumerosExtraidos);

    // --- PASO 3: Generar tabla HTML (solo si se recibió un id de contenedor) ---
    // Si idContenedorTabla es null o vacío, se salta este bloque completamente.
    if (typeof idContenedorTabla === 'string' && idContenedorTabla.length > 0) {

        let elementoContenedor = document.getElementById(idContenedorTabla);

        if (elementoContenedor) {

            // ── Construimos el HTML de la tabla fila por fila ──
            let codigoTablaHTML = '';

            // Título de la tabla
            codigoTablaHTML += '<p><strong>Frecuencia de cada valor';
            codigoTablaHTML += ' (campo analizado: ' + nombreColumnaNum + ')</strong></p>';

            // Encabezado de la tabla
            codigoTablaHTML += '<table class="tabla-interactiva">';
            codigoTablaHTML += '<tr>';
            codigoTablaHTML += '<th>Valor</th>';
            codigoTablaHTML += '<th>Veces que aparece</th>';
            codigoTablaHTML += '<th>¿Es la moda?</th>';
            codigoTablaHTML += '</tr>';

            // Una fila por cada valor único encontrado
            for (let numeroDeFila = 0; numeroDeFila < resultadoModa.conteos.length; numeroDeFila++) {

                // marcaModa: texto vacío por defecto, se llena si es la moda
                let marcaModa = '';

                // IF: si este conteo iguala al máximo, es la moda
                if (resultadoModa.conteos[numeroDeFila].conteo === resultadoModa.maxConteo) {
                    marcaModa = '⬅ moda';
                }

                // Resaltamos en azul las filas que son la moda
                let estiloFilaModa = '';
                if (resultadoModa.conteos[numeroDeFila].conteo === resultadoModa.maxConteo) {
                    estiloFilaModa = ' style="background:#dbeafe; font-weight:bold;"';
                }

                codigoTablaHTML += '<tr' + estiloFilaModa + '>';
                codigoTablaHTML += '<td>' + resultadoModa.conteos[numeroDeFila].valor + '</td>';
                codigoTablaHTML += '<td>' + resultadoModa.conteos[numeroDeFila].conteo + '</td>';
                codigoTablaHTML += '<td>' + marcaModa + '</td>';
                codigoTablaHTML += '</tr>';
            }

            codigoTablaHTML += '</table>';

            // ── Resumen del cálculo debajo de la tabla ──
            codigoTablaHTML += '<div class="detalle-calculo">';
            codigoTablaHTML += 'Total de datos analizados: <strong>' + arregloNumerosExtraidos.length + '</strong><br>';
            codigoTablaHTML += 'Valor(es) que más se repite(n): <strong>' + resultadoModa.modas.join(', ') + '</strong><br>';
            codigoTablaHTML += 'Número de veces que se repite: <strong>' + resultadoModa.maxConteo + '</strong>';
            codigoTablaHTML += '</div>';

            // ── Caja de resultado final ──
            // IF: una sola moda / ELSE: varias modas (multimodal)
            codigoTablaHTML += '<div class="caja-resultado">';
            if (resultadoModa.modas.length === 1) {
                codigoTablaHTML += '📙 Moda: <strong>' + resultadoModa.modas[0] + '</strong>';
            } else {
                codigoTablaHTML += '📙 Modas: <strong>' + resultadoModa.modas.join(', ') + '</strong> (conjunto multimodal)';
            }
            codigoTablaHTML += '</div>';

            // Insertamos todo el HTML construido dentro del contenedor en la página
            elementoContenedor.innerHTML = codigoTablaHTML;
        }
    }

    return resultadoModa;
}


// ============================================================
// FUNCIÓN INTERNA: _prepararDatosGraficoModa
// ============================================================
// Transforma el arreglo de registros en los arreglos paralelos
// que Chart.js necesita para dibujar el gráfico:
//   - arregloEtiquetas[]      → textos del eje X/Y o de la leyenda
//   - arregloValoresGrafico[] → números que determinan el tamaño de cada barra/sector
//   - arregloColoresGrafico[] → color de cada barra o sector
//   - modas[]                 → valores que son la moda (para el tooltip)
//   - maxConteo               → frecuencia máxima (para el tooltip)
//
// El resultado cambia según TIPO_GRAFICO_MODA:
//   Dona / Pie → un sector por cada valor único, coloreado si es moda
//   Resto      → una barra por cada valor único, azul si es moda, rojo si no
//
// Parámetros:
//   arregloRegistros → arreglo de objetos con los datos
//   nombreColumnaNum → nombre de la propiedad numérica
// ============================================================
function _prepararDatosGraficoModa(arregloRegistros, nombreColumnaNum) {

    // Extraemos los números válidos y calculamos la moda
    let arregloNumerosParaGrafico = [];

    for (let indiceNum = 0; indiceNum < arregloRegistros.length; indiceNum++) {
        let valorExtraido = Number(arregloRegistros[indiceNum][nombreColumnaNum]);
        if (!isNaN(valorExtraido)) {
            arregloNumerosParaGrafico.push(valorExtraido);
        }
    }

    let resultadoCalculado = _calcularModaDesdeNumeros(arregloNumerosParaGrafico);

    // Arreglos que se irán llenando en el bucle siguiente
    let arregloEtiquetasGrafico  = [];
    let arregloValoresGrafico    = [];
    let arregloColoresGrafico    = [];

    for (let indicePunto = 0; indicePunto < resultadoCalculado.conteos.length; indicePunto++) {

        let valorActual  = resultadoCalculado.conteos[indicePunto].valor;
        let conteoActual = resultadoCalculado.conteos[indicePunto].conteo;

        // Etiqueta: "Valor X" para que el eje sea legible
        arregloEtiquetasGrafico.push('Valor ' + valorActual);

        // Altura / tamaño de la barra o sector: la frecuencia
        arregloValoresGrafico.push(conteoActual);

        // Color: azul si es la moda, rojo si no lo es
        if (conteoActual === resultadoCalculado.maxConteo) {
            arregloColoresGrafico.push('rgba(22, 151, 249, 0.8)');   // azul = moda
        } else {
            arregloColoresGrafico.push('rgba(247, 85, 85, 0.52)');   // rojo = no es moda
        }
    }

    return {
        arregloEtiquetas:      arregloEtiquetasGrafico,
        arregloValoresGrafico: arregloValoresGrafico,
        arregloColoresGrafico: arregloColoresGrafico,
        modas:                 resultadoCalculado.modas,
        maxConteo:             resultadoCalculado.maxConteo
    };
}


// ============================================================
// FUNCIÓN INTERNA: _opcionesGraficoModa
// ============================================================
// Construye y devuelve el objeto 'options' que Chart.js usa
// para configurar el comportamiento y apariencia del gráfico.
//
// Parámetros:
//   textTituloGrafico → texto que aparece como título del gráfico
//   datosPreparados   → objeto devuelto por _prepararDatosGraficoModa
//                       (necesario para el tooltip personalizado)
// ============================================================
function _opcionesGraficoModa(textTituloGrafico, datosPreparados) {

    // Detecta si el tipo es barras horizontales
    let esBarraHorizontal = (TIPO_GRAFICO_MODA === 'barHorizontal');

    // Solo los gráficos de barras necesitan configurar los ejes
    let requiereConfiguracionEjes = (TIPO_GRAFICO_MODA === 'bar' || esBarraHorizontal);

    return {

        // responsive: true → el gráfico se redimensiona automáticamente
        responsive: true,

        // maintainAspectRatio: false → permite controlar la altura con CSS
        maintainAspectRatio: false,

        // indexAxis: 'y' → barras horizontales; 'x' → barras verticales
        indexAxis: esBarraHorizontal ? 'y' : 'x',

        // Animación de cascada: cada barra aparece con un pequeño retraso
        animations: (TIPO_GRAFICO_MODA === 'bar' || esBarraHorizontal)
            ? {
                [esBarraHorizontal ? 'x' : 'y']: {
                    duration: 600,
                    easing:   'easeInOutQuart',

                    // delay: cada barra espera 150ms más que la anterior
                    delay: function(contextoAnimacion) {
                        return contextoAnimacion.dataIndex * 150;
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

            legend: { position: 'top' },

            title: {
                display: true,
                text:    textTituloGrafico
            },

            // Tooltip personalizado: muestra el valor, la frecuencia
            // y si la barra es la moda
            tooltip: {
                enabled:       true,
                displayColors: false,

                callbacks: {

                    // Sin encabezado en el tooltip
                    title: function() { return ''; },

                    // Texto principal: "Valor X: N veces ← moda"
                    label: function(contextoTooltip) {

                        let etiquetaTooltip = contextoTooltip.label || '';

                        // parsed.y = frecuencia en barras verticales
                        // parsed.x = frecuencia en barras horizontales
                        let ejeValorTooltip  = esBarraHorizontal ? 'x' : 'y';
                        let frecuenciaTooltip = Number(contextoTooltip.parsed[ejeValorTooltip]);

                        // Indicamos si esta barra es la moda
                        let indicadorModa = '';
                        if (frecuenciaTooltip === datosPreparados.maxConteo) {
                            indicadorModa = ' ← moda';
                        }

                        return etiquetaTooltip + ': ' + frecuenciaTooltip + ' veces' + indicadorModa;
                    }
                }
            }
        },

        // Configuración de ejes (solo para tipos de barra)
        scales: requiereConfiguracionEjes
            ? {
                [esBarraHorizontal ? 'x' : 'y']: {
                    beginAtZero: true,
                    ticks: {
                        // stepSize: 1 → marcas de 1 en 1 (frecuencias son enteros)
                        stepSize: 1
                    }
                }
              }
            : {}
    };
}


// ============================================================
// FUNCIÓN PÚBLICA: dibujarGraficoModa
// ============================================================
// Función principal de visualización. Orquesta todo el proceso
// de creación del gráfico Chart.js en el canvas indicado.
//
// Flujo interno:
//   1. Busca el canvas en el DOM
//   2. Destruye el gráfico anterior si existe
//   3. Llama a _prepararDatosGraficoModa() para obtener etiquetas/colores
//   4. Construye el objeto 'data' con el dataset de barras/sectores
//   5. Crea la instancia de Chart.js con todos los parámetros
//   6. Guarda la instancia en instanciaGraficoModa y la devuelve
//
// Parámetros:
//   arregloRegistros → arreglo de objetos con los datos
//   nombreColumnaNum → nombre de la propiedad numérica a graficar
//   idCanvas         → id del elemento <canvas> en el HTML
//   textTitulo       → texto que aparece como título del gráfico
//
// Devuelve: la instancia del gráfico Chart.js creado
// ============================================================
function dibujarGraficoModa(arregloRegistros, nombreColumnaNum, idCanvas, textTitulo) {

    // Busca el elemento <canvas> en el HTML usando su id
    let elementoCanvasModa = document.getElementById(idCanvas);

    // Si no existe el canvas, no puede dibujar nada → sale con null
    if (!elementoCanvasModa) { return null; }

    // Fija la altura del canvas con CSS para que el gráfico no quede aplastado
    elementoCanvasModa.style.height    = '350px';
    elementoCanvasModa.style.maxHeight = '350px';

    // --- Destruye el gráfico anterior si existe ---
    // Chart.js lanza un error si se intenta crear un gráfico nuevo
    // sobre un canvas que ya tiene uno activo. Por eso se destruye primero.
    if (instanciaGraficoModa !== null) {
        try {
            instanciaGraficoModa.destroy();
        } catch (errorAlDestruir) {
            // Si destroy() falla, el try/catch evita que el error
            // detenga la ejecución del resto del código
        }
        instanciaGraficoModa = null;
    }

    // Llama a la función interna que prepara etiquetas, valores y colores
    let datosPreparadosGrafico = _prepararDatosGraficoModa(arregloRegistros, nombreColumnaNum);

    // Si no se recibió título, genera uno automático con las modas encontradas
    let textoTituloDefinitivo = textTitulo || (
        'Moda: ' + datosPreparadosGrafico.modas.join(', ') +
        ' (' + datosPreparadosGrafico.maxConteo + ' veces)'
    );

    // ── Construye el arreglo de datasets ────────────────────────
    // Un solo dataset: barras o sectores con las frecuencias
    let arregloDatasetsGrafico = [
        {
            label:           'Frecuencia (veces que aparece)',
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
    instanciaGraficoModa = new Chart(elementoCanvasModa.getContext('2d'), {

        // 'barHorizontal' es un valor propio de este proyecto.
        // Chart.js no lo reconoce, así que se convierte a 'bar'.
        // La orientación horizontal se controla con indexAxis:'y' en options.
        type: TIPO_GRAFICO_MODA === 'barHorizontal' ? 'bar' : TIPO_GRAFICO_MODA,

        data: {
            labels:   datosPreparadosGrafico.arregloEtiquetas,
            datasets: arregloDatasetsGrafico
        },

        // Pasamos datosPreparadosGrafico a las opciones para que el tooltip
        // pueda acceder a maxConteo y saber cuál barra es la moda
        options: _opcionesGraficoModa(textoTituloDefinitivo, datosPreparadosGrafico)
    });

    return instanciaGraficoModa;
}