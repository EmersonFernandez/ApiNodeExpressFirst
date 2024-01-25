const express = require('express');
const router = express.Router();
const getPool = require('../connention');
const { closeConnection } = require('../fuctiones');
// require('dotenv').config();
// require('../connention');
// const {connection} = require('./login');


router.get('/', async (req, res) => {
    try {

        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ error: 'No hay token, acceso no autorizado' });
        }

        const pool = await getPool();
        const result = await pool.query('SELECT * FROM tx_productos');



        res.json({
            status: 200,
            error: false,
            des: 'ruta de productos',
            message: 'this is OK',
            results : result.rows
        });

        closeConnection(pool,res);

    } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
        res.json({ 
            status:500,
            error:true,
            errorDes: 'Error interno del servidor', 
            erroMesagge: error.message 
        });
    }
});


module.exports = {router};
