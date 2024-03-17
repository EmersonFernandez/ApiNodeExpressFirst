// archivo de ruta de los productos
const express = require('express');
const router = express.Router();
const { validarToken } = require('../funciones');
const multer = require('multer');
const fs = require('fs');
const getPool = require('../connection');
const { closeConnection } = require('../funciones');
const { log } = require('console');

const upload = multer({ dest: 'uploads/' });



router.post('/', upload.single('imagen'), async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.json(
                {
                    error: true,
                    errorMessage: 'No hay token, acceso no autorizado'
                }
            );
        }

        const file = req.file;
        const nombre = req.body.nombre || file.originalname;

        // Leer el archivo cargado
        const datos = fs.readFileSync(file.path);

        const pool = await getPool();
        const resultSeq = await pool.query('SELECT COALESCE(max(NCODIGO),0) + 1 as seq FROM tx_imagen');
        const seq = resultSeq.rows[0].seq; 
        console.log(datos);
        await pool.query('INSERT INTO tx_imagen (ncodigo ,vnombre, bydato) VALUES ($1, $2, $3)', [seq,nombre, datos]);

        // Eliminar el archivo temporal
        fs.unlinkSync(file.path);
        console.log(file.path);

        res.send('Imagen cargada con éxito');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al cargar la imagen');
    }
});

module.exports = {router}