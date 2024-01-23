const express = require('express');
const router = express.Router();
const getPool = require('../connention'); 

let connEstablished;

router.get('/', async (req, res) => {
    data = {
        user:'postgres',
        pass:'1234'
    }
    try {
        const pool = await getPool(data);
        connEstablished = await pool;
        const result = await pool.query('SELECT * FROM tx_productos');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});




module.exports = { router, pool: connEstablished };
