// controlador de los usuarios
const getPool = require('../connection');
const { closeConnection } = require('../funciones');

// mostrar todos los usuaios
async function getsUsers(req, res) {
    try {

        const token = req.cookies.token;
        if (!token) {
            return res.json({ error: 'No hay token, acceso no autorizado' });
        }
        const pool = await getPool();
        if (Number(req.results.rol) === 1) {
            const result = await pool.query('SELECT * FROM usuarios');

            res.json({
                status: 200,
                error: false,
                des: 'ruta de usuarios',
                message: 'this is OK',
                results: result.rows
            });
        } else {
            res.json({
                status: 400,
                error: false,
                des: 'ruta de usuarios',
                message: 'No tiene permisos para ver esta vista',
                results: null
            })
        }

        closeConnection(pool, res);

    } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
        res.json({
            status: 500,
            error: true,
            errorDes: 'Error interno del servidor',
            erroMesagge: error.message
        });
    }
};

// creacion de los usuarios -- se puede mejorar
async function addUsers(req, res) {
    try {
        // validacion del token 
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ error: 'No hay token, acceso no autorizado' });
        }

        // obtemos las campos donde se llena la informacion
        const { nombres, apellidos, telefono, documento, rol, usuario, privilegio, pass } = req.body;
        const userCreator = req.results.user;
        const changePassword = true;

        // Validate input
        // if (!nombres || !apellidos || !telefono || !documento || !rol || !usuario || !privilegio || !pass) {
        //     return res.status(400).json({ error: 'Faltan datos obligatorios' });
        // }

        // la conexion
        const pool = await getPool();

        try {

            // consultas para obetener la ultima secuencia del registro
            const resultseq = await pool.query('SELECT MAX(NCODIGO) + 1 seq FROM USUARIOS');
            const seq = resultseq.rows[0].seq;

            // // Obtener la fecha actual
            // const fechaActual = new Date();
            // // Formatear la fecha como yyyy-mm-dd para PostgreSQL
            // const fechaFormateada = fechaActual.toISOString().split('T')[0];

            // consulta para validar el usuarios que vamos a registrar existe en la base de dato
            const existsUser = await pool.query(`select count(1) usersexit from usuarios where usuario = '${usuario}' or vtelefono = '${telefono}' or vdocumento = '${documento}'`);

            // valiamos que el usuario ya heciste 
            console.log(existsUser.rows[0].usersexit);
            if (Number(existsUser.rows[0].usersexit) == 0) {
                // hacemos la insercion a la tabla 
                const queryInsertUser = 'INSERT INTO USUARIOS (NCODIGO,VNOMBRE,VAPELLIDO,VTELEFONO,VDOCUMENTO,NROL,USUARIO,NPRIVILEGIO,VUSERCREATOR,BCHANGEPASSWORD) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)';
                const result = await pool.query(queryInsertUser, [seq, nombres, apellidos, telefono, documento, rol, usuario, privilegio, userCreator, changePassword]);

                // hacemos una consultas a la tabla privilegio 
                const namePrivilegios = await pool.query('select descripcion from privilegios');

                // validamos si se hizo la insercion correctamente 
                if (result.rowCount > 0) {
                    // creamos el usuario con la función creada en la base de datos
                    const resultCreateUsers = await pool.query('SELECT * FROM create_users ($1,$2) AS create_users', [usuario, pass]);
                    // validamos si al momento de crear el usuario el campo rol es 1 
                    // esto es para los usuarios que se usuarios como administradores
                    if (Number(rol) === 1) {
                        // hacemos una alteracion de roles para darle permisos al user de crear usuarios y roles
                        await pool.query(`ALTER ROLE ${usuario.replace(/'/g, '')} CREATEROLE`);
                        console.log('Se le dio el permiso de crea usuarios y roles');

                        // validamos que la tabla tenga privilegios tenga informacion
                        if (namePrivilegios.rowCount > 0) {
                            // recorremos el array 
                            namePrivilegios.rows.map(el => {
                                //console.log(el.descripcion);
                                // hacenos un grant de los roles y le activamos la opcion ADMIN para este usuario 
                                pool.query(`GRANT ${el.descripcion} TO ${usuario.replace(/'/g, '')} WITH ADMIN OPTION;`)
                            });

                        }

                    }

                    // validamos si el usuarios se creo correctamenete 
                    if (resultCreateUsers.rows[0].create_users) {
                        // la signamos los privilegios al usuario
                        const resultPrivilegiosUser = await pool.query('select * from  config_privilegios_user($1,$2) AS config_priv', [privilegio, usuario]);

                        // validamos que si se hizo la configuracion de los privilegios al usuario que se esta creado 
                        if (resultPrivilegiosUser.rows[0].config_priv) {
                            return res.json({
                                status: 200,
                                error: false,
                                message: 'El usuario fue creado correctamente'
                            });
                        } else {
                            return res.json({
                                status: 400,
                                error: true,
                                message: 'Error al configurar los privilegios del usuario'
                            });
                        }
                    } else {
                        return res.json({
                            status: 400,
                            error: true,
                            message: 'Error al crear el usuario'
                        });
                    }
                }
            } else {
                return res.json({
                    status: 400,
                    error: true,
                    message: 'El usuario ' + usuario + ' ya existe'
                });
            }


            // finalizamos con el cierre de la conexion
        } finally {
            closeConnection(pool, res);
        }

        // la salida de los errores 
    } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
        return res.json({
            status: 500,
            error: true,
            errorDes: 'Error interno del servidor',
            erroMesagge: error.message
        });
    }
}

module.exports = {
    getsUsers,
    addUsers
}