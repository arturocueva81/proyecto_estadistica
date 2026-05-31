// ============================================================
// FUENTE DE DATOS
// ============================================================

const DATOSESTUDIANTES = {
    "estudiantes": [
        { "nombre": "Ana Torres",       "calificacion": 18 },
        { "nombre": "Luis Pérez",       "calificacion": 15 },
        { "nombre": "María Gómez",      "calificacion": 20 },
        { "nombre": "Carlos Ruiz",      "calificacion": 12 },
        { "nombre": "Sofía Díaz",       "calificacion": 17 },
        { "nombre": "Diego Mora",       "calificacion": 14 },
        { "nombre": "Valentina Cruz",   "calificacion": 19 },
        { "nombre": "Andrés León",      "calificacion": 7 },
        { "nombre": "Camila Vega",      "calificacion": 16 },
        { "nombre": "Sebastián Ríos",   "calificacion": 13 },
        { "nombre": "Isabella Flores",  "calificacion": 20 },
        { "nombre": "Mateo Herrera",    "calificacion": 15 },
        { "nombre": "Lucía Mendoza",    "calificacion": 18 },
        { "nombre": "Emilio Castro",    "calificacion": 6 },
        { "nombre": "Daniela Ortiz",    "calificacion": 17 },
        { "nombre": "Nicolás Vargas",   "calificacion": 14 },
        { "nombre": "Gabriela Reyes",   "calificacion": 16 },
        { "nombre": "Tomás Aguirre",    "calificacion": 19 },
        { "nombre": "Renata Salazar",   "calificacion": 13 },
        { "nombre": "Joaquín Paredes",  "calificacion": 12 }
    ]
};

// ============================================================
// PREGUNTAS DEL TEST
// ============================================================

const PREGUNTASTEST = [
    {
        pregunta: "¿Qué es la media aritmética?",
        opciones: [
            "El valor que más se repite",
            "La suma de todos los valores dividida entre la cantidad de datos",
            "El valor máximo menos el valor mínimo"
        ],
        correcta: 1
    },
    {
        pregunta: "¿Qué representa la mediana?",
        opciones: [
            "El valor central de los datos ordenados",
            "El dato más pequeño",
            "El promedio de todos los datos"
        ],
        correcta: 0
    },
    {
        pregunta: "¿Qué es la moda?",
        opciones: [
            "El número que más se repite",
            "La diferencia entre máximo y mínimo",
            "La raíz cuadrada de la varianza"
        ],
        correcta: 0
    },
    {
        pregunta: "¿Cómo se calcula el rango?",
        opciones: [
            "Media + mediana",
            "Valor máximo - valor mínimo",
            "Varianza / cantidad de datos"
        ],
        correcta: 1
    },
    {
        pregunta: "¿Qué mide la varianza?",
        opciones: [
            "Qué tan dispersos están los datos respecto a la media",
            "Cuántos datos hay en total",
            "El valor central del conjunto"
        ],
        correcta: 0
    }
];