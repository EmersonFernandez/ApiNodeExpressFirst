// controlador usuarios
const getPool = require('../connection');
const { closeConnection } = require('../funciones');
const bcrypt = require('bcryptjs');

// mostrar los usuaios
async function getsUsers(req, res) {
    try {

        // validacion si existe el token
        const token = req.cookies.token;
        if (!token) {
            return res.json({ error: 'No hay token, acceso no autorizado' });
        }

        // llamamos la conexion
        const pool = await getPool();
        // cosntrución de le la consulta
        const sqlQuery = `select t_usuarios.*,t_rol.vnombre name_rol,t_privilegios.vnombre name_privg
        from t_usuarios, t_rol , t_privilegios
        where t_usuarios.nrol = t_rol.ncodigo
        and (t_usuarios.nprivilegio = t_privilegios.ncodigo)
        union 
        select t_usuarios.*,t_rol.vnombre name_rol,'Administrador' name_privg 
        from t_usuarios, t_rol
        where t_usuarios.nrol = t_rol.ncodigo
        and (t_usuarios.nprivilegio is null)
        ORDER BY NCODIGO`;
        // ejecutamos el query 
        const result = await pool.query(sqlQuery);

        // mandamos la respuesta
        res.json({
            status: 200,
            error: false,
            des: 'ruta de usuarios',
            message: 'this is OK',
            results: result.rows
        });

        closeConnection(pool, res);

    } catch (error) {
        // manejo de errores
        console.error('Error al ejecutar la consulta:', error);
        res.json({
            status: 500,
            error: true,
            message: 'Error interno del servidor',
            errorMesagge: error.message
        });
    }
};

// creación de los usuarios
async function addUsers(req, res) {
    try {
        // validacion del token 
        const token = req.cookies.token;
        if (!token) {
            return res.json({ error: 'No hay token, acceso no autorizado' });
        }

        // validamos que el usuario tenga los permisos adecuados
        if (Number(req.results.rol) != 1) {
            return res.json({
                status: 400,
                error: true,
                errorMessage: 'No tiene acceso a esta acción por motivos de privilegios'
            })
        }

        // obtemos los campos de body
        const { nombres, apellidos, telefono, documento, rol, usuario, privilegio, pass } = req.body;
        // hash de la password
        const hashpassword = await bcrypt.hash(pass, 10);
        // mandamos a llamar el usuario conectado
        const userCreator = req.results.user;
        // para establecer que el usurio necesita cambio de password
        const changePassword = true;

        // llamamos la conexio
        const pool = await getPool();

        // obtenemos la secuencia
        const resultseq = await pool.query('SELECT MAX(NCODIGO) + 1 seq FROM T_USUARIOS');
        // alamcenamos la secuencia en una variable
        const seq = resultseq.rows[0].seq;

        // validamos que el usuairo no exista
        const existsUser = await pool.query(`select count(1) usersexit from t_usuarios where vusuario = '${usuario}'`);

        if (Number(existsUser.rows[0].usersexit) == 0) {
            // construimos el query de insercion
            const queryInsertUser = `INSERT INTO T_USUARIOS
                (
                    NCODIGO
                    ,VNOMBRE
                    ,VAPELLIDO
                    ,VTELEFONO
                    ,VDOCUMENTO
                    ,NROL
                    ,VUSUARIO
                    ,NPRIVILEGIO
                    ,VUSERCREATOR
                    ,BCHANGEPASSWORD
                    ,VPASSWORD
                ) VALUES
                ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`;

            // ejecutamos el query
            const result = await pool.query(queryInsertUser,
                [seq, nombres, apellidos, telefono, documento, rol, usuario, privilegio, userCreator, changePassword, hashpassword]);

            // validamos si se hizo la insercion correctamente 
            if (result.rowCount > 0) {
                res.json({
                    status: 400,
                    error: false,
                    message: 'Usuario creado correctamente'
                })
            } else {
                // si hay un error
                res.json({
                    status: 400,
                    error: true,
                    errorMesagge: 'Error al crear el usuario'
                });
            }

        } else {
            // si el usuario ya existe
            res.json({
                status: 400,
                error: true,
                errorMesagge: 'El usuario ' + usuario + ' ya existe'
            });
        }

        // Cerramos la conexion
        closeConnection(pool, res);
    } catch (error) {
        // majenos de errores
        console.error('Error al ejecutar la consulta', error);
        return res.json({
            status: 500,
            error: true,
            message: 'Error interno del servidor',
            errorMesagge: error.message
        });
    }
}



// Actualización de usuarios
async function updateUsers(req, res) {
    try {
        // validacion del token 
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ error: 'No hay token, acceso no autorizado' });
        }

        // validamos que el usuario tenga los permisos adecuados
        if (Number(req.results.rol) != 1) {
            return res.json({
                status: 400,
                error: true,
                errorMessage: 'No tiene acceso a esta acción por motivos de privilegios'
            })
        }

        // capturamos los datos del req body
        const { nombres, apellidos, telefono, documento, rol, usuario, privilegio, pass, codigo } = req.body;
        // llamamos la conexion
        const pool = await getPool();

        // construimos el script que se va ejecutar
        const sqlQuery = `
            UPDATE T_USUARIOS SET
            VNOMBRE = $1,
            VAPELLIDO = $2,
            VTELEFONO = $3,
            VDOCUMENTO = $4,
            NROL = $5,
            VUSUARIO = $6,
            NPRIVILEGIO = $7,
            BCHANGEPASSWORD = true
            WHERE NCODIGO = $8
        `;

        // ejecutamos el query 
        const result = await pool.query(sqlQuery, [
            nombres, apellidos, telefono, documento, rol, usuario, privilegio, codigo
        ]);


        // validamos que si se realizo la actualición
        if (result.rowCount > 0) {
            // validamos si va ha actulizar la password
            if (pass) {
                // manejos de errores
                try {
                    // construimos el query para actulizar la password
                    const sqlQuery = `UPDATE T_USUARIOS SET
                                        VPASSWORD = $1
                                        WHERE NCODIGO = $2`;
                    // hash de la password
                    const hashpassword = await bcrypt.hash(pass, 10);
                    // ejecutamos el query
                    const result = await pool.query(sqlQuery, [hashpassword, codigo]);
                } catch (error) {
                    // manejos de errores
                    console.log('Error ', error);
                    return res.json({
                        status: 500,
                        error: true,
                        message: 'Error interno del servidor',
                        errorMesagge: error.message
                    });
                }

            }
        } else {
            // si ocurre un error al momento de actualizar el usuario
            res.json({
                status: 400,
                error: true,
                errorMesagge: 'error al actulizar'
            })
        }

        res.json({
            status: 200,
            error: false,
            message: 'Se actulizó correctamente el usuario'
        })
        // Cerramos le conexion
        closeConnection(pool, res);
    } catch (error) {
        console.error('Error al ejecutar la consulta 1:', error);
        return res.json({
            status: 500,
            error: true,
            message: 'Error interno del servidor',
            errorMesagge: error.message
        });
    }
}


async function deleteUsers(req,res) {
    try {
        // validacion del token 
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ error: 'No hay token, acceso no autorizado' });
        }

        // validamos que el usuario tenga los permisos adecuados
        if (Number(req.results.rol) != 1) {
            return res.json({
                status: 400,
                error: true,
                errorMessage: 'No tiene acceso a esta acción por motivos de privilegios'
            })
        } 
        // llamamos la conexion
        const pool = await getPool();
        // capturamos el parametro
        const id = req.params.id;
        // construimos el query de eliminar
        const sqlQuery = `DELETE FROM T_USUARIOS WHERE NCODIGO = $1`;
        const result = await pool.query(sqlQuery,[id]);

        // validamos que si elimino
        if(result.rowCount > 0 ){
            res.json({
                status: 200,
                error: false,
                message: 'Se elimino correctamente el usuario'
            })
        }else{
            res.json({
                status: 400,
                error: true,
                errorMesagge:'Error al eliminar el usuario'
            })
        }
    } catch (error) {
        console.error('Error al ejecutar la consulta 1:', error);
        return res.json({
            status: 500,
            error: true,
            message: 'Error interno del servidor',
            errorMesagge: error.message
        });
    }
}


// mostrar los usuaios
async function getUserUnique(req, res) {
    try {

        // validacion si existe el token
        const token = req.cookies.token;
        if (!token) {
            return res.json({ error: 'No hay token, acceso no autorizado' });
        }

        // llamamos la conexion
        const pool = await getPool();
        // cosntrución de le la consulta
        const sqlQuery = `select t_usuarios.*,t_rol.vnombre name_rol,t_privilegios.vnombre name_privg
        from t_usuarios, t_rol , t_privilegios
        where t_usuarios.nrol = t_rol.ncodigo
        and (t_usuarios.nprivilegio = t_privilegios.ncodigo)
        union 
        select t_usuarios.*,t_rol.vnombre name_rol,'Administrador' name_privg 
        from t_usuarios, t_rol
        where t_usuarios.nrol = t_rol.ncodigo
        and (t_usuarios.nprivilegio is null)
        and t_usuarios.ncodigo = ${Number(req.results.codigo)}
        ORDER BY NCODIGO`;
        // ejecutamos el query 
        const result = await pool.query(sqlQuery);

        // mandamos la respuesta
        res.json({
            status: 200,
            error: false,
            des: 'ruta de usuarios conectado',
            message: 'this is OK',
            results: result.rows
        });

        closeConnection(pool, res);

    } catch (error) {
        // manejo de errores
        console.error('Error al ejecutar la consulta:', error);
        res.json({
            status: 500,
            error: true,
            message: 'Error interno del servidor',
            errorMesagge: error.message
        });
    }
};

// exportamos las funciones
module.exports = {
    getsUsers,
    addUsers,
    updateUsers,
    deleteUsers,
    getUserUnique
}