const express = require('express');
const router = express.Router();
const { validarToken} = require('../funciones');
const {getsUsers, addUsers,updateUsers,deleteUsers,getUserUnique} = require('../controllers/controllers.usuario');

// rutas
router.get('/', validarToken,getsUsers);
router.get('/unique', validarToken,getUserUnique);
router.post('/', validarToken, addUsers);
router.put('/', validarToken, updateUsers);

router.delete('/:id', validarToken, deleteUsers)

module.exports = { router }