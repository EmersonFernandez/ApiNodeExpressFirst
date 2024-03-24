const express = require('express');
const router = express.Router();
const {getTables, getPrivg, getRol, getConfigTables, addConfigPrivg} = require('../controllers/controllers.configPrivilegios');
const { validarToken } = require('../funciones');

// rutas
router.get('/tables', validarToken, getTables);
router.get('/privg', validarToken, getPrivg);
router.get('/rol', validarToken,getRol);
router.get('/', validarToken,getConfigTables);
router.post('/', validarToken, addConfigPrivg);

module.exports = { router };