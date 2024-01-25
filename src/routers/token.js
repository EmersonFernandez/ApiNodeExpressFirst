const express = require('express');
const router = express.Router();


// Ruta protegida que utiliza el middleware de validación
router.get('/', (req, res) => {
    const token = req.cookies.token;

    res.json({ 
                token
            });
});


module.exports = { router };