// ============================================================
// varianza_pagina.js — Controlador de página para Varianza
// ============================================================

function obtenerListaRedesSociales() {
    if (typeof SOCIAL_MEDIA_USAGE === 'undefined' || !SOCIAL_MEDIA_USAGE.datos_redes) {
        return [];
    }
    return SOCIAL_MEDIA_USAGE.datos_redes;
}

const PROPIEDAD_NUMERICA_EJERCICIO_VARIANZA = 'Daily_Minutes_Spent';
const PROPIEDAD_ETIQUETA_EJERCICIO_VARIANZA = 'App';

// Instancias para los gráficos de varianza
let graficoVarianzaInstancia = null;
let graficoEjercicioVarianzaInstancia = null;

function toggleEjercicioVarianza() {
    let contenedorResultado = document.getElementById('resultado-ejercicio-varianza');
    let botonInteractivo = document.getElementById('btn-ejercicio-varianza');

    if (!contenedorResultado || !botonInteractivo) {
        return;
    }

    if (contenedorResultado.classList.contains('oculto')) {
        let registrosRedesSociales = obtenerListaRedesSociales();
        calcularVarianza(
            registrosRedesSociales,
            PROPIEDAD_NUMERICA_EJERCICIO_VARIANZA,
            'resultado-ejercicio-varianza',
            PROPIEDAD_ETIQUETA_EJERCICIO_VARIANZA
        );
        contenedorResultado.classList.remove('oculto');
        botonInteractivo.textContent = '✖ Ocultar Tabla';
    } else {
        contenedorResultado.classList.add('oculto');
        botonInteractivo.textContent = '▶ Calcular Varianza';
    }
}

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
            } catch (error) {}
            graficoEjercicioVarianzaInstancia = null;
        }
        return;
    }

    contenedorResultado.classList.remove('oculto');
    botonInteractivo.textContent = '✖ Ocultar Gráfico';

    if (graficoEjercicioVarianzaInstancia) {
        try {
            graficoEjercicioVarianzaInstancia.destroy();
        } catch (error) {}
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
            obtenerListaRedesSociales(),
            PROPIEDAD_NUMERICA_EJERCICIO_VARIANZA,
            'graficaEjercicioVarianza',
            'Varianza de minutos diarios en redes sociales',
            PROPIEDAD_ETIQUETA_EJERCICIO_VARIANZA
        );
    }, 50);
}
