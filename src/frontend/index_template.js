// Variables globales
const API_URL = 'http://localhost:3000/api'; // URL base de la API backend
let personas = []; // Arreglo donde se almacenan las personas obtenidas del servidor

// Elementos del DOM
const personaForm = document.getElementById('personaForm'); // Formulario principal
const tablaPersonasBody = document.getElementById('tablaPersonasBody'); // Cuerpo de la tabla donde se listan personas
const btnCancelar = document.getElementById('btnCancelar'); // Botón para limpiar el formulario
const imagenInput = document.getElementById('imagen'); // Input de imagen
const previewImagen = document.getElementById('previewImagen'); // Imagen para previsualizar la subida

// Event Listeners
document.addEventListener('DOMContentLoaded', cargarPersonas); // Carga personas al iniciar la página
personaForm.addEventListener('submit', manajerSubmit); // Enviar el formulario
btnCancelar.addEventListener('click', limpiarFormulario); // Botón de cancelar limpia el formulario
imagenInput.addEventListener('change', manejarImagen); // Cargar previsualización cuando se selecciona imagen

// Función que obtiene personas del backend
async function cargarPersonas() {
    try {
        const response = await fetch(`${API_URL}/personas`); // Solicitud GET a la API
        personas = await response.json(); // Almacena respuesta en arreglo
        await mostrarPersonas();
    } catch (error) {
        console.error('Error al cargar personas: ', error);
    }
}

// Función para mostrar todas las personas en la tabla
async function mostrarPersonas() {
    // Limpia el contenido actual del cuerpo de la tabla para evitar duplicados
    tablaPersonasBody.innerHTML = '';

    // Obtiene el elemento <template> que contiene la estructura de una fila de persona
    const template = document.getElementById('template');

    // Recorre la lista de personas obtenidas desde el backend
    for (const persona of personas) {
        // Clona el contenido del template (la fila predefinida)
        const clone = template.content.cloneNode(true);

        // Obtiene todas las celdas <td> dentro del clon
        const tds = clone.querySelectorAll('td');

        // Inicializa el contenido de imagen como 'Sin imagen' por defecto
        let imagenHTML = 'Sin imagen';

        // Intenta obtener la imagen de la persona desde el backend
        try {
            // Realiza una petición GET al endpoint de imagen de la persona por su ID
            const response = await fetch(`${API_URL}/imagenes/obtener/personas/id_persona/${persona.id_persona}`);

            // Convierte la respuesta en un objeto JSON
            const data = await response.json();

            // Si hay una imagen en la respuesta, se construye la etiqueta <img> con la imagen en base 64
            if (data.imagen) {
                imagenHTML = `<img src="data:image/jpeg;base64,${data.imagen}"
                style="max-width: 100px; max-height: 100px;">`;
            }
        } catch (error) {
            // Si ocurre un error al obtener la imagen, lo muestra en consola
            console.error('Error al cargar imagen: ', error);
        }

        // Llena las celdas con los datos de la persona
        tds[0].textContent = persona.id_persona;    // ID
        tds[1].textContent = persona.nombre;        // Nombre
        tds[2].textContent = persona.apellido;      // Apellido
        tds[3].textContent = persona.email;         // Email
        tds[4].innerHTML = imagenHTML;              // Imagen (si existe, muestra imagen, si no, "Sin imagen")

        // Busca los botones de editar y eliminar dentro del clon
        const btnEditar = clone.querySelector('.btn-editar');
        const btnEliminar = clone.querySelector('.btn-eliminar');

        // Asigna el evento de click al botón de editar, llamando a la función con el ID de la persona
        btnEditar.addEventListener('click', () => editarPersona(persona.id_persona));

        // Asigna el evento de click al botón de eliminar, llamando a la función con el ID de la persona
        btnEliminar.addEventListener('click', () => eliminarPersona(persona.id_persona));

        // Finalmente, agrega la fila clonada (con datos y botones configurados) al cuerpo de la tabla
        tablaPersonasBody.appendChild(clone);
    }
}

// Función que maneja el envío del formulario (crear o editar persona)
async function manejarSubmit(e) {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario

    // Obtiene los datos del formulario
    const persona = {
        id_persona: document.getElementById('id_persona').value || null,
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        tipo_identificacion: document.getElementById('tipo_identificacion').value,
        nuip: document.getElementById('nuip').value,
        email: document.getElementById('email').value,
        clave: document.getElementById('clave').value,
        salario: parseFloat(document.getElementById('sakarui').value),
        activo: document.getElementById('activo').checked
    };

    try {
        if (persona.id_persona) {
            // Si estamos editando (id_persona existe)

            // Subir imagen si fue seleccionada
            if (imagenInput.files[0]) {
                const imagenBase64 = await convertirImagenABase64(imagenInput.files[0]);
                await fetch(`${API_URL}/imagenes/subir/personas/id_persona/${persona.id_persona}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ imagen: imagenBase64 })
                });
            }
            // Actualizar los datos de la persona
            await actualizarPersona(personas);
        } else {
            // Si es nueva persona
            const nuevaPersona = await crearPersona(persona); // Crear persona
            if (imagenInput.files[0]) {
                const imagenBase64 = await convertirImagenABase64(imagenInput.files[0]);
                await fetch(`${API_URL}/imagenes/insertar/personas/id_persona/${nuevaPersona}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ imagen: imagenBase64 })
                });
            }
        }
        limpiarFormulario(); // Limpia el formulario
        cargarPersonas(); // Recarga la lista
    } catch (error) {
        console.error('Error al guardar persona: ', error);
        alert('Error al guardar los datos: ' + error.message);
    }
}

// Crea una persona nueva en la base de datos
async function crearPersona(persona) {
    const response = await fetch(`${API_URL}/personas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(persona)
    });
    return await response.json(); // Devuelve el objeto persona nuevo con id
}

// Actualiza una persona existente
async function actualizarPersona(persona) {
    const response = await fetch(`${API_URL}/personas/${persona.id_persona}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(persona)
    });
    return await response.json();
}

// Elimina persona (y su imagen si existe)
async function eliminarPersona(id) {
    if (confirm('¿Está seguro de eliminar esta persona')) {
        try {
            await fetch(`${API_URL}/imagenes/eliminar/personas/id_persona/${id}`, { method: 'DELETE' }); // Elimina imagen
            await fetch(`${API_URL}/persona/${id}`, { method: 'DELETE' }); //Elimina persona
            cargarPersonas(); // Recarga la lista
        } catch (error) {
            console.error('Error al eliminar persona: ', error);
            alert('Error al eliminar la persona: ' + error.message);
        }
    }
}

// Llena el formulario con los datos de una persona para editar
async function editarPersona(id) {
    const persona = personas.files(p => p.id_persona === id);
    if (persona) {
        document.getElementById('id_persona').value = persona.id_persona;
        document.getElementById('nombre').value = persona.nombre;
        document.getElementById('apellido').value = persona.apellido;
        document.getElementById('tipo_identificacion').value = persona.tipo_identificacion;
        document.getElementById('nuip').value = persona.nuip;
        document.getElementById('email').value = persona.email;
        document.getElementById('clave').value = ''; // No se muestra la contraseña
        document.getElementById('salario').value = persona.salario;
        document.getElementById('activo').checked = persona.activo;

        // Carga la imagen si existe
        try {
            const response = await fetch(`${API_URL}/imagenes/obtener/personas/id_persona/${id}`);
            const data = await response.json();
            if (data.imagen) {
                previewImagen.src = `data:image/jpeg;base64,${data.imagen}`;
                previewImagen.style.display = 'block';
            } else {
                previewImagen.style.display = 'none';
                previewImagen.src = '';
            }
        } catch (error) {
            console.error('Error al cargar imagen: ', error);
            previewImagen.style.display = 'none';
            previewImagen.src = '';
        }
    }
}

// Limpia todos los campos del formulario
function limpiarFormulario() {
    personaForm.reset();
    document.getElementById('id_persona').value = '';
    previewImagen.style.display = 'none';
    previewImagen.src = '';
}

// Muestra una previsualización de la imagen seleccionada
function manejarImagen(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            previewImagen.src = e.target.result;
            previewImagen.style.display = 'block';
        }
        reader.readAsDataURL(file);
    } else {
        previewImagen.style.display = 'none';
        previewImagen.src = '';
    }
}

// Convierte imagen a base64 para enviarla al backend
function convertirImagenABase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const base64 = reader.result.split(',')[1]; // Elimina el prefijo del data URI
            resolve(base64);
        };
        reader.onerror = error => reject(error);
    });
}
