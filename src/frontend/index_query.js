// =========================
// VARIABLES GLOBALES
// =========================

// URL base de la API
const API_URL = 'http://localhost:3000/api';

// Arreglo donde se almacenarán las personas traídas desde la API
let personas = [];

// Variables para determinar si estamos editando o creando
let modoEdicion = false;

// =========================
// ELEMENTOS DEL DOM
// =========================

// Referencia al formulario de personas
const form = document.querySelector('#personaForm');

// Cuerpo de la tabla donde se insertarán las filas dinámicamente
const tablaBody = document.querySelector('#tablaPersonasBody');

// Template HTML para generar filas de tabla