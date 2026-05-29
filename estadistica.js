/**
 * Funcion: mostrarSeccion
 * */
function mostrarSeccion(idSeccion) {

    // Paso 1: Obtener TODAS las secciones de la pagina.
    // document.getElementsByTagName('section') busca en el HTML
    // todos los elementos que usan la etiqueta <section>.
    // El resultado es una lista (similar a un array) con todas
    // las secciones encontradas.
    var secciones = document.getElementsByTagName('section');

    // Paso 2: Recorrer todas las secciones con un ciclo for.
    // Para cada seccion, le asignamos la clase 'oculto'.
    // La clase 'oculto' esta definida en estadistica.css
    // y tiene la propiedad display: none que esconde el elemento.
    for (var i = 0; i < secciones.length; i++) {
        secciones[i].className = 'oculto';
    }

    // Paso 3: Buscar la seccion que queremos MOSTRAR.
    // document.getElementById() busca un elemento por su id.
    // El id es el valor que pasamos como parametro (idSeccion).
    // Por ejemplo, si idSeccion = 'media', buscara <section id="media">.
    var seccionMostrar = document.getElementById(idSeccion);

    // Paso 4: Quitar la clase 'oculto' para que la seccion se vea.
    // Al asignar className = '' (vacio), eliminamos la clase 'oculto'
    // y el CSS ya no le aplica display: none, asi que se muestra.
    seccionMostrar.className = '';
}