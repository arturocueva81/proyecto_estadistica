/**
 * Funcion: mostrarSeccion
 * */
function mostrarSeccion(idSeccion) {

    let secciones = document.getElementsByTagName('section');
    for (let i = 0; i < secciones.length; i++) {
        secciones[i].classList.add('oculto');
    }

    let seccionMostrar = document.getElementById(idSeccion);
    seccionMostrar.classList.remove('oculto');  // solo quita 'oculto', conserva 'dos-columnas'
}

// ============================================================
// BLOQUE 2: CARGA DE DATOS DESDE datos.js
// ============================================================

/**
 * Funcion: cargarDatos
 * Lee la variable global datosEstudiantes declarada en datos.js
 * y devuelve el arreglo de estudiantes
 */
function cargarDatos() {
    return DATOSESTUDIANTES.estudiantes;
}


// ============================================================
// BLOQUE 3: FUNCIONES DE EXTRACCION
// ============================================================

/**
 * Funcion: obtenerCalificaciones
 * Recibe el arreglo de estudiantes y devuelve
 * solo un arreglo de numeros con las calificaciones
 */
function obtenerCalificaciones(estudiantes) {
    let calificaciones = [];

    for (let i = 0; i < estudiantes.length; i++) {
        calificaciones.push(estudiantes[i].calificacion);
    }

    return calificaciones;
}


// ============================================================
// BLOQUE 4: FUNCIONES ESTADISTICAS
// ============================================================


// --- MEDIA ---
// El cálculo puro lo hace media.js → calcularMediaDesdeArreglo(arregloObjetos, propiedad)

function obtenerResultadoMedia(estudiantes) {
    // Si la función calcularMedia (de media.js) está disponible, úsala
    if (typeof calcularMedia === 'function') {
        // pasar null como idContenedor para que no escriba HTML aquí
        return calcularMedia(estudiantes, 'calificacion', null, null);
    }

    // Si no existe calcularMedia, usar el antiguo cálculo simple (fallback)
    let media = calcularMediaDesdeArreglo(estudiantes, 'calificacion');
    let suma = 0;
    for (let i = 0; i < estudiantes.length; i++) {
        suma = suma + estudiantes[i].calificacion;
    }
    return {
        suma: suma,
        cantidad: estudiantes.length,
        media: media
    };
}

// ============================================================
// MEDIA: toggle del ejemplo interactivo
// ============================================================

let graficoMediaInstancia = null; // evita crear el grafico dos veces

function toggleEjemploMedia() {
    let contenedor = document.getElementById('resultado-media');
    let btn = document.getElementById('btn-ejemplo-media');

    if (!contenedor || !btn) return;

    if (contenedor.classList.contains('oculto')) {
        // Si está oculto: calcular y mostrar usando media.js
        let estudiantes = cargarDatos();

        if (typeof calcularMedia === 'function') {
            // calcularMedia rellenará la tabla en el elemento 'resultado-media'
            calcularMedia(estudiantes, 'calificacion', 'resultado-media', 'nombre');
        } else {
            // fallback sencillo: generar tabla aquí (igual que antes)
            let resultado = obtenerResultadoMedia(estudiantes);

            let html = '';
            html += '<p><strong>Datos cargados desde datos.js:</strong></p>';
            html += '<table class="tabla-interactiva">';
            html += '<tr><th>#</th><th>Estudiante</th><th>Calificación</th></tr>';

            for (let i = 0; i < estudiantes.length; i++) {
                html += '<tr>';
                html += '<td>' + (i + 1) + '</td>';
                html += '<td>' + estudiantes[i].nombre + '</td>';
                html += '<td>' + estudiantes[i].calificacion + '</td>';
                html += '</tr>';
            }

            html += '</table>';
            html += '<div class="detalle-calculo">';
            html += 'Suma total: ' + resultado.suma + '<br>';
            html += 'Número de datos: ' + resultado.cantidad + '<br>';
            html += 'Fórmula: Media = Suma / Cantidad<br>';
            html += 'Media = ' + resultado.suma + ' / ' + resultado.cantidad;
            html += '</div>';
            html += '<div class="caja-resultado">';
            html += '📘 La media aritmética es: <strong>' + resultado.media.toFixed(2) + '</strong>';
            html += '</div>';

            contenedor.innerHTML = html;
        }

        contenedor.classList.remove('oculto');
        btn.textContent = '✖ Ocultar Ejemplo';
    } else {
        // Si está visible: ocultar
        contenedor.classList.add('oculto');
        btn.textContent = '▶ Calcular Media';
    }
}


// ============================================================
// MEDIA: toggle del gráfico
// ============================================================

function toggleGraficoMedia() {
    let contenedor = document.getElementById('contenedor-grafico-media');
    let btn = document.getElementById('btn-grafico-media');

    if (!contenedor || !btn) return;

    if (contenedor.classList.contains('oculto')) {
        contenedor.classList.remove('oculto');
        btn.textContent = '✖ Ocultar Gráfico';

        // Solo dibuja el grafico si no existe todavía
        if (graficoMediaInstancia === null) {
            let estudiantes = cargarDatos();

            if (typeof dibujarGraficoMedia === 'function') {
                // Llamamos a la función de media.js que dibuja el gráfico
                graficoMediaInstancia = dibujarGraficoMedia(
                    estudiantes,
                    'calificacion',
                    'nombre',
                    'graficaMedia',
                    'Calificaciones de estudiantes con línea de media'
                );
            } else {
                // Fallback: dibujar aquí el gráfico simple (manteniendo compatibilidad)
                // Reemplazamos el canvas por uno nuevo para evitar errores
                let canvasViejo = document.getElementById('graficaMedia');
                let canvasNuevo = document.createElement('canvas');
                canvasNuevo.id = 'graficaMedia';
                canvasViejo.parentNode.replaceChild(canvasNuevo, canvasViejo);

                // Crear el gráfico localmente (copia de la lógica anterior)
                let resultado = obtenerResultadoMedia(estudiantes);
                let calificaciones = obtenerCalificaciones(estudiantes);
                let nombres = [];
                for (let i = 0; i < estudiantes.length; i++) {
                    nombres.push(estudiantes[i].nombre);
                }
                let ctx = document.getElementById('graficaMedia').getContext('2d');
                graficoMediaInstancia = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: nombres,
                        datasets: [{
                            label: 'Calificación',
                            data: calificaciones,
                            backgroundColor: 'rgba(54, 162, 235, 0.6)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        }, {
                            label: 'Media (' + resultado.media.toFixed(2) + ')',
                            data: new Array(calificaciones.length).fill(resultado.media),
                            type: 'line',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 2,
                            pointRadius: 0,
                            fill: false
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: { position: 'top' },
                            title: {
                                display: true,
                                text: 'Calificaciones de estudiantes con línea de media'
                            }
                        },
                        scales: {
                            y: { beginAtZero: true, max: 20 }
                        }
                    }
                });
            }
        }
    } else {
        contenedor.classList.add('oculto');
        btn.textContent = '📊 Ver Gráfico de Barras';

        // Mantener limpieza: destruir el gráfico si existe
        if (graficoMediaInstancia) {
            try {
                graficoMediaInstancia.destroy();
            } catch (e) {
                // ignorar errores al destruir
            }
            graficoMediaInstancia = null;
        }
    }
}

// ============================================================
// BLOQUE 5: FUNCIONES ESTADISTICAS - MEDIANA
// ============================================================

let graficoMedianaInstancia = null;

// --- Toggle del ejemplo interactivo ---
function toggleEjemploMediana() {
    let contenedor = document.getElementById('resultado-mediana');
    let btn = document.getElementById('btn-ejemplo-mediana');

    if (contenedor.classList.contains('oculto')) {
        // calcularMediana (de mediana.js) escribe la tabla directamente en 'resultado-mediana'
        calcularMediana(cargarDatos(), 'calificacion', 'resultado-mediana', 'nombre');
        contenedor.classList.remove('oculto');
        btn.textContent = '✖ Ocultar Ejemplo';
    } else {
        contenedor.classList.add('oculto');
        btn.textContent = '▶ Calcular Mediana';
    }
}

// --- Toggle del gráfico ---
function toggleGraficoMediana() {
    let contenedor = document.getElementById('contenedor-grafico-mediana');
    let btn = document.getElementById('btn-grafico-mediana');

    if (contenedor.classList.contains('oculto')) {
        contenedor.classList.remove('oculto');
        btn.textContent = '✖ Ocultar Gráfico';

        // Reemplaza el canvas para evitar "Canvas already in use"
        let canvasViejo = document.getElementById('graficaMediana');
        let canvasNuevo = document.createElement('canvas');
        canvasNuevo.id = 'graficaMediana';
        canvasViejo.parentNode.replaceChild(canvasNuevo, canvasViejo);

        // dibujarGraficoMediana (de mediana.js) dibuja el gráfico
        graficoMedianaInstancia = dibujarGraficoMediana(
            cargarDatos(),
            'calificacion',
            'nombre',
            'graficaMediana',
            'Calificaciones ordenadas con línea de mediana'
        );
    } else {
        contenedor.classList.add('oculto');
        btn.textContent = '📊 Ver Gráfico de Barras Horizontales';
    }
}

// ============================================================
// BLOQUE 6: FUNCIONES ESTADISTICAS - MODA
// ============================================================

let graficoModaInstancia = null;

// --- Toggle del ejemplo interactivo ---
function toggleEjemploModa() {
    let contenedor = document.getElementById('resultado-moda');
    let btn = document.getElementById('btn-ejemplo-moda');

    if (contenedor.classList.contains('oculto')) {
        calcularModa(cargarDatos(), 'calificacion', 'resultado-moda', 'nombre');
        contenedor.classList.remove('oculto');
        btn.textContent = '✖ Ocultar Ejemplo';
    } else {
        contenedor.classList.add('oculto');
        btn.textContent = '▶ Calcular Moda';
    }
}

// --- Toggle del gráfico ---
function toggleGraficoModa() {
    let contenedor = document.getElementById('contenedor-grafico-moda');
    let btn = document.getElementById('btn-grafico-moda');

    if (contenedor.classList.contains('oculto')) {
        contenedor.classList.remove('oculto');
        btn.textContent = '✖ Ocultar Gráfico';

        if (graficoModaInstancia === null) {
            graficoModaInstancia = dibujarGraficoModa(
                cargarDatos(),
                'calificacion',
                'graficaModa',
                'Frecuencia de calificaciones (barra azul = moda)'
            );
        }
    } else {
        contenedor.classList.add('oculto');
        btn.textContent = '📊 Ver Gráfico de Frecuencias';
    }
}

// ============================================================
// BLOQUE 7: FUNCIONES ESTADISTICAS - MINIMO Y MAXIMO
// ============================================================

let graficoMinMaxInstancia = null;

// --- Toggle del ejemplo interactivo ---
function toggleEjemploMinMax() {
    let contenedor = document.getElementById('resultado-minmax');
    let btn = document.getElementById('btn-ejemplo-minmax');

    if (contenedor.classList.contains('oculto')) {
        calcularMinMax(cargarDatos(), 'calificacion', 'resultado-minmax', 'nombre');
        contenedor.classList.remove('oculto');
        btn.textContent = '✖ Ocultar Ejemplo';
    } else {
        contenedor.classList.add('oculto');
        btn.textContent = '▶ Calcular Mínimo y Máximo';
    }
}

// --- Toggle del gráfico ---
function toggleGraficoMinMax() {
    let contenedor = document.getElementById('contenedor-grafico-minmax');
    let btn = document.getElementById('btn-grafico-minmax');

    if (contenedor.classList.contains('oculto')) {
        contenedor.classList.remove('oculto');
        btn.textContent = '✖ Ocultar Gráfico';

        // Reemplazar canvas para evitar "Canvas already in use"
        let canvasViejo = document.getElementById('graficaMinMax');
        let canvasNuevo = document.createElement('canvas');
        canvasNuevo.id = 'graficaMinMax';
        canvasViejo.parentNode.replaceChild(canvasNuevo, canvasViejo);

        graficoMinMaxInstancia = dibujarGraficoMinMax(
            cargarDatos(),
            'calificacion',
            'nombre',
            'graficaMinMax',
            'Calificaciones — azul: mínimo | rojo: máximo'
        );
    } else {
        contenedor.classList.add('oculto');
        btn.textContent = '📊 Ver Gráfico de Barras';
    }
}

// ============================================================
// BLOQUE 8: FUNCIONES ESTADISTICAS - RANGO
// ============================================================

let graficoRangoInstancia = null;

// --- Toggle del ejemplo interactivo ---
function toggleEjemploRango() {
    let contenedor = document.getElementById('resultado-rango');
    let btn = document.getElementById('btn-ejemplo-rango');

    if (contenedor.classList.contains('oculto')) {
        calcularRango(cargarDatos(), 'calificacion', 'resultado-rango', 'nombre');
        contenedor.classList.remove('oculto');
        btn.textContent = '✖ Ocultar Ejemplo';
    } else {
        contenedor.classList.add('oculto');
        btn.textContent = '▶ Calcular Rango';
    }
}

// --- Toggle del gráfico ---
function toggleGraficoRango() {
    let contenedor = document.getElementById('contenedor-grafico-rango');
    let btn = document.getElementById('btn-grafico-rango');

    if (contenedor.classList.contains('oculto')) {
        contenedor.classList.remove('oculto');
        btn.textContent = '✖ Ocultar Gráfico';

        // Reemplazar canvas para evitar "Canvas already in use"
        let canvasViejo = document.getElementById('graficaRango');
        let canvasNuevo = document.createElement('canvas');
        canvasNuevo.id = 'graficaRango';
        canvasViejo.parentNode.replaceChild(canvasNuevo, canvasViejo);

        graficoRangoInstancia = dibujarGraficoRango(
            cargarDatos(),
            'calificacion',
            'nombre',
            'graficaRango',
            'Rango de calificaciones — rojo: mínimo | verde: máximo'
        );
    } else {
        contenedor.classList.add('oculto');
        btn.textContent = '📊 Ver Gráfico de Rango';
    }
}

// ============================================================
// BLOQUE 9: FUNCIONES ESTADISTICAS - VARIANZA
// ============================================================

let graficoVarianzaInstancia = null;

// --- Calculo puro de la varianza ---
function calcularVarianzaDesdeArreglo(calificaciones) {

    let suma = 0;
    for (let i = 0; i < calificaciones.length; i++) {
        suma = suma + calificaciones[i];
    }
    let media = suma / calificaciones.length;

    let sumaCuadrados = 0;
    let detalles = [];

    for (let i = 0; i < calificaciones.length; i++) {
        let diferencia = calificaciones[i] - media;
        let cuadrado = diferencia * diferencia;

        sumaCuadrados = sumaCuadrados + cuadrado;

        detalles.push({
            calificacion: calificaciones[i],
            diferencia: diferencia,
            cuadrado: cuadrado
        });
    }

    let varianza = sumaCuadrados / calificaciones.length;

    return {
        media: media,
        sumaCuadrados: sumaCuadrados,
        cantidad: calificaciones.length,
        varianza: varianza,
        detalles: detalles
    };
}


// --- Toggle del ejemplo interactivo ---
function toggleEjemploVarianza() {
    let contenedor = document.getElementById('resultado-varianza');
    let btn = document.getElementById('btn-ejemplo-varianza');

    if (contenedor.classList.contains('oculto')) {
        calcularVarianza();
        contenedor.classList.remove('oculto');
        btn.textContent = '✖ Ocultar Ejemplo';
    } else {
        contenedor.classList.add('oculto');
        btn.textContent = '▶ Calcular Varianza';
    }
}


// --- Genera el HTML del ejemplo interactivo ---
function calcularVarianza() {
    let estudiantes = cargarDatos();
    let calificaciones = obtenerCalificaciones(estudiantes);
    let resultado = calcularVarianzaDesdeArreglo(calificaciones);

    let html = "";

    html = html + '<p><strong>Cálculo de varianza usando las calificaciones de los estudiantes:</strong></p>';

    html = html + '<table class="tabla-interactiva">';
    html = html + '<tr>';
    html = html + '<th>#</th>';
    html = html + '<th>Estudiante</th>';
    html = html + '<th>Calificación</th>';
    html = html + '<th>Diferencia con la media</th>';
    html = html + '<th>Diferencia al cuadrado</th>';
    html = html + '</tr>';

    for (let i = 0; i < estudiantes.length; i++) {
        html = html + '<tr>';
        html = html + '<td>' + (i + 1) + '</td>';
        html = html + '<td>' + estudiantes[i].nombre + '</td>';
        html = html + '<td>' + estudiantes[i].calificacion + '</td>';
        html = html + '<td>' + resultado.detalles[i].diferencia.toFixed(2) + '</td>';
        html = html + '<td>' + resultado.detalles[i].cuadrado.toFixed(2) + '</td>';
        html = html + '</tr>';
    }

    html = html + '</table>';

    html = html + '<div class="detalle-calculo">';
    html = html + 'Media: <strong>' + resultado.media.toFixed(2) + '</strong><br>';
    html = html + 'Suma de diferencias al cuadrado: <strong>' + resultado.sumaCuadrados.toFixed(2) + '</strong><br>';
    html = html + 'Cantidad de datos: <strong>' + resultado.cantidad + '</strong><br>';
    html = html + 'Fórmula: Varianza = Suma de cuadrados / Cantidad de datos<br>';
    html = html + 'Varianza = ' + resultado.sumaCuadrados.toFixed(2) + ' / ' + resultado.cantidad;
    html = html + '</div>';

    html = html + '<div class="caja-resultado">';
    html = html + '📊 La varianza es: <strong>' + resultado.varianza.toFixed(2) + '</strong>';
    html = html + '</div>';

    document.getElementById('resultado-varianza').innerHTML = html;
}


// --- Toggle del gráfico ---
function toggleGraficoVarianza() {
    let contenedor = document.getElementById('contenedor-grafico-varianza');
    let btn = document.getElementById('btn-grafico-varianza');

    if (contenedor.classList.contains('oculto')) {
        contenedor.classList.remove('oculto');
        btn.textContent = '✖ Ocultar Gráfico';

        let canvasViejo = document.getElementById('graficaVarianza');
        let canvasNuevo = document.createElement('canvas');
        canvasNuevo.id = 'graficaVarianza';
        canvasViejo.parentNode.replaceChild(canvasNuevo, canvasViejo);

        graficoVarianzaInstancia = dibujarGraficoVarianza();

    } else {
        contenedor.classList.add('oculto');
        btn.textContent = '📊 Ver Gráfico de Varianza';
    }
}


// --- Dibuja el gráfico de varianza ---
function dibujarGraficoVarianza() {
    let estudiantes = cargarDatos();
    let calificaciones = obtenerCalificaciones(estudiantes);
    let resultado = calcularVarianzaDesdeArreglo(calificaciones);

    let nombres = [];

    for (let i = 0; i < estudiantes.length; i++) {
        nombres.push(estudiantes[i].nombre);
    }

    let ctx = document.getElementById('graficaVarianza').getContext('2d');

    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: nombres,
            datasets: [
                {
                    label: 'Calificación',
                    data: calificaciones,
                    backgroundColor: 'rgba(99, 144, 241, 0.6)',
                    borderColor: 'rgba(99, 144, 241, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Media (' + resultado.media.toFixed(2) + ')',
                    data: new Array(calificaciones.length).fill(resultado.media),
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
                legend: { position: 'top' },
                title: {
                    display: true,
                    text: 'Calificaciones comparadas con la media — Varianza: ' + resultado.varianza.toFixed(2)
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 20
                }
            }
        }
    });
}

// ============================================================
// BLOQUE 10: FUNCIONES ESTADISTICAS - DESVIACION ESTANDAR
// ============================================================

let graficoDesviacionInstancia = null;

// --- Calculo puro de la desviacion estandar ---
function calcularDesviacionDesdeArreglo(calificaciones) {

    let resultadoVarianza = calcularVarianzaDesdeArreglo(calificaciones);

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


// --- Toggle del ejemplo interactivo ---
function toggleEjemploDesviacion() {
    let contenedor = document.getElementById('resultado-desviacion');
    let btn = document.getElementById('btn-ejemplo-desviacion');

    if (contenedor.classList.contains('oculto')) {
        calcularDesviacion();
        contenedor.classList.remove('oculto');
        btn.textContent = '✖ Ocultar Ejemplo';
    } else {
        contenedor.classList.add('oculto');
        btn.textContent = '▶ Calcular Desviación Estándar';
    }
}


// --- Genera el HTML del ejemplo interactivo ---
function calcularDesviacion() {
    let estudiantes = cargarDatos();
    let calificaciones = obtenerCalificaciones(estudiantes);
    let resultado = calcularDesviacionDesdeArreglo(calificaciones);

    let html = "";

    html = html + '<p><strong>Cálculo de desviación estándar usando las calificaciones de los estudiantes:</strong></p>';

    html = html + '<table class="tabla-interactiva">';
    html = html + '<tr>';
    html = html + '<th>#</th>';
    html = html + '<th>Estudiante</th>';
    html = html + '<th>Calificación</th>';
    html = html + '<th>Diferencia con la media</th>';
    html = html + '<th>Diferencia al cuadrado</th>';
    html = html + '</tr>';

    for (let i = 0; i < estudiantes.length; i++) {
        html = html + '<tr>';
        html = html + '<td>' + (i + 1) + '</td>';
        html = html + '<td>' + estudiantes[i].nombre + '</td>';
        html = html + '<td>' + estudiantes[i].calificacion + '</td>';
        html = html + '<td>' + resultado.detalles[i].diferencia.toFixed(2) + '</td>';
        html = html + '<td>' + resultado.detalles[i].cuadrado.toFixed(2) + '</td>';
        html = html + '</tr>';
    }

    html = html + '</table>';

    html = html + '<div class="detalle-calculo">';
    html = html + 'Media: <strong>' + resultado.media.toFixed(2) + '</strong><br>';
    html = html + 'Suma de diferencias al cuadrado: <strong>' + resultado.sumaCuadrados.toFixed(2) + '</strong><br>';
    html = html + 'Cantidad de datos: <strong>' + resultado.cantidad + '</strong><br>';
    html = html + 'Varianza: <strong>' + resultado.varianza.toFixed(2) + '</strong><br>';
    html = html + 'Fórmula: Desviación Estándar = √Varianza<br>';
    html = html + 'Desviación Estándar = √' + resultado.varianza.toFixed(2);
    html = html + '</div>';

    html = html + '<div class="caja-resultado">';
    html = html + '📈 La desviación estándar es: <strong>' + resultado.desviacion.toFixed(2) + '</strong>';
    html = html + '</div>';

    document.getElementById('resultado-desviacion').innerHTML = html;
}


// --- Toggle del gráfico ---
function toggleGraficoDesviacion() {
    let contenedor = document.getElementById('contenedor-grafico-desviacion');
    let btn = document.getElementById('btn-grafico-desviacion');

    if (contenedor.classList.contains('oculto')) {
        contenedor.classList.remove('oculto');
        btn.textContent = '✖ Ocultar Gráfico';

        let canvasViejo = document.getElementById('graficaDesviacion');
        let canvasNuevo = document.createElement('canvas');
        canvasNuevo.id = 'graficaDesviacion';
        canvasViejo.parentNode.replaceChild(canvasNuevo, canvasViejo);

        graficoDesviacionInstancia = dibujarGraficoDesviacion();

    } else {
        contenedor.classList.add('oculto');
        btn.textContent = '📊 Ver Gráfico de Desviación Estándar';
    }
}


// --- Dibuja el gráfico de desviacion estandar ---
function dibujarGraficoDesviacion() {
    let estudiantes = cargarDatos();
    let calificaciones = obtenerCalificaciones(estudiantes);
    let resultado = calcularDesviacionDesdeArreglo(calificaciones);

    let nombres = [];

    for (let i = 0; i < estudiantes.length; i++) {
        nombres.push(estudiantes[i].nombre);
    }

    let limiteSuperior = resultado.media + resultado.desviacion;
    let limiteInferior = resultado.media - resultado.desviacion;

    let ctx = document.getElementById('graficaDesviacion').getContext('2d');

    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: nombres,
            datasets: [
                {
                    label: 'Calificación',
                    data: calificaciones,
                    backgroundColor: 'rgba(99, 144, 241, 0.6)',
                    borderColor: 'rgba(99, 144, 241, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Media (' + resultado.media.toFixed(2) + ')',
                    data: new Array(calificaciones.length).fill(resultado.media),
                    type: 'line',
                    borderColor: 'rgba(239, 68, 68, 1)',
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: false
                },
                {
                    label: 'Media + Desviación (' + limiteSuperior.toFixed(2) + ')',
                    data: new Array(calificaciones.length).fill(limiteSuperior),
                    type: 'line',
                    borderColor: 'rgba(34, 197, 94, 1)',
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: false
                },
                {
                    label: 'Media - Desviación (' + limiteInferior.toFixed(2) + ')',
                    data: new Array(calificaciones.length).fill(limiteInferior),
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
                legend: { position: 'top' },
                title: {
                    display: true,
                    text: 'Desviación estándar: ' + resultado.desviacion.toFixed(2)
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 20
                }
            }
        }
    });
}

// ============================================================
// BLOQUE 11: TEST DE EVALUACION
// ============================================================

function generarTest() {
    let contenedorTest = document.getElementById("contenedor-test");
    let contenido = "";

    for (let i = 0; i < PREGUNTASTEST.length; i++) {
        contenido = contenido + '<div class="pregunta">';
        contenido = contenido + '<p><strong>' + (i + 1) + '. ' + PREGUNTASTEST[i].pregunta + '</strong></p>';

        for (let j = 0; j < PREGUNTASTEST[i].opciones.length; j++) {
            contenido = contenido + '<label>';
            contenido = contenido + '<input type="radio" name="pregunta' + i + '" value="' + j + '"> ';
            contenido = contenido + PREGUNTASTEST[i].opciones[j];
            contenido = contenido + '</label><br>';
        }
        contenido = contenido + '</div>';
    }
    contenedorTest.innerHTML = contenido;
}
generarTest();

function calificarTest() {
    let puntaje = 0;
    let preguntasRespondidas = 0;

    for (let i = 0; i < PREGUNTASTEST.length; i++) {
        let respuestaSeleccionada = document.querySelector('input[name="pregunta' + i + '"]:checked');
        if (respuestaSeleccionada != null) {
            preguntasRespondidas++;

            let respuestaUsuario = Number(respuestaSeleccionada.value);
            if (respuestaUsuario === PREGUNTASTEST[i].correcta) {
                puntaje++;
            }

            // --- VALIDACION VISUAL: X roja y Check verde ---
            let labels = document.querySelectorAll('input[name="pregunta' + i + '"]');
            for (let j = 0; j < labels.length; j++) {
                let icono = document.createElement('span');
                icono.className = 'icono-validacion';
                if (j === PREGUNTASTEST[i].correcta) {
                    icono.textContent = ' ✔';
                    icono.style.color = '#16a34a';
                    icono.style.fontWeight = 'bold';
                } else if (j === respuestaUsuario) {
                    icono.textContent = ' ✘';
                    icono.style.color = '#dc2626';
                    icono.style.fontWeight = 'bold';
                }
                if (icono.textContent !== '') {
                    labels[j].parentNode.appendChild(icono);
                }
            }
            // --- FIN VALIDACION VISUAL ---
        }
    }

    let resultado = document.getElementById("resultado-test");
    if (preguntasRespondidas < PREGUNTASTEST.length) {
        resultado.innerHTML = "Por favor, responde todas las preguntas antes de calificar.";
        resultado.className = "resultado-alerta";
        return;
    }
    if (preguntasRespondidas < PREGUNTASTEST.length) {
        resultado.innerHTML = "Por favor, responde todas las preguntas antes de calificar.";
        resultado.className = "resultado-alerta";
        return;
    }

    let nota = puntaje * 2;
    if (puntaje >= 4) {
        resultado.innerHTML = "¡Excelente! Obtuviste " + puntaje + " de 5 respuestas correctas. Tu nota es " + nota + "/10.";
        resultado.className = "resultado-aprobado";
    } else if (puntaje === 3) {
        resultado.innerHTML = "Buen intento. Obtuviste " + puntaje + " de 5 respuestas correctas. Tu nota es " + nota + "/10.";
        resultado.className = "resultado-medio";
    } else {
        resultado.innerHTML = "Necesitas repasar un poco más. Obtuviste " + puntaje + " de 5 respuestas correctas. Tu nota es " + nota + "/10.";
        resultado.className = "resultado-reprobado";
    }
}

function reiniciarTest() {

    let opciones = document.querySelectorAll('#contenedor-test input[type="radio"]');

    for (let i = 0; i < opciones.length; i++) {
        opciones[i].checked = false;
    }

    let resultado = document.getElementById("resultado-test");

    // --- LIMPIAR íconos de validación al reiniciar ---
    let iconos = document.querySelectorAll('#contenedor-test .icono-validacion');
    for (let k = 0; k < iconos.length; k++) {
        iconos[k].remove();
    }
    // --- FIN LIMPIEZA ---
    resultado.innerHTML = "";
    resultado.className = "";
}


// ============================================================
// BLOQUE 12: EJERCICIO PRACTICO - SOCIAL MEDIA (INTEGRADO con media.js)
// ============================================================

let graficoEjercicioInstancia = null;

// Nombre de la columna numérica en social_media_200.js que vamos a usar
const COLUMNA_CALCULO_EJ = 'Daily_Minutes_Spent'; // cambiar si tu columna tiene otro nombre
// Nombre de la propiedad que identifica cada registro (etiqueta)
const NOMBRE_ETIQUETA_EJ = 'App';

/**
 * Devuelve los datos desde social_media_200.js (seguro)
 */
function cargarDatosSocial() {
    if (typeof SOCIAL_MEDIA_USAGE === 'undefined' || !SOCIAL_MEDIA_USAGE.datos_redes) {
        return [];
    }
    return SOCIAL_MEDIA_USAGE.datos_redes;
}

/**
 * Agrupa los registros por App y devuelve un arreglo
 * donde cada elemento es { App: 'Facebook', valor: <media> }
 * Usa calcularMedia (de media.js) para el cálculo por App cuando esté disponible.
 */
function agruparMediaPorApp() {
    let datos = cargarDatosSocial();

    // mapa: App -> lista de objetos que pertenecen a esa app
    let mapa = {};
    for (let i = 0; i < datos.length; i++) {
        let fila = datos[i];
        let app = fila[NOMBRE_ETIQUETA_EJ] || 'SinNombre';

        if (!mapa[app]) {
            mapa[app] = [];
        }
        mapa[app].push(fila);
    }

    // convertir a arreglo de objetos con la media por app
    let arregloApps = [];
    // obtener nombres y ordenarlos para consistencia
    let nombres = [];
    for (let k in mapa) {
        nombres.push(k);
    }
    nombres.sort();

    for (let j = 0; j < nombres.length; j++) {
        let nombre = nombres[j];
        let filasApp = mapa[nombre];

        // calcular media usando la función de media.js si existe
        let mediaApp = 0;
        if (typeof calcularMedia === 'function') {
            // pasar null como idContenedor para que no escriba tabla aquí
            let res = calcularMedia(filasApp, COLUMNA_CALCULO_EJ, null, null);
            mediaApp = res.media;
        } else {
            // fallback simple: sumar y dividir
            let s = 0;
            let c = 0;
            for (let t = 0; t < filasApp.length; t++) {
                let v = Number(filasApp[t][COLUMNA_CALCULO_EJ]);
                if (!isNaN(v)) {
                    s = s + v;
                    c = c + 1;
                }
            }
            mediaApp = c > 0 ? (s / c) : 0;
            mediaApp = parseFloat(mediaApp.toFixed(2));
        }

        arregloApps.push({
            App: nombre,
            valor: mediaApp
        });
    }

    return arregloApps;
}

/**
 * Muestra la tabla con la media por App en el elemento 'resultado-ejercicio'.
 * Aprovecha calcularMedia de media.js: le pasamos el arreglo generado y la propiedad 'valor'.
 */
function mostrarTablaMediaApps() {
    let arregloApps = agruparMediaPorApp();

    // Si media.js está disponible, usar calcularMedia para generar la tabla automáticamente
    if (typeof calcularMedia === 'function') {
        // calcularMedia(arregloObjetos, propiedad, idContenedor, nombrePropMostrar)
        calcularMedia(arregloApps, 'valor', 'resultado-ejercicio', 'App');
        return;
    }

    // Fallback: generar tabla manualmente (muy simple)
    let html = '';
    html += '<p><strong>Media por App (columna: ' + COLUMNA_CALCULO_EJ + ')</strong></p>';
    html += '<table class="tabla-interactiva">';
    html += '<tr><th>#</th><th>Red Social</th><th>Media</th></tr>';

    for (let i = 0; i < arregloApps.length; i++) {
        html += '<tr>';
        html += '<td>' + (i + 1) + '</td>';
        html += '<td>' + arregloApps[i].App + '</td>';
        html += '<td>' + arregloApps[i].valor.toFixed(2) + '</td>';
        html += '</tr>';
    }

    html += '</table>';
    document.getElementById('resultado-ejercicio').innerHTML = html;
}

/**
 * Toggle (mostrar/ocultar) la tabla del ejercicio práctico.
 * Usa la clase 'oculto' igual que el resto del proyecto.
 */
function toggleEjercicioPractico() {
    let cont = document.getElementById('resultado-ejercicio');
    let btn = document.getElementById('btn-ejercicio-practico');

    if (!cont || !btn) return;

    if (cont.classList.contains('oculto')) {
        mostrarTablaMediaApps();
        cont.classList.remove('oculto');
        btn.textContent = '✖ Ocultar Tabla';
    } else {
        cont.classList.add('oculto');
        btn.textContent = '▶ Calcular Media por App';
    }
}

/**
 * Toggle del gráfico: muestra u oculta el contenedor y dibuja el gráfico
 * usando dibujarGraficoMedia de media.js (si está disponible).
 */
function toggleGraficoEjercicio() {
    let cont = document.getElementById('contenedor-grafico-ejercicio');
    let btn = document.getElementById('btn-grafico-ejercicio');

    if (!cont || !btn) return;

    if (cont.classList.contains('oculto')) {
        cont.classList.remove('oculto');
        btn.textContent = '✖ Ocultar Gráfico';

        // Si ya hay un gráfico, destruirlo antes de crear uno nuevo
        if (graficoEjercicioInstancia) {
            graficoEjercicioInstancia.destroy();
            graficoEjercicioInstancia = null;
        }

        // preparar canvas: si no existe, crearlo
        let canvas = document.getElementById('graficaEjercicio');
        if (!canvas) {
            let nuevo = document.createElement('canvas');
            nuevo.id = 'graficaEjercicio';
            cont.appendChild(nuevo);
            canvas = nuevo;
        }

        // crear datos agrupados (cada objeto: { App, valor })
        let arregloApps = agruparMediaPorApp();

        if (typeof dibujarGraficoMedia === 'function') {
            // dibujarGraficoMedia(arregloObjetos, propiedad, nombrePropMostrar, canvasId, titulo)
            graficoEjercicioInstancia = dibujarGraficoMedia(
                arregloApps,
                'valor',
                'App',
                'graficaEjercicio',
                'Media por App (' + COLUMNA_CALCULO_EJ + ')'
            );
        } else {
            // Fallback sencillo: dibujar barras con Chart.js aquí
            let etiquetas = [];
            let valores = [];
            for (let i = 0; i < arregloApps.length; i++) {
                etiquetas.push(arregloApps[i].App);
                valores.push(arregloApps[i].valor);
            }

            let ctx = document.getElementById('graficaEjercicio').getContext('2d');
            graficoEjercicioInstancia = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: etiquetas,
                    datasets: [{
                        label: 'Media (' + COLUMNA_CALCULO_EJ + ')',
                        data: valores,
                        backgroundColor: 'rgba(99, 102, 241, 0.7)',
                        borderColor: 'rgba(99, 102, 241, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { position: 'top' },
                        title: {
                            display: true,
                            text: 'Media por App (' + COLUMNA_CALCULO_EJ + ')'
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
        }

    } else {
        // ocultar y destruir grafico si existe
        cont.classList.add('oculto');
        btn.textContent = '📊 Ver Gráfico Comparativo';

        if (graficoEjercicioInstancia) {
            graficoEjercicioInstancia.destroy();
            graficoEjercicioInstancia = null;
        }
    }
}