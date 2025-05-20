// =========================
// VARIABLES GLOBALES
// =========================

// URL base de la API
const API_URL = 'http://localhost:3000/api';

// Arreglo donde se almacenarán las proveedores traídas desde la API
let proveedores = [];

// Variables para determinar si estamos editando o creando
let modoEdicion = false;

// =========================
// ELEMENTOS DEL DOM
// =========================

// Referencia al formulario de proveedores
const form = document.querySelector('#proveedorForm');

// Cuerpo de la tabla donde se insertarán las filas dinámicamente
const tablaBody = document.querySelector('#tablaProveedorBody');

// Template HTML para generar filas de tabla
const template = document.querySelector('#template');

// Botón para guaradar(crear o actualizar)
const btnGuardar = document.querySelector('#btnGuardar');

// Botón para cancelar la edición
const btnCancelar = document.querySelector('#btnCancelar');

// ============================
// CAMPOS DEL FORMULARIO
// ============================

const campos = {
    id: document.querySelector('#id_proveedor'),
    nombre_proveedor: document.querySelector('#nombre_proveedor'),
    direccion: document.querySelector('#direccion'),
    telefono: document.querySelector('#telefono')
};

// ============================
// EVENTOS PRINCIPALES
// ============================

document.addEventListener('DOMContentLoaded', () => {
    cargarProveedores(); // Cargar lista inicial
    form.addEventListener('submit', manejarSubmit); // Guardar datos
    btnCancelar.addEventListener('click', resetearFormulario); // Cancelar edición
});

// =============================
// FUNCIONES DE LÓGICA
// =============================

// Carga todas las proveedores desde la API
async function cargarProveedores() {
    try {
        const response = await fetch(`${API_URL}/proveedores`);
        proveedores = await response.json();
        console.log('Datos de proveedores:', proveedores); // Inspeccionar los datos
        mostrarProveedores();
    } catch (error) {
        console.error('Error al cargar proveedores: ', error);
    }
}

// Muestra en la tabla todas las proveedores cargadas
async function mostrarProveedores() {
    tablaBody.innerHTML = ''; // Limpiar tabla

    proveedores.forEach(async proveedor => {
        const clone = template.content.cloneNode(true); // Clonar template
        const celdas = clone.querySelectorAll('td');

        // Llenar celdas con datos de la proveedor
        celdas[0].textContent = proveedor.id_proveedor;
        celdas[1].textContent = proveedor.nombre_proveedor;
        celdas[2].textContent = proveedor.direccion;
        celdas[3].textContent = proveedor.telefono;

        // Botones de acción
        const btnEditar = clone.querySelector('.btn-editar');
        const btnEliminar = clone.querySelector('.btn-eliminar');

        btnEditar.addEventListener('click', () => editarProveedor(proveedor));
        btnEliminar.addEventListener('click', () => eliminarProveedor(proveedor.id_proveedor));

        tablaBody.appendChild(clone);
    });
}

// Manejo del submit del formulario (crear o actualizar proveedor)
async function manejarSubmit(e) {
    e.preventDefault();

    // Recolectar datos desde el formulario
    const proveedor = {
        nombre_proveedor: campos.nombre_proveedor.value,
        direccion: campos.direccion.value,
        telefono: campos.telefono.value
    };

    try {
        if (modoEdicion) {
            proveedor.id_proveedor = campos.id.value;

            await actualizarProveedor(proveedor);
        } else {
            const response = await crearProveedor(proveedor);
            if (!response.id) {
                throw new Error('El servidor no devolvió el ID de la proveedor creada');
            }
        }

        resetearFormulario();
        cargarProveedores();
    } catch (error) {
        console.error('Error al guardar proveedor: ', error);
        alert('Error al guardar los datos: ' + error.message);
    }
}

// Crea una nueva proveedor en la base de datos
async function crearProveedor(proveedor) {
    const response = await fetch(`${API_URL}/proveedores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proveedor)
    });

    if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();

    if (!data.id) {
        throw new Error('La respuesta del servidor no contiene el ID de la proveedor');
    }

    return data;
}

// Actualiza los datos de una proveedor existente
async function actualizarProveedor(proveedor) {
    const response = await fetch(`${API_URL}/proveedores/${proveedor.id_proveedor}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proveedor)
    });

    const data = await response.json();
    return data;
}

// Elimina una proveedor y su imagen asociada
async function eliminarProveedor(id) {
    if (!confirm('¿Está seguro de eliminar esta proveedor?')) return;

    try {
        await fetch(`${API_URL}/imagenes/eliminar/proveedores/id_proveedor/${id}`, {
            method: 'DELETE'
        });
        await fetch(`${API_URL}/proveedores/${id}`, {
            method: 'DELETE'
        });

        cargarProveedores(); // Recargar la lista
    } catch (error) {
        console.error('Error al eliminar proveedor: ', error);
        alert('Error al eliminar la proveedor ' + error.message);
    }
}

// Carga los datos de la proveedor al formulario para editar
async function editarProveedor(proveedor) {
    modoEdicion = true;

    // Cargar campos
    campos.id.value = proveedor.id_proveedor;
    campos.nombre_proveedor.value = proveedor.nombre_proveedor;
    campos.direccion.value = proveedor.direccion;
    campos.telefono.value = proveedor.telefono;

    btnGuardar.textContent = 'Actualizar';
}

// Restablece el formulario al estado original
function resetearFormulario() {
    modoEdicion = false;
    form.reset();
    btnGuardar.textContent = 'Guardar';
}