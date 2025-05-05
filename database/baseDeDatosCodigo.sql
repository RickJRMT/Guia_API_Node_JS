-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS crud;
USE crud;

-- Crear tabla personas
CREATE TABLE IF NOT EXISTS personas (
	id_persona INT auto_increment primary key,				-- Indentificador único autoincremental
	nombre varchar(100),									-- Cadena para el nombre
    apellido varchar(100),									-- Cadena para el apellido
    tipo_identificacion varchar(50),						-- Tipo de documento: CC, TI, CE, etc.
    nuip varchar(100),										-- Número único de identificación (ej: cédula)
    email varchar(100),										-- Correo electrónico del usuario
    clave varchar(500),										-- Constraseña encriptada
    salario decimal(10,2),									-- Valor númerico decimal para salario
    activo boolean default true,							-- Valor booleano: 1 (activo), 0 (inactivo)
    fecha_registro date default (current_date),				-- Fecha en la que se registra a la persona
    imagen longblob											-- Imagen en binario (para subir una foto)
);

-- Ver los registros actuales de la tabla personas
select * from personas;