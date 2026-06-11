// rango.js

/**
 * Función base: calcularRangoDesdeArreglo
 * Recibe un arreglo de NÚMEROS ya extraídos
 * y devuelve { min, max, rango }
 */
function calcularRangoDesdeArreglo(arregloNumeros) {

    if (arregloNumeros.length === 0) {
        return { min: null, max: null, rango: null };
    }

    let min = arregloNumeros[0];
    let max = arregloNumeros[0];

    for (let i = 1; i < arregloNumeros.length; i++) {
        if (arregloNumeros[i] < min) {
            min = arregloNumeros[i];
        }
        if (arregloNumeros[i] > max) {
            max = arregloNumeros[i];
        }
    }

    let rango = max - min;

    return { min: min, max: max, rango: rango };
}


/**
 * calcularRango:
 * - arregloObjetos     : array de objetos
 * - propiedad          : nombre de la propiedad numérica (string)
 * - idContenedor       : id del elemento donde insertar el resultado (string o null)
 * - nombrePropMostrar  : propiedad a mostrar como etiqueta (string, opcional)
 *
 * Devuelve: { min, max, rango }
 */
function calcularRango(arregloObjetos, propiedad, idContenedor, nombrePropMostrar) {

    // --- PASO 1: filtrar objetos con valor numérico válido ---
    let validos = [];
    for (let i = 0; i < arregloObjetos.length; i++) {
        let val = Number(arregloObjetos[i][propiedad]);
        if (!isNaN(val)) {
            validos.push(arregloObjetos[i]);
        }
    }

    // --- PASO 2: extraer solo los números ---
    let numeros = [];
    for (let i = 0; i < validos.length; i++) {
        numeros.push(Number(validos[i][propiedad]));
    }

    // --- PASO 3: calcular rango ---
    let resultado = calcularRangoDesdeArreglo(numeros);

    // --- PASO 4: generar HTML si se pidió contenedor ---
    if (typeof idContenedor === 'string' && idContenedor.length > 0) {

        let cont = document.getElementById(idContenedor);

        if (cont) {

            let html = '';
            html += '<p><strong>Cálculo del Rango (propiedad: ' + propiedad + ')</strong></p>';
            html += '<table class="tabla-interactiva">';
            html += '<tr>';
            html += '<th>#</th>';
            if (nombrePropMostrar) { html += '<th>' + nombrePropMostrar + '</th>'; }
            html += '<th>' + propiedad + '</th>';
            html += '</tr>';

            for (let i = 0; i < validos.length; i++) {
                html += '<tr>';
                html += '<td>' + (i + 1) + '</td>';
                if (nombrePropMostrar) {
                    html += '<td>' + validos[i][nombrePropMostrar] + '</td>';
                }
                html += '<td>' + numeros[i] + '</td>';
                html += '</tr>';
            }

            html += '</table>';

            // Detalle del cálculo
            html += '<div class="detalle-calculo">';
            html += 'Total de datos: ' + numeros.length + '<br>';
            html += 'Valor mínimo: <strong>' + resultado.min + '</strong><br>';
            html += 'Valor máximo: <strong>' + resultado.max + '</strong><br>';
            html += 'Rango = Máximo − Mínimo = ' + resultado.max + ' − ' + resultado.min + ' = <strong>' + resultado.rango + '</strong>';
            html += '</div>';

            // Caja de resultado final
            html += '<div class="caja-resultado">';
            html += '📏 Rango: <strong>' + resultado.rango + '</strong>';
            html += '</div>';

            cont.innerHTML = html;
        }
    }

    return resultado;
}


/**
 * dibujarGraficoRango:
 * - arregloObjetos     : array de objetos
 * - propiedad          : nombre de la propiedad numérica (string)
 * - nombrePropMostrar  : propiedad a usar como etiqueta del eje X (string)
 * - canvasId           : id del canvas donde dibujar (string)
 * - titulo             : texto del título del gráfico (string, opcional)
 *
 * Dibuja un gráfico de barras donde se visualiza el rango
 * con una línea horizontal en el mínimo y otra en el máximo.
 *
 * Devuelve la instancia del gráfico creada por Chart.js
 */
function dibujarGraficoRango(arregloObjetos, propiedad, nombrePropMostrar, canvasId, titulo) {

    // --- PASO 1: filtrar objetos válidos ---
    let validos = [];
    for (let i = 0; i < arregloObjetos.length; i++) {
        let val = Number(arregloObjetos[i][propiedad]);
        if (!isNaN(val)) {
            validos.push(arregloObjetos[i]);
        }
    }

    // --- PASO 2: extraer números y calcular rango ---
    let numeros = [];
    for (let i = 0; i < validos.length; i++) {
        numeros.push(Number(validos[i][propiedad]));
    }

    let resultado = calcularRangoDesdeArreglo(numeros);

    // --- PASO 3: preparar etiquetas ---
    let etiquetas = [];
    for (let i = 0; i < validos.length; i++) {
        let etiqueta = nombrePropMostrar ? validos[i][nombrePropMostrar] : 'Dato ' + (i + 1);
        etiquetas.push(etiqueta);
    }

    // --- PASO 4: líneas de referencia (min y max) ---
    let lineaMin = [];
    let lineaMax = [];
    for (let i = 0; i < numeros.length; i++) {
        lineaMin.push(resultado.min);
        lineaMax.push(resultado.max);
    }

    // --- PASO 5: obtener el canvas ---
    let canvas = document.getElementById(canvasId);
    if (!canvas) { return null; }
    let ctx = canvas.getContext('2d');

    // --- PASO 6: crear y devolver el gráfico ---
    let grafico = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: etiquetas,
            datasets: [
                {
                    label: propiedad,
                    data: numeros,
                    backgroundColor: 'rgba(22, 151, 249, 0.6)',
                    borderColor: 'rgba(22, 151, 249, 1)',
                    borderWidth: 1,
                    order: 2
                },
                {
                    label: 'Mínimo (' + resultado.min + ')',
                    data: lineaMin,
                    type: 'line',
                    borderColor: 'rgba(247, 85, 85, 0.9)',
                    borderWidth: 2,
                    borderDash: [6, 4],
                    pointRadius: 0,
                    fill: false,
                    order: 1
                },
                {
                    label: 'Máximo (' + resultado.max + ')',
                    data: lineaMax,
                    type: 'line',
                    borderColor: 'rgba(50, 200, 100, 0.9)',
                    borderWidth: 2,
                    borderDash: [6, 4],
                    pointRadius: 0,
                    fill: false,
                    order: 1
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                title: {
                    display: true,
                    text: (titulo ? titulo : 'Gráfico de Rango')
                },
                tooltip: {
                    enabled: true,
                    displayColors: false,
                    callbacks: {
                        title: function () { return ''; },
                        label: function (context) {
                            let etiqueta = context.label || '';
                            let valor = (context.parsed && context.parsed.y !== undefined)
                                ? context.parsed.y
                                : context.parsed;
                            return etiqueta + ': ' + valor;
                        }
                    }
                }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });

    return grafico;
}