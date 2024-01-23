const express = require('express');
const router = express.Router();
const getPool = require('../connention');

router.get('/', async (req, res) => {
    const { user, pass } = req.body;
    process.env.PASS =  '1234';
    process.env.USER =  'emerson';
    // process.env.PASS =  pass;
    // process.env.USER =  user;

    try {
        const pool = await getPool();
        pool.query('SELECT 1', (err, result) => {
            if (err) {
                console.log('Error al conectar a la base de datos:', err);
                res.json({
                    error :'Ocurrio un error',
                    message:err.message
                });
            } else {
                console.log('Conexión exitosa a la base de datos');
                res.json({
                    message:'Credenciales correctas'
                });

            }
        });
        
    } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
        res.status(500).json({ error: 'Error interno del servidor', erroMesagge: error.message });
    }
});

module.exports = { router };
