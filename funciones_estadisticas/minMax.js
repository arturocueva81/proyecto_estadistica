// minMax.js

/**
 * Función base: calcularMinMaxDesdeArreglo
 * Recibe un arreglo de NÚMEROS ya extraídos
 * y devuelve { min, max, indiceMin, indiceMax }
 */
function calcularMinMaxDesdeArreglo(arregloNumeros) {

    if (arregloNumeros.length === 0) {
        return { min: null, max: null, indiceMin: null, indiceMax: null };
    }

    let min = arregloNumeros[0];
    let max = arregloNumeros[0];
    let indiceMin = 0;
    let indiceMax = 0;

    for (let i = 1; i < arregloNumeros.length; i++) {
        if (arregloNumeros[i] < min) {
            min = arregloNumeros[i];
            indiceMin = i;
        }
        if (arregloNumeros[i] > max) {
            max = arregloNumeros[i];
            indiceMax = i;
        }
    }

    return { min: min, max: max, indiceMin: indiceMin, indiceMax: indiceMax };
}


/**
 * calcularMinMax:
 * - arregloObjetos     : array de objetos
 * - propiedad          : nombre de la propiedad numérica (string)
 * - idContenedor       : id del elemento donde insertar la tabla (string o null)
 * - nombrePropMostrar  : propiedad a mostrar como etiqueta (string, opcional)
 *
 * Devuelve: { min, max, indiceMin, indiceMax, objetoMin, objetoMax }
 */
function calcularMinMax(arregloObjetos, propiedad, idContenedor, nombrePropMostrar) {

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

    // --- PASO 3: calcular min y max ---
    let resultado = calcularMinMaxDesdeArreglo(numeros);

    // Guardar referencia al objeto completo
    resultado.objetoMin = validos[resultado.indiceMin] || null;
    resultado.objetoMax = validos[resultado.indiceMax] || null;

    // --- PASO 4: generar HTML si se pidió contenedor ---
    if (typeof idContenedor === 'string' && idContenedor.length > 0) {

        let cont = document.getElementById(idContenedor);

        if (cont) {

            let etiquetaMin = '';
            let etiquetaMax = '';

            if (nombrePropMostrar && resultado.objetoMin) {
                etiquetaMin = ' (' + resultado.objetoMin[nombrePropMostrar] + ')';
            }
            if (nombrePropMostrar && resultado.objetoMax) {
                etiquetaMax = ' (' + resultado.objetoMax[nombrePropMostrar] + ')';
            }

            let html = '';
            html += '<p><strong>Búsqueda de mínimo y máximo (propiedad: ' + propiedad + ')</strong></p>';
            html += '<table class="tabla-interactiva">';
            html += '<tr>';
            html += '<th>#</th>';
            if (nombrePropMostrar) { html += '<th>' + nombrePropMostrar + '</th>'; }
            html += '<th>' + propiedad + '</th>';
            html += '<th>¿Destacado?</th>';
            html += '</tr>';

            for (let i = 0; i < validos.length; i++) {
                let marca = '';
                if (i === resultado.indiceMin && i === resultado.indiceMax) {
                    marca = '⬅ mínimo y máximo';
                } else if (i === resultado.indiceMin) {
                    marca = '⬅ mínimo';
                } else if (i === resultado.indiceMax) {
                    marca = '⬅ máximo';
                }

                html += '<tr>';
                html += '<td>' + (i + 1) + '</td>';
                if (nombrePropMostrar) {
                    html += '<td>' + validos[i][nombrePropMostrar] + '</td>';
                }
                html += '<td>' + numeros[i] + '</td>';
                html += '<td>' + marca + '</td>';
                html += '</tr>';
            }

            html += '</table>';

            // Detalle del cálculo
            html += '<div class="detalle-calculo">';
            html += 'Total de datos analizados: ' + numeros.length + '<br>';
            html += 'Valor mínimo encontrado: <strong>' + resultado.min + '</strong>' + etiquetaMin + '<br>';
            html += 'Valor máximo encontrado: <strong>' + resultado.max + '</strong>' + etiquetaMax;
            html += '</div>';

            // Cajas de resultado
            html += '<div style="display: flex; gap: 1rem; flex-wrap: wrap;">';

            html += '<div class="caja-resultado" style="flex: 1;">';
            html += '📉 Mínimo: <strong>' + resultado.min + '</strong>' + etiquetaMin;
            html += '</div>';

            html += '<div class="caja-resultado" style="flex: 1;">';
            html += '📈 Máximo: <strong>' + resultado.max + '</strong>' + etiquetaMax;
            html += '</div>';

            html += '</div>';

            cont.innerHTML = html;
        }
    }

    return resultado;
}


/**
 * dibujarGraficoMinMax:
 * - arregloObjetos     : array de objetos
 * - propiedad          : nombre de la propiedad numérica (string)
 * - nombrePropMostrar  : propiedad a usar como etiqueta del eje X (string)
 * - canvasId           : id del canvas donde dibujar (string)
 * - titulo             : texto del título del gráfico (string, opcional)
 *
 * Dibuja un gráfico de barras donde:
 *   - barra azul  = valor mínimo
 *   - barra roja  = valor máximo
 *   - barra gris  = resto de valores
 *
 * Devuelve la instancia del gráfico creada por Chart.js
 */
function dibujarGraficoMinMax(arregloObjetos, propiedad, nombrePropMostrar, canvasId, titulo) {

    // --- PASO 1: filtrar objetos válidos ---
    let validos = [];
    for (let i = 0; i < arregloObjetos.length; i++) {
        let val = Number(arregloObjetos[i][propiedad]);
        if (!isNaN(val)) {
            validos.push(arregloObjetos[i]);
        }
    }

    // --- PASO 2: extraer números y calcular min/max ---
    let numeros = [];
    for (let i = 0; i < validos.length; i++) {
        numeros.push(Number(validos[i][propiedad]));
    }

    let resultado = calcularMinMaxDesdeArreglo(numeros);

    // --- PASO 3: preparar etiquetas y colores ---
    let etiquetas = [];
    let colores = [];

    for (let i = 0; i < validos.length; i++) {
        let etiqueta = nombrePropMostrar ? validos[i][nombrePropMostrar] : 'Dato ' + (i + 1);
        etiquetas.push(etiqueta);

        if (i === resultado.indiceMin && i === resultado.indiceMax) {
            colores.push('rgba(150, 100, 220, 0.8)');  // morado = ambos
        } else if (i === resultado.indiceMin) {
            colores.push('rgba(22, 151, 249, 0.8)');   // azul = mínimo
        } else if (i === resultado.indiceMax) {
            colores.push('rgba(247, 85, 85, 0.8)');    // rojo = máximo
        } else {
            colores.push('rgba(180, 180, 180, 0.6)');  // gris = resto
        }
    }

    // --- PASO 4: obtener el canvas ---
    let canvas = document.getElementById(canvasId);
    if (!canvas) { return null; }
    let ctx = canvas.getContext('2d');

    // --- PASO 5: crear y devolver el gráfico ---
    let grafico = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: etiquetas,
            datasets: [
                {
                    label: propiedad,
                    data: numeros,
                    backgroundColor: colores,
                    borderColor: colores,
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                title: {
                    display: true,
                    text: (titulo ? titulo : 'Gráfico de Mínimo y Máximo')
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
                            let sufijo = '';
                            if (context.dataIndex === resultado.indiceMin) sufijo = ' ← mínimo';
                            if (context.dataIndex === resultado.indiceMax) sufijo = ' ← máximo';
                            return etiqueta + ': ' + valor + sufijo;
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