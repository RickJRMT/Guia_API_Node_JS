const multer = require('multer');
// Importa el módulo "multer", que sirve para manejar la subida de archivos desde formularios en Node.js

// Almacenamiento en memoria
const storage = multer.memoryStorage();
// Se define una estrategia de almacenamiento en memoria (RAM) temporal para los archivos subidos. Esto significa que los archivos no se guardan en el disco, sino en un buffer en memoria

const upload = multer({ storage });
// Se crea una instancia del middleware de subida con la configuración de almancemiento definida (en memoria). Esta instancia puede ser utilizada en las rutas donde se acepten archivos, por ejemplo, imágenes de perfil.

module.exports = upload;
// Se exporta la configuración para poder utilizarla en otros archivos del proyecto (como en rutas de Express)