const express = require('express');
const router = express.Router();
const {Login} = require('../controllers/controllers.login');

// rutas
router.post('/', Login);
module.exports = { router };
