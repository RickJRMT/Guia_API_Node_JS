const db = require('../config/db');
// Se importa la conexión a la base de datos desde el archivo db.js

// Se crea una clase llamada CrudController que manejará todas las operaciones CRUD
class CrudController {

    // Método para obtener todos los registros de una tabla
    async obtenerTodo(tabla) {
        try {
            // Realiza una consulta SQL para seleccionar todos los registros de la tabla indicada
            const [resultados] = await db.query(`SELECT * FROM ${tabla}`);
            return resultados; // Devuelve el array de resultados
        } catch (error) {
            throw error; // Lanza el error para que sea manejado en otro lugar
        }
    }

    // Método para obtener un único registro por su ID
    async obtenerUno(tabla, idCampo, id) {
        try {
            // Se utiliza el doble interrogante "??" para escapar nombre de tabla/campo, y un interrogante "?" para el valor
            const [resultado] = await db.query(`SELECT * FROM ?? WHERE ?? = ?`, [tabla, idCampo, id]);
            return resultado[0]; // Devuelve solo el primer resultado
        } catch (error) {
            throw error; // Lanza el error para que sea manejado en otro lugar
        }
    }

    // Método para crear un nuevo registro
    async crear(tabla, data) {
        try {
            // Inserta los datos en la tabla indicada
            const [resultado] = await db.query(`INSERT INTO ?? SET ?`, [tabla, data]);
            // Devuelve el objeto creado, incluyendo el ID generado automáticamente
            return { ...data, id: resultado.insertId };
        } catch (error) {
            throw error;
        }
    }

    // Método para actualizar un registro existente
    async actualizar(tabla, idCampo, id, data) {
        try {
            // Ejecuta una consulta UPDATE con los datos nuevos
            const [resultado] = await db.query(`UPDATE ?? SET ? WHERE ?? = ?`, [tabla, data, idCampo, id]);
            // Si no se afectó ninguna fila, es que el registro no existía
            if (resultado.affectedRows === 0) {
                throw new Error('Registro no encontrado');
            }
            // Devuelve el registro actualizado
            return await this.obtenerUno(tabla, idCampo, id);
        } catch (error) {
            throw error;
        }
    }

    // Método para eliminar un registro
    async eliminar(tabla, idCampo, id) {
        try {
            // Ejecuta la eliminación del registro
            const [resultado] = await db.query(`DELETE FROM ?? WHERE ?? = ?`, [tabla, idCampo, id]);
            // Si no se eliminó niguna fila, es que el ID no existe
            if (resultado.affectedRows === 0) {
                throw new Error('Regristro no encontrado');
            }
            // Devuelve un mensaje de éxito
            return { mensaje: 'Registro eliminado correctamente' };
        } catch (error) {
            throw error;
        }
    }
}

// Se exporta la clase para poder utilizarla en otros archivos
module.exports = CrudController;