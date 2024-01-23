// const express = require('express');
// const router = express.Router();

// const ejemploRoutes = require('./router');

// router.use('/', ejemploRoutes);

// module.exports = router;


const fs = require('fs');
const path = require('path');

function cargarRutas(app) {
    const directorio = './routers'; // Directorio donde se encuentran tus archivos de ruta

    fs.readdir(directorio, (error, archivos) => {
        if (error) {
            console.error('Error al leer el directorio:', error);
            return;
        }

        archivos.forEach(nombreArchivo => {
            const rutaArchivo = path.join(directorio, nombreArchivo);
            const nombreRouter = nombreArchivo.substring(0, nombreArchivo.indexOf('.'));
            if (nombreRouter !== 'index' && nombreArchivo.endsWith('.js')) {
                const router = require(`../${rutaArchivo}`);
                app.use(`/api/${nombreRouter}`, router);
            }
        });
    });
}

module.exports = cargarRutas;
