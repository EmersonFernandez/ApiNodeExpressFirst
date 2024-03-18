const express = require('express');
const router = express.Router();
const {validarToken} = require('../funciones');
const {getDataUserConectado} = require('../controllers/controllers.userDataConectado');


// rutas
router.get('/', validarToken,getDataUserConectado);
module.exports = {router}