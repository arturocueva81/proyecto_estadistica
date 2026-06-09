// ================================================
// mediana.js
// Función para calcular la MEDIANA
// ================================================

function calcularMedianaDesdeArreglo(arregloObjetos, propiedad) {

    let valores = [];
    let cantidad = 0;
    let mediana = 0;
    
    if (arregloObjetos.length === 0) {
        return 0;
    }

    for (let i = 0; i < arregloObjetos.length; i++) {
        valores[i] = arregloObjetos[i][propiedad];
    }

    for (let i = 0; i < valores.length; i++) {
        for (let j = i + 1; j < valores.length; j++) {
            if (valores[j] < valores[i]) {
                let temporal = valores[i];
                valores[i] = valores[j];
                valores[j] = temporal;
            }
        }
    }

    cantidad = valores.length;

    if (cantidad % 2 !== 0) {
        let posicionCentral = (cantidad - 1) / 2;
        mediana = valores[posicionCentral];
    } else {
        let posicionIzquierda = (cantidad / 2) - 1;
        let posicionDerecha = cantidad / 2;
        mediana = (valores[posicionIzquierda] + valores[posicionDerecha]) / 2;
    }

    return parseFloat(mediana.toFixed(2));
}