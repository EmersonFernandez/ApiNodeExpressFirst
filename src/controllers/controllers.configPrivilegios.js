// controlador de configuraciones de privilegios de tablas
const getPool = require('../connection');
const { closeConnection } = require('../funciones');

async function getTables(req, res) {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.json(
                {
                    error: true,
                    errorMessage: 'No hay token, acceso no autorizado'
                }
            );
        }

        const pool = await getPool();
        const result = await pool.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`);
        if (Number(req.results.rol) === 1) {
            res.json({
                status: 200,
                error: false,
                des: 'ruta de table',
                message: 'this is OK',
                token: req.results,
                results: result.rows
            });
        } else {
            res.json({
                status: 400,
                error: false,
                des: 'ruta de table',
                message: 'No tiene permisos para ver esta vista',
                results: null
            })
        }

        closeConnection(pool, res);
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


async function getPrivg(req, res) {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.json(
                {
                    error: true,
                    errorMessage: 'No hay token, acceso no autorizado'
                }
            );
        }

        const pool = await getPool();
        const result = await pool.query(`SELECT ncodigo,vnombre FROM t_privilegios`);
        res.json({
            status: 200,
            error: false,
            des: 'ruta de privilegios',
            message: 'this is OK',
            token: req.results,
            results: result.rows
        });


        closeConnection(pool, res);
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

async function getRol(req, res) {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.json(
                {
                    error: true,
                    errorMessage: 'No hay token, acceso no autorizado'
                }
            );
        }

        const pool = await getPool();
        const result = await pool.query(`SELECT ncodigo,vnombre FROM t_rol`);
        res.json({
            status: 200,
            error: false,
            des: 'ruta de rol',
            message: 'this is OK',
            token: req.results,
            results: result.rows
        });


        closeConnection(pool, res);
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

async function getConfigTables(req, res) {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.json(
                {
                    error: true,
                    errorMessage: 'No hay token, acceso no autorizado'
                }
            );
        }

        const pool = await getPool();
        const queryGrant = `
        SELECT 
        table_name
        ,STRING_AGG( distinct grantee, ', ') AS grantee
        ,STRING_AGG( distinct nombreprivg || ':' || CAST(idprivg AS TEXT), ',') AS CODIGOS
        ,STRING_AGG( distinct nombreprivg, ',  ') AS nombreprivg
        FROM 
            information_schema.table_privileges
            ,t_historial_privilegios
        WHERE grantee IN ('sololectura', 'escritura_actualizacion', 'lectura_eliminar', 'modoadministrador')
        and t_historial_privilegios.usuario = grantee
        GROUP BY table_name;
        `;
        await pool.query('SELECT f_detectar_y_registrar_cambios_privilegios()');
        const result = await pool.query(queryGrant);
        res.json({
            status: 200,
            error: false,
            des: 'ruta de informe privilegios',
            message: 'this is OK',
            token: req.results,
            results: result.rows
        });


        closeConnection(pool, res);
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

async function addConfigPrivg(req,res) {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.json(
                {
                    error: true,
                    errorMessage: 'No hay token, acceso no autorizado'
                }
            );
        }
        const { privilegios, tablesSelect } = req.body;
        const pool = await getPool();

        const result = await pool.query('SELECT * FROM f_config_rol_tables ($1,$2) config_table', [privilegios, tablesSelect]);
        closeConnection(pool, res);
        if (result.rows[0].config_table) {
            return res.json({
                status: 200,
                error: false,
                message: 'Privilegios configurados correctamente'
            });
        } else {
            return res.json({
                status: 400,
                error: true,
                message: 'Error al configurar los privilegios del las tablas'
            });
        }

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

async function removPrinvg(req,res){
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.json(
                {
                    error: true,
                    errorMessage: 'No hay token, acceso no autorizado'
                }
            );
        }
        const { privilegios, tablesSelect } = req.body;
        const pool = await getPool();

        const result = await pool.query('SELECT * FROM f_remove_privilege ($1,$2) config_table', [privilegios, tablesSelect]);
        closeConnection(pool, res);
        if (result.rows[0].config_table) {
            return res.json({
                status: 200,
                error: false,
                message: 'Se removio correctamente los privilegios'
            });
        } else {
            return res.json({
                status: 400,
                error: true,
                message: 'Error al remover los privilegios del las tablas'
            });
        }

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
    getTables,
    getPrivg,
    getRol,
    getConfigTables,
    addConfigPrivg,
    removPrinvg
}