// ============================================================
// desviacion_pagina.js — Controlador de página para Desviación Estándar
// ============================================================

function obtenerListaRedesSociales() {
    if (typeof SOCIAL_MEDIA_USAGE === 'undefined' || !SOCIAL_MEDIA_USAGE.datos_redes) {
        return [];
    }
    return SOCIAL_MEDIA_USAGE.datos_redes;
}

const PROPIEDAD_NUMERICA_EJERCICIO_DESVIACION = 'Daily_Minutes_Spent';
const PROPIEDAD_ETIQUETA_EJERCICIO_DESVIACION = 'App';

// Instancias para los gráficos de desviación estándar
let graficoDesviacionInstancia = null;
let graficoEjercicioDesviacionInstancia = null;

function toggleEjercicioDesviacion() {
    let contenedorResultado = document.getElementById('resultado-ejercicio-desviacion');
    let botonInteractivo = document.getElementById('btn-ejercicio-desviacion');

    if (!contenedorResultado || !botonInteractivo) {
        return;
    }

    if (contenedorResultado.classList.contains('oculto')) {
        let registrosRedesSociales = obtenerListaRedesSociales();
        calcularDesviacion(
            registrosRedesSociales,
            PROPIEDAD_NUMERICA_EJERCICIO_DESVIACION,
            'resultado-ejercicio-desviacion',
            PROPIEDAD_ETIQUETA_EJERCICIO_DESVIACION
        );
        contenedorResultado.classList.remove('oculto');
        botonInteractivo.textContent = '✖ Ocultar Tabla';
    } else {
        contenedorResultado.classList.add('oculto');
        botonInteractivo.textContent = '▶ Calcular Desviación Estándar';
    }
}

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
            } catch (error) {}
            graficoEjercicioDesviacionInstancia = null;
        }
        return;
    }

    contenedorResultado.classList.remove('oculto');
    botonInteractivo.textContent = '✖ Ocultar Gráfico';

    if (graficoEjercicioDesviacionInstancia) {
        try {
            graficoEjercicioDesviacionInstancia.destroy();
        } catch (error) {}
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
        let selectorGrafico = document.getElementById('select-grafico-desviacion');
        let tipoElegido = selectorGrafico ? selectorGrafico.value : null;

        graficoEjercicioDesviacionInstancia = dibujarGraficoDesviacion(
            obtenerListaRedesSociales(),
            PROPIEDAD_NUMERICA_EJERCICIO_DESVIACION,
            'graficaEjercicioDesviacion',
            'Desviación estándar de minutos diarios en redes sociales',
            PROPIEDAD_ETIQUETA_EJERCICIO_DESVIACION,
            tipoElegido
        );
    }, 50);
}

document.addEventListener('DOMContentLoaded', function() {
    let selectorGrafico = document.getElementById('select-grafico-desviacion');
    if (selectorGrafico) {
        selectorGrafico.addEventListener('change', function() {
            let contenedorGrafico = document.getElementById('contenedor-grafico-ejercicio-desviacion');
            let botonAccion = document.getElementById('btn-grafico-ejercicio-desviacion');

            if (contenedorGrafico && botonAccion) {
                if (!contenedorGrafico.classList.contains('oculto')) {
                    contenedorGrafico.classList.add('oculto');
                    botonAccion.textContent = '📊 Ver Gráfico de Desviación Estándar';

                    if (graficoEjercicioDesviacionInstancia !== null) {
                        try { graficoEjercicioDesviacionInstancia.destroy(); } catch(error) {}
                        graficoEjercicioDesviacionInstancia = null;
                    }
                }
            }
        });
    }
});
