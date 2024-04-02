// archivo de ruta de los productos
const express = require('express');
const router = express.Router();
const { validarToken } = require('../funciones');
const multer = require('multer');
const fs = require('fs');
const getPool = require('../connection');
const { closeConnection } = require('../funciones');

const upload = multer();

// const upload = multer({ dest: 'uploads/' });



// router.post('/', upload.single('imagen'), async (req, res) => {
//     try {
//         const token = req.cookies.token;
//         if (!token) {
//             return res.json(
//                 {
//                     error: true,
//                     errorMessage: 'No hay token, acceso no autorizado'
//                 }
//             );
//         }

//         const file = req.file;
//         const nombre = req.body.nombre || file.originalname;

//         // Leer el archivo cargado
//         const datos = fs.readFileSync(file.path);

//         const pool = await getPool();
//         const resultSeq = await pool.query('SELECT COALESCE(max(NCODIGO),0) + 1 as seq FROM tx_imagen');
//         const seq = resultSeq.rows[0].seq; 
//         console.log(datos);
//         await pool.query('INSERT INTO tx_imagen (ncodigo ,vnombre, bydato) VALUES ($1, $2, $3)', [seq,nombre, datos]);

//         // Eliminar el archivo temporal
//         fs.unlinkSync(file.path);
//         console.log(file.path);

//         res.send('Imagen cargada con éxito');
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error al cargar la imagen');
//     }
// });

router.post('/upload', validarToken,upload.single('image'), async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json(
            {
                error: true,
                errorMessage: 'No hay token, acceso no autorizado'
            }
        );
    }

    if (!req.file) {
        return res.status(400).send('No se envió ningún archivo.');
    }

    try {
        const imageBuffer = req.file.buffer; // Accede al buffer del archivo cargado
        // Asume que tienes una columna de tipo BYTEA en tu tabla 'imagenes' para almacenar el archivo binario
        await pool.query('INSERT INTO t_imagenes (imagen) VALUES ($1)', [imageBuffer]);
        res.status(200).json({ message: "Imagen guardada con éxito" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al guardar la imagen" });
    }
});


router.get('/image/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await pool.query('SELECT imagen FROM imagenes WHERE id = $1', [id]);
        
        if (rows.length > 0) {
            const image = rows[0].imagen;
            res.writeHead(200, {
                'Content-Type': 'image/png', // Ajusta según el tipo de imagen que estés manejando
                'Content-Length': image.length
            });
            res.end(image); 
        } else {
            res.status(404).send('Imagen no encontrada.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al recuperar la imagen.');
    }
});


module.exports = { router }