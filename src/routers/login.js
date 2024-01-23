const express = require('express');
const router = express.Router();
const getPool = require('../connention'); // Importar la configuración de la conexión

router.post('/', async (req, res) => {
    try {
        const pool = await getPool(req.body); // Obtener el pool antes de ejecutar la consulta
        const result = await pool.query('SELECT * FROM tx_productos');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;
