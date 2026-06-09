// media.js

/**
 * Función original que ya tienes.
 * Calcula la media a partir de un arreglo de objetos y el nombre de la propiedad numérica.
 */
function calcularMediaDesdeArreglo(arregloObjetos, propiedad) {

    let suma = 0;
    let media = 0;

    if (arregloObjetos.length === 0) {
        return 0;
    }

    for (let i = 0; i < arregloObjetos.length; i++) {
        suma = suma + arregloObjetos[i][propiedad];
    }

    media = suma / arregloObjetos.length;

    return parseFloat(media.toFixed(2));
}

/**
 * calcularMedia:
 * - arregloObjetos: array de objetos
 * - propiedad: nombre de la propiedad numérica (string)
 * - idContenedor: id del elemento donde insertar la tabla (opcional). Si null => no escribe HTML.
 * - nombrePropMostrar: nombre de la propiedad a mostrar como etiqueta (opcional). Si no se pasa, se usa "Item #".
 *
 * Devuelve: { suma: number, cantidad: number, media: number }
 */
function calcularMedia(arregloObjetos, propiedad, idContenedor, nombrePropMostrar) {
    // crear arreglo con objetos válidos (tienen propiedad numérica)
    let validos = [];
    for (let i = 0; i < arregloObjetos.length; i++) {
        let val = Number(arregloObjetos[i][propiedad]);
        if (!isNaN(val)) {
            // guardamos el objeto original (con la propiedad válida)
            validos.push(arregloObjetos[i]);
        }
    }

    // usar la función existente para calcular la media sobre los válidos
    let media = 0;
    if (validos.length > 0) {
        media = calcularMediaDesdeArreglo(validos, propiedad);
    } else {
        media = 0;
    }

    // calcular suma y cantidad (suma usando los válidos)
    let suma = 0;
    for (let j = 0; j < validos.length; j++) {
        suma = suma + Number(validos[j][propiedad]);
    }
    let cantidad = validos.length;

    // si se proporcionó idContenedor, generar una tabla simple allí
    if (typeof idContenedor === 'string' && idContenedor.length > 0) {
        let cont = document.getElementById(idContenedor);
        if (cont) {
            let html = '';
            html += '<p><strong>Datos y cálculo de la media (propiedad: ' + propiedad + ')</strong></p>';
            html += '<table class="tabla-interactiva">';
            html += '<tr><th>#</th><th>' + (nombrePropMostrar ? nombrePropMostrar : 'Item') + '</th><th>Valor</th></tr>';

            for (let k = 0; k < validos.length; k++) {
                let etiqueta = nombrePropMostrar && validos[k][nombrePropMostrar] !== undefined
                    ? validos[k][nombrePropMostrar]
                    : ('#' + (k + 1));
                let valor = Number(validos[k][propiedad]);
                html += '<tr>';
                html += '<td>' + (k + 1) + '</td>';
                html += '<td>' + etiqueta + '</td>';
                html += '<td>' + valor + '</td>';
                html += '</tr>';
            }

            html += '</table>';
            html += '<div class="detalle-calculo">';
            html += 'Suma total: ' + suma + '<br>';
            html += 'Número de datos: ' + cantidad + '<br>';
            html += 'Media = ' + (cantidad > 0 ? (suma + ' / ' + cantidad) : '0');
            html += '</div>';
            html += '<div class="caja-resultado">';
            html += '📘 Media aritmética: <strong>' + media.toFixed(2) + '</strong>';
            html += '</div>';

            cont.innerHTML = html;
        }
    }

    return {
        suma: suma,
        cantidad: cantidad,
        media: Number(media)
    };
}

/**
 * dibujarGraficoMedia:
 * - arregloObjetos: array de objetos
 * - propiedad: nombre de la propiedad numérica (string)
 * - nombrePropMostrar: nombre de la propiedad para usar como etiqueta (string, opcional, por ejemplo 'nombre' o 'App')
 * - canvasId: id del canvas donde dibujar (string)
 * - titulo: texto para el título del gráfico (string, opcional)
 *
 * Devuelve la instancia del gráfico creada por Chart.js
 */
function dibujarGraficoMedia(arregloObjetos, propiedad, nombrePropMostrar, canvasId, titulo) {
    // preparar arrays de etiquetas y valores (solo entradas con valor numérico)
    let etiquetas = [];
    let valores = [];

    for (let i = 0; i < arregloObjetos.length; i++) {
        let val = Number(arregloObjetos[i][propiedad]);
        if (!isNaN(val)) {
            let etiqueta = (nombrePropMostrar && arregloObjetos[i][nombrePropMostrar] !== undefined)
                ? arregloObjetos[i][nombrePropMostrar]
                : ('Item ' + (etiquetas.length + 1));
            etiquetas.push(etiqueta);
            valores.push(val);
        }
    }

    // calcular media general usando la función anterior (pasamos arreglo filtrado)
    // construir arreglo de objetos válidos para pasar a calcularMediaDesdeArreglo
    let objetosValidos = [];
    for (let j = 0; j < arregloObjetos.length; j++) {
        let v = Number(arregloObjetos[j][propiedad]);
        if (!isNaN(v)) {
            objetosValidos.push(arregloObjetos[j]);
        }
    }
    let mediaGeneral = 0;
    if (objetosValidos.length > 0) {
        mediaGeneral = calcularMediaDesdeArreglo(objetosValidos, propiedad);
    } else {
        mediaGeneral = 0;
    }

    // preparar colores simples (se repiten si hay muchas barras)
    let colores = [
        'rgba(54, 162, 235, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 159, 64, 0.6)',
        'rgba(255, 99, 132, 0.6)'
    ];
    let background = [];
    for (let c = 0; c < etiquetas.length; c++) {
        background.push(colores[c % colores.length]);
    }

    // obtener contexto del canvas
    let canvas = document.getElementById(canvasId);
    if (!canvas) {
        // si no hay canvas, no dibuja; retornamos null para que el llamador lo sepa
        return null;
    }
    let ctx = canvas.getContext('2d');

    // crear el gráfico
    let grafico = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: etiquetas,
            datasets: [
                {
                    label: 'Valor (' + propiedad + ')',
                    data: valores,
                    backgroundColor: background,
                    borderColor: background,
                    borderWidth: 1
                },
                {
                    label: 'Media (' + mediaGeneral.toFixed(2) + ')',
                    data: (function() {
                        // crear array con el mismo largo que valores y con el valor mediaGeneral
                        let arr = [];
                        for (let z = 0; z < valores.length; z++) {
                            arr.push(mediaGeneral);
                        }
                        return arr;
                    })(),
                    type: 'line',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                title: {
                    display: true,
                    text: (titulo ? titulo : 'Gráfico de barras y línea de media')
                },
                tooltip: {
                    enabled: true,
                    displayColors: false,
                    callbacks: {
                        title: function() { return ''; },
                        label: function(context) {
                            let nombre = context.label || '';
                            let valor = (context.parsed && context.parsed.y !== undefined) ? context.parsed.y : context.parsed;
                            return nombre + ' ' + Number(valor).toFixed(2);
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