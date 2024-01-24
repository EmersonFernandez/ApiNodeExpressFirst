const express = require('express');
const router = express.Router();
const getPool = require('../connention');
const {validarToken} = require('../fuctiones');



router.get('/', validarToken,async (req, res) => {
    try {

        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ error: 'No hay token, acceso no autorizado' });
        }

        if(Number(req.results.rol) === 1){
            const pool = await getPool();
            const result = await pool.query('SELECT * FROM usuarios');

            res.json({
                status:200,
                des:'ruta de productos',
                message:'this is OK',
                data : result.rows
            });
        }else{
            res.json({
                status:400,
                des:'ruta de productos',
                message:'No tiene persimos para ver esta vista',
                data : null
            })
        }
        
    } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
        res.status(500).json({ error: 'Error interno del servidor -->' , message:error.message});
    }
});


module.exports = {router}