const getPool = require('../connection');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { closeConnection } = require('../funciones');


async function Login(req, res) {
    const { user, pass } = req.body;
    try {
        // llamamos la conexion
        const pool = await getPool();
        // hacemos una consulta
        const { rows } = await pool.query('SELECT * FROM T_USUARIOS WHERE VUSUARIO = $1', [user]);

        // validamos que el usuario exista
        if (rows.length > 0) {
            const usuario = rows[0];
            const contraseñaValida = await bcrypt.compare(pass, usuario.vpassword);

            // validamos que la contrasela hash si tenga contenido
            if (contraseñaValida) {
                // generamos el token
                const token = generateToken(usuario);
                // madamos el token a la cookies
                res.cookie('token', token, { secure: true, sameSite: 'none' });
                // mandamos la repuesta
                res.json({
                    status: 200,
                    error: false,
                    message: 'Credenciales correctas',
                    token,
                    user: usuario.vusuario,
                    rol: usuario.nrol,
                    privilegio: usuario.nprivilegio
                });
            } else {
                // si pass sea incorrectas o es null
                res.json({
                    status: 401,
                    error: true,
                    errorMesagge: 'Credenciales incorrectas'
                });
            }
        } else {
            // si el usuario no existe
            res.json({
                status: 404,
                error: true,
                errorMesagge: 'Usuario o contreaseña iccorrestas'
            });
        }
        // Cierra la conexión con la base de datos
        closeConnection(pool, res);
    } catch (error) {
        // manejos de errores
        console.error('Error al ejecutar la consulta:', error);
        res.json({
            status: 500,
            error: true,
            message: 'Error interno del servidor',
            errorMessage: error.message
        });
    }
}

// almacenamos la palabara clave para el token
process.env.SECRET_SENTENCE = '010101';

// fucion que genera el token 
function generateToken(usuario) {
    const token = jwt.sign({
        codigo: usuario.ncodigo,
        user: usuario.vusuario,
        documento: usuario.vdocumento,
        rol: usuario.nrol,
        privilegio: usuario.nprivilegio,
        nombres: usuario.vnombre,
        apellidos: usuario.vapellido,
        changepassword: usuario.bchangepassword
    }, process.env.SECRET_SENTENCE, { expiresIn: '15m' });
    return token;
}



async function ResetPassword(req, res) {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.json(
                {
                    status: 400,
                    error: true,
                    errorMessage: 'No hay token, acceso no autorizado'
                }
            )
        }

        // capturamos los datos del body
        const { pass, user } = req.body;

        // lamamos la conexion
        const pool = await getPool();
        // hash de la password
        const hashpassword = await bcrypt.hash(pass, 10);
        // construimos el query 
        const sqlQuery = `
        UPDATE T_USUARIOS SET
            vpassword = $1,
            bchangepassword = false
        WHERE ncodigo = $2
        AND vusuario = $3    
        `;
        // ejecutamos el query 
        const result = await pool.query(sqlQuery, [hashpassword, req.results.codigo, user]);

        if(result.rowCount > 0){
            // mandamos la respuestas
        res.json({
            status: 200,
            error: false,
            message: 'La contraseña se cambio con exito'
        });
        }else{
            // mandamos la respuestas
        res.json({
            status: 400,
            error: true,
            message: 'Error al cambiar la contraseña'
        });
        }
        
        // Cerramos la conexion
        closeConnection(pool,res);
        
    } catch (error) {
        // manejos de errores
        console.error('Error al ejecutar la consulta:', error);
        res.json({
            status: 500,
            error: true,
            message: 'Error interno del servidor',
            errorMessage: error.message
        });
    }
}

// exportamos el login
module.exports = {
    Login,
    ResetPassword
};

