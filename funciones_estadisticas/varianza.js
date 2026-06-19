// ============================================================
// FUNCIONES ESTADISTICAS - VARIANZA
// ============================================================

/**
 * Funcion: calcularVarianzaDesdeArreglo
 * Calcula la varianza poblacional a partir de un arreglo de números.
 */
function calcularVarianzaDesdeArreglo(listaNumeros) {

    let sumaValores = 0;

    for (let i = 0; i < listaNumeros.length; i++) {
        sumaValores = sumaValores + listaNumeros[i];
    }

    let media = sumaValores / listaNumeros.length;

    let sumaCuadradosDiferencias = 0;
    let detalles = [];

    for (let i = 0; i < listaNumeros.length; i++) {

        let valor = listaNumeros[i];
        let diferencia = valor - media;
        let cuadrado = diferencia * diferencia;

        sumaCuadradosDiferencias = sumaCuadradosDiferencias + cuadrado;

        detalles.push({
            valor: valor,
            diferencia: diferencia,
            cuadrado: cuadrado
        });
    }

    let varianza = sumaCuadradosDiferencias / listaNumeros.length;

    return {
        media: media,
        sumaCuadrados: sumaCuadradosDiferencias,
        cantidad: listaNumeros.length,
        varianza: varianza,
        detalles: detalles
    };
}


/**
 * Funcion: calcularVarianza
 * Calcula la varianza desde un arreglo de objetos.
 * También puede imprimir una tabla en pantalla si recibe idContenedor.
 */
function calcularVarianza(arregloObjetos, propiedad, idContenedor, nombrePropMostrar) {

    let listaNumeros = [];
    let listaObjetosValidos = [];

    for (let i = 0; i < arregloObjetos.length; i++) {

        let valor = Number(arregloObjetos[i][propiedad]);

        if (!isNaN(valor)) {
            listaNumeros.push(valor);
            listaObjetosValidos.push(arregloObjetos[i]);
        }
    }

    let resultado = calcularVarianzaDesdeArreglo(listaNumeros);

    if (idContenedor) {

        let contenidoHTML = '';

        contenidoHTML += '<p><strong>Cálculo de varianza:</strong></p>';

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
        contenidoHTML += 'Fórmula: Varianza = Suma de cuadrados / Cantidad de datos<br>';
        contenidoHTML += 'Varianza = ' + resultado.sumaCuadrados.toFixed(2) + ' / ' + resultado.cantidad;
        contenidoHTML += '</div>';

        contenidoHTML += '<div class="caja-resultado">';
        contenidoHTML += '📓 La varianza es: <strong>' + resultado.varianza.toFixed(2) + '</strong>';
        contenidoHTML += '</div>';

        document.getElementById(idContenedor).innerHTML = contenidoHTML;
    }

    return resultado;
}


/**
 * Funcion: dibujarGraficoVarianza
 * Dibuja un gráfico de barras con línea de media.
 */
function dibujarGraficoVarianza(arregloObjetos, propiedad, canvasId, titulo, nombrePropMostrar, tipoGraficoOpcional) {

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

    let resultado = calcularVarianzaDesdeArreglo(listaNumeros);

    let contextoGrafico = document.getElementById(canvasId).getContext('2d');

    return new Chart(contextoGrafico, {
        type: tipoGraficoOpcional || 'bar',
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
                    text: titulo + ' — Varianza: ' + resultado.varianza.toFixed(2)
                }
            },
            scales: {
                x: {
                    ticks: {
                        display: false // Evitar amontonamiento de 200 etiquetas
                    }
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}