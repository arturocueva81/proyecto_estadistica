// ============================================================
// media.js — Cálculo y visualización de la Media Aritmética
// ============================================================
// Este archivo contiene TODAS las funciones relacionadas con
// la media aritmética: cálculo, tabla HTML y gráfico Chart.js.
//
// Funciones públicas (se llaman desde estadistica.js):
//   - calcularMedia(...)   → calcula y muestra la tabla
//   - dibujarGrafico(...)  → dibuja el gráfico Chart.js
//
// Funciones internas (solo se usan dentro de este archivo):
//   - _prepararDatosGrafico(...)  → prepara etiquetas y colores
//   - _pluginTextoCentral(...)    → dibuja el valor en el centro
//   - _opcionesGrafico(...)       → devuelve la configuración
// ============================================================


// ------------------------------------------------------------
// VARIABLE GLOBAL: instanciaGraficoMedia
// ------------------------------------------------------------
// Guarda la referencia al gráfico Chart.js que está activo.
// Se necesita para poder DESTRUIRLO antes de crear uno nuevo,
// porque Chart.js no permite reutilizar un <canvas> sin antes
// destruir el gráfico anterior.
//
// IMPORTANTE: esta es la ÚNICA declaración de esta variable
// en todo el proyecto. NO repetirla en estadistica.js.
// Se usa 'var' (no 'let') para evitar errores si el navegador
// carga el archivo más de una vez.
// ------------------------------------------------------------
var instanciaGraficoMedia = null;


// ------------------------------------------------------------
// CONSTANTE: TIPO_GRAFICO_MEDIA
// ------------------------------------------------------------
// Define qué tipo de gráfico se dibuja en TODA la sección Media.
// Cambiar este valor afecta tanto el gráfico del ejemplo
// interactivo como el del ejercicio práctico.
//
// Opciones válidas:
//   'bar'           → Barras verticales
//   'barHorizontal' → Barras horizontales
//   'line'          → Línea (ideal para datos por fecha)
//   'radar'         → Telaraña (compara categorías)
//   'polarArea'     → Área polar (radio = valor)
//   'doughnut'      → Dona (agrupa en 4 rangos por cuartiles)
//   'pie'           → Pastel (igual que dona, sin hueco)
// ------------------------------------------------------------
const TIPO_GRAFICO_MEDIA = 'doughnut';


// ============================================================
// FUNCIÓN PÚBLICA: calcularMedia
// ============================================================
// Recorre un arreglo de objetos, suma los valores de una
// propiedad numérica y calcula el promedio (media aritmética).
// Opcionalmente genera una tabla HTML en el contenedor indicado.
//
// Parámetros:
//   arregloEstudiantes → arreglo de objetos con los datos
//                        Ejemplo: [{nombre:'Ana', nota:15}, ...]
//   nombreColumnaNum   → nombre de la propiedad numérica a promediar
//                        Ejemplo: 'nota' o 'Daily_Minutes_Spent'
//   idContenedorTabla  → id del elemento HTML donde mostrar la tabla
//                        Pasar null si NO se quiere generar tabla
//   nombreColumnaLabel → nombre de la propiedad de texto para la tabla
//                        Ejemplo: 'nombre' o 'App'
//
// Devuelve un objeto: { suma, cantidad, media }
// ============================================================
function calcularMedia(arregloEstudiantes, nombreColumnaNum, idContenedorTabla, nombreColumnaLabel) {

    // --- PASO 1: Filtrar registros con valor numérico válido ---
    // No todos los objetos del arreglo tienen garantizado un número
    // en la columna indicada. Este bucle descarta los que no sirven.
    let registrosConNumero = [];

    // Recorre cada objeto del arreglo de inicio a fin
    for (let indiceFiltro = 0; indiceFiltro < arregloEstudiantes.length; indiceFiltro++) {

        // Convierte el valor de la columna a número (Number() devuelve NaN si no es válido)
        let valorNumerico = Number(arregloEstudiantes[indiceFiltro][nombreColumnaNum]);

        // isNaN() devuelve true si el valor NO es un número válido
        // Solo agrega al arreglo si SÍ es un número válido
        if (!isNaN(valorNumerico)) {
            registrosConNumero.push(arregloEstudiantes[indiceFiltro]);
        }
    }

    // --- PASO 2: Sumar los valores válidos y calcular la media ---
    let sumaDeValores   = 0;
    let cantidadDatos   = registrosConNumero.length;
    let mediaAritmetica = 0;

    // Solo calcula si hay al menos un registro válido (evita dividir entre 0)
    if (cantidadDatos > 0) {

        // Recorre solo los registros que pasaron el filtro numérico
        for (let indiceSuma = 0; indiceSuma < cantidadDatos; indiceSuma++) {
            sumaDeValores += Number(registrosConNumero[indiceSuma][nombreColumnaNum]);
        }

        // Fórmula de la media: suma total / cantidad de datos
        // toFixed(2) redondea a 2 decimales, Number() lo convierte de texto a número
        mediaAritmetica = Number((sumaDeValores / cantidadDatos).toFixed(2));
    }

    // --- PASO 3: Generar tabla HTML (solo si se recibió un id de contenedor) ---
    // Si idContenedorTabla es null o vacío, se salta este bloque completamente
    if (typeof idContenedorTabla === 'string' && idContenedorTabla.length > 0) {

        // Busca el elemento HTML con ese id en el documento
        let elementoContenedor = document.getElementById(idContenedorTabla);

        // Solo continúa si el elemento existe en el HTML
        if (elementoContenedor) {

            // Construye el HTML de la tabla como un texto largo
            let codigoTabla = '';
            codigoTabla += '<p><strong>Cálculo de la Media — ' + nombreColumnaNum + '</strong></p>';

            // Abre la tabla con la clase CSS que le da estilo
            codigoTabla += '<table class="tabla-interactiva">';

            // Fila de encabezados: número, etiqueta y valor
            codigoTabla += '<tr><th>#</th><th>' + (nombreColumnaLabel || 'Ítem') + '</th><th>Valor</th></tr>';

            // Genera una fila por cada registro válido
            for (let indiceFila = 0; indiceFila < registrosConNumero.length; indiceFila++) {

                // Si se recibió un nombre de columna de texto, usa ese valor como etiqueta
                // Si no, usa "Dato 1", "Dato 2", etc.
                let textoEtiqueta = nombreColumnaLabel
                    ? registrosConNumero[indiceFila][nombreColumnaLabel]
                    : 'Dato ' + (indiceFila + 1);

                let numeroDeFila = Number(registrosConNumero[indiceFila][nombreColumnaNum]);

                codigoTabla += '<tr>';
                codigoTabla += '<td>' + (indiceFila + 1) + '</td>';
                codigoTabla += '<td>' + textoEtiqueta + '</td>';
                codigoTabla += '<td>' + numeroDeFila + '</td>';
                codigoTabla += '</tr>';
            }

            codigoTabla += '</table>';

            // Caja estilo consola que muestra el proceso de cálculo
            codigoTabla += '<div class="detalle-calculo">';
            codigoTabla += 'Suma: ' + sumaDeValores + ' | Registros: ' + cantidadDatos + '<br>';
            codigoTabla += 'Media = ' + sumaDeValores + ' / ' + cantidadDatos;
            codigoTabla += '</div>';

            // Caja destacada con el resultado final
            codigoTabla += '<div class="caja-resultado">';
            codigoTabla += '📘 Media aritmética: <strong>' + mediaAritmetica.toFixed(2) + '</strong>';
            codigoTabla += '</div>';

            // Inserta todo el HTML generado dentro del contenedor en la página
            elementoContenedor.innerHTML = codigoTabla;
        }
    }

    // Devuelve los tres valores clave para que otras funciones los puedan usar
    return { suma: sumaDeValores, cantidad: cantidadDatos, media: mediaAritmetica };
}


// ============================================================
// FUNCIÓN INTERNA: _prepararDatosGrafico
// ============================================================
// Transforma el arreglo de registros en tres arreglos paralelos
// que Chart.js necesita para dibujar el gráfico:
//   - etiquetas[]      → textos del eje X o de la leyenda
//   - valoresGrafico[] → números que determinan el tamaño de cada barra/sector
//   - coloresGrafico[] → color de cada barra o sector
//
// El resultado cambia según TIPO_GRAFICO_MEDIA:
//   Dona / Pie  → agrupa todos los datos en 4 rangos por cuartiles
//   Resto       → un punto por cada registro, coloreado vs la media
//
// Parámetros:
//   arregloRegistros → arreglo de objetos con los datos
//   nombreColumnaNum → nombre de la propiedad numérica
//   valorMediaCalc   → media ya calculada (para colorear barras)
// ============================================================
function _prepararDatosGrafico(arregloRegistros, nombreColumnaNum, valorMediaCalc) {

    // ── MODO DONA / PIE: agrupar datos en 4 rangos por cuartiles ──
    // Los cuartiles dividen los datos ordenados en 4 grupos iguales:
    //   Q1 = valor en la posición 25% → separa el 25% más bajo
    //   Q2 = valor en la posición 50% → es la mediana
    //   Q3 = valor en la posición 75% → separa el 25% más alto
    if (TIPO_GRAFICO_MEDIA === 'doughnut' || TIPO_GRAFICO_MEDIA === 'pie') {

        // Extrae solo los valores numéricos válidos en un arreglo simple
        let soloNumeros = [];
        for (let indiceNum = 0; indiceNum < arregloRegistros.length; indiceNum++) {
            let valorExtraido = Number(arregloRegistros[indiceNum][nombreColumnaNum]);
            if (!isNaN(valorExtraido)) {
                soloNumeros.push(valorExtraido);
            }
        }

        // Ordena los números de menor a mayor para poder calcular cuartiles
        // La función de comparación (a - b) le dice a sort() el orden correcto
        soloNumeros.sort(function(numeroA, numeroB) { return numeroA - numeroB; });

        // Calcula los tres cuartiles usando posiciones del arreglo ordenado
        // Math.floor() redondea hacia abajo para obtener un índice entero
        let cuartil1 = soloNumeros[Math.floor(soloNumeros.length * 0.25)] || 0;
        let cuartil2 = soloNumeros[Math.floor(soloNumeros.length * 0.50)] || 0;
        let cuartil3 = soloNumeros[Math.floor(soloNumeros.length * 0.75)] || 0;

        // Contadores para cada uno de los 4 rangos
        let contadorAlto      = 0;  // valores por encima de Q3 (top 25%)
        let contadorMedioAlto = 0;  // valores entre Q2 y Q3
        let contadorMedioBajo = 0;  // valores entre Q1 y Q2
        let contadorBajo      = 0;  // valores por debajo o igual a Q1 (bottom 25%)

        // Clasifica cada valor en su rango correspondiente
        for (let indiceClasif = 0; indiceClasif < arregloRegistros.length; indiceClasif++) {
            let valorClasif = Number(arregloRegistros[indiceClasif][nombreColumnaNum]);

            if (!isNaN(valorClasif)) {
                // Evalúa de mayor a menor para que cada valor caiga en un solo rango
                if      (valorClasif > cuartil3) { contadorAlto++;      }
                else if (valorClasif > cuartil2) { contadorMedioAlto++; }
                else if (valorClasif > cuartil1) { contadorMedioBajo++;  }
                else                             { contadorBajo++;       }
            }
        }

        // Devuelve los tres arreglos que Chart.js necesita para la dona/pastel
        return {
            etiquetas: [
                'Alto (> '     + cuartil3 + ')',
                'Medio-Alto (' + cuartil2 + '  ' + cuartil3 + ')',
                'Medio-Bajo (' + cuartil1 + '  ' + cuartil2 + ')',
                'Bajo (≤ '     + cuartil1 + ')'
            ],
            valoresGrafico: [contadorAlto, contadorMedioAlto, contadorMedioBajo, contadorBajo],
            // Verde=alto, Azul=medio-alto, Amarillo=medio-bajo, Rojo=bajo
            coloresGrafico: ['#2ecc71', '#3498db', '#f1c40f', '#e74c3c']
        };
    }

    // ── RESTO DE TIPOS: un punto por cada registro ──────────────
    // Busca la primera propiedad de texto del objeto para usarla
    // como etiqueta en el eje X (por ejemplo: 'nombre' o 'App')
    let nombreColumnaTexto = null;

    if (arregloRegistros.length > 0) {
        // Object.keys() devuelve un arreglo con los nombres de las propiedades del objeto
        let propiedadesObjeto = Object.keys(arregloRegistros[0]);

        // Recorre las propiedades hasta encontrar una de tipo texto (string)
        // que no sea la misma columna numérica que ya estamos usando
        for (let indiceProp = 0; indiceProp < propiedadesObjeto.length; indiceProp++) {
            let nombrePropiedad = propiedadesObjeto[indiceProp];

            // Condición: debe ser diferente a la columna numérica Y ser de tipo string
            if (nombrePropiedad !== nombreColumnaNum &&
                typeof arregloRegistros[0][nombrePropiedad] === 'string') {
                nombreColumnaTexto = nombrePropiedad;
                break; // Ya encontró la primera columna de texto, no necesita seguir
            }
        }
    }

    // Arreglos vacíos que se irán llenando en el bucle siguiente
    let arregloEtiquetas  = [];
    let arregloValores    = [];
    let arregloColores    = [];

    // Construye un punto por cada registro con valor numérico válido
    for (let indicePunto = 0; indicePunto < arregloRegistros.length; indicePunto++) {
        let valorPunto = Number(arregloRegistros[indicePunto][nombreColumnaNum]);

        if (!isNaN(valorPunto)) {
            // Usa el texto de la columna de etiqueta, o "Dato N" si no hay columna de texto
            arregloEtiquetas.push(
                nombreColumnaTexto
                    ? arregloRegistros[indicePunto][nombreColumnaTexto]
                    : 'Dato ' + (indicePunto + 1)
            );

            arregloValores.push(valorPunto);

            // Verde si el valor está en o por encima de la media, azul si está por debajo
            // Esto permite identificar visualmente quién supera el promedio
            arregloColores.push(
                valorPunto >= valorMediaCalc
                    ? 'rgba(46,204,113,0.7)'   // verde semitransparente
                    : 'rgba(99,144,241,0.7)'   // azul semitransparente
            );
        }
    }

    return {
        etiquetas:     arregloEtiquetas,
        valoresGrafico: arregloValores,
        coloresGrafico: arregloColores
    };
}


// ============================================================
// FUNCIÓN INTERNA: _pluginTextoCentral
// ============================================================
// Crea y devuelve un PLUGIN personalizado de Chart.js.
//
// ¿Qué es un plugin de Chart.js?
//   Chart.js permite agregar código propio que se ejecuta en
//   momentos específicos del ciclo de vida del gráfico.
//   El evento 'afterDraw' se dispara justo después de que
//   Chart.js termina de dibujar el gráfico en el canvas.
//
// ¿Para qué sirve este plugin?
//   Dibuja el valor de la media directamente sobre el canvas
//   usando la API de dibujo 2D del navegador (Canvas API).
//   Solo tiene efecto visual en los tipos 'doughnut' y 'pie',
//   porque son los únicos que tienen espacio central vacío.
//
// Parámetros:
//   valorMedia → número con la media ya calculada
//   idPlugin   → identificador único del plugin (evita conflictos
//                si hay varios gráficos en la misma página)
// ============================================================
function _pluginTextoCentral(valorMedia, idPlugin) {

    // Devuelve un objeto con la estructura que Chart.js espera para un plugin
    return {

        // 'id' identifica el plugin. Chart.js lo usa internamente.
        id: idPlugin || 'pluginTextoCentral',

        // 'afterDraw' es el HOOK (gancho): Chart.js llama a esta función
        // automáticamente cada vez que termina de renderizar el gráfico.
        // El parámetro 'chart' es el objeto Chart.js con toda la información
        // del gráfico: dimensiones, canvas, contexto de dibujo, etc.
        afterDraw: function(chart) {

            // Si el tipo de gráfico no es dona ni pastel, no dibuja nada
            // y sale de la función inmediatamente con 'return'
            if (TIPO_GRAFICO_MEDIA !== 'doughnut' && TIPO_GRAFICO_MEDIA !== 'pie') { return; }

            // Calcula el centro geométrico del canvas dividiendo entre 2
            let coordCentroX = chart.width  / 2;
            let coordCentroY = chart.height / 2;

            // 'chart.ctx' es el contexto de dibujo 2D del canvas.
            // Es el mismo objeto que se obtiene con canvas.getContext('2d').
            // A través de él se accede a todas las funciones de dibujo.
            let contexto2D = chart.ctx;

            // save() guarda el estado actual del contexto (fuente, color, etc.)
            // para poder restaurarlo después con restore() sin afectar al gráfico
            contexto2D.save();

            // --- Dibuja el número grande con el valor de la media ---
            contexto2D.font         = 'bold 28px Arial';  // tamaño y fuente del texto
            contexto2D.textAlign    = 'center';            // centra el texto en X
            contexto2D.textBaseline = 'middle';            // centra el texto en Y
            contexto2D.fillStyle    = '#2c3e50';           // color del texto (gris oscuro)

            // fillText(texto, x, y) dibuja el texto en las coordenadas indicadas
            // Se sube 14px del centro para dejar espacio a la línea y la etiqueta
            contexto2D.fillText(valorMedia.toFixed(2), coordCentroX, coordCentroY - 14);

            // --- Dibuja la línea roja decorativa debajo del número ---
            contexto2D.strokeStyle = '#DC2626'; // color de la línea (rojo)
            contexto2D.lineWidth   = 3;          // grosor de la línea en píxeles

            // beginPath() inicia un nuevo trazo (borra el trazo anterior)
            contexto2D.beginPath();
            // moveTo(x, y) mueve el "lápiz" al punto de inicio sin dibujar
            contexto2D.moveTo(coordCentroX - 28, coordCentroY + 8);
            // lineTo(x, y) traza una línea desde el punto actual hasta este punto
            contexto2D.lineTo(coordCentroX + 28, coordCentroY + 8);
            // stroke() aplica el trazo con el color y grosor definidos arriba
            contexto2D.stroke();

            // --- Dibuja la etiqueta "MEDIA" debajo de la línea ---
            contexto2D.font      = 'bold 11px Arial';
            contexto2D.fillStyle = '#DC2626';  // mismo rojo que la línea
            contexto2D.fillText('MEDIA', coordCentroX, coordCentroY + 26);

            // restore() recupera el estado guardado con save(), dejando el
            // contexto exactamente como estaba antes de que este plugin dibujara
            contexto2D.restore();
        }
    };
}


// ============================================================
// FUNCIÓN INTERNA: _opcionesGrafico
// ============================================================
// Construye y devuelve el objeto 'options' que Chart.js usa
// para configurar el comportamiento y apariencia del gráfico.
//
// Chart.js separa la configuración en dos partes:
//   - 'data'    → qué datos mostrar (etiquetas, valores, colores)
//   - 'options' → cómo mostrarlos (animación, leyenda, ejes, etc.)
//
// Esta función genera la parte 'options' de forma dinámica
// según el tipo de gráfico definido en TIPO_GRAFICO_MEDIA.
//
// Parámetros:
//   textTituloGrafico → texto que aparece como título del gráfico
// ============================================================
function _opcionesGrafico(textTituloGrafico) {

    // Detecta si el tipo es barras horizontales
    // (Chart.js usa el mismo tipo 'bar' pero con indexAxis:'y')
    let esBarraHorizontal = (TIPO_GRAFICO_MEDIA === 'barHorizontal');

    // Solo los gráficos de barras (vertical u horizontal) necesitan
    // configurar los ejes X e Y. Los circulares (pie, doughnut, radar,
    // polarArea) no tienen ejes y fallan si se les pasa esta configuración.
    let requiereEjes = (TIPO_GRAFICO_MEDIA === 'bar' || esBarraHorizontal);

    // Devuelve el objeto de configuración completo
    return {

        // responsive: true → el gráfico se redimensiona automáticamente
        // cuando cambia el tamaño del contenedor o la ventana del navegador
        responsive: true,

        // maintainAspectRatio: false → permite controlar la altura con CSS
        // Si fuera true, Chart.js impondría su propia proporción ancho/alto
        maintainAspectRatio: false,

        // indexAxis define qué eje es el "principal" (donde van las etiquetas)
        // 'x' = barras verticales (por defecto)
        // 'y' = barras horizontales (gira el gráfico 90°)
        indexAxis: esBarraHorizontal ? 'y' : 'x',

        // Configuración de la animación de entrada del gráfico
        animation: {
            animateRotate: true,       // los gráficos circulares giran al aparecer
            animateScale:  true,       // el gráfico crece desde el centro
            duration:      1000,       // duración de la animación en milisegundos
            easing:        'easeInOutQuart'  // curva de aceleración (suave al inicio y al final)
        },

        // 'plugins' configura los módulos integrados de Chart.js
        plugins: {

            // Leyenda: el recuadro con los colores y nombres de cada serie
            legend: {
                position: 'bottom'  // la coloca debajo del gráfico
            },

            // Título: texto que aparece encima del gráfico
            title: {
                display: true,           // activa la visualización del título
                text:    textTituloGrafico  // texto recibido como parámetro
            }
        },

        // 'scales' configura los ejes del gráfico.
        // Se usa un operador ternario: si requiereEjes es true, agrega la
        // configuración del eje; si es false, devuelve un objeto vacío {}.
        //
        // La sintaxis [esBarraHorizontal ? 'x' : 'y'] es una "clave dinámica":
        // crea la propiedad 'x' o 'y' según el tipo de gráfico.
        //   - Barras verticales: configura el eje 'y' (el de los valores)
        //   - Barras horizontales: configura el eje 'x' (el de los valores)
        scales: requiereEjes
            ? { [esBarraHorizontal ? 'x' : 'y']: { beginAtZero: true } }
            : {}
    };
}


// ============================================================
// FUNCIÓN PÚBLICA: dibujarGrafico
// ============================================================
// Función principal de visualización. Orquesta todo el proceso
// de creación del gráfico Chart.js en el canvas indicado.
//
// Flujo interno:
//   1. Busca el canvas en el DOM
//   2. Destruye el gráfico anterior si existe
//   3. Calcula la media (si no se recibió una ya calculada)
//   4. Llama a _prepararDatosGrafico() para obtener etiquetas/colores
//   5. Crea la instancia de Chart.js con todos los parámetros
//   6. Guarda la instancia en instanciaGraficoMedia y la devuelve
//
// Parámetros:
//   arregloRegistros  → arreglo de objetos con los datos
//   nombreColumnaNum  → nombre de la propiedad numérica a graficar
//   idCanvas          → id del elemento <canvas> en el HTML
//   textTitulo        → texto que aparece como título del gráfico
//   mediaYaCalculada  → (opcional) media precalculada; si no se
//                       pasa, la función la calcula internamente
//
// Devuelve: la instancia del gráfico Chart.js creado
// ============================================================
function dibujarGraficoMedia(arregloRegistros, nombreColumnaNum, idCanvas, textTitulo, mediaYaCalculada) {

    // Busca el elemento <canvas> en el HTML usando su id
    let elementoCanvas = document.getElementById(idCanvas);

    // Si no existe el canvas, no puede dibujar nada → sale con null
    if (!elementoCanvas) { return null; }

    // Fija la altura del canvas con CSS para que pie/doughnut no quede
    // aplastado. Con maintainAspectRatio:false, Chart.js respeta este valor.
    elementoCanvas.style.height    = '350px';
    elementoCanvas.style.maxHeight = '350px';

    // --- Destruye el gráfico anterior si existe ---
    // Chart.js lanza un error si se intenta crear un gráfico nuevo
    // sobre un canvas que ya tiene uno activo. Por eso se destruye primero.
    if (instanciaGraficoMedia !== null) {
        try {
            instanciaGraficoMedia.destroy(); // libera el canvas y la memoria
        } catch(errorDestruccion) {
            // Si destroy() falla (por ejemplo, el canvas ya fue removido del DOM),
            // el try/catch evita que el error detenga la ejecución del resto del código
        }
        instanciaGraficoMedia = null; // limpia la referencia
    }

    // --- Determina el valor de la media a usar ---
    let valorMediaFinal = 0;

    // Si se recibió una media externa válida (número y no NaN), la usa directamente
    // Esto evita calcular la media dos veces cuando ya se calculó en estadistica.js
    if (typeof mediaYaCalculada === 'number' && !isNaN(mediaYaCalculada)) {
        valorMediaFinal = mediaYaCalculada;

    } else {
        // Si no se recibió media externa, la calcula recorriendo el arreglo
        let acumuladorSuma  = 0;
        let contadorValidos = 0;

        for (let indiceCalc = 0; indiceCalc < arregloRegistros.length; indiceCalc++) {
            let valorCalc = Number(arregloRegistros[indiceCalc][nombreColumnaNum]);

            // Solo suma los valores que son números válidos
            if (!isNaN(valorCalc)) {
                acumuladorSuma += valorCalc;
                contadorValidos++;
            }
        }

        // Calcula la media solo si hay datos válidos (evita dividir entre 0)
        valorMediaFinal = contadorValidos > 0
            ? Number((acumuladorSuma / contadorValidos).toFixed(2))
            : 0;
    }

    // Llama a la función interna que prepara etiquetas, valores y colores
    let datosParaGrafico = _prepararDatosGrafico(arregloRegistros, nombreColumnaNum, valorMediaFinal);

    // Si no se recibió título, genera uno automático con el valor de la media
    let textoTituloFinal = textTitulo || ('Media: ' + valorMediaFinal.toFixed(2));

    // ============================================================
    // CREACIÓN DEL GRÁFICO CON CHART.JS
    // ============================================================
    // 'new Chart(contexto, configuracion)' crea el gráfico.
    //
    // Parámetro 1: contexto de dibujo 2D del canvas
    //   canvas.getContext('2d') devuelve el objeto que Chart.js
    //   usa para dibujar formas, líneas y texto en el canvas.
    //
    // Parámetro 2: objeto de configuración con tres secciones:
    //   - type    → tipo de gráfico ('bar', 'pie', 'doughnut', etc.)
    //   - data    → los datos a visualizar
    //   - options → comportamiento y apariencia
    //   - plugins → extensiones personalizadas (como el texto central)
    // ============================================================
    instanciaGraficoMedia = new Chart(elementoCanvas.getContext('2d'), {

        // 'type' define el tipo de gráfico.
        // Si es 'barHorizontal' (valor propio de este proyecto),
        // se convierte a 'bar' porque Chart.js no reconoce 'barHorizontal'.
        // La orientación horizontal se controla con indexAxis:'y' en options.
        type: TIPO_GRAFICO_MEDIA === 'barHorizontal' ? 'bar' : TIPO_GRAFICO_MEDIA,

        // 'data' contiene los datos que se van a visualizar
        data: {

            // 'labels' → arreglo de textos para el eje X o la leyenda
            // Cada etiqueta corresponde a un punto/sector del gráfico
            labels: datosParaGrafico.etiquetas,

            // 'datasets' → arreglo de series de datos.
            // Cada objeto dentro del arreglo es una serie independiente.
            // En este gráfico solo hay una serie (un solo arreglo de valores).
            datasets: [{

                // Nombre de la serie (aparece en la leyenda y en el tooltip)
                label: 'Media',

                // Arreglo de valores numéricos. Cada número corresponde
                // a una etiqueta de 'labels' por posición (índice 0 con índice 0, etc.)
                data: datosParaGrafico.valoresGrafico,

                // Color de relleno de cada barra o sector.
                // Puede ser un solo color (igual para todos) o un arreglo
                // (un color diferente por barra/sector, como en este caso).
                backgroundColor: datosParaGrafico.coloresGrafico,

                // Color del borde de cada barra o sector
                borderColor: datosParaGrafico.coloresGrafico,

                // Grosor del borde en píxeles
                borderWidth: 1,

                // hoverOffset: cuántos píxeles se separa un sector al pasar
                // el mouse por encima (solo aplica a pie y doughnut)
                hoverOffset: 10
            }]
        },

        // 'options' → configuración de comportamiento y apariencia
        // Se genera dinámicamente con la función _opcionesGrafico()
        options: _opcionesGrafico(textoTituloFinal),

        // 'plugins' → arreglo de plugins personalizados que se ejecutan
        // durante el ciclo de vida del gráfico.
        // _pluginTextoCentral() devuelve un objeto plugin que dibuja
        // el valor de la media en el centro del canvas (solo en pie/doughnut).
        // Se le pasa un id único combinando 'plugin_' con el id del canvas
        // para evitar conflictos si hay varios gráficos en la misma página.
        plugins: [ _pluginTextoCentral(valorMediaFinal, 'plugin_' + idCanvas) ]
    });

    // Guarda y devuelve la instancia para que estadistica.js pueda
    // destruirla cuando el usuario oculte el gráfico
    return instanciaGraficoMedia;
}