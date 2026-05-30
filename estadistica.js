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