// archivo de ruta de los productos
const express = require('express');
const router = express.Router();
const { getsProducts, addProducts, updateProducts , deleteProduct,getProduct} = require('../controllers/controllers.producto')
const {validarToken } = require('../funciones');

router.get('/', validarToken, getsProducts);
router.post('/', validarToken, addProducts);
router.put('/', validarToken, updateProducts);
router.get('/:id', validarToken , getProduct)
router.delete('/:id',validarToken, deleteProduct);

module.exports = { router };
