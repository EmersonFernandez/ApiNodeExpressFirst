const express = require('express');
const router = express.Router();
const getPool = require('../connention');
const jwt = require('jsonwebtoken');
const {closeConnection} = require('../fuctiones');
require('dotenv').config();

router.post('/', async (req, res) => {

    const { user, pass } = req.body;
    process.env.PASS =  pass;
    process.env.USER =  user;
    const users = {}

    try {
        const pool = await getPool();
        pool.query('SELECT 1', async (err, result) => {
        // res.clearCookie('token', { secure: true, sameSite: 'none' });
            if (err) {
                console.log('Error al conectar a la base de datos:', err);
                res.json({
                    status:500,
                    error:true,
                    errorDes :'Ocurrio un error',
                    errorMessage:err.message
                });

            } else {
                console.log('Conexión exitosa a la base de datos');

                try {
                    const result = await pool.query('SELECT VDOCUMENTO, USUARIO, NROL, NPRIVILEGIO FROM USUARIOS WHERE USUARIO = $1', [process.env.USER]);
                    users.user = result.rows[0].usuario;
                    users.documento = result.rows[0].vdocumento;
                    users.rol = result.rows[0].nrol;
                    users.privilegio = result.rows[0].nprivilegio;

                } catch (error) {
                    console.error('Error en la consulta:', error);
                    res.json({ 
                        status:400,
                        error:true,
                        errorDes: 'Error interno del servidor', 
                        erroMesagge: error.message 
                    });
                }
                closeConnection(pool,res);
                const token = generateToken(users);

                // httpOnly: true,
                res.cookie('token', token, {secure: true, sameSite: 'none' });
                process.env.TOKEN = token;

                res.json({
                    status:200,
                    error:false,
                    message:'Credenciales correctas',
                    token,
                    user:users.user,
                    rol:users.rol
                });
            }
        });
        
    } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
        res.json({ 
            status:500,
            error:true,
            errorDes: 'Error interno del servidor', 
            erroMesagge: error.message 
        });
    }
});

process.env.SECRET_SENTENCE = '0101452';
function generateToken(user){
    const token = jwt.sign(user,process.env.SECRET_SENTENCE,{expiresIn:'5m'});
    return token;
}

module.exports = { router };
