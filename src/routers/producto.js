const express = require('express');
const router = express.Router();
const getPool = require('../connention');
// require('dotenv').config();
// require('../connention');
// const {connection} = require('./login');


router.get('/', async (req, res) => {
    try {

        const token = req.cookies.token;

        // if (!token) {
        //     return res.status(401).json({ error: 'No hay token, acceso no autorizado' });
        // }

        const pool = await getPool();
        const result = await pool.query('SELECT * FROM tx_productos');



        res.json({
            status:200,
            des:'ruta de productos',
            message:'this is OK',
            data : result.rows
        });

        pool.end(err => {
            if (err) {
                console.error('Error al cerrar la conexión:', err);
            } else {
                console.log('Conexión cerrada correctamente');
            }
            });

    } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
        res.json({ error: 'Error interno del servidor -->' , message:error.message});
    }
});


module.exports = {router};
