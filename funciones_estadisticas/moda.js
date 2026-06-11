// moda.js

/**
 * Función base: calcularModaDesdeArregloNumeros
 * Recibe un arreglo de NÚMEROS ya extraídos
 * y devuelve el objeto con el resultado de la moda.
 *
 * Devuelve: { conteos, modas, maxConteo }
 */
function calcularModaDesdeArregloNumeros(arregloNumeros) {

    let conteos = [];

    for (let i = 0; i < arregloNumeros.length; i++) {
        let encontrado = false;

        for (let j = 0; j < conteos.length; j++) {
            if (conteos[j].valor === arregloNumeros[i]) {
                conteos[j].conteo = conteos[j].conteo + 1;
                encontrado = true;
            }
        }

        if (encontrado === false) {
            conteos.push({ valor: arregloNumeros[i], conteo: 1 });
        }
    }

    // Ordenamos por valor para que el gráfico quede ordenado
    conteos.sort(function (a, b) {
        return a.valor - b.valor;
    });

    // Encontramos el máximo conteo
    let maxConteo = 0;
    for (let k = 0; k < conteos.length; k++) {
        if (conteos[k].conteo > maxConteo) {
            maxConteo = conteos[k].conteo;
        }
    }

    // Recopilamos todos los valores con el máximo conteo (puede haber más de una moda)
    let modas = [];
    for (let k = 0; k < conteos.length; k++) {
        if (conteos[k].conteo === maxConteo) {
            modas.push(conteos[k].valor);
        }
    }

    return {
        conteos: conteos,
        modas: modas,
        maxConteo: maxConteo
    };
}


/**
 * calcularModa:
 * - arregloObjetos     : array de objetos
 * - propiedad          : nombre de la propiedad numérica (string)
 * - idContenedor       : id del elemento donde insertar la tabla (opcional).
 *                        Si null => no escribe HTML.
 * - nombrePropMostrar  : nombre de la propiedad a mostrar como etiqueta (opcional).
 *
 * Devuelve: { conteos, modas, maxConteo }
 */
function calcularModa(arregloObjetos, propiedad, idContenedor, nombrePropMostrar) {

    // --- PASO 1: filtrar solo los objetos con valor numérico válido ---
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

    // --- PASO 3: calcular la moda usando la función base ---
    let resultado = calcularModaDesdeArregloNumeros(numeros);

    // --- PASO 4: si se pidió tabla, generarla en el contenedor ---
    if (typeof idContenedor === 'string' && idContenedor.length > 0) {

        let cont = document.getElementById(idContenedor);

        if (cont) {

            let html = '';
            html += '<p><strong>Frecuencia de cada valor (propiedad: ' + propiedad + ')</strong></p>';
            html += '<table class="tabla-interactiva">';
            html += '<tr>';
            html += '<th>Valor</th>';
            html += '<th>Veces que aparece</th>';
            html += '<th>¿Es la moda?</th>';
            html += '</tr>';

            for (let i = 0; i < resultado.conteos.length; i++) {
                let esModa = resultado.conteos[i].conteo === resultado.maxConteo ? '⬅ moda' : '';

                html += '<tr>';
                html += '<td>' + resultado.conteos[i].valor + '</td>';
                html += '<td>' + resultado.conteos[i].conteo + '</td>';
                html += '<td>' + esModa + '</td>';
                html += '</tr>';
            }

            html += '</table>';

            // Detalle del cálculo
            html += '<div class="detalle-calculo">';
            html += 'Total de datos: ' + numeros.length + '<br>';
            html += 'Valor(es) que más se repite(n): <strong>' + resultado.modas.join(', ') + '</strong><br>';
            html += 'Número de veces: ' + resultado.maxConteo;
            html += '</div>';

            // Caja de resultado final
            html += '<div class="caja-resultado">';
            if (resultado.modas.length === 1) {
                html += '📙 Moda: <strong>' + resultado.modas[0] + '</strong>';
            } else {
                html += '📙 Modas: <strong>' + resultado.modas.join(', ') + '</strong> (conjunto multimodal)';
            }
            html += '</div>';

            cont.innerHTML = html;
        }
    }

    return resultado;
}


/**
 * dibujarGraficoModa:
 * - arregloObjetos     : array de objetos
 * - propiedad          : nombre de la propiedad numérica (string)
 * - canvasId           : id del canvas donde dibujar (string)
 * - titulo             : texto del título del gráfico (string, opcional)
 *
 * Dibuja un gráfico de barras de FRECUENCIAS.
 * La(s) barra(s) de la moda se pintan de azul, el resto de rojo.
 *
 * Devuelve la instancia del gráfico creada por Chart.js
 */
function dibujarGraficoModa(arregloObjetos, propiedad, canvasId, titulo) {

    // --- PASO 1: filtrar objetos válidos ---
    let validos = [];
    for (let i = 0; i < arregloObjetos.length; i++) {
        let val = Number(arregloObjetos[i][propiedad]);
        if (!isNaN(val)) {
            validos.push(arregloObjetos[i]);
        }
    }

    // --- PASO 2: extraer números y calcular moda ---
    let numeros = [];
    for (let i = 0; i < validos.length; i++) {
        numeros.push(Number(validos[i][propiedad]));
    }

    let resultado = calcularModaDesdeArregloNumeros(numeros);

    // --- PASO 3: preparar etiquetas, frecuencias y colores ---
    let etiquetas = [];
    let frecuencias = [];
    let colores = [];

    for (let i = 0; i < resultado.conteos.length; i++) {
        etiquetas.push('Valor ' + resultado.conteos[i].valor);
        frecuencias.push(resultado.conteos[i].conteo);

        if (resultado.conteos[i].conteo === resultado.maxConteo) {
            colores.push('rgba(22, 151, 249, 0.8)');   // azul = moda
        } else {
            colores.push('rgba(247, 85, 85, 0.52)');   // rojo = resto
        }
    }

    // --- PASO 4: obtener el canvas ---
    let canvas = document.getElementById(canvasId);
    if (!canvas) {
        return null;
    }
    let ctx = canvas.getContext('2d');

    // --- PASO 5: crear y devolver el gráfico ---
    let grafico = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: etiquetas,
            datasets: [
                {
                    label: 'Frecuencia (veces que aparece)',
                    data: frecuencias,
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
                    text: (titulo ? titulo : 'Gráfico de moda')
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
                            return etiqueta + ': ' + valor + ' veces';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 }
                }
            }
        }
    });

    return grafico;
}