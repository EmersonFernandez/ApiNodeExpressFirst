// archivo de ruta de los productos
const express = require('express');
const router = express.Router();
const { validarToken } = require('../funciones');
const multer = require('multer');
const fs = require('fs');
const getPool = require('../connection');
const { closeConnection } = require('../funciones');

const upload = multer();


router.post('/upload',upload.single('image'), async (req, res) => {
    // const token = req.cookies.token;
    // if (!token) {
    //     return res.json(
    //         {
    //             error: true,
    //             errorMessage: 'No hay token, acceso no autorizado'
    //         }
    //     );
    // }

    if (!req.file) {
        return res.json({
            status:400,
            error:true,
            message:'No se envió ningún archivo.'
        });
    }

    try {
        const pool = await getPool();
        const resultSeq = await pool.query('SELECT COALESCE(max(NCODIGO),0) + 1 as seq FROM t_imagenes');
        const seq = resultSeq.rows[0].seq; 
        const {codigo} = req.body;
        const { originalname, mimetype, buffer } = req.file; 
        // Asume que tienes una columna de tipo BYTEA en tu tabla 'imagenes' para almacenar el archivo binario
        await pool.query('INSERT INTO t_imagenes (ncodigo,bydata,vmime,vnombre,ncodigo_producto) VALUES ($1,$2,$3,$4,$5)', [seq,buffer,mimetype,originalname,codigo]);
        res.json({ 
            status:200,
            error:false,
            message: "Imagen guardada con éxito"
        });
        // cerramos la conexion
        closeConnection(pool,res);
    } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
        return res.json({
            status: 500,
            error: true,
            message: 'Error interno del servidor',
            errorMesagge: error.message
        });
    }
});


router.put('/upload',upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.json({
            status:400,
            error:true,
            message:'No se envió ningún archivo.'
        });
    }

    try {
        const pool = await getPool();
        const {codigo} = req.body;
        const { originalname, mimetype, buffer } = req.file; 
        // Asume que tienes una columna de tipo BYTEA en tu tabla 'imagenes' para almacenar el archivo binario
        const sqlQuery = `
            UPDATE T_IMAGENES SET 
            bydata = $1,
            vmime = $2,
            vnombre = $3
            WHERE ncodigo_producto = $4
        `;
        await pool.query(sqlQuery, [buffer,mimetype,originalname,codigo]);
        res.json({ 
            status:200,
            error:false,
            message: "Imagen actualizada"
        });
        // cerramos la conexion
        closeConnection(pool,res);
    } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
        return res.json({
            status: 500,
            error: true,
            message: 'Error interno del servidor',
            errorMesagge: error.message
        });
    }
});

router.get('/image/:id', async (req, res) => {
    try {
        const pool = await getPool();

        const { id } = req.params;
        const { rows } = await pool.query('SELECT * FROM t_imagenes WHERE ncodigo = $1', [id]);
        
        if (rows.length > 0) {
            const image = rows[0].bydata;
            const mime = rows[0].vmime;
            res.writeHead(200, {
                'Content-Type': `${mime}`, // Ajusta según el tipo de imagen que estés manejando
                'Content-Length': image.length
            });
            res.end(image); 
            // cerramos la conexion
        closeConnection(pool,res);
        } else {
            res.json({
                status:400,
                error:true,
                errorMessage:'Imagen no encontrada.'
            });
        }
    } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
        return res.json({
            status: 500,
            error: true,
            message: 'Error interno del servidor',
            errorMesagge: error.message
        });
    }
});


module.exports = { router }