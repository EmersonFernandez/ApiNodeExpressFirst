const express = require('express');
const router = express.Router();
const getPool = require('../connention');
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.post('/', async (req, res) => {
    const { user, pass } = req.body;
    process.env.PASS =  pass;
    process.env.USER =  user;
    console.log(user);
    const users = {}
    // process.env.PASS =  pass;
    // process.env.USER =  user;

    try {
        const pool = await getPool();
        pool.query('SELECT 1', async (err, result) => {
            if (err) {
                console.log('Error al conectar a la base de datos:', err);
                res.json({
                    error :'Ocurrio un error',
                    message:err.message
                });
            } else {
                console.log('Conexión exitosa a la base de datos');

                try {
                    const result = await pool.query('SELECT VDOCUMENTO, USUARIO, NROL FROM USUARIOS WHERE USUARIO = $1', [process.env.USER]);
                   // console.log(result.rows); // Resultados de la consulta
                    users.user = result.rows[0].usuario;
                    users.documento = result.rows[0].vdocumento;
                    users.rol = result.rows[0].nrol;
                    console.log(users);
                    } catch (error) {
                    console.error('Error en la consulta:', error);
                    }

                pool.end(err => {
                    if (err) {
                        console.error('Error al cerrar la conexión:', err);
                    } else {
                        console.log('Conexión cerrada correctamente');
                    }
                    });

                const token = generateToken(users);
                res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none' });
                process.env.TOKEN = token;
                res.header('Authorization', `Bearer ${token}`);
                res.json({
                    message:'Credenciales correctas',
                    token
                });
            }
        });
        
    } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
        res.status(500).json({ error: 'Error interno del servidor', erroMesagge: error.message });
    }
});

process.env.SECRET_SENTENCE = '0101452';
function generateToken(user){
    const token = jwt.sign(user,process.env.SECRET_SENTENCE,{expiresIn:'5m'});
    return token;
}

module.exports = { router };


// const express = require('express');
// const router = express.Router();
// const getPool = require('../connention'); // Correct the typo in the require statement
// const jwt = require('jsonwebtoken');
// require('dotenv').config();

// router.get('/', async (req, res) => { // Use router.post for handling POST requests
//     const { user, pass } = req.body;
//     process.env.PASS =  '1234';
//     process.env.USER =  'emerson';
//     const users = {
//         user :  'emerson'
//     }
//     try {
//         const pool = await getPool();
//         pool.query('SELECT 1', (err, result) => {
//             if (err) {
//                 console.log('Error al conectar a la base de datos:', err);
//                 return res.status(500).json({
//                     error: 'Ocurrio un error',
//                     message: err.message
//                 });
//             }

//             console.log('Conexión exitosa a la base de datos');
//             const token = generateToken({ user: 'emerson' }); // Pass a valid user object
            
//             res.header('Authorization', `Bearer ${token}`);
//             res.json({
//                 message: 'Credenciales correctas',
//                 token
//             });
//             console.log('Todos los encabezados:', req.headers.authorization);
//         });

//     } catch (error) {
//         console.error('Error al ejecutar la consulta:', error);
//         res.status(500).json({ error: 'Error interno del servidor', errorMessage: error.message });
//     }
// });

// const claveSecreta = process.env.SECRET_SENTENCE || '0101452';
// function generateToken(user) {
//     const token = jwt.sign(user, claveSecreta, { expiresIn: '1h' });
//     return token;
// }

// module.exports = {router}; // Export the router directly, not as an object
