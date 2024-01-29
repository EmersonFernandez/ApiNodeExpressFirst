const express = require('express');
const router = express.Router();
const {validarToken} = require('../funciones');



router.get('/', validarToken,async (req, res) => {
    try {

        const token = req.cookies.token;

        if (!token) {
            return res.json({ error: 'No hay token, acceso no autorizado' });
        }

        res.json({
            status: 200,
            error: false,
            des: 'Data del usuario conectado',
            message: 'this is OK',
            dataUser: req.results,
            token: req.token
        
        });

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


module.exports = {router}