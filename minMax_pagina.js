// ============================================================
// minMax_pagina.js — Controlador de página para Mínimo y Máximo
// ============================================================

function obtenerListaRedesSociales() {
    if (typeof SOCIAL_MEDIA_USAGE === 'undefined' || !SOCIAL_MEDIA_USAGE.datos_redes) {
        return [];
    }
    return SOCIAL_MEDIA_USAGE.datos_redes;
}

const PROPIEDAD_NUMERICA_EJERCICIO_MINMAX = 'Daily_Minutes_Spent';
const PROPIEDAD_ETIQUETA_EJERCICIO_MINMAX = 'App';

// Instancia para el gráfico del ejercicio práctico de mínimo y máximo
let graficoEjercicioMinMaxInstancia = null;

function toggleEjercicioMinMax() {
    let contenedorResultado = document.getElementById('resultado-ejercicio-minmax');
    let botonInteractivo = document.getElementById('btn-ejercicio-minmax');

    if (!contenedorResultado || !botonInteractivo) {
        return;
    }

    if (contenedorResultado.classList.contains('oculto')) {
        let registrosRedesSociales = obtenerListaRedesSociales();
        calcularMinMax(
            registrosRedesSociales,
            PROPIEDAD_NUMERICA_EJERCICIO_MINMAX,
            'resultado-ejercicio-minmax',
            PROPIEDAD_ETIQUETA_EJERCICIO_MINMAX
        );
        contenedorResultado.classList.remove('oculto');
        botonInteractivo.textContent = '✖ Ocultar Tabla';
    } else {
        contenedorResultado.classList.add('oculto');
        botonInteractivo.textContent = '▶ Calcular Mínimo y Máximo';
    }
}

function toggleGraficoEjercicioMinMax() {
    let contenedorResultado = document.getElementById('contenedor-grafico-ejercicio-minmax');
    let botonInteractivo = document.getElementById('btn-grafico-ejercicio-minmax');

    if (!contenedorResultado || !botonInteractivo) {
        return;
    }

    if (!contenedorResultado.classList.contains('oculto')) {
        contenedorResultado.classList.add('oculto');
        botonInteractivo.textContent = '📊 Ver Gráfico de Extremos';

        if (graficoEjercicioMinMaxInstancia) {
            try {
                graficoEjercicioMinMaxInstancia.destroy();
            } catch (error) {}
            graficoEjercicioMinMaxInstancia = null;
        }
        return;
    }

    contenedorResultado.classList.remove('oculto');
    botonInteractivo.textContent = '✖ Ocultar Gráfico';

    if (graficoEjercicioMinMaxInstancia) {
        try {
            graficoEjercicioMinMaxInstancia.destroy();
        } catch (error) {}
        graficoEjercicioMinMaxInstancia = null;
    }

    let canvasAnterior = document.getElementById('graficaEjercicioMinMax');
    if (!canvasAnterior) {
        return;
    }

    let canvasNuevo = document.createElement('canvas');
    canvasNuevo.id = 'graficaEjercicioMinMax';
    canvasAnterior.parentNode.replaceChild(canvasNuevo, canvasAnterior);

    setTimeout(function () {
        let selectorGrafico = document.getElementById('select-grafico-minmax');
        let tipoElegido = selectorGrafico ? selectorGrafico.value : null;

        graficoEjercicioMinMaxInstancia = dibujarGraficoMinMax(
            obtenerListaRedesSociales(),
            PROPIEDAD_NUMERICA_EJERCICIO_MINMAX,
            'graficaEjercicioMinMax',
            'Distribución de minutos diarios — azul: mínimo | rojo: máximo',
            tipoElegido
        );
    }, 50);
}

document.addEventListener('DOMContentLoaded', function() {
    let selectorGrafico = document.getElementById('select-grafico-minmax');
    if (selectorGrafico) {
        selectorGrafico.addEventListener('change', function() {
            let contenedorGrafico = document.getElementById('contenedor-grafico-ejercicio-minmax');
            let botonAccion = document.getElementById('btn-grafico-ejercicio-minmax');

            if (contenedorGrafico && botonAccion) {
                if (!contenedorGrafico.classList.contains('oculto')) {
                    contenedorGrafico.classList.add('oculto');
                    botonAccion.textContent = '📊 Ver Gráfico de Extremos';

                    if (graficoEjercicioMinMaxInstancia !== null) {
                        try { graficoEjercicioMinMaxInstancia.destroy(); } catch(error) {}
                        graficoEjercicioMinMaxInstancia = null;
                    }
                }
            }
        });
    }
});
