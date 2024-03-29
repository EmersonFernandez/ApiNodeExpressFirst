// controlador de login
const getPool = require('../connection');
const jwt = require('jsonwebtoken');
const {closeConnection} = require('../funciones');
require('dotenv').config();

// logica del login
async function Login(req,res) {
    const { user, pass } = req.body;
    // almacenamos el user y las clave en las variable de entornos
    process.env.PASS = pass;
    process.env.USER = user;

    // establecemos un objeto vacio para almacenar los datos que se van a pasar al token
    const users = {}

    try {
        const pool = await getPool();
        pool.query('SELECT 1', async (err, result) => {

            if (err) {
                console.log('Error al conectar a la base de datos:', err);
                res.json({
                    status: 500,
                    error: true,
                    errorDes: 'Ocurrio un error',
                    errorMessage: err.message
                });

            } else {
                console.log('Conexión exitosa a la base de datos');
                try {
                    const result = await pool.query('SELECT * FROM T_USUARIOS WHERE VUSUARIO = $1', [process.env.USER]);
                    // almacemanos los datos que vamos a pasar por el token
                    users.user = result.rows[0].vusuario;
                    users.documento = result.rows[0].vdocumento;
                    users.rol = result.rows[0].nrol;
                    users.privilegio = result.rows[0].nprivilegio;
                    users.nombres = result.rows[0].vnombre;
                    users.apellidos = result.rows[0].vapellido;
                    users.changepassword = result.rows[0].bchangepassword;
                    //await pool.query(`UPDATE T_USUARIOS SET DFECHALAST = CURRENT_TIMESTAMP WHERE VUSUARIO = $1`,[process.env.USER]);

                } catch (error) {
                    console.error('Error en la consulta:', error);
                    res.json({
                        status: 400,
                        error: true,
                        errorDes: 'Error interno del servidor',
                        erroMesagge: error.message
                    });
                }
                closeConnection(pool, res);

                const token = generateToken(users);

                // pasamos el token a las cookies
                res.cookie('token', token, { secure: true, sameSite: 'none' });

                res.json({
                    status: 200,
                    error: false,
                    message: 'Credenciales correctas',
                    token,
                    user: users.user,
                    rol: users.rol,
                    privilegio: users.privilegio
                });
            }
        });

    } catch (error) {
        console.error('Error al ejecutar la consulta l:', error);
        res.json({
            status: 500,
            error: true,
            errorDes: 'Error interno del servidor',
            erroMesagge: error.message
        });
    }
}

// almacenamos en la variable de entorno la parlabra secreta del token
process.env.SECRET_SENTENCE = '0101452';

// funcion que nos permite generar el token
function generateToken(user){
    const token = jwt.sign(user,process.env.SECRET_SENTENCE,{expiresIn:'15m'});
    return token;
}


module.exports = {
    Login
}