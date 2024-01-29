const express = require('express');
const router = express.Router();
const {validarToken} = require('../funciones');

// Ruta protegida que utiliza el middleware de validación
router.get('/', validarToken, (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: 'No hay token, acceso no autorizado' });
    }

    res.json({ 
            status: 200,
            error: false,
            mensaje: 'Acceso autorizado',
            results: req.results,
            token: req.token
            });
});


module.exports = { router };