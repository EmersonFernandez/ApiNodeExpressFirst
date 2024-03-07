// este archivo es el encargado de la creacion de la ruta de una forma más dinamica
const fs = require('fs');
const path = require('path');

function cargarRutas(app) {
    const directorio = __dirname;
    console.log("este es el Dirrectorio: >>>>>  " ,directorio);
    fs.readdir(directorio, (error, archivos) => {
        if (error) {
            console.error('Error al leer el directorio:', error);
            return;
        }

        archivos.forEach(nombreArchivo => {
            const rutaArchivo = path.join(directorio, nombreArchivo);
            const nombreRouter = nombreArchivo.substring(0, nombreArchivo.indexOf('.'));
            if (nombreRouter !== 'index' && nombreArchivo.endsWith('.js')) {
                const {router} = require(`${rutaArchivo}`);
                app.use(`/api/${nombreRouter}`, router);
            }
        });
    });
}

// la exportamos
module.exports = cargarRutas;
