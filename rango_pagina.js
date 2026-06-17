// ============================================================
// rango_pagina.js — Controlador de página para Rango
// ============================================================

function obtenerListaRedesSociales() {
    if (typeof SOCIAL_MEDIA_USAGE === 'undefined' || !SOCIAL_MEDIA_USAGE.datos_redes) {
        return [];
    }
    return SOCIAL_MEDIA_USAGE.datos_redes;
}

const PROPIEDAD_NUMERICA_EJERCICIO_RANGO = 'Daily_Minutes_Spent';
const PROPIEDAD_ETIQUETA_EJERCICIO_RANGO = 'App';

// Instancia para el gráfico del ejercicio práctico de rango
let graficoEjercicioRangoInstancia = null;

function toggleEjercicioRango() {
    let contenedorResultado = document.getElementById('resultado-ejercicio-rango');
    let botonInteractivo = document.getElementById('btn-ejercicio-rango');

    if (!contenedorResultado || !botonInteractivo) {
        return;
    }

    if (contenedorResultado.classList.contains('oculto')) {
        let registrosRedesSociales = obtenerListaRedesSociales();
        calcularRango(
            registrosRedesSociales,
            PROPIEDAD_NUMERICA_EJERCICIO_RANGO,
            'resultado-ejercicio-rango',
            PROPIEDAD_ETIQUETA_EJERCICIO_RANGO
        );
        contenedorResultado.classList.remove('oculto');
        botonInteractivo.textContent = '✖ Ocultar Tabla';
    } else {
        contenedorResultado.classList.add('oculto');
        botonInteractivo.textContent = '▶ Calcular Rango';
    }
}

function toggleGraficoEjercicioRango() {
    let contenedorResultado = document.getElementById('contenedor-grafico-ejercicio-rango');
    let botonInteractivo = document.getElementById('btn-grafico-ejercicio-rango');

    if (!contenedorResultado || !botonInteractivo) {
        return;
    }

    if (!contenedorResultado.classList.contains('oculto')) {
        contenedorResultado.classList.add('oculto');
        botonInteractivo.textContent = '📊 Ver Gráfico de Amplitud';

        if (graficoEjercicioRangoInstancia) {
            try {
                graficoEjercicioRangoInstancia.destroy();
            } catch (error) {}
            graficoEjercicioRangoInstancia = null;
        }
        return;
    }

    contenedorResultado.classList.remove('oculto');
    botonInteractivo.textContent = '✖ Ocultar Gráfico';

    if (graficoEjercicioRangoInstancia) {
        try {
            graficoEjercicioRangoInstancia.destroy();
        } catch (error) {}
        graficoEjercicioRangoInstancia = null;
    }

    let canvasAnterior = document.getElementById('graficaEjercicioRango');
    if (!canvasAnterior) {
        return;
    }

    let canvasNuevo = document.createElement('canvas');
    canvasNuevo.id = 'graficaEjercicioRango';
    canvasAnterior.parentNode.replaceChild(canvasNuevo, canvasAnterior);

    setTimeout(function () {
        graficoEjercicioRangoInstancia = dibujarGraficoRango(
            obtenerListaRedesSociales(),
            PROPIEDAD_NUMERICA_EJERCICIO_RANGO,
            PROPIEDAD_ETIQUETA_EJERCICIO_RANGO,
            'graficaEjercicioRango',
            'Amplitud de minutos diarios — rojo: mínimo | verde: máximo'
        );
    }, 50);
}
