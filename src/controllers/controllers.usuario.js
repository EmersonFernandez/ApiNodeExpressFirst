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
            const result = await pool.query(`select t_usuarios.*,t_rol.vnombre name_rol,t_privilegios.vnombre name_privg
            from t_usuarios, t_rol , t_privilegios
            where t_usuarios.nrol = t_rol.ncodigo
            and (t_usuarios.nprivilegio = t_privilegios.ncodigo)
            union 
            select t_usuarios.*,t_rol.vnombre name_rol,'Administrador' name_privg 
            from t_usuarios, t_rol
            where t_usuarios.nrol = t_rol.ncodigo
            and (t_usuarios.nprivilegio is null)`);

            res.json({
                status: 200,
                error: false,
                des: 'ruta de usuarios',
                message: 'this is OK',
                results: result.rows
            });
        } else {
            console.log('No permitido');
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

        // la conexion
        const pool = await getPool();

        try {

            // consultas para obetener la ultima secuencia del registro
            const resultseq = await pool.query('SELECT MAX(NCODIGO) + 1 seq FROM T_USUARIOS');
            const seq = resultseq.rows[0].seq;
            
            // consulta para validar el usuarios que vamos a registrar existe en la base de dato
            const existsUser = await pool.query(`select count(1) usersexit from t_usuarios where vusuario = '${usuario}'`);

            // valiamos que el usuario ya heciste 
            console.log(existsUser.rows[0].usersexit);

            if (Number(existsUser.rows[0].usersexit) == 0) {
                // hacemos la insercion a la tabla 
                const queryInsertUser = 'INSERT INTO T_USUARIOS (NCODIGO,VNOMBRE,VAPELLIDO,VTELEFONO,VDOCUMENTO,NROL,VUSUARIO,NPRIVILEGIO,VUSERCREATOR,BCHANGEPASSWORD) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)';
                const result = await pool.query(queryInsertUser, [seq, nombres, apellidos, telefono, documento, rol, usuario, privilegio, userCreator, changePassword]);
                console.log(result.rowCount);
                // validamos si se hizo la insercion correctamente 
                if (result.rowCount > 0) {
                    // validamos si al momento de crear el usuario el campo rol es 1 
                    // esto es para los usuarios que son administradores
                    if (Number(rol) === 1) {
                        const createUserQuery = `CREATE USER ${usuario.replace(/'/g, '')} WITH SUPERUSER CREATEDB CREATEROLE PASSWORD '1234';`;
                        await pool.query(createUserQuery, (err, res) => {
                                if (err) {
                                    console.error('Error al ejecutar el script de usuario administrador:', err);
                                        return res.json({
                                            status: 400,
                                            error: true,
                                            message: err
                                        });
                                } else {
                                console.log('Script ejecutado correctamente');
                                    return res.json({
                                        status: 200,
                                        error: false,
                                        message: 'El usuario fue creado correctamente'
                                    });
                                
                                }
                            });

                    } else if (Number(rol) != 1) {
                        // creamos el usuario a nivel de base de dato
                        const resultCreateUsers = await pool.query('SELECT * FROM f_create_users ($1,$2) AS create_users', [usuario, pass]);
                        // validamos si el usuarios se creo correctamenete 
                        if (resultCreateUsers.rows[0].create_users) {
                            // la asignamos el rol con sus repectivos privilegios
                            const resultPrivilegiosUser = await pool.query('select * from  f_config_privilegios_user($1,$2) AS config_priv', [privilegio, usuario]);

                            // validamos que si se hizo la configuración de los privilegios al usuario que se creo 
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
        console.error('Error al ejecutar la consulta 1:', error);
        return res.json({
            status: 500,
            error: true,
            errorDes: 'Error interno del servidor',
            erroMesagge: error.message
        });
    }
}



// fuction que va a realizar la actualización
async function updateUsers(req, res) {
    try {
        // validacion del token 
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ error: 'No hay token, acceso no autorizado' });
        }

        // capturamos los datos del req body
        const { nombres, apellidos, telefono, documento, rol, usuario, privilegio, pass, codigo } = req.body;
        // llamamos la conexion
        const pool = await getPool();
        // armamos el script y llamos los privielegios antes de actalizar para hacer algunas validaciones adcionales
        const resultPrivg = await pool.query(`SELECT NPRIVILEGIO FROM T_USUARIOS WHERE NCODIGO = $1`,[codigo]);
        // armamos el script que se va ejecutar
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

        // validamos que el usuario se tengas los permisos adecaudos para hacer la actualzación
        if(Number(req.results.rol) == 1){
            const result = await pool.query(sqlQuery,[
                nombres,apellidos,telefono,documento,rol,usuario,privilegio,codigo
            ]);
            // validamos que si se realizo la actualición
            if(result.rowCount > 0){

                // alacenamos el valor del privilegio anterior
                const privg = Number(resultPrivg.rows[0].nprivilegio);
                //console.log('before privg ', privg);
                
                // validamos si vamos actulizar los privilegio o rol al usuario qu estamos actualizando
                if (privg != Number(privilegio)){
                        const remove = await pool.query(`select * from f_remove_rol($1,$2)`,[privg,usuario]);
                        const results = await pool.query('select * from  f_config_privilegios_user($1,$2) AS config_priv', [privilegio, usuario]);
                        if(results.rows[0].config_priv){
                            console.log('correcto');
                        } else {
                            return res.json({
                                status: 400,
                                error: true,
                                message: 'Error al actualizar los roles'
                            });
                        }
                };

                if(pass){
                    try {
                        await pool.query('SELECT f_cambiar_contrasena($1, $2)', [usuario, pass]);
                        await pool.query(`UPDATE t_usuarios SET bchangepassword = true WHERE vusuario = $1`,[usuario]);
                    } catch (error) {
                        console.log('Error ' ,error);
                        return res.json({
                            status: 500,
                            error: true,
                            message: error.message
                        });
                    }
                    
                }
            }else{
                return res.json({
                    status: 400,
                    error: true,
                    message: 'Error al actulizar'
                })
            }

        }else{
            return res.json({
                status: 400,
                error: true,
                message: 'El usuario no tiene los permisos adecuados'
            })
        }
        closeConnection(pool,res);
        return res.json({
            status: 400,
            error: false,
            message: 'Se actulizó correctamente el usuario'
        })     
        
    }catch(error){
        console.error('Error al ejecutar la consulta 1:', error);
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
    addUsers,
    updateUsers
}