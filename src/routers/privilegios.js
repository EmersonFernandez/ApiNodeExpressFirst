const express = require('express');
const router = express.Router();

const getPool = require('../connection');
const { closeConnection } = require('../funciones');
const { validarToken } = require('../funciones');


// rutas
router.get('/tables', validarToken, async (req, res) => {
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
});
router.get('/privg', validarToken, async (req, res) => {
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
        const result = await pool.query(`SELECT ncodigo,vnombre FROM privilegios`);
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
});

router.get('/rol', validarToken, async (req, res) => {
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
        const result = await pool.query(`SELECT ncodigo,vnombre FROM rol`);
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
});
router.get('/', validarToken, async (req, res) => {
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
        ,STRING_AGG( distinct nombreprivg, ',  ') AS nombreprivg
        ,STRING_AGG( distinct CAST(idprivg AS TEXT), ':') AS CODIGOS
        FROM 
            information_schema.table_privileges
            ,historial_privilegios
        WHERE grantee IN ('sololectura', 'escritura_actualizacion', 'lectura_eliminar', 'modoadministrador')
        and historial_privilegios.usuario = grantee
        GROUP BY table_name;
        `;
        await pool.query('SELECT detectar_y_registrar_cambios_privilegios()');
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
});

// establecer los roles a las tablas

router.post('/', validarToken, async (req, res) => {
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

        const result = await pool.query('SELECT * FROM config_rol_tables ($1,$2) config_table', [privilegios, tablesSelect]);
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
});


module.exports = { router };