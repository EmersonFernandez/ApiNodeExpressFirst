const express = require('express');
const router = express.Router();

const getPool = require('../connection');
const { closeConnection } = require('../funciones');
const {validarToken} = require('../funciones');


// rutas
router.get('/', validarToken , async (req, res) => {
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
                des: 'ruta de privilegios',
                message: 'this is OK',
                token: req.results,
                results: result.rows
            });
        } else {
            res.json({
                status: 400,
                error: false,
                des: 'ruta de privilegios',
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

// establecer los roles a las tablas

router.post('/',validarToken,async (req,res) => {
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
        const {privilegios,tablesSelect} = req.body;
        const pool = await getPool();

        const result = await pool.query('SELECT * FROM config_rol_tables ($1,$2) config_table',[privilegios,tablesSelect]);
        if (result.rows[0].config_table) {
            return res.json({
                status: 200,
                error: false,
                message: 'Privilegios configurados correctamente'
            });
        }else{
            return res.json({
                status: 400,
                error: true,
                message: 'Error al configurar los privilegios del las tablas'
            });
        }

        closeConnection(pool,res);

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