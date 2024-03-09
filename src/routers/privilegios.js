const express = require('express');
const router = express.Router();


// Ruta protegida que utiliza el middleware de validación
router.get('/', (req, res) => {
    res.send('Enviado');
});


module.exports = { router };