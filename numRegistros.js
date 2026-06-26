// ============================================================
// numRegistros.js
// Permite elegir cuántos registros aleatorios usar en los
// cálculos estadísticos del Ejercicio Práctico.
//
// Depende de: social_media_200.js (debe cargarse antes)
// ============================================================


// ------------------------------------------------------------
// PASO 1: Guardar una copia fija de los 200 registros
// ------------------------------------------------------------
// Creamos un arreglo separado que NUNCA se va a modificar.
// Lo usamos como "fuente original" cada vez que el usuario
// cambia la cantidad de registros en el combobox.
//
// Nota: usamos slice() para copiar el arreglo, NO para
// apuntar al mismo. Si no copiamos, ambas variables
// apuntarían al mismo lugar en memoria y se modificarían juntas.
// ------------------------------------------------------------

let datosOriginales = SOCIAL_MEDIA_USAGE.datos_redes.slice();


// ------------------------------------------------------------
// PASO 2: Función para mezclar registros aleatoriamente
// ------------------------------------------------------------
// Recibe un arreglo y devuelve una copia mezclada al azar.
// Algoritmo: Fisher-Yates (estándar para mezclas aleatorias)
// ------------------------------------------------------------

function mezclarAleatorio(arreglo) {

    // Copiamos el arreglo para no modificar el original
    let copia = arreglo.slice();

    // Recorremos de atrás hacia adelante
    for (let i = copia.length - 1; i > 0; i--) {

        // Elegimos una posición aleatoria entre 0 e i
        let j = Math.floor(Math.random() * (i + 1));

        // Intercambiamos los elementos en posición i y j
        let temporal    = copia[i];
        copia[i]        = copia[j];
        copia[j]        = temporal;
    }

    return copia;
}


// ------------------------------------------------------------
// PASO 3: Función principal — aplica la muestra elegida
// ------------------------------------------------------------
// Esta función es llamada por el botón "Aplicar Muestra".
// 1. Lee cuántos registros pidió el usuario
// 2. Mezcla los 200 originales aleatoriamente
// 3. Toma solo los primeros N de esa mezcla
// 4. Los asigna al dataset global que usan todos los demás scripts
// 5. Actualiza la tabla preview y limpia resultados anteriores
// ------------------------------------------------------------

function confirmarMuestra() {

    let select = document.getElementById('selectRegistros');
    let n      = parseInt(select.value);

    let muestraAleatoria = mezclarAleatorio(datosOriginales).slice(0, n);
    SOCIAL_MEDIA_USAGE.datos_redes = muestraAleatoria;

    actualizarTablaPreview();
    limpiarResultados();

    // Protección: solo actualiza el span si existe en esta página
    let spanMuestra = document.getElementById('span-muestra-activa');
    if (spanMuestra) {
        spanMuestra.textContent = n + ' registros';
    }

    // Protección: solo actualiza el botón si existe
    let btn = document.getElementById('btn-aplicar-muestra');
    if (btn) {
        btn.textContent = '✅ Muestra aplicada (' + n + ')';
        setTimeout(function() {
            btn.textContent = '🔀 Aplicar Muestra';
        }, 1500);
    }
}


// ------------------------------------------------------------
// PASO 4: Actualizar la tabla de previsualización
// ------------------------------------------------------------
// Muestra los primeros 10 registros de la muestra actual
// en la tabla #cuerpo-tabla-preview del HTML.
// ------------------------------------------------------------

function actualizarTablaPreview() {

    let tbody = document.getElementById('cuerpo-tabla-preview');
    if (!tbody) return; // Si no existe la tabla, salimos

    let datos   = SOCIAL_MEDIA_USAGE.datos_redes;
    let limite  = 10; // Siempre mostramos máximo 10 filas en la preview
    let filas   = '';

    for (var i = 0; i < limite && i < datos.length; i++) {
        var reg = datos[i];
        filas += '<tr>';
        filas += '<td>' + (i + 1)                   + '</td>';
        filas += '<td>' + reg.User_ID               + '</td>';
        filas += '<td>' + reg.App                   + '</td>';
        filas += '<td>' + reg.Daily_Minutes_Spent   + '</td>';
        filas += '<td>' + reg.Posts_Per_Day         + '</td>';
        filas += '<td>' + reg.Likes_Per_Day         + '</td>';
        filas += '<td>' + reg.Follows_Per_Day       + '</td>';
        filas += '</tr>';
    }

    tbody.innerHTML = filas;
}


// ------------------------------------------------------------
// PASO 5: Limpiar resultados y gráficos anteriores
// ------------------------------------------------------------
// Cuando el usuario cambia la muestra, ocultamos todos los
// resultados calculados para que vuelva a presionar los botones
// y calcule con los nuevos datos.
// ------------------------------------------------------------

function limpiarResultados() {

    let ids = [
        'resultado-ejercicio',              'contenedor-grafico-ejercicio',
        'resultado-ejercicio-mediana',      'contenedor-grafico-ejercicio-mediana',
        'resultado-ejercicio-moda',         'contenedor-grafico-ejercicio-moda',
        'resultado-ejercicio-minmax',       'contenedor-grafico-ejercicio-minmax',
        'resultado-ejercicio-rango',        'contenedor-grafico-ejercicio-rango',
        'resultado-ejercicio-varianza',     'contenedor-grafico-ejercicio-varianza',
        'resultado-ejercicio-desviacion',   'contenedor-grafico-ejercicio-desviacion'
    ];

    for (let i = 0; i < ids.length; i++) {
        var elemento = document.getElementById(ids[i]);
        if (elemento) {
            elemento.classList.add('oculto');
            // ❌ NO pongas innerHTML = '' aquí
            // porque destruye los <canvas> que los gráficos necesitan
        }
    }
}


// ------------------------------------------------------------
// PASO 6: Inicialización al cargar la página
// ------------------------------------------------------------
// Cuando el HTML termina de cargarse, pintamos la tabla
// preview con los primeros 10 registros del dataset completo.
// ------------------------------------------------------------

document.addEventListener('DOMContentLoaded', function() {
    actualizarTablaPreview();
});