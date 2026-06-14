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
// BLOQUE 4: FUNCIONES ESTADISTICAS - MEDIA
// ============================================================

let graficoMediaInstancia = null;

// --- Calcula la media sin generar tabla (para uso interno) ---
function obtenerResultadoMedia(estudiantes) {
    return calcularMedia(estudiantes, 'calificacion', null, null);
}

// --- Toggle del ejemplo interactivo ---
function toggleEjemploMedia() {
    let contenedor = document.getElementById('resultado-media');
    let btn = document.getElementById('btn-ejemplo-media');

    if (!contenedor || !btn) { return; }

    if (contenedor.classList.contains('oculto')) {
        calcularMedia(cargarDatos(), 'calificacion', 'resultado-media', 'nombre');
        contenedor.classList.remove('oculto');
        btn.textContent = '✖ Ocultar Ejemplo';
    } else {
        contenedor.classList.add('oculto');
        btn.textContent = '▶ Calcular Media';
    }
}

// --- Toggle del gráfico ---
function toggleGraficoMedia() {
    let contenedor = document.getElementById('contenedor-grafico-media');
    let btn = document.getElementById('btn-grafico-media');

    if (!contenedor || !btn) { return; }

    // --- OCULTAR ---
    if (!contenedor.classList.contains('oculto')) {
        contenedor.classList.add('oculto');
        btn.textContent = '📊 Ver Gráfico de Barras';

        if (graficoMediaInstancia !== null) {
            try { graficoMediaInstancia.destroy(); } catch (e) {}
            graficoMediaInstancia = null;
        }
        return;
    }

    // --- MOSTRAR ---
    contenedor.classList.remove('oculto');
    btn.textContent = '✖ Ocultar Gráfico';

    // Reemplaza el canvas para evitar "Canvas already in use"
    let canvasViejo = document.getElementById('graficaMedia');
    if (!canvasViejo) { return; }
    let canvasNuevo = document.createElement('canvas');
    canvasNuevo.id = 'graficaMedia';
    canvasViejo.parentNode.replaceChild(canvasNuevo, canvasViejo);

    setTimeout(function () {
        graficoMediaInstancia = dibujarGraficoMedia(
            cargarDatos(),
            'calificacion',
            'graficaMedia',
            'Calificaciones de estudiantes con media'
        );
    }, 50);
}

// ============================================================
// BLOQUE 5: FUNCIONES ESTADISTICAS - MEDIANA
// ============================================================

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

    if (!contenedor || !btn) { return; }

    // --- OCULTAR ---
    if (!contenedor.classList.contains('oculto')) {
        contenedor.classList.add('oculto');
        btn.textContent = '📊 Ver Gráfico de Barras Horizontales';
        return;
    }

    // --- MOSTRAR ---
    contenedor.classList.remove('oculto');
    btn.textContent = '✖ Ocultar Gráfico';

    // Reemplaza el canvas para evitar "Canvas already in use"
    let canvasViejo = document.getElementById('graficaMediana');
    if (canvasViejo && canvasViejo.parentNode) {
        let canvasNuevo = document.createElement('canvas');
        canvasNuevo.id = 'graficaMediana';
        canvasViejo.parentNode.replaceChild(canvasNuevo, canvasViejo);
    }

    // setTimeout: da tiempo al DOM para que el canvas nuevo tenga tamaño real
    // antes de que Chart.js intente renderizar. Esto es obligatorio cuando se
    // reemplaza un canvas justo después de quitar la clase 'oculto'.
    setTimeout(function () {
        dibujarGraficoMediana(
            cargarDatos(),
            'calificacion',
            'graficaMediana',
            'Calificaciones ordenadas con línea de mediana',
            'nombre'
        );
    }, 50);
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

    if (!contenedor || !btn) { return; }

    // --- OCULTAR ---
    if (!contenedor.classList.contains('oculto')) {
        contenedor.classList.add('oculto');
        btn.textContent = '📊 Ver Gráfico de Frecuencias';

        if (graficoModaInstancia) {
            try { graficoModaInstancia.destroy(); } catch (e) {}
            graficoModaInstancia = null;
        }
        return;
    }

    // --- MOSTRAR ---
    contenedor.classList.remove('oculto');
    btn.textContent = '✖ Ocultar Gráfico';

    // Reemplazar canvas para evitar "Canvas already in use"
    let canvasViejo = document.getElementById('graficaModa');
    if (!canvasViejo) { return; }
    let canvasNuevo = document.createElement('canvas');
    canvasNuevo.id = 'graficaModa';
    canvasViejo.parentNode.replaceChild(canvasNuevo, canvasViejo);

    // setTimeout obligatorio: el canvas nuevo necesita tiempo para tener tamaño real
    setTimeout(function () {
        graficoModaInstancia = dibujarGraficoModa(
            cargarDatos(),
            'calificacion',
            'graficaModa',
            'Frecuencia de calificaciones (barra azul = moda)'
        );
    }, 50);
}

// ============================================================
// BLOQUE 7: FUNCIONES ESTADISTICAS - MINIMO Y MAXIMO
// ============================================================

let graficoMinMaxInstancia = null;

// --- Toggle del ejemplo interactivo (datos de estudiantes) ---
function toggleEjemploMinMax() {
    let contenedor = document.getElementById('resultado-minmax');
    let btn = document.getElementById('btn-ejemplo-minmax');

    // Validación: si no existen los elementos en el HTML, salimos
    if (!contenedor || !btn) { return; }

    if (contenedor.classList.contains('oculto')) {
        // calcularMinMax viene de minMax.js
        calcularMinMax(cargarDatos(), 'calificacion', 'resultado-minmax', 'nombre');
        contenedor.classList.remove('oculto');
        btn.textContent = '✖ Ocultar Ejemplo';
    } else {
        contenedor.classList.add('oculto');
        btn.textContent = '▶ Calcular Mínimo y Máximo';
    }
}

// --- Toggle del gráfico (datos de estudiantes) ---
function toggleGraficoMinMax() {
    let contenedor = document.getElementById('contenedor-grafico-minmax');
    let btn = document.getElementById('btn-grafico-minmax');

    // Validación: si no existen los elementos en el HTML, salimos
    if (!contenedor || !btn) { return; }

    // --- OCULTAR ---
    if (!contenedor.classList.contains('oculto')) {
        contenedor.classList.add('oculto');
        btn.textContent = '📊 Ver Gráfico de Barras';

        // Destruir gráfico anterior para liberar memoria
        if (graficoMinMaxInstancia) {
            try { graficoMinMaxInstancia.destroy(); } catch (e) {}
            graficoMinMaxInstancia = null;
        }
        return;
    }

    // --- MOSTRAR ---
    contenedor.classList.remove('oculto');
    btn.textContent = '✖ Ocultar Gráfico';

    // Destruir instancia previa si existe
    if (graficoMinMaxInstancia) {
        try { graficoMinMaxInstancia.destroy(); } catch (e) {}
        graficoMinMaxInstancia = null;
    }

    // Reemplazar canvas para evitar el error "Canvas already in use"
    let canvasViejo = document.getElementById('graficaMinMax');
    if (!canvasViejo) { return; }
    let canvasNuevo = document.createElement('canvas');
    canvasNuevo.id = 'graficaMinMax';
    canvasViejo.parentNode.replaceChild(canvasNuevo, canvasViejo);

    // setTimeout: da tiempo al DOM para que el canvas nuevo tenga tamaño real
    // antes de que Chart.js intente dibujar. Esto es obligatorio.
        setTimeout(function () {
        // dibujarGraficoMinMax viene de minMax.js
        // Orden: arreglo, campoNumerico, canvasId, titulo
        // (el campoLabel ya no se pasa: minMax.js lo detecta automáticamente)
        graficoMinMaxInstancia = dibujarGraficoMinMax(
            cargarDatos(),
            'calificacion',
            'graficaMinMax',
            'Calificaciones — azul: mínimo | rojo: máximo'
        );
    }, 50);
}

// ============================================================
// BLOQUE 8: FUNCIONES ESTADISTICAS - RANGO
// ============================================================

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

    if (!contenedor || !btn) { return; }

    // --- OCULTAR ---
    if (!contenedor.classList.contains('oculto')) {
        contenedor.classList.add('oculto');
        btn.textContent = '📊 Ver Gráfico de Barras Verticales';

        if (instanciaGraficoRango !== null) {
            try { instanciaGraficoRango.destroy(); } catch (e) {}
            instanciaGraficoRango = null;
        }
        return;
    }

    // --- MOSTRAR ---
    contenedor.classList.remove('oculto');
    btn.textContent = '✖ Ocultar Gráfico';

    // Reemplazar canvas para evitar "Canvas already in use"
    let canvasViejo = document.getElementById('graficaRango');
    if (!canvasViejo) { return; }
    let canvasNuevo = document.createElement('canvas');
    canvasNuevo.id = 'graficaRango';
    canvasViejo.parentNode.replaceChild(canvasNuevo, canvasViejo);

    // setTimeout obligatorio: el canvas nuevo necesita tiempo para tener tamaño real
    setTimeout(function () {
        instanciaGraficoRango = dibujarGraficoRango(
            cargarDatos(),
            'calificacion',
            'nombre',
            'graficaRango',
            'Rango de calificaciones — rojo: mínimo | verde: máximo'
        );
    }, 50);
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
        resultado.innerHTML = "Incorrecto - Por favor, responde todas las preguntas antes de calificar.";
        resultado.className = "resultado-alerta";
        return;
    }
    if (preguntasRespondidas < PREGUNTASTEST.length) {
        resultado.innerHTML = "Incorrecto - Por favor, responde todas las preguntas antes de calificar.";
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
    let btn  = document.getElementById('btn-grafico-ejercicio');

    if (!cont || !btn) { return; }

    // --- OCULTAR ---
    if (!cont.classList.contains('oculto')) {
        cont.classList.add('oculto');
        btn.textContent = '📊 Ver Gráfico Comparativo';

        // Destruye el gráfico anterior para liberar memoria
        if (graficoEjercicioInstancia) {
            graficoEjercicioInstancia.destroy();
            graficoEjercicioInstancia = null;
        }
        return;
    }

    // --- MOSTRAR ---
    cont.classList.remove('oculto');
    btn.textContent = '✖ Ocultar Gráfico';

    // Destruye instancia previa si existe
    if (graficoEjercicioInstancia) {
        graficoEjercicioInstancia.destroy();
        graficoEjercicioInstancia = null;
    }

    // Crea el canvas si no existe en el DOM
    let canvas = document.getElementById('graficaEjercicio');
    if (!canvas) {
        canvas    = document.createElement('canvas');
        canvas.id = 'graficaEjercicio';
        cont.appendChild(canvas);
    }

    // Agrupa los datos por App y calcula la media de cada una
    let arregloApps = agruparMediaPorApp();

    // dibujarGrafico (media.js): arreglo, propiedad, canvasId, titulo
    // No se pasa mediaExterna: la función la calcula internamente sobre arregloApps
    graficoEjercicioInstancia = dibujarGraficoMedia(
        arregloApps,
        'valor',
        'graficaEjercicio',
        'Media por App (' + COLUMNA_CALCULO_EJ + ')'
    );
}

// ============================================================
// FUNCIÓN: cargarTablaPreviewDataset
// Muestra los primeros 10 registros de SOCIAL_MEDIA_USAGE
// en la tabla #tabla-preview-dataset al cargar la sección.
// Se llama una sola vez desde el evento DOMContentLoaded.
// ============================================================
function cargarTablaPreviewDataset() {
    let cuerpoTabla = document.getElementById("cuerpo-tabla-preview");
    if (!cuerpoTabla) { return; }

    let datos = SOCIAL_MEDIA_USAGE.datos_redes;
    let filas = "";

    // Recorre solo los primeros 10 registros del dataset
    for (let indiceFila = 0; indiceFila < 10 && indiceFila < datos.length; indiceFila++) {
        let registro = datos[indiceFila];
        filas += "<tr>";
        filas += "<td>" + (indiceFila + 1) + "</td>";
        filas += "<td>" + registro.User_ID + "</td>";
        filas += "<td>" + registro.App + "</td>";
        filas += "<td>" + registro.Daily_Minutes_Spent + "</td>";
        filas += "<td>" + registro.Posts_Per_Day + "</td>";
        filas += "<td>" + registro.Likes_Per_Day + "</td>";
        filas += "<td>" + registro.Follows_Per_Day + "</td>";
        filas += "</tr>";
    }

    cuerpoTabla.innerHTML = filas;
}

// Llenar la tabla preview cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", function() {
    cargarTablaPreviewDataset();
});

// ============================================================
// BLOQUE 12B: EJERCICIO PRACTICO - MEDIANA
// ============================================================

let graficoEjercicioMedianaInstancia = null;

/**
 * Calcula la mediana del dataset completo (los 200 registros)
 * sobre la columna Daily_Minutes_Spent y genera la tabla HTML.
 */
function mostrarTablaMedianaDataset() {
    let datos = cargarDatosSocial();
    let idContenedor = 'resultado-ejercicio-mediana';

    // Usar calcularMediana de mediana.js si está disponible
    if (typeof calcularMediana === 'function') {
        calcularMediana(datos, COLUMNA_CALCULO_EJ, idContenedor, NOMBRE_ETIQUETA_EJ);
        return;
    }

    // Fallback manual si mediana.js no está cargado
    let valores = [];
    for (let i = 0; i < datos.length; i++) {
        let v = Number(datos[i][COLUMNA_CALCULO_EJ]);
        if (!isNaN(v)) {
            valores.push(v);
        }
    }

    // Ordenar de menor a mayor
    valores.sort(function(a, b) { return a - b; });

    let centro = Math.floor(valores.length / 2);
    let mediana = 0;
    if (valores.length % 2 === 0) {
        mediana = (valores[centro - 1] + valores[centro]) / 2;
    } else {
        mediana = valores[centro];
    }

    let html = '';
    html += '<p><strong>Mediana de ' + COLUMNA_CALCULO_EJ + ' (200 registros ordenados):</strong></p>';
    html += '<div class="detalle-calculo">';
    html += 'Total de registros: <strong>' + valores.length + '</strong><br>';
    html += 'Posición central: <strong>' + (centro + 1) + '</strong><br>';
    html += 'Mediana: <strong>' + mediana.toFixed(2) + '</strong>';
    html += '</div>';
    html += '<div class="caja-resultado">';
    html += '📊 La mediana es: <strong>' + mediana.toFixed(2) + '</strong> minutos/día';
    html += '</div>';

    document.getElementById(idContenedor).innerHTML = html;
}

/**
 * Toggle tabla de mediana del ejercicio práctico.
 */
function toggleEjercicioMediana() {
    let cont = document.getElementById('resultado-ejercicio-mediana');
    let btn  = document.getElementById('btn-ejercicio-mediana');

    if (!cont || !btn) { return; }

    if (cont.classList.contains('oculto')) {
        mostrarTablaMedianaDataset();
        cont.classList.remove('oculto');
        btn.textContent = '✖ Ocultar Tabla';
    } else {
        cont.classList.add('oculto');
        btn.textContent = '▶ Calcular Mediana';
    }
}

/**
 * Toggle gráfico de mediana del ejercicio práctico.
 * Usa dibujarGraficoMediana de mediana.js con los 200 registros.
 */
function toggleGraficoEjercicioMediana() {
    let cont = document.getElementById('contenedor-grafico-ejercicio-mediana');
    let btn  = document.getElementById('btn-grafico-ejercicio-mediana');

    if (!cont || !btn) { return; }

    // --- OCULTAR ---
    if (!cont.classList.contains('oculto')) {
        cont.classList.add('oculto');
        btn.textContent = '📊 Ver Gráfico de Distribución';
        return;
    }

    // --- MOSTRAR ---
    cont.classList.remove('oculto');
    btn.textContent = '✖ Ocultar Gráfico';

    // Reemplazar canvas para evitar "Canvas already in use"
    let canvasViejo = document.getElementById('graficaEjercicioMediana');
    if (canvasViejo && canvasViejo.parentNode) {
        let canvasNuevo = document.createElement('canvas');
        canvasNuevo.id = 'graficaEjercicioMediana';
        canvasViejo.parentNode.replaceChild(canvasNuevo, canvasViejo);
    }

    // setTimeout obligatorio: el canvas nuevo necesita tiempo para tener tamaño real
    setTimeout(function () {
        dibujarGraficoMediana(
            cargarDatosSocial(),
            COLUMNA_CALCULO_EJ,
            'graficaEjercicioMediana',
            'Distribución de minutos diarios con línea de mediana',
            NOMBRE_ETIQUETA_EJ
        );
    }, 50);
}

// ============================================================
// BLOQUE 12C: EJERCICIO PRACTICO - MINIMO Y MAXIMO
// ============================================================

let graficoEjercicioMinMaxInstancia = null;

/**
 * Muestra la tabla del dataset completo (200 registros)
 * destacando el mínimo y el máximo con calcularMinMax de minMax.js.
 */
function mostrarTablaMinMaxDataset() {
    let datos = cargarDatosSocial();
    let idContenedor = 'resultado-ejercicio-minmax';

    // Usar calcularMinMax de minMax.js con los datos de redes sociales
    calcularMinMax(datos, COLUMNA_CALCULO_EJ, idContenedor, NOMBRE_ETIQUETA_EJ);
}

/**
 * Toggle (mostrar/ocultar) la tabla del ejercicio práctico de mínimo y máximo.
 */
function toggleEjercicioMinMax() {
    let cont = document.getElementById('resultado-ejercicio-minmax');
    let btn  = document.getElementById('btn-ejercicio-minmax');

    if (!cont || !btn) { return; }

    if (cont.classList.contains('oculto')) {
        mostrarTablaMinMaxDataset();
        cont.classList.remove('oculto');
        btn.textContent = '✖ Ocultar Tabla';
    } else {
        cont.classList.add('oculto');
        btn.textContent = '▶ Calcular Mínimo y Máximo';
    }
}

/**
 * Toggle (mostrar/ocultar) el gráfico de mínimo y máximo del ejercicio práctico.
 */
function toggleGraficoEjercicioMinMax() {
    let cont = document.getElementById('contenedor-grafico-ejercicio-minmax');
    let btn  = document.getElementById('btn-grafico-ejercicio-minmax');

    if (!cont || !btn) { return; }

    // --- OCULTAR ---
    if (!cont.classList.contains('oculto')) {
        cont.classList.add('oculto');
        btn.textContent = '📊 Ver Gráfico de Barras';

        if (graficoEjercicioMinMaxInstancia) {
            try { graficoEjercicioMinMaxInstancia.destroy(); } catch (e) {}
            graficoEjercicioMinMaxInstancia = null;
        }
        return;
    }

    // --- MOSTRAR ---
    cont.classList.remove('oculto');
    btn.textContent = '✖ Ocultar Gráfico';

    // Reemplazar canvas para evitar "Canvas already in use"
    let canvasViejo = document.getElementById('graficaEjercicioMinMax');
    if (!canvasViejo) { return; }
    let canvasNuevo = document.createElement('canvas');
    canvasNuevo.id = 'graficaEjercicioMinMax';
    canvasViejo.parentNode.replaceChild(canvasNuevo, canvasViejo);

    // setTimeout obligatorio: el canvas nuevo necesita tiempo para tener tamaño real
    setTimeout(function () {
        // Orden: arreglo, campoNumerico, canvasId, titulo
        // (campoLabel detectado automáticamente por minMax.js)
        graficoEjercicioMinMaxInstancia = dibujarGraficoMinMax(
            cargarDatosSocial(),
            COLUMNA_CALCULO_EJ,
            'graficaEjercicioMinMax',
            'Distribución de minutos diarios — azul: mínimo | rojo: máximo'
        );
    }, 50);
}

// ============================================================
// BLOQUE 12D: EJERCICIO PRACTICO - MODA
// ============================================================

let graficoEjercicioModaInstancia = null;

/**
 * Muestra la tabla del dataset completo (200 registros)
 * destacando la moda con calcularModa de moda.js.
 */
function mostrarTablaModaDataset() {
    let datos = cargarDatosSocial();
    let idContenedor = 'resultado-ejercicio-moda';

    // Usar calcularModa de moda.js con los datos de redes sociales
    calcularModa(datos, COLUMNA_CALCULO_EJ, idContenedor, NOMBRE_ETIQUETA_EJ);
}

/**
 * Toggle (mostrar/ocultar) la tabla del ejercicio práctico de moda.
 */
function toggleEjercicioModa() {
    let cont = document.getElementById('resultado-ejercicio-moda');
    let btn  = document.getElementById('btn-ejercicio-moda');

    if (!cont || !btn) { return; }

    if (cont.classList.contains('oculto')) {
        mostrarTablaModaDataset();
        cont.classList.remove('oculto');
        btn.textContent = '✖ Ocultar Tabla';
    } else {
        cont.classList.add('oculto');
        btn.textContent = '▶ Calcular Moda';
    }
}

/**
 * Toggle (mostrar/ocultar) el gráfico de moda del ejercicio práctico.
 */
function toggleGraficoEjercicioModa() {
    let cont = document.getElementById('contenedor-grafico-ejercicio-moda');
    let btn  = document.getElementById('btn-grafico-ejercicio-moda');

    if (!cont || !btn) { return; }

    // --- OCULTAR ---
    if (!cont.classList.contains('oculto')) {
        cont.classList.add('oculto');
        btn.textContent = '📊 Ver Gráfico de Frecuencias';

        if (graficoEjercicioModaInstancia) {
            try { graficoEjercicioModaInstancia.destroy(); } catch (e) {}
            graficoEjercicioModaInstancia = null;
        }
        return;
    }

    // --- MOSTRAR ---
    cont.classList.remove('oculto');
    btn.textContent = '✖ Ocultar Gráfico';

    // Reemplazar canvas para evitar "Canvas already in use"
    let canvasViejo = document.getElementById('graficaEjercicioModa');
    if (!canvasViejo) { return; }
    let canvasNuevo = document.createElement('canvas');
    canvasNuevo.id = 'graficaEjercicioModa';
    canvasViejo.parentNode.replaceChild(canvasNuevo, canvasViejo);

    // setTimeout obligatorio: el canvas nuevo necesita tiempo para tener tamaño real
    setTimeout(function () {
        graficoEjercicioModaInstancia = dibujarGraficoModa(
            cargarDatosSocial(),
            COLUMNA_CALCULO_EJ,
            'graficaEjercicioModa',
            'Frecuencia de minutos diarios (barra azul = moda)'
        );
    }, 50);
}

// ============================================================
// BLOQUE 12E: EJERCICIO PRACTICO - RANGO
// ============================================================

let graficoEjercicioRangoInstancia = null;

/**
 * Muestra la tabla del dataset completo (200 registros)
 * con el cálculo del rango usando calcularRango de rango.js.
 */
function mostrarTablaRangoDataset() {
    let datos = cargarDatosSocial();
    let idContenedor = 'resultado-ejercicio-rango';

    // Usar calcularRango de rango.js con los datos de redes sociales
    calcularRango(datos, COLUMNA_CALCULO_EJ, idContenedor, NOMBRE_ETIQUETA_EJ);
}

/**
 * Toggle (mostrar/ocultar) la tabla del ejercicio práctico de rango.
 */
function toggleEjercicioRango() {
    let cont = document.getElementById('resultado-ejercicio-rango');
    let btn  = document.getElementById('btn-ejercicio-rango');

    if (!cont || !btn) { return; }

    if (cont.classList.contains('oculto')) {
        mostrarTablaRangoDataset();
        cont.classList.remove('oculto');
        btn.textContent = '✖ Ocultar Tabla';
    } else {
        cont.classList.add('oculto');
        btn.textContent = '▶ Calcular Rango';
    }
}

/**
 * Toggle (mostrar/ocultar) el gráfico de rango del ejercicio práctico.
 */
function toggleGraficoEjercicioRango() {
    let cont = document.getElementById('contenedor-grafico-ejercicio-rango');
    let btn  = document.getElementById('btn-grafico-ejercicio-rango');

    if (!cont || !btn) { return; }

    // --- OCULTAR ---
    if (!cont.classList.contains('oculto')) {
        cont.classList.add('oculto');
        btn.textContent = '📊 Ver Gráfico de Amplitud';

        if (graficoEjercicioRangoInstancia) {
            try { graficoEjercicioRangoInstancia.destroy(); } catch (e) {}
            graficoEjercicioRangoInstancia = null;
        }
        return;
    }

    // --- MOSTRAR ---
    cont.classList.remove('oculto');
    btn.textContent = '✖ Ocultar Gráfico';

    // Reemplazar canvas para evitar "Canvas already in use"
    let canvasViejo = document.getElementById('graficaEjercicioRango');
    if (!canvasViejo) { return; }
    let canvasNuevo = document.createElement('canvas');
    canvasNuevo.id = 'graficaEjercicioRango';
    canvasViejo.parentNode.replaceChild(canvasNuevo, canvasViejo);

    // setTimeout obligatorio: el canvas nuevo necesita tiempo para tener tamaño real
    setTimeout(function () {
        graficoEjercicioRangoInstancia = dibujarGraficoRango(
            cargarDatosSocial(),
            COLUMNA_CALCULO_EJ,
            NOMBRE_ETIQUETA_EJ,
            'graficaEjercicioRango',
            'Amplitud de minutos diarios — rojo: mínimo | verde: máximo'
        );
    }, 50);
}