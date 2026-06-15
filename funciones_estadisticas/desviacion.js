// ============================================================
// FUNCIONES ESTADISTICAS - DESVIACION ESTANDAR
// ============================================================

/**
 * Funcion: calcularDesviacionDesdeArreglo
 * Calcula la desviación estándar poblacional a partir de un arreglo numérico.
 * Reutiliza la varianza y aplica la raíz cuadrada.
 */
function calcularDesviacionDesdeArreglo(listaNumeros) {

    let resultadoVarianza = calcularVarianzaDesdeArreglo(listaNumeros);

    let desviacion = Math.sqrt(resultadoVarianza.varianza);

    return {
        media: resultadoVarianza.media,
        sumaCuadrados: resultadoVarianza.sumaCuadrados,
        cantidad: resultadoVarianza.cantidad,
        varianza: resultadoVarianza.varianza,
        desviacion: desviacion,
        detalles: resultadoVarianza.detalles
    };
}


/**
 * Funcion: calcularDesviacion
 * Calcula la desviación estándar desde un arreglo de objetos.
 * También puede imprimir una tabla si recibe idContenedor.
 */
function calcularDesviacion(arregloObjetos, propiedad, idContenedor, nombrePropMostrar) {

    let listaNumeros = [];
    let listaObjetosValidos = [];

    for (let i = 0; i < arregloObjetos.length; i++) {

        let valor = Number(arregloObjetos[i][propiedad]);

        if (!isNaN(valor)) {
            listaNumeros.push(valor);
            listaObjetosValidos.push(arregloObjetos[i]);
        }
    }

    let resultado = calcularDesviacionDesdeArreglo(listaNumeros);

    if (idContenedor) {

        let contenidoHTML = '';

        contenidoHTML += '<p><strong>Cálculo de desviación estándar:</strong></p>';

        contenidoHTML += '<table class="tabla-interactiva">';
        contenidoHTML += '<tr>';
        contenidoHTML += '<th>#</th>';

        if (nombrePropMostrar) {
            contenidoHTML += '<th>' + nombrePropMostrar + '</th>';
        }

        contenidoHTML += '<th>Valor</th>';
        contenidoHTML += '<th>Diferencia con la media</th>';
        contenidoHTML += '<th>Diferencia al cuadrado</th>';
        contenidoHTML += '</tr>';

        for (let i = 0; i < resultado.detalles.length; i++) {

            contenidoHTML += '<tr>';
            contenidoHTML += '<td>' + (i + 1) + '</td>';

            if (nombrePropMostrar) {
                contenidoHTML += '<td>' + listaObjetosValidos[i][nombrePropMostrar] + '</td>';
            }

            contenidoHTML += '<td>' + resultado.detalles[i].valor.toFixed(2) + '</td>';
            contenidoHTML += '<td>' + resultado.detalles[i].diferencia.toFixed(2) + '</td>';
            contenidoHTML += '<td>' + resultado.detalles[i].cuadrado.toFixed(2) + '</td>';
            contenidoHTML += '</tr>';
        }

        contenidoHTML += '</table>';

        contenidoHTML += '<div class="detalle-calculo">';
        contenidoHTML += 'Media: <strong>' + resultado.media.toFixed(2) + '</strong><br>';
        contenidoHTML += 'Suma de diferencias al cuadrado: <strong>' + resultado.sumaCuadrados.toFixed(2) + '</strong><br>';
        contenidoHTML += 'Cantidad de datos: <strong>' + resultado.cantidad + '</strong><br>';
        contenidoHTML += 'Varianza: <strong>' + resultado.varianza.toFixed(2) + '</strong><br>';
        contenidoHTML += 'Fórmula: Desviación Estándar = √Varianza<br>';
        contenidoHTML += 'Desviación Estándar = √' + resultado.varianza.toFixed(2);
        contenidoHTML += '</div>';

        contenidoHTML += '<div class="caja-resultado">';
        contenidoHTML += '📔 La desviación estándar es: <strong>' + resultado.desviacion.toFixed(2) + '</strong>';
        contenidoHTML += '</div>';

        document.getElementById(idContenedor).innerHTML = contenidoHTML;
    }

    return resultado;
}


/**
 * Funcion: dibujarGraficoDesviacion
 * Dibuja un gráfico con barras, línea de media y límites de desviación.
 */
function dibujarGraficoDesviacion(arregloObjetos, propiedad, canvasId, titulo, nombrePropMostrar) {

    let listaNumeros = [];
    let etiquetas = [];

    for (let i = 0; i < arregloObjetos.length; i++) {

        let valor = Number(arregloObjetos[i][propiedad]);

        if (!isNaN(valor)) {
            listaNumeros.push(valor);

            if (nombrePropMostrar) {
                etiquetas.push(arregloObjetos[i][nombrePropMostrar]);
            } else {
                etiquetas.push(i + 1);
            }
        }
    }

    let resultado = calcularDesviacionDesdeArreglo(listaNumeros);

    let limiteSuperior = resultado.media + resultado.desviacion;
    let limiteInferior = resultado.media - resultado.desviacion;

    let contextoGrafico = document.getElementById(canvasId).getContext('2d');

    return new Chart(contextoGrafico, {
        type: 'bar',
        data: {
            labels: etiquetas,
            datasets: [
                {
                    label: propiedad,
                    data: listaNumeros,
                    backgroundColor: 'rgba(99, 144, 241, 0.6)',
                    borderColor: 'rgba(99, 144, 241, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Media (' + resultado.media.toFixed(2) + ')',
                    data: new Array(listaNumeros.length).fill(resultado.media),
                    type: 'line',
                    borderColor: 'rgba(239, 68, 68, 1)',
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: false
                },
                {
                    label: 'Media + Desviación (' + limiteSuperior.toFixed(2) + ')',
                    data: new Array(listaNumeros.length).fill(limiteSuperior),
                    type: 'line',
                    borderColor: 'rgba(34, 197, 94, 1)',
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: false
                },
                {
                    label: 'Media - Desviación (' + limiteInferior.toFixed(2) + ')',
                    data: new Array(listaNumeros.length).fill(limiteInferior),
                    type: 'line',
                    borderColor: 'rgba(251, 191, 36, 1)',
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top'
                },
                title: {
                    display: true,
                    text: titulo + ' — Desviación estándar: ' + resultado.desviacion.toFixed(2)
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}