// API URL base
const API_URL = 'http://localhost:3000/api';

// Elementos del DOM
const registroForm = document.getElementById('registroForm');
const mensajeDiv = document.getElementById('mensaje');

// Events Listeners
document.addEventListener('DOMContentLoaded', () => {
    registroForm.addEventListener('submit', manejarRegistro);

    // Verificar si el usuario ya está autenticado
    const usuarioId = localStorage.getItem('usuarioId');
    if (usuarioId) {
        // Si ya está autenticado, redirigir a la página principal
        window.location.href = 'index_template.html';
    }
});

// Función para manejar el registro
async function manejarRegistro(e) {
    e.preventDefault();

    // Obtener valores del formulario
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const telefono = document.getElementById('telefono').value;
    const email = document.getElementById('email').value;
    const clave = document.getElementById('clave').value;
    const confirmarClave = document.getElementById('confirmarClave').value;

    // Validar que las contraseñas coincidan
    if (clave !== confirmarClave) {
        mostrarMensaje('Las contraseñas no coinciden', false);
        return;
    }

    // Crear objeto de usuario
    const usuario = {
        nombre,
        apellido,
        telefono,
        email,
        clave,
        rol: 'Cliente' // Por defecto, asignamos rol de cliente
    };

    try {
        // Enviar solicitud de registro
        const response = await fetch(`${API_URL}/auth/registro`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
        });

        const resultado = await response.json();

        if (resultado.success) {
            mostrarMensaje('Registro exitoso. Redirigiendo al inicio de sesión...', true);

            // Redirigir al login después de un breve retraso
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            mostrarMensaje(resultado.message, false);
        }
    } catch (error) {
        console.error('Error al registrar usuario: ', error);
        mostrarMensaje('Error al procesar el registro. Intente nuevamente.', false);
    }
}

// Funcion para mostrar mensaje
function mostrarMensaje(texto, esExito) {
    mensajeDiv.textContent = texto;
    mensajeDiv.style.display = 'block';

    if (esExito) {
        mensajeDiv.style.backgroundColor = '#d4edda';
        mensajeDiv.style.color = '#155724';
    } else {
        mensajeDiv.style.backgroundColor = '#f8d7da';
        mensajeDiv.style.color = '#721c24';
    }
}