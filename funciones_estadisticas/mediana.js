// mediana.js

/**
 * Función base: calcularMedianaDesdeArreglo
 * Recibe un arreglo de NÚMEROS (no objetos) ya extraídos
 * y devuelve el objeto con el resultado de la mediana.
 *
 * Devuelve: { ordenados, centro, esPar, mediana }
 */
function calcularMedianaDesdeArregloNumeros(arregloNumeros) {

    // Copiamos el arreglo para no modificar el original
    let ordenados = arregloNumeros.slice();

    // Ordenamos de menor a mayor
    ordenados.sort(function (a, b) {
        return a - b;
    });

    let centro = Math.floor(ordenados.length / 2);
    let esPar = ordenados.length % 2 === 0;
    let mediana = 0;

    if (esPar) {
        mediana = (ordenados[centro - 1] + ordenados[centro]) / 2;
    } else {
        mediana = ordenados[centro];
    }

    return {
        ordenados: ordenados,
        centro: centro,
        esPar: esPar,
        mediana: parseFloat(mediana.toFixed(2))
    };
}


/**
 * calcularMediana:
 * - arregloObjetos  : array de objetos (igual que en media.js)
 * - propiedad       : nombre de la propiedad numérica (string)
 * - idContenedor    : id del elemento donde insertar la tabla (opcional).
 *                     Si null => no escribe HTML.
 * - nombrePropMostrar: nombre de la propiedad a mostrar como etiqueta (opcional).
 *                     Si no se pasa, se usa "Item #".
 *
 * Devuelve: { ordenados, centro, esPar, mediana }
 */
function calcularMediana(arregloObjetos, propiedad, idContenedor, nombrePropMostrar) {

    // --- PASO 1: filtrar solo los objetos con valor numérico válido ---
    let validos = [];
    for (let i = 0; i < arregloObjetos.length; i++) {
        let val = Number(arregloObjetos[i][propiedad]);
        if (!isNaN(val)) {
            validos.push(arregloObjetos[i]);
        }
    }

    // --- PASO 2: extraer solo los números para calcular la mediana ---
    let numeros = [];
    for (let i = 0; i < validos.length; i++) {
        numeros.push(Number(validos[i][propiedad]));
    }

    // --- PASO 3: calcular la mediana usando la función base ---
    let resultado = calcularMedianaDesdeArregloNumeros(numeros);

    // --- PASO 4: si se pidió tabla, generarla en el contenedor ---
    if (typeof idContenedor === 'string' && idContenedor.length > 0) {

        let cont = document.getElementById(idContenedor);

        if (cont) {

            // Ordenar los objetos de menor a mayor para mostrarlos en la tabla
            let objetosOrdenados = validos.slice();
            objetosOrdenados.sort(function (a, b) {
                return Number(a[propiedad]) - Number(b[propiedad]);
            });

            let html = '';
            html += '<p><strong>Datos ordenados de menor a mayor (propiedad: ' + propiedad + ')</strong></p>';
            html += '<table class="tabla-interactiva">';
            html += '<tr>';
            html += '<th>#</th>';
            html += '<th>' + (nombrePropMostrar ? nombrePropMostrar : 'Item') + '</th>';
            html += '<th>Valor</th>';
            html += '<th>¿Centro?</th>';
            html += '</tr>';

            for (let k = 0; k < objetosOrdenados.length; k++) {

                // Determinar si esta fila es el valor central
                let esCentro = '';

                if (!resultado.esPar && k === resultado.centro) {
                    esCentro = '⬅ centro';
                }
                if (resultado.esPar && (k === resultado.centro - 1 || k === resultado.centro)) {
                    esCentro = '⬅ centro';
                }

                let etiqueta = (nombrePropMostrar && objetosOrdenados[k][nombrePropMostrar] !== undefined)
                    ? objetosOrdenados[k][nombrePropMostrar]
                    : ('#' + (k + 1));

                let valor = Number(objetosOrdenados[k][propiedad]);

                html += '<tr>';
                html += '<td>' + (k + 1) + '</td>';
                html += '<td>' + etiqueta + '</td>';
                html += '<td>' + valor + '</td>';
                html += '<td>' + esCentro + '</td>';
                html += '</tr>';
            }

            html += '</table>';

            // Detalle del cálculo
            html += '<div class="detalle-calculo">';
            html += 'Total de datos: ' + resultado.ordenados.length + '<br>';
            html += 'Cantidad de datos: ' + (resultado.esPar ? 'par' : 'impar') + '<br>';

            if (resultado.esPar) {
                html += 'Valores centrales: <strong>'
                    + resultado.ordenados[resultado.centro - 1]
                    + '</strong> y <strong>'
                    + resultado.ordenados[resultado.centro]
                    + '</strong><br>';
                html += 'Fórmula: ('
                    + resultado.ordenados[resultado.centro - 1]
                    + ' + '
                    + resultado.ordenados[resultado.centro]
                    + ') / 2';
            } else {
                html += 'Posición central: ' + (resultado.centro + 1) + '<br>';
                html += 'Valor en esa posición: <strong>' + resultado.mediana + '</strong>';
            }

            html += '</div>';

            // Caja de resultado final
            html += '<div class="caja-resultado">';
            html += '📗 Mediana: <strong>' + resultado.mediana.toFixed(2) + '</strong>';
            html += '</div>';

            cont.innerHTML = html;
        }
    }

    return resultado;
}


/**
 * dibujarGraficoMediana:
 * - arregloObjetos     : array de objetos
 * - propiedad          : nombre de la propiedad numérica (string)
 * - nombrePropMostrar  : nombre de la propiedad para etiquetas (string, opcional)
 * - canvasId           : id del canvas donde dibujar (string)
 * - titulo             : texto del título del gráfico (string, opcional)
 *
 * Dibuja un gráfico de barras HORIZONTALES ordenado de menor a mayor
 * con una línea vertical (línea de referencia) en el valor de la mediana.
 *
 * Devuelve la instancia del gráfico creada por Chart.js
 */
function dibujarGraficoMediana(arregloObjetos, propiedad, nombrePropMostrar, canvasId, titulo) {

    // --- PASO 1: filtrar objetos válidos y ordenar de menor a mayor ---
    let objetosValidos = [];
    for (let i = 0; i < arregloObjetos.length; i++) {
        let val = Number(arregloObjetos[i][propiedad]);
        if (!isNaN(val)) {
            objetosValidos.push(arregloObjetos[i]);
        }
    }

    objetosValidos.sort(function (a, b) {
        return Number(a[propiedad]) - Number(b[propiedad]);
    });

    // --- PASO 2: extraer etiquetas y valores ---
    let etiquetas = [];
    let valores = [];

    for (let i = 0; i < objetosValidos.length; i++) {
        let etiqueta = (nombrePropMostrar && objetosValidos[i][nombrePropMostrar] !== undefined)
            ? objetosValidos[i][nombrePropMostrar]
            : ('Item ' + (i + 1));
        etiquetas.push(etiqueta);
        valores.push(Number(objetosValidos[i][propiedad]));
    }

    // --- PASO 3: calcular la mediana ---
    let numeros = [];
    for (let i = 0; i < objetosValidos.length; i++) {
        numeros.push(Number(objetosValidos[i][propiedad]));
    }
    let resultado = calcularMedianaDesdeArregloNumeros(numeros);

    // --- PASO 4: crear array de colores ---
    // Las barras del centro se pintan de rojo, el resto de verde
    let colores = [];
    for (let i = 0; i < objetosValidos.length; i++) {

        let esCentro = false;

        if (!resultado.esPar && i === resultado.centro) {
            esCentro = true;
        }
        if (resultado.esPar && (i === resultado.centro - 1 || i === resultado.centro)) {
            esCentro = true;
        }

        if (esCentro) {
            colores.push('rgba(239, 68, 68, 0.8)');    // rojo = centro
        } else {
            colores.push('rgba(34, 197, 94, 0.6)');    // verde = resto
        }
    }

    // --- PASO 5: crear array de la línea de mediana (mismo valor para todos) ---
    let lineaMediana = [];
    for (let i = 0; i < valores.length; i++) {
        lineaMediana.push(resultado.mediana);
    }

    // --- PASO 6: obtener el canvas ---
    let canvas = document.getElementById(canvasId);
    if (!canvas) {
        return null;
    }
    let ctx = canvas.getContext('2d');

    // --- PASO 7: crear y devolver el gráfico ---
    let grafico = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: etiquetas,
            datasets: [
                {
                    label: 'Valor (' + propiedad + ')',
                    data: valores,
                    backgroundColor: colores,
                    borderColor: colores,
                    borderWidth: 1
                },
                {
                    label: 'Mediana (' + resultado.mediana.toFixed(2) + ')',
                    data: lineaMediana,
                    type: 'line',
                    borderColor: 'rgba(239, 68, 68, 1)',
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: false
                }
            ]
        },
        options: {
            indexAxis: 'y',         // barras horizontales
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                title: {
                    display: true,
                    text: (titulo ? titulo : 'Gráfico de mediana')
                },
                tooltip: {
                    enabled: true,
                    displayColors: false,
                    callbacks: {
                        title: function () { return ''; },
                        label: function (context) {
                            let nombre = context.label || '';
                            let valor = (context.parsed && context.parsed.x !== undefined)
                                ? context.parsed.x
                                : context.parsed;
                            return nombre + ': ' + Number(valor).toFixed(2);
                        }
                    }
                }
            },
            scales: {
                x: { beginAtZero: true }
            }
        }
    });

    return grafico;
}