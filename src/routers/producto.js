const express = require('express');
const router = express.Router();
const getPool = require('../connention');
// require('../connention');
// const {connection} = require('./login');


router.get('/', async (req, res) => {
    try {

        const pool = await getPool();
        const result = await pool.query('SELECT * FROM tx_productos');

        res.json({
            status:200,
            des:'ruta de productos',
            message:'this is OK',
            data : result.rows
        });
    } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
        res.status(500).json({ error: 'Error interno del servidor -->' , message:error.message});
    }
});


module.exports = {router};
