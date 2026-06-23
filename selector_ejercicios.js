function mostrarEjercicioSeleccionado() {
    const selector = document.getElementById("selectorEjercicioPractico");
    const ejercicioSeleccionado = selector.value;

    const tarjetasEjercicios = document.querySelectorAll(".columna-ejercicios .subseccion-interactiva");

    tarjetasEjercicios.forEach(function (tarjeta) {
        tarjeta.style.display = "none";
    });

    if (ejercicioSeleccionado !== "") {
        const tarjetaSeleccionada = document.getElementById(ejercicioSeleccionado);

        if (tarjetaSeleccionada) {
            tarjetaSeleccionada.style.display = "block";
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const tarjetasEjercicios = document.querySelectorAll(".columna-ejercicios .subseccion-interactiva");

    tarjetasEjercicios.forEach(function (tarjeta) {
        tarjeta.style.display = "none";
    });
});