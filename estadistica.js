// ============================================================
// BLOQUE 1: NAVEGACION ENTRE SECCIONES
// ============================================================

/**
 * Funcion: mostrarSeccion
 * Oculta todas las secciones del documento y muestra únicamente
 * la sección cuyo ID coincide con el parámetro recibido.
 */
function mostrarSeccion(idSeccionObjetivo) {

    // Se obtiene la lista de todas las etiquetas <section> del DOM
    let listaSecciones = document.getElementsByTagName('section');

    // BUCLE: Se recorre cada sección para ocultarla agregando la clase 'oculto'
    for (let indiceSeccion = 0; indiceSeccion < listaSecciones.length; indiceSeccion++) {
        listaSecciones[indiceSeccion].classList.add('oculto');
    }

    // Se obtiene la referencia a la sección objetivo mediante su ID
    let seccionActiva = document.getElementById(idSeccionObjetivo);

    // CONDICIONAL: Solo se remueve la clase 'oculto' si el elemento existe en el DOM
    if (seccionActiva) {
        seccionActiva.classList.remove('oculto');
    }
}


// ============================================================
// BLOQUE 2: CARGA DE DATOS DESDE datos.js
// ============================================================

/**
 * Funcion: cargarDatos
 * Accede a la variable global DATOSESTUDIANTES definida en el archivo datos.js
 * y devuelve el arreglo de objetos que contiene la información de los estudiantes.
 */
function cargarDatos() {
    return DATOSESTUDIANTES.estudiantes;
}


// ============================================================
// BLOQUE 3: FUNCIONES DE EXTRACCION
// ============================================================

/**
 * Funcion: obtenerCalificaciones
 * Recibe el arreglo completo de estudiantes y extrae únicamente
 * las calificaciones numéricas en un nuevo arreglo.
 */
function obtenerCalificaciones(listaEstudiantes) {
    let listaCalificaciones = [];

    // BUCLE: Se itera sobre cada estudiante para extraer su calificación
    for (let indiceEstudiante = 0; indiceEstudiante < listaEstudiantes.length; indiceEstudiante++) {
        listaCalificaciones.push(listaEstudiantes[indiceEstudiante].calificacion);
    }

    return listaCalificaciones;
}


// ============================================================
// BLOQUE 4: FUNCIONES ESTADISTICAS - MEDIA
// ============================================================

// Variable de control para la instancia del gráfico de media (Chart.js)
let graficoMediaInstancia = null;

/**
 * Funcion: obtenerResultadoMedia
 * Calcula la media utilizando la función externa calcularMedia (media.js)
 * sin generar tabla visual, únicamente retornando el valor numérico.
 */
function obtenerResultadoMedia(listaEstudiantes) {
    return calcularMedia(listaEstudiantes, 'calificacion', null, null);
}

/**
 * Funcion: toggleEjemploMedia
 * Alterna la visibilidad del ejemplo interactivo de cálculo de media.
 * Si está oculto, calcula y muestra la tabla; si está visible, la oculta.
 */
function toggleEjemploMedia() {
    let contenedorResultado = document.getElementById('resultado-media');
    let botonInteractivo = document.getElementById('btn-ejemplo-media');

    // CONDICIONAL: Validación de existencia de elementos en el DOM
    if (!contenedorResultado || !botonInteractivo) {
        return;
    }

    // CONDICIONAL: Si el contenedor tiene la clase 'oculto', se procede a mostrar
    if (contenedorResultado.classList.contains('oculto')) {
        calcularMedia(cargarDatos(), 'calificacion', 'resultado-media', 'nombre');
        contenedorResultado.classList.remove('oculto');
        botonInteractivo.textContent = '✖ Ocultar Ejemplo';
    } else {
        // Si no está oculto, se oculta y se restablece el texto del botón
        contenedorResultado.classList.add('oculto');
        botonInteractivo.textContent = '▶ Calcular Media';
    }
}

/**
 * Funcion: toggleGraficoMedia
 * Alterna la visibilidad del gráfico de barras de la media.
 * Gestiona la destrucción y recreación del canvas para evitar conflictos con Chart.js.
 */
function toggleGraficoMedia() {
    let contenedorResultado = document.getElementById('contenedor-grafico-media');
    let botonInteractivo = document.getElementById('btn-grafico-media');

    // CONDICIONAL: Validación de existencia de elementos en el DOM
    if (!contenedorResultado || !botonInteractivo) {
        return;
    }

    // --- SECCION: OCULTAR GRÁFICO ---
    if (!contenedorResultado.classList.contains('oculto')) {
        contenedorResultado.classList.add('oculto');
        botonInteractivo.textContent = '📊 Ver Gráfico de Barras';

        // CONDICIONAL: Se destruye la instancia anterior del gráfico para liberar memoria
        if (graficoMediaInstancia !== null) {
            try {
                graficoMediaInstancia.destroy();
            } catch (errorDestruccion) {
                // En caso de error al destruir, se ignora silenciosamente
            }
            graficoMediaInstancia = null;
        }
        return;
    }

    // --- SECCION: MOSTRAR GRÁFICO ---
    contenedorResultado.classList.remove('oculto');
    botonInteractivo.textContent = '✖ Ocultar Gráfico';

    // Se reemplaza el canvas físicamente para evitar el error "Canvas already in use"
    let canvasAnterior = document.getElementById('graficaMedia');

    // CONDICIONAL: Si no existe el canvas, se cancela la operación
    if (!canvasAnterior) {
        return;
    }

    let canvasNuevo = document.createElement('canvas');
    canvasNuevo.id = 'graficaMedia';
    canvasAnterior.parentNode.replaceChild(canvasNuevo, canvasAnterior);

    // setTimeout: Permite que el navegador calcule el tamaño real del nuevo canvas
    // antes de que Chart.js intente renderizar el gráfico
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

/**
 * Funcion: toggleEjemploMediana
 * Alterna la visibilidad del ejemplo interactivo de cálculo de mediana.
 * Utiliza la función externa calcularMediana definida en mediana.js.
 */
function toggleEjemploMediana() {
    let contenedorResultado = document.getElementById('resultado-mediana');
    let botonInteractivo = document.getElementById('btn-ejemplo-mediana');

    // CONDICIONAL: Si el contenedor está oculto, se calcula y muestra la tabla
    if (contenedorResultado.classList.contains('oculto')) {
        calcularMediana(cargarDatos(), 'calificacion', 'resultado-mediana', 'nombre');
        contenedorResultado.classList.remove('oculto');
        botonInteractivo.textContent = '✖ Ocultar Ejemplo';
    } else {
        contenedorResultado.classList.add('oculto');
        botonInteractivo.textContent = '▶ Calcular Mediana';
    }
}

/**
 * Funcion: toggleGraficoMediana
 * Alterna la visibilidad del gráfico de barras horizontales de la mediana.
 */
function toggleGraficoMediana() {
    let contenedorResultado = document.getElementById('contenedor-grafico-mediana');
    let botonInteractivo = document.getElementById('btn-grafico-mediana');

    // CONDICIONAL: Validación de existencia de elementos en el DOM
    if (!contenedorResultado || !botonInteractivo) {
        return;
    }

    // --- SECCION: OCULTAR GRÁFICO ---
    if (!contenedorResultado.classList.contains('oculto')) {
        contenedorResultado.classList.add('oculto');
        botonInteractivo.textContent = '📊 Ver Gráfico de Barras Horizontales';
        return;
    }

    // --- SECCION: MOSTRAR GRÁFICO ---
    contenedorResultado.classList.remove('oculto');
    botonInteractivo.textContent = '✖ Ocultar Gráfico';

    // Se reemplaza el canvas para evitar conflictos de instancia en Chart.js
    let canvasAnterior = document.getElementById('graficaMediana');

    // CONDICIONAL: Solo se reemplaza si el canvas existe y tiene nodo padre
    if (canvasAnterior && canvasAnterior.parentNode) {
        let canvasNuevo = document.createElement('canvas');
        canvasNuevo.id = 'graficaMediana';
        canvasAnterior.parentNode.replaceChild(canvasNuevo, canvasAnterior);
    }

    // setTimeout: Da tiempo al DOM para que el nuevo canvas tenga dimensiones reales
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

// Variable de control para la instancia del gráfico de moda (Chart.js)
let graficoModaInstancia = null;

/**
 * Funcion: toggleEjemploModa
 * Alterna la visibilidad del ejemplo interactivo de cálculo de moda.
 * Utiliza la función externa calcularModa definida en moda.js.
 */
function toggleEjemploModa() {
    let contenedorResultado = document.getElementById('resultado-moda');
    let botonInteractivo = document.getElementById('btn-ejemplo-moda');

    // CONDICIONAL: Si está oculto, se calcula la moda y se muestra la tabla
    if (contenedorResultado.classList.contains('oculto')) {
        calcularModa(cargarDatos(), 'calificacion', 'resultado-moda', 'nombre');
        contenedorResultado.classList.remove('oculto');
        botonInteractivo.textContent = '✖ Ocultar Ejemplo';
    } else {
        contenedorResultado.classList.add('oculto');
        botonInteractivo.textContent = '▶ Calcular Moda';
    }
}

/**
 * Funcion: toggleGraficoModa
 * Alterna la visibilidad del gráfico de frecuencias de la moda.
 */
function toggleGraficoModa() {
    let contenedorResultado = document.getElementById('contenedor-grafico-moda');
    let botonInteractivo = document.getElementById('btn-grafico-moda');

    // CONDICIONAL: Validación de existencia de elementos en el DOM
    if (!contenedorResultado || !botonInteractivo) {
        return;
    }

    // --- SECCION: OCULTAR GRÁFICO ---
    if (!contenedorResultado.classList.contains('oculto')) {
        contenedorResultado.classList.add('oculto');
        botonInteractivo.textContent = '📊 Ver Gráfico de Frecuencias';

        // CONDICIONAL: Se destruye la instancia previa del gráfico
        if (graficoModaInstancia) {
            try {
                graficoModaInstancia.destroy();
            } catch (errorDestruccion) {
                // Se ignora el error si la instancia ya no es válida
            }
            graficoModaInstancia = null;
        }
        return;
    }

    // --- SECCION: MOSTRAR GRÁFICO ---
    contenedorResultado.classList.remove('oculto');
    botonInteractivo.textContent = '✖ Ocultar Gráfico';

    // Se reemplaza el canvas físicamente para evitar "Canvas already in use"
    let canvasAnterior = document.getElementById('graficaModa');

    // CONDICIONAL: Si no existe el canvas, se cancela la operación
    if (!canvasAnterior) {
        return;
    }

    let canvasNuevo = document.createElement('canvas');
    canvasNuevo.id = 'graficaModa';
    canvasAnterior.parentNode.replaceChild(canvasNuevo, canvasAnterior);

    // setTimeout: Permite que el navegador renderice el canvas con tamaño correcto
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

// Variable de control para la instancia del gráfico de mínimo y máximo (Chart.js)
let graficoMinMaxInstancia = null;

/**
 * Funcion: toggleEjemploMinMax
 * Alterna la visibilidad del ejemplo interactivo de mínimo y máximo.
 * Utiliza la función externa calcularMinMax definida en minMax.js.
 */
function toggleEjemploMinMax() {
    let contenedorResultado = document.getElementById('resultado-minmax');
    let botonInteractivo = document.getElementById('btn-ejemplo-minmax');

    // CONDICIONAL: Validación de existencia de elementos en el DOM
    if (!contenedorResultado || !botonInteractivo) {
        return;
    }

    // CONDICIONAL: Si está oculto, se calcula y muestra la tabla
    if (contenedorResultado.classList.contains('oculto')) {
        calcularMinMax(cargarDatos(), 'calificacion', 'resultado-minmax', 'nombre');
        contenedorResultado.classList.remove('oculto');
        botonInteractivo.textContent = '✖ Ocultar Ejemplo';
    } else {
        contenedorResultado.classList.add('oculto');
        botonInteractivo.textContent = '▶ Calcular Mínimo y Máximo';
    }
}

/**
 * Funcion: toggleGraficoMinMax
 * Alterna la visibilidad del gráfico de barras de mínimo y máximo.
 */
function toggleGraficoMinMax() {
    let contenedorResultado = document.getElementById('contenedor-grafico-minmax');
    let botonInteractivo = document.getElementById('btn-grafico-minmax');

    // CONDICIONAL: Validación de existencia de elementos en el DOM
    if (!contenedorResultado || !botonInteractivo) {
        return;
    }

    // --- SECCION: OCULTAR GRÁFICO ---
    if (!contenedorResultado.classList.contains('oculto')) {
        contenedorResultado.classList.add('oculto');
        botonInteractivo.textContent = '📊 Ver Gráfico de Barras';

        // CONDICIONAL: Se destruye la instancia previa para liberar memoria
        if (graficoMinMaxInstancia) {
            try {
                graficoMinMaxInstancia.destroy();
            } catch (errorDestruccion) {
                // Se ignora el error si la instancia ya no es válida
            }
            graficoMinMaxInstancia = null;
        }
        return;
    }

    // --- SECCION: MOSTRAR GRÁFICO ---
    contenedorResultado.classList.remove('oculto');
    botonInteractivo.textContent = '✖ Ocultar Gráfico';

    // CONDICIONAL: Se destruye cualquier instancia previa antes de crear una nueva
    if (graficoMinMaxInstancia) {
        try {
            graficoMinMaxInstancia.destroy();
        } catch (errorDestruccion) {
            // Se ignora el error si la instancia ya no es válida
        }
        graficoMinMaxInstancia = null;
    }

    // Se reemplaza el canvas físicamente para evitar "Canvas already in use"
    let canvasAnterior = document.getElementById('graficaMinMax');

    // CONDICIONAL: Si no existe el canvas, se cancela la operación
    if (!canvasAnterior) {
        return;
    }

    let canvasNuevo = document.createElement('canvas');
    canvasNuevo.id = 'graficaMinMax';
    canvasAnterior.parentNode.replaceChild(canvasNuevo, canvasAnterior);

    // setTimeout: Da tiempo al DOM para que el canvas nuevo tenga tamaño real
    setTimeout(function () {
        // dibujarGraficoMinMax viene de minMax.js
        // Parámetros: arreglo, campoNumerico, canvasId, titulo
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

// Variable de control para la instancia del gráfico de rango (Chart.js)
// NOTA: Esta declaración faltaba en el código original y causaba error de referencia
let graficoRangoEjemploInstancia = null;

/**
 * Funcion: toggleEjemploRango
 * Alterna la visibilidad del ejemplo interactivo de cálculo de rango.
 * Utiliza la función externa calcularRango definida en rango.js.
 */
function toggleEjemploRango() {
    let contenedorResultado = document.getElementById('resultado-rango');
    let botonInteractivo = document.getElementById('btn-ejemplo-rango');

    // CONDICIONAL: Si está oculto, se calcula y muestra la tabla
    if (contenedorResultado.classList.contains('oculto')) {
        calcularRango(cargarDatos(), 'calificacion', 'resultado-rango', 'nombre');
        contenedorResultado.classList.remove('oculto');
        botonInteractivo.textContent = '✖ Ocultar Ejemplo';
    } else {
        contenedorResultado.classList.add('oculto');
        botonInteractivo.textContent = '▶ Calcular Rango';
    }
}

/**
 * Funcion: toggleGraficoRango
 * Alterna la visibilidad del gráfico de barras verticales del rango.
 */
function toggleGraficoRango() {
    let contenedorResultado = document.getElementById('contenedor-grafico-rango');
    let botonInteractivo = document.getElementById('btn-grafico-rango');

    // CONDICIONAL: Validación de existencia de elementos en el DOM
    if (!contenedorResultado || !botonInteractivo) {
        return;
    }

    // --- SECCION: OCULTAR GRÁFICO ---
    if (!contenedorResultado.classList.contains('oculto')) {
        contenedorResultado.classList.add('oculto');
        botonInteractivo.textContent = '📊 Ver Gráfico de Barras Verticales';

        // CONDICIONAL: Se destruye la instancia previa si existe
        if (graficoRangoEjemploInstancia !== null) {
            try {
                graficoRangoEjemploInstancia.destroy();
            } catch (errorDestruccion) {
                // Se ignora el error si la instancia ya no es válida
            }
            graficoRangoEjemploInstancia = null;
        }
        return;
    }

    // --- SECCION: MOSTRAR GRÁFICO ---
    contenedorResultado.classList.remove('oculto');
    botonInteractivo.textContent = '✖ Ocultar Gráfico';

    // Se reemplaza el canvas físicamente para evitar "Canvas already in use"
    let canvasAnterior = document.getElementById('graficaRango');

    // CONDICIONAL: Si no existe el canvas, se cancela la operación
    if (!canvasAnterior) {
        return;
    }

    let canvasNuevo = document.createElement('canvas');
    canvasNuevo.id = 'graficaRango';
    canvasAnterior.parentNode.replaceChild(canvasNuevo, canvasAnterior);

    // setTimeout: Permite que el navegador calcule el tamaño real del nuevo canvas
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

// Variable de control para la instancia del gráfico de varianza (Chart.js)
let graficoVarianzaInstancia = null;

/**
 * Funcion: calcularVarianzaDesdeArreglo
 * Realiza el cálculo matemático completo de la varianza poblacional
 * a partir de un arreglo de calificaciones numéricas.
 */
function calcularVarianzaEjemploDesdeArreglo(listaCalificaciones) {

    // Se calcula la suma total de todas las calificaciones
    let sumaCalificaciones = 0;

    // BUCLE: Se acumulan todas las calificaciones en sumaCalificaciones
    for (let indiceCalificacion = 0; indiceCalificacion < listaCalificaciones.length; indiceCalificacion++) {
        sumaCalificaciones = sumaCalificaciones + listaCalificaciones[indiceCalificacion];
    }

    // Se obtiene la media aritmética dividiendo la suma entre la cantidad de elementos
    let valorMedia = sumaCalificaciones / listaCalificaciones.length;

    let sumaCuadradosDiferencias = 0;
    let listaDetallesCalculo = [];

    // BUCLE: Se calcula la diferencia al cuadrado de cada calificación respecto a la media
    for (let indiceCalificacion = 0; indiceCalificacion < listaCalificaciones.length; indiceCalificacion++) {
        let valorDiferencia = listaCalificaciones[indiceCalificacion] - valorMedia;
        let valorCuadrado = valorDiferencia * valorDiferencia;

        sumaCuadradosDiferencias = sumaCuadradosDiferencias + valorCuadrado;

        listaDetallesCalculo.push({
            calificacion: listaCalificaciones[indiceCalificacion],
            diferencia: valorDiferencia,
            cuadrado: valorCuadrado
        });
    }

    // La varianza es el promedio de las diferencias al cuadrado
    let valorVarianza = sumaCuadradosDiferencias / listaCalificaciones.length;

    return {
        media: valorMedia,
        sumaCuadrados: sumaCuadradosDiferencias,
        cantidad: listaCalificaciones.length,
        varianza: valorVarianza,
        detalles: listaDetallesCalculo
    };
}

/**
 * Funcion: toggleEjemploVarianza
 * Alterna la visibilidad del ejemplo interactivo de varianza.
 */
function toggleEjemploVarianza() {
    let contenedorResultado = document.getElementById('resultado-varianza');
    let botonInteractivo = document.getElementById('btn-ejemplo-varianza');

    // CONDICIONAL: Si está oculto, se genera el HTML del cálculo y se muestra
    if (contenedorResultado.classList.contains('oculto')) {
        calcularVarianzaEjemplo();
        contenedorResultado.classList.remove('oculto');
        botonInteractivo.textContent = '✖ Ocultar Ejemplo';
    } else {
        contenedorResultado.classList.add('oculto');
        botonInteractivo.textContent = '▶ Calcular Varianza';
    }
}

/**
 * Funcion: calcularVarianza
 * Genera el HTML completo de la tabla interactiva de varianza
 * con el paso a paso del cálculo estadístico.
 */
function calcularVarianzaEjemplo() {
    let listaEstudiantes = cargarDatos();
    let listaCalificaciones = obtenerCalificaciones(listaEstudiantes);
    let resultadoEstadistico = calcularVarianzaEjemploDesdeArreglo(listaCalificaciones);

    let contenidoHTML = "";

    contenidoHTML = contenidoHTML + '<p><strong>Cálculo de varianza usando las calificaciones de los estudiantes:</strong></p>';

    contenidoHTML = contenidoHTML + '<table class="tabla-interactiva">';
    contenidoHTML = contenidoHTML + '<tr>';
    contenidoHTML = contenidoHTML + '<th>#</th>';
    contenidoHTML = contenidoHTML + '<th>Estudiante</th>';
    contenidoHTML = contenidoHTML + '<th>Calificación</th>';
    contenidoHTML = contenidoHTML + '<th>Diferencia con la media</th>';
    contenidoHTML = contenidoHTML + '<th>Diferencia al cuadrado</th>';
    contenidoHTML = contenidoHTML + '</tr>';

    // BUCLE: Se construye cada fila de la tabla con los datos de cada estudiante
    for (let indiceEstudiante = 0; indiceEstudiante < listaEstudiantes.length; indiceEstudiante++) {
        contenidoHTML = contenidoHTML + '<tr>';
        contenidoHTML = contenidoHTML + '<td>' + (indiceEstudiante + 1) + '</td>';
        contenidoHTML = contenidoHTML + '<td>' + listaEstudiantes[indiceEstudiante].nombre + '</td>';
        contenidoHTML = contenidoHTML + '<td>' + listaEstudiantes[indiceEstudiante].calificacion + '</td>';
        contenidoHTML = contenidoHTML + '<td>' + resultadoEstadistico.detalles[indiceEstudiante].diferencia.toFixed(2) + '</td>';
        contenidoHTML = contenidoHTML + '<td>' + resultadoEstadistico.detalles[indiceEstudiante].cuadrado.toFixed(2) + '</td>';
        contenidoHTML = contenidoHTML + '</tr>';
    }

    contenidoHTML = contenidoHTML + '</table>';

    contenidoHTML = contenidoHTML + '<div class="detalle-calculo">';
    contenidoHTML = contenidoHTML + 'Media: <strong>' + resultadoEstadistico.media.toFixed(2) + '</strong><br>';
    contenidoHTML = contenidoHTML + 'Suma de diferencias al cuadrado: <strong>' + resultadoEstadistico.sumaCuadrados.toFixed(2) + '</strong><br>';
    contenidoHTML = contenidoHTML + 'Cantidad de datos: <strong>' + resultadoEstadistico.cantidad + '</strong><br>';
    contenidoHTML = contenidoHTML + 'Fórmula: Varianza = Suma de cuadrados / Cantidad de datos<br>';
    contenidoHTML = contenidoHTML + 'Varianza = ' + resultadoEstadistico.sumaCuadrados.toFixed(2) + ' / ' + resultadoEstadistico.cantidad;
    contenidoHTML = contenidoHTML + '</div>';

    contenidoHTML = contenidoHTML + '<div class="caja-resultado">';
    contenidoHTML = contenidoHTML + '📊 La varianza es: <strong>' + resultadoEstadistico.varianza.toFixed(2) + '</strong>';
    contenidoHTML = contenidoHTML + '</div>';

    document.getElementById('resultado-varianza').innerHTML = contenidoHTML;
}

/**
 * Funcion: toggleGraficoVarianza
 * Alterna la visibilidad del gráfico comparativo de varianza.
 */
function toggleGraficoVarianza() {
    let contenedorResultado = document.getElementById('contenedor-grafico-varianza');
    let botonInteractivo = document.getElementById('btn-grafico-varianza');

    // CONDICIONAL: Si está oculto, se muestra y se genera el gráfico
    if (contenedorResultado.classList.contains('oculto')) {
        contenedorResultado.classList.remove('oculto');
        botonInteractivo.textContent = '✖ Ocultar Gráfico';

        // Se reemplaza el canvas físicamente para evitar conflictos de instancia
        let canvasAnterior = document.getElementById('graficaVarianza');
        let canvasNuevo = document.createElement('canvas');
        canvasNuevo.id = 'graficaVarianza';
        canvasAnterior.parentNode.replaceChild(canvasNuevo, canvasAnterior);

        graficoVarianzaInstancia = dibujarGraficoVarianzaEjemplo();

    } else {
        // Si está visible, se oculta y se actualiza el texto del botón
        contenedorResultado.classList.add('oculto');
        botonInteractivo.textContent = '📊 Ver Gráfico de Varianza';
    }
}

/**
 * Funcion: dibujarGraficoVarianza
 * Renderiza el gráfico de barras de calificaciones superpuesto con la línea de media.
 * Utiliza Chart.js para la visualización.
 */
function dibujarGraficoVarianzaEjemplo() {
    let listaEstudiantes = cargarDatos();
    let listaCalificaciones = obtenerCalificaciones(listaEstudiantes);
    let resultadoEstadistico = calcularVarianzaEjemploDesdeArreglo(listaCalificaciones);

    let listaNombresEstudiantes = [];

    // BUCLE: Se extraen los nombres de los estudiantes para las etiquetas del gráfico
    for (let indiceEstudiante = 0; indiceEstudiante < listaEstudiantes.length; indiceEstudiante++) {
        listaNombresEstudiantes.push(listaEstudiantes[indiceEstudiante].nombre);
    }

    // Se obtiene el contexto 2D del canvas para Chart.js
    let contextoGrafico = document.getElementById('graficaVarianza').getContext('2d');

    return new Chart(contextoGrafico, {
        type: 'bar',
        data: {
            labels: listaNombresEstudiantes,
            datasets: [
                {
                    label: 'Calificación',
                    data: listaCalificaciones,
                    backgroundColor: 'rgba(99, 144, 241, 0.6)',
                    borderColor: 'rgba(99, 144, 241, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Media (' + resultadoEstadistico.media.toFixed(2) + ')',
                    data: new Array(listaCalificaciones.length).fill(resultadoEstadistico.media),
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
                    text: 'Calificaciones comparadas con la media — Varianza: ' + resultadoEstadistico.varianza.toFixed(2)
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

// Variable de control para la instancia del gráfico de desviación estándar (Chart.js)
let graficoDesviacionInstancia = null;

/**
 * Funcion: calcularDesviacionDesdeArreglo
 * Calcula la desviación estándar poblacional a partir de un arreglo numérico.
 * Reutiliza el cálculo de varianza y aplica la raíz cuadrada.
 */
function calcularDesviacionEjemploDesdeArreglo(listaCalificaciones) {

    let resultadoVarianza = calcularVarianzaEjemploDesdeArreglo(listaCalificaciones);

    let valorDesviacion = Math.sqrt(resultadoVarianza.varianza);

    return {
        media: resultadoVarianza.media,
        sumaCuadrados: resultadoVarianza.sumaCuadrados,
        cantidad: resultadoVarianza.cantidad,
        varianza: resultadoVarianza.varianza,
        desviacion: valorDesviacion,
        detalles: resultadoVarianza.detalles
    };
}

/**
 * Funcion: toggleEjemploDesviacion
 * Alterna la visibilidad del ejemplo interactivo de desviación estándar.
 */
function toggleEjemploDesviacion() {
    let contenedorResultado = document.getElementById('resultado-desviacion');
    let botonInteractivo = document.getElementById('btn-ejemplo-desviacion');

    // CONDICIONAL: Si está oculto, se genera el HTML del cálculo y se muestra
    if (contenedorResultado.classList.contains('oculto')) {
        calcularDesviacionEjemplo();
        contenedorResultado.classList.remove('oculto');
        botonInteractivo.textContent = '✖ Ocultar Ejemplo';
    } else {
        contenedorResultado.classList.add('oculto');
        botonInteractivo.textContent = '▶ Calcular Desviación Estándar';
    }
}

/**
 * Funcion: calcularDesviacion
 * Genera el HTML completo de la tabla interactiva de desviación estándar
 * incluyendo el paso a paso desde la varianza hasta la raíz cuadrada.
 */
function calcularDesviacionEjemplo() {
    let listaEstudiantes = cargarDatos();
    let listaCalificaciones = obtenerCalificaciones(listaEstudiantes);
    let resultadoEstadistico = calcularDesviacionEjemploDesdeArreglo(listaCalificaciones);

    let contenidoHTML = "";

    contenidoHTML = contenidoHTML + '<p><strong>Cálculo de desviación estándar usando las calificaciones de los estudiantes:</strong></p>';

    contenidoHTML = contenidoHTML + '<table class="tabla-interactiva">';
    contenidoHTML = contenidoHTML + '<tr>';
    contenidoHTML = contenidoHTML + '<th>#</th>';
    contenidoHTML = contenidoHTML + '<th>Estudiante</th>';
    contenidoHTML = contenidoHTML + '<th>Calificación</th>';
    contenidoHTML = contenidoHTML + '<th>Diferencia con la media</th>';
    contenidoHTML = contenidoHTML + '<th>Diferencia al cuadrado</th>';
    contenidoHTML = contenidoHTML + '</tr>';

    // BUCLE: Se construye cada fila de la tabla con los datos detallados
    for (let indiceEstudiante = 0; indiceEstudiante < listaEstudiantes.length; indiceEstudiante++) {
        contenidoHTML = contenidoHTML + '<tr>';
        contenidoHTML = contenidoHTML + '<td>' + (indiceEstudiante + 1) + '</td>';
        contenidoHTML = contenidoHTML + '<td>' + listaEstudiantes[indiceEstudiante].nombre + '</td>';
        contenidoHTML = contenidoHTML + '<td>' + listaEstudiantes[indiceEstudiante].calificacion + '</td>';
        contenidoHTML = contenidoHTML + '<td>' + resultadoEstadistico.detalles[indiceEstudiante].diferencia.toFixed(2) + '</td>';
        contenidoHTML = contenidoHTML + '<td>' + resultadoEstadistico.detalles[indiceEstudiante].cuadrado.toFixed(2) + '</td>';
        contenidoHTML = contenidoHTML + '</tr>';
    }

    contenidoHTML = contenidoHTML + '</table>';

    contenidoHTML = contenidoHTML + '<div class="detalle-calculo">';
    contenidoHTML = contenidoHTML + 'Media: <strong>' + resultadoEstadistico.media.toFixed(2) + '</strong><br>';
    contenidoHTML = contenidoHTML + 'Suma de diferencias al cuadrado: <strong>' + resultadoEstadistico.sumaCuadrados.toFixed(2) + '</strong><br>';
    contenidoHTML = contenidoHTML + 'Cantidad de datos: <strong>' + resultadoEstadistico.cantidad + '</strong><br>';
    contenidoHTML = contenidoHTML + 'Varianza: <strong>' + resultadoEstadistico.varianza.toFixed(2) + '</strong><br>';
    contenidoHTML = contenidoHTML + 'Fórmula: Desviación Estándar = √Varianza<br>';
    contenidoHTML = contenidoHTML + 'Desviación Estándar = √' + resultadoEstadistico.varianza.toFixed(2);
    contenidoHTML = contenidoHTML + '</div>';

    contenidoHTML = contenidoHTML + '<div class="caja-resultado">';
    contenidoHTML = contenidoHTML + '📈 La desviación estándar es: <strong>' + resultadoEstadistico.desviacion.toFixed(2) + '</strong>';
    contenidoHTML = contenidoHTML + '</div>';

    document.getElementById('resultado-desviacion').innerHTML = contenidoHTML;
}

/**
 * Funcion: toggleGraficoDesviacion
 * Alterna la visibilidad del gráfico de desviación estándar.
 */
function toggleGraficoDesviacion() {
    let contenedorResultado = document.getElementById('contenedor-grafico-desviacion');
    let botonInteractivo = document.getElementById('btn-grafico-desviacion');

    // CONDICIONAL: Si está oculto, se muestra y se genera el gráfico
    if (contenedorResultado.classList.contains('oculto')) {
        contenedorResultado.classList.remove('oculto');
        botonInteractivo.textContent = '✖ Ocultar Gráfico';

        // Se reemplaza el canvas físicamente para evitar conflictos de instancia
        let canvasAnterior = document.getElementById('graficaDesviacion');
        let canvasNuevo = document.createElement('canvas');
        canvasNuevo.id = 'graficaDesviacion';
        canvasAnterior.parentNode.replaceChild(canvasNuevo, canvasAnterior);

        graficoDesviacionInstancia = dibujarGraficoDesviacionEjemplo();

    } else {
        contenedorResultado.classList.add('oculto');
        botonInteractivo.textContent = '📊 Ver Gráfico de Desviación Estándar';
    }
}

/**
 * Funcion: dibujarGraficoDesviacion
 * Renderiza el gráfico de barras con líneas de media y desviación estándar.
 * Muestra visualmente los límites superior e inferior (media ± desviación).
 */
function dibujarGraficoDesviacionEjemplo() {
    let listaEstudiantes = cargarDatos();
    let listaCalificaciones = obtenerCalificaciones(listaEstudiantes);
    let resultadoEstadistico = calcularDesviacionDesdeArreglo(listaCalificaciones);

    let listaNombresEstudiantes = [];

    // BUCLE: Se extraen los nombres para las etiquetas del eje X
    for (let indiceEstudiante = 0; indiceEstudiante < listaEstudiantes.length; indiceEstudiante++) {
        listaNombresEstudiantes.push(listaEstudiantes[indiceEstudiante].nombre);
    }

    // Se calculan los límites teóricos de la desviación estándar
    let limiteSuperiorDesviacion = resultadoEstadistico.media + resultadoEstadistico.desviacion;
    let limiteInferiorDesviacion = resultadoEstadistico.media - resultadoEstadistico.desviacion;

    // Se obtiene el contexto 2D del canvas para Chart.js
    let contextoGrafico = document.getElementById('graficaDesviacion').getContext('2d');

    return new Chart(contextoGrafico, {
        type: 'bar',
        data: {
            labels: listaNombresEstudiantes,
            datasets: [
                {
                    label: 'Calificación',
                    data: listaCalificaciones,
                    backgroundColor: 'rgba(99, 144, 241, 0.6)',
                    borderColor: 'rgba(99, 144, 241, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Media (' + resultadoEstadistico.media.toFixed(2) + ')',
                    data: new Array(listaCalificaciones.length).fill(resultadoEstadistico.media),
                    type: 'line',
                    borderColor: 'rgba(239, 68, 68, 1)',
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: false
                },
                {
                    label: 'Media + Desviación (' + limiteSuperiorDesviacion.toFixed(2) + ')',
                    data: new Array(listaCalificaciones.length).fill(limiteSuperiorDesviacion),
                    type: 'line',
                    borderColor: 'rgba(34, 197, 94, 1)',
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: false
                },
                {
                    label: 'Media - Desviación (' + limiteInferiorDesviacion.toFixed(2) + ')',
                    data: new Array(listaCalificaciones.length).fill(limiteInferiorDesviacion),
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
                    text: 'Desviación estándar: ' + resultadoEstadistico.desviacion.toFixed(2)
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

/**
 * Funcion: generarTest
 * Construye dinámicamente el HTML del cuestionario de evaluación
 * utilizando las preguntas definidas en la variable global PREGUNTASTEST.
 */
function generarTest() {
    let contenedorEvaluacion = document.getElementById("contenedor-test");
    let contenidoHTMLTest = "";

    // BUCLE EXTERNO: Se recorre cada pregunta del arreglo de preguntas
    for (let indicePregunta = 0; indicePregunta < PREGUNTASTEST.length; indicePregunta++) {
        contenidoHTMLTest = contenidoHTMLTest + '<div class="pregunta">';
        contenidoHTMLTest = contenidoHTMLTest + '<p><strong>' + (indicePregunta + 1) + '. ' + PREGUNTASTEST[indicePregunta].pregunta + '</strong></p>';

        // BUCLE INTERNO: Se recorren las opciones de respuesta de la pregunta actual
        for (let indiceOpcion = 0; indiceOpcion < PREGUNTASTEST[indicePregunta].opciones.length; indiceOpcion++) {
            contenidoHTMLTest = contenidoHTMLTest + '<label>';
            contenidoHTMLTest = contenidoHTMLTest + '<input type="radio" name="pregunta' + indicePregunta + '" value="' + indiceOpcion + '"> ';
            contenidoHTMLTest = contenidoHTMLTest + PREGUNTASTEST[indicePregunta].opciones[indiceOpcion];
            contenidoHTMLTest = contenidoHTMLTest + '</label><br>';
        }
        contenidoHTMLTest = contenidoHTMLTest + '</div>';
    }
    contenedorEvaluacion.innerHTML = contenidoHTMLTest;
}

// Se ejecuta la generación del test inmediatamente al cargar el script
generarTest();

/**
 * Funcion: calificarTest
 * Evalúa las respuestas seleccionadas por el usuario, calcula el puntaje,
 * muestra la nota final e inserta íconos visuales de validación.
 */
function calificarTest() {
    let puntajeObtenido = 0;
    let cantidadPreguntasRespondidas = 0;

    // BUCLE: Se recorre cada pregunta para verificar la respuesta del usuario
    for (let indicePregunta = 0; indicePregunta < PREGUNTASTEST.length; indicePregunta++) {
        let opcionSeleccionada = document.querySelector('input[name="pregunta' + indicePregunta + '"]:checked');

        // CONDICIONAL: Si el usuario seleccionó una respuesta para esta pregunta
        if (opcionSeleccionada != null) {
            cantidadPreguntasRespondidas++;

            let indiceRespuestaUsuario = Number(opcionSeleccionada.value);

            // CONDICIONAL: Se compara el índice seleccionado con la respuesta correcta
            if (indiceRespuestaUsuario === PREGUNTASTEST[indicePregunta].correcta) {
                puntajeObtenido++;
            }

            // --- SECCION: VALIDACION VISUAL CON ICONOS ---
            let listaOpciones = document.querySelectorAll('input[name="pregunta' + indicePregunta + '"]');

            // BUCLE: Se recorren todas las opciones para agregar íconos de check o X
            for (let indiceOpcion = 0; indiceOpcion < listaOpciones.length; indiceOpcion++) {
                let elementoIcono = document.createElement('span');
                elementoIcono.className = 'icono-validacion';

                // CONDICIONAL: Si la opción actual es la correcta, se agrega check verde
                if (indiceOpcion === PREGUNTASTEST[indicePregunta].correcta) {
                    elementoIcono.textContent = ' ✔';
                    elementoIcono.style.color = '#16a34a';
                    elementoIcono.style.fontWeight = 'bold';
                } else if (indiceOpcion === indiceRespuestaUsuario) {
                    // Si es la opción seleccionada por el usuario pero no es la correcta, X roja
                    elementoIcono.textContent = ' ✘';
                    elementoIcono.style.color = '#dc2626';
                    elementoIcono.style.fontWeight = 'bold';
                }

                // CONDICIONAL: Solo se agrega el ícono al DOM si se asignó un contenido
                if (elementoIcono.textContent !== '') {
                    listaOpciones[indiceOpcion].parentNode.appendChild(elementoIcono);
                }
            }
            // --- FIN VALIDACION VISUAL ---
        }
    }

    let elementoResultado = document.getElementById("resultado-test");

    // CONDICIONAL: Si no se respondieron todas las preguntas, se muestra alerta
    if (cantidadPreguntasRespondidas < PREGUNTASTEST.length) {
        elementoResultado.innerHTML = "Incorrecto - Por favor, responde todas las preguntas antes de calificar.";
        elementoResultado.className = "resultado-alerta";
        return;
    }

    // Se calcula la nota final sobre 10 puntos
    let notaFinal = puntajeObtenido * 2;

    // CONDICIONAL: Se determina el mensaje y el estilo según el puntaje obtenido
    if (puntajeObtenido >= 4) {
        elementoResultado.innerHTML = "¡Excelente! Obtuviste " + puntajeObtenido + " de 5 respuestas correctas. Tu nota es " + notaFinal + "/10.";
        elementoResultado.className = "resultado-aprobado";
    } else if (puntajeObtenido === 3) {
        elementoResultado.innerHTML = "Buen intento. Obtuviste " + puntajeObtenido + " de 5 respuestas correctas. Tu nota es " + notaFinal + "/10.";
        elementoResultado.className = "resultado-medio";
    } else {
        elementoResultado.innerHTML = "Necesitas repasar un poco más. Obtuviste " + puntajeObtenido + " de 5 respuestas correctas. Tu nota es " + notaFinal + "/10.";
        elementoResultado.className = "resultado-reprobado";
    }
}

/**
 * Funcion: reiniciarTest
 * Limpia todas las selecciones del usuario, elimina los íconos de validación
 * y borra el mensaje de resultado para permitir un nuevo intento.
 */
function reiniciarTest() {

    let listaOpcionesRadio = document.querySelectorAll('#contenedor-test input[type="radio"]');

    // BUCLE: Se desmarcan todos los radio buttons del test
    for (let indiceOpcion = 0; indiceOpcion < listaOpcionesRadio.length; indiceOpcion++) {
        listaOpcionesRadio[indiceOpcion].checked = false;
    }

    let elementoResultado = document.getElementById("resultado-test");

    // --- SECCION: LIMPIEZA DE ICONOS DE VALIDACION ---
    let listaIconosValidacion = document.querySelectorAll('#contenedor-test .icono-validacion');

    // BUCLE: Se eliminan todos los íconos de check/X generados previamente
    for (let indiceIcono = 0; indiceIcono < listaIconosValidacion.length; indiceIcono++) {
        listaIconosValidacion[indiceIcono].remove();
    }
    // --- FIN LIMPIEZA ---

    // Se limpia el contenido y las clases del contenedor de resultados
    elementoResultado.innerHTML = "";
    elementoResultado.className = "";
}


// ============================================================
// BLOQUE 12: EJERCICIO PRACTICO - SOCIAL MEDIA (INTEGRADO con media.js)
// ============================================================

// Variable de control para la instancia del gráfico del ejercicio práctico (Chart.js)
let graficoEjercicioInstancia = null;

// Nombre de la columna numérica en social_media_200.js que se utilizará para los cálculos
const COLUMNA_CALCULO_EJERCICIO = 'Daily_Minutes_Spent';
// Nombre de la propiedad que identifica cada registro (etiqueta textual)
const NOMBRE_ETIQUETA_EJERCICIO = 'App';

/**
 * Funcion: cargarDatosSocial
 * Obtiene de forma segura los datos desde la variable global SOCIAL_MEDIA_USAGE
 * definida en el archivo social_media_200.js.
 */
function cargarDatosSocial() {
    if (typeof SOCIAL_MEDIA_USAGE === 'undefined' || !SOCIAL_MEDIA_USAGE.datos_redes) {
        return [];
    }
    return SOCIAL_MEDIA_USAGE.datos_redes;
}

/**
 * Funcion: agruparMediaPorApp
 * Agrupa los registros del dataset por nombre de aplicación (App) y calcula
 * la media de la columna Daily_Minutes_Spent para cada grupo.
 * Utiliza calcularMedia de media.js cuando está disponible.
 */
function agruparMediaPorApp() {
    let registrosRedesSociales = cargarDatosSocial();

    // mapaAgrupacion almacena temporalmente listas de registros por aplicación
    let mapaAgrupacion = {};

    // BUCLE: Se clasifica cada registro según su nombre de aplicación
    for (let indiceRegistro = 0; indiceRegistro < registrosRedesSociales.length; indiceRegistro++) {
        let registroIndividual = registrosRedesSociales[indiceRegistro];
        let nombreAplicacion = registroIndividual[NOMBRE_ETIQUETA_EJERCICIO] || 'SinNombre';

        // CONDICIONAL: Si la aplicación no existe en el mapa, se inicializa su arreglo
        if (!mapaAgrupacion[nombreAplicacion]) {
            mapaAgrupacion[nombreAplicacion] = [];
        }
        mapaAgrupacion[nombreAplicacion].push(registroIndividual);
    }

    // Se convierte el mapa en un arreglo de objetos con la media por aplicación
    let listaMediaPorAplicacion = [];

    // Se extraen los nombres de las aplicaciones y se ordenan alfabéticamente
    let listaNombresAplicaciones = [];
    for (let claveAplicacion in mapaAgrupacion) {
        listaNombresAplicaciones.push(claveAplicacion);
    }
    listaNombresAplicaciones.sort();

    // BUCLE: Se calcula la media para cada aplicación ordenada
    for (let indiceAplicacion = 0; indiceAplicacion < listaNombresAplicaciones.length; indiceAplicacion++) {
        let nombreAplicacion = listaNombresAplicaciones[indiceAplicacion];
        let registrosAplicacion = mapaAgrupacion[nombreAplicacion];

        let valorMediaAplicacion = 0;

        // CONDICIONAL: Si existe la función externa calcularMedia, se utiliza
        if (typeof calcularMedia === 'function') {
            let resultadoCalculo = calcularMedia(registrosAplicacion, COLUMNA_CALCULO_EJERCICIO, null, null);
            valorMediaAplicacion = resultadoCalculo.media;
        } else {
            // Fallback manual: sumar valores y dividir entre la cantidad de registros válidos
            let sumaValores = 0;
            let conteoValores = 0;

            for (let indiceInterno = 0; indiceInterno < registrosAplicacion.length; indiceInterno++) {
                let valorMinuto = Number(registrosAplicacion[indiceInterno][COLUMNA_CALCULO_EJERCICIO]);
                if (!isNaN(valorMinuto)) {
                    sumaValores = sumaValores + valorMinuto;
                    conteoValores = conteoValores + 1;
                }
            }
            valorMediaAplicacion = conteoValores > 0 ? (sumaValores / conteoValores) : 0;
            valorMediaAplicacion = parseFloat(valorMediaAplicacion.toFixed(2));
        }

        listaMediaPorAplicacion.push({
            App: nombreAplicacion,
            valor: valorMediaAplicacion
        });
    }

    return listaMediaPorAplicacion;
}

/**
 * Funcion: mostrarTablaMediaApps
 * Genera y muestra la tabla HTML con la media de minutos por aplicación.
 * Aprovecha la función calcularMedia de media.js si está disponible.
 */
function mostrarTablaMediaApps() {
    let listaMediaPorAplicacion = agruparMediaPorApp();

    // CONDICIONAL: Si existe la función externa calcularMedia, se usa para generar la tabla
    if (typeof calcularMedia === 'function') {
        calcularMedia(listaMediaPorAplicacion, 'valor', 'resultado-ejercicio', 'App');
        return;
    }

    // Fallback: generar tabla manualmente en caso de que media.js no esté cargado
    let contenidoHTML = '';
    contenidoHTML += '<p><strong>Media por App (columna: ' + COLUMNA_CALCULO_EJERCICIO + ')</strong></p>';
    contenidoHTML += '<table class="tabla-interactiva">';
    contenidoHTML += '<tr><th>#</th><th>Red Social</th><th>Media</th></tr>';

    // BUCLE: Se construye cada fila con los datos de media por aplicación
    for (let indiceFila = 0; indiceFila < listaMediaPorAplicacion.length; indiceFila++) {
        contenidoHTML += '<tr>';
        contenidoHTML += '<td>' + (indiceFila + 1) + '</td>';
        contenidoHTML += '<td>' + listaMediaPorAplicacion[indiceFila].App + '</td>';
        contenidoHTML += '<td>' + listaMediaPorAplicacion[indiceFila].valor.toFixed(2) + '</td>';
        contenidoHTML += '</tr>';
    }

    contenidoHTML += '</table>';
    document.getElementById('resultado-ejercicio').innerHTML = contenidoHTML;
}

/**
 * Funcion: toggleEjercicioPractico
 * Alterna la visibilidad de la tabla del ejercicio práctico de media por App.
 */
function toggleEjercicioPractico() {
    let contenedorResultado = document.getElementById('resultado-ejercicio');
    let botonInteractivo = document.getElementById('btn-ejercicio-practico');

    // CONDICIONAL: Validación de existencia de elementos en el DOM
    if (!contenedorResultado || !botonInteractivo) {
        return;
    }

    // CONDICIONAL: Si está oculto, se genera la tabla y se muestra
    if (contenedorResultado.classList.contains('oculto')) {
        mostrarTablaMediaApps();
        contenedorResultado.classList.remove('oculto');
        botonInteractivo.textContent = '✖ Ocultar Tabla';
    } else {
        contenedorResultado.classList.add('oculto');
        botonInteractivo.textContent = '▶ Calcular Media por App';
    }
}

/**
 * Funcion: toggleGraficoEjercicio
 * Alterna la visibilidad del gráfico comparativo del ejercicio práctico.
 * Utiliza dibujarGraficoMedia de media.js para la renderización.
 */
function toggleGraficoEjercicio() {
    let contenedorResultado = document.getElementById('contenedor-grafico-ejercicio');
    let botonInteractivo = document.getElementById('btn-grafico-ejercicio');

    // CONDICIONAL: Validación de existencia de elementos en el DOM
    if (!contenedorResultado || !botonInteractivo) {
        return;
    }

    // --- SECCION: OCULTAR GRÁFICO ---
    if (!contenedorResultado.classList.contains('oculto')) {
        contenedorResultado.classList.add('oculto');
        botonInteractivo.textContent = '📊 Ver Gráfico Comparativo';

        // CONDICIONAL: Se destruye la instancia previa para liberar memoria
        if (graficoEjercicioInstancia) {
            graficoEjercicioInstancia.destroy();
            graficoEjercicioInstancia = null;
        }
        return;
    }

    // --- SECCION: MOSTRAR GRÁFICO ---
    contenedorResultado.classList.remove('oculto');
    botonInteractivo.textContent = '✖ Ocultar Gráfico';

    // CONDICIONAL: Se destruye cualquier instancia previa antes de crear una nueva
    if (graficoEjercicioInstancia) {
        graficoEjercicioInstancia.destroy();
        graficoEjercicioInstancia = null;
    }

    // Se crea el canvas si no existe en el DOM
    let canvasGrafico = document.getElementById('graficaEjercicio');

    if (!canvasGrafico) {
        canvasGrafico = document.createElement('canvas');
        canvasGrafico.id = 'graficaEjercicio';
        contenedorResultado.appendChild(canvasGrafico);
    }

    // Se agrupan los datos por App y se calcula la media de cada una
    let listaMediaPorAplicacion = agruparMediaPorApp();

    // dibujarGraficoMedia (media.js): arreglo, propiedad, canvasId, titulo
    graficoEjercicioInstancia = dibujarGraficoMedia(
        listaMediaPorAplicacion,
        'valor',
        'graficaEjercicio',
        'Media por App (' + COLUMNA_CALCULO_EJERCICIO + ')'
    );
}

// ============================================================
// FUNCION: cargarTablaPreviewDataset
// Muestra los primeros 10 registros de SOCIAL_MEDIA_USAGE
// en la tabla #tabla-preview-dataset al cargar la sección.
// Se llama una sola vez desde el evento DOMContentLoaded.
// ============================================================

/**
 * Funcion: cargarTablaPreviewDataset
 * Inserta dinámicamente las primeras 10 filas del dataset de redes sociales
 * en la tabla de previsualización definida en el HTML.
 */
function cargarTablaPreviewDataset() {
    let cuerpoTablaPreview = document.getElementById("cuerpo-tabla-preview");

    // CONDICIONAL: Si no existe el cuerpo de la tabla, se cancela la operación
    if (!cuerpoTablaPreview) {
        return;
    }

    let registrosRedesSociales = SOCIAL_MEDIA_USAGE.datos_redes;
    let filasTablaHTML = "";

    // BUCLE: Se recorren únicamente los primeros 10 registros del dataset
    for (let indiceFila = 0; indiceFila < 10 && indiceFila < registrosRedesSociales.length; indiceFila++) {
        let registroRedSocial = registrosRedesSociales[indiceFila];
        filasTablaHTML += "<tr>";
        filasTablaHTML += "<td>" + (indiceFila + 1) + "</td>";
        filasTablaHTML += "<td>" + registroRedSocial.User_ID + "</td>";
        filasTablaHTML += "<td>" + registroRedSocial.App + "</td>";
        filasTablaHTML += "<td>" + registroRedSocial.Daily_Minutes_Spent + "</td>";
        filasTablaHTML += "<td>" + registroRedSocial.Posts_Per_Day + "</td>";
        filasTablaHTML += "<td>" + registroRedSocial.Likes_Per_Day + "</td>";
        filasTablaHTML += "<td>" + registroRedSocial.Follows_Per_Day + "</td>";
        filasTablaHTML += "</tr>";
    }

    cuerpoTablaPreview.innerHTML = filasTablaHTML;
}

// Llenar la tabla preview cuando el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function () {
    cargarTablaPreviewDataset();
});

// ============================================================
// BLOQUE 12B: EJERCICIO PRACTICO - MEDIANA
// ============================================================

// Variable de control para la instancia del gráfico de mediana del ejercicio (Chart.js)
let graficoEjercicioMedianaInstancia = null;

/**
 * Funcion: mostrarTablaMedianaDataset
 * Calcula la mediana del dataset completo (200 registros) sobre la columna
 * Daily_Minutes_Spent y genera el HTML con el resultado.
 */
function mostrarTablaMedianaDataset() {
    let registrosRedesSociales = cargarDatosSocial();
    let identificadorContenedor = 'resultado-ejercicio-mediana';

    // CONDICIONAL: Si existe la función externa calcularMediana, se utiliza
    if (typeof calcularMediana === 'function') {
        calcularMediana(registrosRedesSociales, COLUMNA_CALCULO_EJERCICIO, identificadorContenedor, NOMBRE_ETIQUETA_EJERCICIO);
        return;
    }

    // Fallback manual si mediana.js no está cargado
    let listaValoresNumericos = [];

    // BUCLE: Se extraen únicamente los valores numéricos válidos de la columna objetivo
    for (let indiceRegistro = 0; indiceRegistro < registrosRedesSociales.length; indiceRegistro++) {
        let valorNumerico = Number(registrosRedesSociales[indiceRegistro][COLUMNA_CALCULO_EJERCICIO]);
        if (!isNaN(valorNumerico)) {
            listaValoresNumericos.push(valorNumerico);
        }
    }

    // Se ordenan los valores de menor a mayor
    listaValoresNumericos.sort(function (valorA, valorB) {
        return valorA - valorB;
    });

    let posicionCentral = Math.floor(listaValoresNumericos.length / 2);
    let valorMediana = 0;

    // CONDICIONAL: Si la cantidad de datos es par, la mediana es el promedio de los dos centrales
    if (listaValoresNumericos.length % 2 === 0) {
        valorMediana = (listaValoresNumericos[posicionCentral - 1] + listaValoresNumericos[posicionCentral]) / 2;
    } else {
        // Si es impar, la mediana es el valor exacto del centro
        valorMediana = listaValoresNumericos[posicionCentral];
    }

    let contenidoHTML = '';
    contenidoHTML += '<p><strong>Mediana de ' + COLUMNA_CALCULO_EJERCICIO + ' (200 registros ordenados):</strong></p>';
    contenidoHTML += '<div class="detalle-calculo">';
    contenidoHTML += 'Total de registros: <strong>' + listaValoresNumericos.length + '</strong><br>';
    contenidoHTML += 'Posición central: <strong>' + (posicionCentral + 1) + '</strong><br>';
    contenidoHTML += 'Mediana: <strong>' + valorMediana.toFixed(2) + '</strong>';
    contenidoHTML += '</div>';
    contenidoHTML += '<div class="caja-resultado">';
    contenidoHTML += '📊 La mediana es: <strong>' + valorMediana.toFixed(2) + '</strong> minutos/día';
    contenidoHTML += '</div>';

    document.getElementById(identificadorContenedor).innerHTML = contenidoHTML;
}

/**
 * Funcion: toggleEjercicioMediana
 * Alterna la visibilidad de la tabla de mediana del ejercicio práctico.
 */
function toggleEjercicioMediana() {
    let contenedorResultado = document.getElementById('resultado-ejercicio-mediana');
    let botonInteractivo = document.getElementById('btn-ejercicio-mediana');

    // CONDICIONAL: Validación de existencia de elementos en el DOM
    if (!contenedorResultado || !botonInteractivo) {
        return;
    }

    // CONDICIONAL: Si está oculto, se calcula la mediana y se muestra
    if (contenedorResultado.classList.contains('oculto')) {
        mostrarTablaMedianaDataset();
        contenedorResultado.classList.remove('oculto');
        botonInteractivo.textContent = '✖ Ocultar Tabla';
    } else {
        contenedorResultado.classList.add('oculto');
        botonInteractivo.textContent = '▶ Calcular Mediana';
    }
}

/**
 * Funcion: toggleGraficoEjercicioMediana
 * Alterna la visibilidad del gráfico de distribución de mediana del ejercicio práctico.
 * Utiliza dibujarGraficoMediana de mediana.js con los 200 registros.
 */
function toggleGraficoEjercicioMediana() {
    let contenedorResultado = document.getElementById('contenedor-grafico-ejercicio-mediana');
    let botonInteractivo = document.getElementById('btn-grafico-ejercicio-mediana');

    // CONDICIONAL: Validación de existencia de elementos en el DOM
    if (!contenedorResultado || !botonInteractivo) {
        return;
    }

    // --- SECCION: OCULTAR GRÁFICO ---
    if (!contenedorResultado.classList.contains('oculto')) {
        contenedorResultado.classList.add('oculto');
        botonInteractivo.textContent = '📊 Ver Gráfico de Distribución';
        return;
    }

    // --- SECCION: MOSTRAR GRÁFICO ---
    contenedorResultado.classList.remove('oculto');
    botonInteractivo.textContent = '✖ Ocultar Gráfico';

    // Se reemplaza el canvas para evitar el error "Canvas already in use"
    let canvasAnterior = document.getElementById('graficaEjercicioMediana');

    // CONDICIONAL: Solo se reemplaza si el canvas existe y tiene nodo padre
    if (canvasAnterior && canvasAnterior.parentNode) {
        let canvasNuevo = document.createElement('canvas');
        canvasNuevo.id = 'graficaEjercicioMediana';
        canvasAnterior.parentNode.replaceChild(canvasNuevo, canvasAnterior);
    }

    // setTimeout: Da tiempo al DOM para que el nuevo canvas tenga tamaño real
    setTimeout(function () {
        dibujarGraficoMediana(
            cargarDatosSocial(),
            COLUMNA_CALCULO_EJERCICIO,
            'graficaEjercicioMediana',
            'Distribución de minutos diarios con línea de mediana',
            NOMBRE_ETIQUETA_EJERCICIO
        );
    }, 50);
}

// ============================================================
// BLOQUE 12F: EJERCICIO PRACTICO - VARIANZA
// ============================================================

// Variable de control para la instancia del gráfico de varianza del ejercicio
let graficoEjercicioVarianzaInstancia = null;

/**
 * Funcion: mostrarTablaVarianzaDataset
 * Muestra la varianza del dataset completo usando varianza.js.
 */
function mostrarTablaVarianzaDataset() {
    let registrosRedesSociales = cargarDatosSocial();
    let identificadorContenedor = 'resultado-ejercicio-varianza';

    calcularVarianza(
        registrosRedesSociales,
        COLUMNA_CALCULO_EJERCICIO,
        identificadorContenedor,
        NOMBRE_ETIQUETA_EJERCICIO
    );
}

/**
 * Funcion: toggleEjercicioVarianza
 * Alterna la visibilidad de la tabla de varianza del ejercicio práctico.
 */
function toggleEjercicioVarianza() {
    let contenedorResultado = document.getElementById('resultado-ejercicio-varianza');
    let botonInteractivo = document.getElementById('btn-ejercicio-varianza');

    if (!contenedorResultado || !botonInteractivo) {
        return;
    }

    if (contenedorResultado.classList.contains('oculto')) {
        mostrarTablaVarianzaDataset();
        contenedorResultado.classList.remove('oculto');
        botonInteractivo.textContent = '✖ Ocultar Tabla';
    } else {
        contenedorResultado.classList.add('oculto');
        botonInteractivo.textContent = '▶ Calcular Varianza';
    }
}

/**
 * Funcion: toggleGraficoEjercicioVarianza
 * Alterna la visibilidad del gráfico de varianza del ejercicio práctico.
 */
function toggleGraficoEjercicioVarianza() {
    let contenedorResultado = document.getElementById('contenedor-grafico-ejercicio-varianza');
    let botonInteractivo = document.getElementById('btn-grafico-ejercicio-varianza');

    if (!contenedorResultado || !botonInteractivo) {
        return;
    }

    if (!contenedorResultado.classList.contains('oculto')) {
        contenedorResultado.classList.add('oculto');
        botonInteractivo.textContent = '📊 Ver Gráfico de Desviaciones';

        if (graficoEjercicioVarianzaInstancia) {
            try {
                graficoEjercicioVarianzaInstancia.destroy();
            } catch (errorDestruccion) {
                // Se ignora el error si la instancia ya no es válida
            }

            graficoEjercicioVarianzaInstancia = null;
        }

        return;
    }

    contenedorResultado.classList.remove('oculto');
    botonInteractivo.textContent = '✖ Ocultar Gráfico';

    if (graficoEjercicioVarianzaInstancia) {
        try {
            graficoEjercicioVarianzaInstancia.destroy();
        } catch (errorDestruccion) {
            // Se ignora el error si la instancia ya no es válida
        }

        graficoEjercicioVarianzaInstancia = null;
    }

    let canvasAnterior = document.getElementById('graficaEjercicioVarianza');

    if (!canvasAnterior) {
        return;
    }

    let canvasNuevo = document.createElement('canvas');
    canvasNuevo.id = 'graficaEjercicioVarianza';
    canvasAnterior.parentNode.replaceChild(canvasNuevo, canvasAnterior);

    setTimeout(function () {
        graficoEjercicioVarianzaInstancia = dibujarGraficoVarianza(
            cargarDatosSocial(),
            COLUMNA_CALCULO_EJERCICIO,
            'graficaEjercicioVarianza',
            'Varianza de minutos diarios en redes sociales',
            NOMBRE_ETIQUETA_EJERCICIO
        );
    }, 50);
}

// ============================================================
// BLOQUE 12G: EJERCICIO PRACTICO - DESVIACION ESTANDAR
// ============================================================

// Variable de control para la instancia del gráfico de desviación del ejercicio
let graficoEjercicioDesviacionInstancia = null;

/**
 * Funcion: mostrarTablaDesviacionDataset
 * Muestra la desviación estándar del dataset completo usando desviacion.js.
 */
function mostrarTablaDesviacionDataset() {
    let registrosRedesSociales = cargarDatosSocial();
    let identificadorContenedor = 'resultado-ejercicio-desviacion';

    calcularDesviacion(
        registrosRedesSociales,
        COLUMNA_CALCULO_EJERCICIO,
        identificadorContenedor,
        NOMBRE_ETIQUETA_EJERCICIO
    );
}

/**
 * Funcion: toggleEjercicioDesviacion
 * Alterna la visibilidad de la tabla de desviación estándar del ejercicio práctico.
 */
function toggleEjercicioDesviacion() {
    let contenedorResultado = document.getElementById('resultado-ejercicio-desviacion');
    let botonInteractivo = document.getElementById('btn-ejercicio-desviacion');

    if (!contenedorResultado || !botonInteractivo) {
        return;
    }

    if (contenedorResultado.classList.contains('oculto')) {
        mostrarTablaDesviacionDataset();
        contenedorResultado.classList.remove('oculto');
        botonInteractivo.textContent = '✖ Ocultar Tabla';
    } else {
        contenedorResultado.classList.add('oculto');
        botonInteractivo.textContent = '▶ Calcular Desviación Estándar';
    }
}

/**
 * Funcion: toggleGraficoEjercicioDesviacion
 * Alterna la visibilidad del gráfico de desviación estándar del ejercicio práctico.
 */
function toggleGraficoEjercicioDesviacion() {
    let contenedorResultado = document.getElementById('contenedor-grafico-ejercicio-desviacion');
    let botonInteractivo = document.getElementById('btn-grafico-ejercicio-desviacion');

    if (!contenedorResultado || !botonInteractivo) {
        return;
    }

    if (!contenedorResultado.classList.contains('oculto')) {
        contenedorResultado.classList.add('oculto');
        botonInteractivo.textContent = '📊 Ver Gráfico de Desviación Estándar';

        if (graficoEjercicioDesviacionInstancia) {
            try {
                graficoEjercicioDesviacionInstancia.destroy();
            } catch (errorDestruccion) {
                // Se ignora el error si la instancia ya no es válida
            }

            graficoEjercicioDesviacionInstancia = null;
        }

        return;
    }

    contenedorResultado.classList.remove('oculto');
    botonInteractivo.textContent = '✖ Ocultar Gráfico';

    if (graficoEjercicioDesviacionInstancia) {
        try {
            graficoEjercicioDesviacionInstancia.destroy();
        } catch (errorDestruccion) {
            // Se ignora el error si la instancia ya no es válida
        }

        graficoEjercicioDesviacionInstancia = null;
    }

    let canvasAnterior = document.getElementById('graficaEjercicioDesviacion');

    if (!canvasAnterior) {
        return;
    }

    let canvasNuevo = document.createElement('canvas');
    canvasNuevo.id = 'graficaEjercicioDesviacion';
    canvasAnterior.parentNode.replaceChild(canvasNuevo, canvasAnterior);

    setTimeout(function () {
        graficoEjercicioDesviacionInstancia = dibujarGraficoDesviacion(
            cargarDatosSocial(),
            COLUMNA_CALCULO_EJERCICIO,
            'graficaEjercicioDesviacion',
            'Desviación estándar de minutos diarios en redes sociales',
            NOMBRE_ETIQUETA_EJERCICIO
        );
    }, 50);
}

// ============================================================
// BLOQUE 12C: EJERCICIO PRACTICO - MINIMO Y MAXIMO
// ============================================================

// Variable de control para la instancia del gráfico de mínimo y máximo del ejercicio (Chart.js)
let graficoEjercicioMinMaxInstancia = null;

/**
 * Funcion: mostrarTablaMinMaxDataset
 * Muestra la tabla del dataset completo (200 registros) destacando
 * el valor mínimo y máximo mediante la función calcularMinMax de minMax.js.
 */
function mostrarTablaMinMaxDataset() {
    let registrosRedesSociales = cargarDatosSocial();
    let identificadorContenedor = 'resultado-ejercicio-minmax';

    // Se utiliza la función externa calcularMinMax con los datos de redes sociales
    calcularMinMax(registrosRedesSociales, COLUMNA_CALCULO_EJERCICIO, identificadorContenedor, NOMBRE_ETIQUETA_EJERCICIO);
}

/**
 * Funcion: toggleEjercicioMinMax
 * Alterna la visibilidad de la tabla del ejercicio práctico de mínimo y máximo.
 */
function toggleEjercicioMinMax() {
    let contenedorResultado = document.getElementById('resultado-ejercicio-minmax');
    let botonInteractivo = document.getElementById('btn-ejercicio-minmax');

    // CONDICIONAL: Validación de existencia de elementos en el DOM
    if (!contenedorResultado || !botonInteractivo) {
        return;
    }

    // CONDICIONAL: Si está oculto, se genera la tabla y se muestra
    if (contenedorResultado.classList.contains('oculto')) {
        mostrarTablaMinMaxDataset();
        contenedorResultado.classList.remove('oculto');
        botonInteractivo.textContent = '✖ Ocultar Tabla';
    } else {
        contenedorResultado.classList.add('oculto');
        botonInteractivo.textContent = '▶ Calcular Mínimo y Máximo';
    }
}

/**
 * Funcion: toggleGraficoEjercicioMinMax
 * Alterna la visibilidad del gráfico de barras de mínimo y máximo del ejercicio práctico.
 */
function toggleGraficoEjercicioMinMax() {
    let contenedorResultado = document.getElementById('contenedor-grafico-ejercicio-minmax');
    let botonInteractivo = document.getElementById('btn-grafico-ejercicio-minmax');

    // CONDICIONAL: Validación de existencia de elementos en el DOM
    if (!contenedorResultado || !botonInteractivo) {
        return;
    }

    // --- SECCION: OCULTAR GRÁFICO ---
    if (!contenedorResultado.classList.contains('oculto')) {
        contenedorResultado.classList.add('oculto');
        botonInteractivo.textContent = '📊 Ver Gráfico de Barras';

        // CONDICIONAL: Se destruye la instancia previa para liberar memoria
        if (graficoEjercicioMinMaxInstancia) {
            try {
                graficoEjercicioMinMaxInstancia.destroy();
            } catch (errorDestruccion) {
                // Se ignora el error si la instancia ya no es válida
            }
            graficoEjercicioMinMaxInstancia = null;
        }
        return;
    }

    // --- SECCION: MOSTRAR GRÁFICO ---
    contenedorResultado.classList.remove('oculto');
    botonInteractivo.textContent = '✖ Ocultar Gráfico';

    // Se reemplaza el canvas físicamente para evitar "Canvas already in use"
    let canvasAnterior = document.getElementById('graficaEjercicioMinMax');

    // CONDICIONAL: Si no existe el canvas, se cancela la operación
    if (!canvasAnterior) {
        return;
    }

    let canvasNuevo = document.createElement('canvas');
    canvasNuevo.id = 'graficaEjercicioMinMax';
    canvasAnterior.parentNode.replaceChild(canvasNuevo, canvasAnterior);

    // setTimeout: Da tiempo al DOM para que el canvas nuevo tenga tamaño real
    setTimeout(function () {
        // Parámetros: arreglo, campoNumerico, canvasId, titulo
        // (campoLabel detectado automáticamente por minMax.js)
        graficoEjercicioMinMaxInstancia = dibujarGraficoMinMax(
            cargarDatosSocial(),
            COLUMNA_CALCULO_EJERCICIO,
            'graficaEjercicioMinMax',
            'Distribución de minutos diarios — azul: mínimo | rojo: máximo'
        );
    }, 50);
}

// ============================================================
// BLOQUE 12D: EJERCICIO PRACTICO - MODA
// ============================================================

// Variable de control para la instancia del gráfico de moda del ejercicio (Chart.js)
let graficoEjercicioModaInstancia = null;

/**
 * Funcion: mostrarTablaModaDataset
 * Muestra la tabla del dataset completo (200 registros) destacando
 * la moda mediante la función calcularModa de moda.js.
 */
function mostrarTablaModaDataset() {
    let registrosRedesSociales = cargarDatosSocial();
    let identificadorContenedor = 'resultado-ejercicio-moda';

    // Se utiliza la función externa calcularModa con los datos de redes sociales
    calcularModa(registrosRedesSociales, COLUMNA_CALCULO_EJERCICIO, identificadorContenedor, NOMBRE_ETIQUETA_EJERCICIO);
}

/**
 * Funcion: toggleEjercicioModa
 * Alterna la visibilidad de la tabla del ejercicio práctico de moda.
 */
function toggleEjercicioModa() {
    let contenedorResultado = document.getElementById('resultado-ejercicio-moda');
    let botonInteractivo = document.getElementById('btn-ejercicio-moda');

    // CONDICIONAL: Validación de existencia de elementos en el DOM
    if (!contenedorResultado || !botonInteractivo) {
        return;
    }

    // CONDICIONAL: Si está oculto, se genera la tabla y se muestra
    if (contenedorResultado.classList.contains('oculto')) {
        mostrarTablaModaDataset();
        contenedorResultado.classList.remove('oculto');
        botonInteractivo.textContent = '✖ Ocultar Tabla';
    } else {
        contenedorResultado.classList.add('oculto');
        botonInteractivo.textContent = '▶ Calcular Moda';
    }
}

/**
 * Funcion: toggleGraficoEjercicioModa
 * Alterna la visibilidad del gráfico de frecuencias de moda del ejercicio práctico.
 */
function toggleGraficoEjercicioModa() {
    let contenedorResultado = document.getElementById('contenedor-grafico-ejercicio-moda');
    let botonInteractivo = document.getElementById('btn-grafico-ejercicio-moda');

    // CONDICIONAL: Validación de existencia de elementos en el DOM
    if (!contenedorResultado || !botonInteractivo) {
        return;
    }

    // --- SECCION: OCULTAR GRÁFICO ---
    if (!contenedorResultado.classList.contains('oculto')) {
        contenedorResultado.classList.add('oculto');
        botonInteractivo.textContent = '📊 Ver Gráfico de Frecuencias';

        // CONDICIONAL: Se destruye la instancia previa para liberar memoria
        if (graficoEjercicioModaInstancia) {
            try {
                graficoEjercicioModaInstancia.destroy();
            } catch (errorDestruccion) {
                // Se ignora el error si la instancia ya no es válida
            }
            graficoEjercicioModaInstancia = null;
        }
        return;
    }

    // --- SECCION: MOSTRAR GRÁFICO ---
    contenedorResultado.classList.remove('oculto');
    botonInteractivo.textContent = '✖ Ocultar Gráfico';

    // Se reemplaza el canvas físicamente para evitar "Canvas already in use"
    let canvasAnterior = document.getElementById('graficaEjercicioModa');

    // CONDICIONAL: Si no existe el canvas, se cancela la operación
    if (!canvasAnterior) {
        return;
    }

    let canvasNuevo = document.createElement('canvas');
    canvasNuevo.id = 'graficaEjercicioModa';
    canvasAnterior.parentNode.replaceChild(canvasNuevo, canvasAnterior);

    // setTimeout: Permite que el navegador calcule el tamaño real del nuevo canvas
    setTimeout(function () {
        graficoEjercicioModaInstancia = dibujarGraficoModa(
            cargarDatosSocial(),
            COLUMNA_CALCULO_EJERCICIO,
            'graficaEjercicioModa',
            'Frecuencia de minutos diarios (barra azul = moda)'
        );
    }, 50);
}

// ============================================================
// BLOQUE 12E: EJERCICIO PRACTICO - RANGO
// ============================================================

// Variable de control para la instancia del gráfico de rango del ejercicio (Chart.js)
let graficoEjercicioRangoInstancia = null;

/**
 * Funcion: mostrarTablaRangoDataset
 * Muestra la tabla del dataset completo (200 registros) con el cálculo
 * del rango utilizando la función calcularRango de rango.js.
 */
function mostrarTablaRangoDataset() {
    let registrosRedesSociales = cargarDatosSocial();
    let identificadorContenedor = 'resultado-ejercicio-rango';

    // Se utiliza la función externa calcularRango con los datos de redes sociales
    calcularRango(registrosRedesSociales, COLUMNA_CALCULO_EJERCICIO, identificadorContenedor, NOMBRE_ETIQUETA_EJERCICIO);
}

/**
 * Funcion: toggleEjercicioRango
 * Alterna la visibilidad de la tabla del ejercicio práctico de rango.
 */
function toggleEjercicioRango() {
    let contenedorResultado = document.getElementById('resultado-ejercicio-rango');
    let botonInteractivo = document.getElementById('btn-ejercicio-rango');

    // CONDICIONAL: Validación de existencia de elementos en el DOM
    if (!contenedorResultado || !botonInteractivo) {
        return;
    }

    // CONDICIONAL: Si está oculto, se genera la tabla y se muestra
    if (contenedorResultado.classList.contains('oculto')) {
        mostrarTablaRangoDataset();
        contenedorResultado.classList.remove('oculto');
        botonInteractivo.textContent = '✖ Ocultar Tabla';
    } else {
        contenedorResultado.classList.add('oculto');
        botonInteractivo.textContent = '▶ Calcular Rango';
    }
}

/**
 * Funcion: toggleGraficoEjercicioRango
 * Alterna la visibilidad del gráfico de amplitud de rango del ejercicio práctico.
 */
function toggleGraficoEjercicioRango() {
    let contenedorResultado = document.getElementById('contenedor-grafico-ejercicio-rango');
    let botonInteractivo = document.getElementById('btn-grafico-ejercicio-rango');

    // CONDICIONAL: Validación de existencia de elementos en el DOM
    if (!contenedorResultado || !botonInteractivo) {
        return;
    }

    // --- SECCION: OCULTAR GRÁFICO ---
    if (!contenedorResultado.classList.contains('oculto')) {
        contenedorResultado.classList.add('oculto');
        botonInteractivo.textContent = '📊 Ver Gráfico de Amplitud';

        // CONDICIONAL: Se destruye la instancia previa para liberar memoria
        if (graficoEjercicioRangoInstancia) {
            try {
                graficoEjercicioRangoInstancia.destroy();
            } catch (errorDestruccion) {
                // Se ignora el error si la instancia ya no es válida
            }
            graficoEjercicioRangoInstancia = null;
        }
        return;
    }

    // --- SECCION: MOSTRAR GRÁFICO ---
    contenedorResultado.classList.remove('oculto');
    botonInteractivo.textContent = '✖ Ocultar Gráfico';

    // Se reemplaza el canvas físicamente para evitar "Canvas already in use"
    let canvasAnterior = document.getElementById('graficaEjercicioRango');

    // CONDICIONAL: Si no existe el canvas, se cancela la operación
    if (!canvasAnterior) {
        return;
    }

    let canvasNuevo = document.createElement('canvas');
    canvasNuevo.id = 'graficaEjercicioRango';
    canvasAnterior.parentNode.replaceChild(canvasNuevo, canvasAnterior);

    // setTimeout: Permite que el navegador calcule el tamaño real del nuevo canvas
    setTimeout(function () {
        graficoEjercicioRangoInstancia = dibujarGraficoRango(
            cargarDatosSocial(),
            COLUMNA_CALCULO_EJERCICIO,
            NOMBRE_ETIQUETA_EJERCICIO,
            'graficaEjercicioRango',
            'Amplitud de minutos diarios — rojo: mínimo | verde: máximo'
        );
    }, 50);
}