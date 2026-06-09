// ================================================
// moda.js
// Función para calcular la MODA
// ================================================

function calcularModaDesdeArreglo(arregloObjetos, propiedad) {
    let valores = [];
    let frecuencias = [];
    let modas = [];

    let maxFrecuencia = 0;
    let texto = "";

    if (arregloObjetos.length === 0) {
        return 0;
    }

    for (let i = 0; i < arregloObjetos.length; i++) {
        valores[i] = arregloObjetos[i][propiedad];
    }

    for (let i = 0; i < valores.length; i++) {
        let valorActual = valores[i];
        let encontrado = false;

        for (let j = 0; j < frecuencias.length; j++) {
            if (frecuencias[j].valor === valorActual) {
                frecuencias[j].cantidad = frecuencias[j].cantidad + 1;
                encontrado = true;
            }
        }

        if (encontrado === false) {
            frecuencias[frecuencias.length] = { valor: valorActual, cantidad: 1 };
        }
    }

    
    for (let i = 0; i < frecuencias.length; i++) {
        if (frecuencias[i].cantidad > maxFrecuencia) {
            maxFrecuencia = frecuencias[i].cantidad;
        }
    }

    for (let i = 0; i < frecuencias.length; i++) {
        if (frecuencias[i].cantidad === maxFrecuencia) {
            modas[modas.length] = frecuencias[i].valor;
        }
    }

    if (modas.length === frecuencias.length) {
        return "Sin moda";
    }

    if (modas.length === 1) {
        return modas[0];
    }

    for (let i = 0; i < modas.length; i++) {
        if (i === 0) {
            texto = modas[i];
        } else {
            texto = texto + ", " + modas[i];
        }
    }
    return texto;
}