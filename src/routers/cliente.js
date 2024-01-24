const express = require('express');
const router = express.Router();
const {validarToken} = require('../fuctiones');

// Ruta protegida que utiliza el middleware de validación
router.get('/', validarToken, (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: 'No hay token, acceso no autorizado' });
    }

    res.json({ 
            mensaje: 'Acceso autorizado',
            data:req.results,
            token:req.token
            });
});


module.exports = { router };