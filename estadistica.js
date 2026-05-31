/**
 * Funcion: mostrarSeccion
 * */
function mostrarSeccion(idSeccion) {

    let secciones = document.getElementsByTagName('section');
    for (let i = 0; i < secciones.length; i++) {
        secciones[i].className = 'oculto';
    }

    let seccionMostrar = document.getElementById(idSeccion);
    seccionMostrar.className = '';
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

function calcularMediaDesdeArreglo(calificaciones) {
    let suma = 0;

    for (let i = 0; i < calificaciones.length; i++) {
        suma = suma + calificaciones[i];
    }

    let media = suma / calificaciones.length;

    return {
        suma: suma,
        cantidad: calificaciones.length,
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

    if (contenedor.classList.contains('oculto')) {
        // Si está oculto: calcular y mostrar
        calcularMedia();
        contenedor.classList.remove('oculto');
        btn.textContent = '✖ Ocultar Ejemplo';
    } else {
        // Si está visible: ocultar
        contenedor.classList.add('oculto');
        btn.textContent = '▶ Calcular Media';
    }
}

function calcularMedia() {
    let estudiantes = cargarDatos();
    let calificaciones = obtenerCalificaciones(estudiantes);
    let resultado = calcularMediaDesdeArreglo(calificaciones);

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

    document.getElementById('resultado-media').innerHTML = html;
}


// ============================================================
// MEDIA: toggle del gráfico
// ============================================================

function toggleGraficoMedia() {
    let contenedor = document.getElementById('contenedor-grafico-media');
    let btn = document.getElementById('btn-grafico-media');

    if (contenedor.classList.contains('oculto')) {
        contenedor.classList.remove('oculto');
        btn.textContent = '✖ Ocultar Gráfico';

        // Solo dibuja el grafico si no existe todavia
        if (graficoMediaInstancia === null) {
            graficoMediaInstancia = dibujarGraficoMedia();
        }
    } else {
        contenedor.classList.add('oculto');
        btn.textContent = '📊 Ver Gráfico de Barras';
    }
}

function dibujarGraficoMedia() {
    let estudiantes = cargarDatos();
    let calificaciones = obtenerCalificaciones(estudiantes);
    let resultado = calcularMediaDesdeArreglo(calificaciones);

    let nombres = [];
    for (let i = 0; i < estudiantes.length; i++) {
        nombres.push(estudiantes[i].nombre);
    }

    let ctx = document.getElementById('graficaMedia').getContext('2d');

    return new Chart(ctx, {
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