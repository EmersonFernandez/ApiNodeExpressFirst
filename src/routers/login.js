const express = require('express');
const router = express.Router();
const getPool = require('../connention'); 

let connEstablished;

router.post('/', async (req, res) => {
    try {
        const pool = await getPool(req.body);
        connEstablished = pool;
        const result = await pool.query('SELECT * FROM tx_productos');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.get('/', async (req, res) => {
    try {
        res.json({
            status:200,
            message:'this is OK'
        });
        // const pool = await getPool(req.body); // Obtener el pool antes de ejecutar la consulta
        // const result = await pool.query('SELECT * FROM tx_productos');
        // res.json(result.rows);
    } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


module.exports = {
    router,
    pool
};
