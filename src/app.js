const express = require('express');
// Importa el framework Express para crear el servidor

const cors = require('cors');
// Importa CORS para permitir solicitudes desde otros dominios (muy útil cuando el frontend y backend están separados)

const app = express();
// Crear una instancia de aplicación Express

const imagenesRoutes = require('./backend/routes/imagenes.routes');
// Importar las rutas para el manejo de imágenes desde el archivo correspondiente

// Middleware
app.use(cors());
// Habilita los CORS (permite que el servidor reciba peticiones desde otros orígenes)

app.use(express.json({ limit: '50mb' }));
// Permite recibir datos en formato JSON, estableciendo un límite de 50MB (ideal para datos grandes como imagenes en base64)

app.use(express.urlencoded({ extended: true, limit: '50mb' }));
// Permite recibir datos codificados desde formularios (como los enviados por POST desde HTML), también con límite de 50MB

// Rutas
app.use('/api/imagenes', imagenesRoutes);
// Asocia todas las rutas de imágenes bajo el prefijo de /api/imagenes

app.use('/api/personas', require('./backend/routes/personas.routes'));
// Asocia todas las rutas de personas bajo el prefijo /api/personas

app.use('/api/proveedores', require('./backend/routes/proveedores.routes'));
// Asocia todas las rutas de proveedores bajo el prefijo /api/proveedores

module.exports = app;
// Exporta la app configurada para ser utilizada por el archivo principal del servidor (en este caso el archivo server.js)