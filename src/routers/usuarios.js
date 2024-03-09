const express = require('express');
const router = express.Router();
const getPool = require('../connection');
const { validarToken, closeConnection } = require('../funciones');
const {getsUsers, addUsers} = require('../controllers/controllers.usuario');

// mostrar lo usuarios registrados
router.get('/', validarToken,getsUsers);
// creacion de los usuarios 
router.post('/', validarToken, addUsers);

router.delete('/:id', async (req, res) => {
    try {
        let result;
        const token = req.cookies.token;

        if (!token) {
            return res.json({ error: 'No autorizado: No se proporcionó un token' });
        }

        const id = req.params.id;
        const pool = await getPool();

        try {
            const resultUser = await pool.query('SELECT usuario, nrol FROM usuarios WHERE NCODIGO = $1', [id]);

            if (resultUser.rowCount === 0) {
                return res.json({
                    status: 404,
                    error: true,
                    message: 'Usuario no encontrado, no se puede eliminar'
                });
            }
            //const namePrivilegios = await pool.query('select descripcion from privilegios');
            const usuario = resultUser.rows[0].usuario;
            // if (Number(resultUser.rows[0].nrol) === 1) {
            //     console.log('entro en rol 1');
            //     await namePrivilegios.rows.map(el => {
            //         pool.query(`REVOKE ${el.descripcion} FROM ${resultUser.rows[0].usuario}`);
            //     });
                result = await pool.query('DROP ROLE ' + usuario.replace(/'/g, ''));
            //}
            // else{
            //     console.log('entro rol diferente 3');
            //     result = await pool.query('DROP ROLE ' + usuario.replace(/'/g, ''));
            // }

            
            if (result.command == 'DROP') {
                const resultUsuario = await pool.query('DELETE FROM usuarios WHERE NCODIGO = $1', [id]);

                if (resultUsuario.rowCount > 0) {
                    return res.json({
                        status: 200,
                        error: false,
                        message: 'Usuario eliminado exitosamente'
                    });
                } else {
                    return res.json({
                        status: 500,
                        error: true,
                        message: 'Error al eliminar el usuario'
                    });
                }
            } else {
                return res.json({
                    status: 500,
                    error: true,
                    message: 'Error al eliminar el usuario'
                });
            }
        } finally {
            closeConnection(pool, res);
        }
    } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
        return res.json({
            status: 500,
            error: true,
            errorDes: 'Error interno del servidor',
            errorMessage: error.message
        });
    }
});


module.exports = { router }