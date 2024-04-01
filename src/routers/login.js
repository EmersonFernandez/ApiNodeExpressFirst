const express = require('express');
const router = express.Router();
const {validarToken } = require('../funciones');
const {Login,ResetPassword} = require('../controllers/controllers.login');

// rutas
router.post('/', Login);
router.put('/',validarToken,ResetPassword);
module.exports = { router };
