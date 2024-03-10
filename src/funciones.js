// este es un archivo de funciones que se estan utlizando en todo la api
const jwt = require('jsonwebtoken');
require('dotenv').config();


// funcion que valida si el token exites o es valido
function validarToken(req,res,next){
    req.headers['authorization'] = req.cookies.token;
    const accessToken = req.headers['authorization'] || req.query.accessToken || req.cookies.token;

    if (!accessToken) {
        return res.json({
            status:401,
            error:true,
            message: "Acceso denegado"
        });
    }

    jwt.verify(accessToken, process.env.SECRET_SENTENCE, (error, results) => {
        if (error) {
            return res.json({
                status:401,
                error:true,
                des: 'Acceso Denegado o Token expirado o Incorrecto',
                errorMessage: error
                
            });
        }
        req.results = results;
        req.token = accessToken;
        next();
    });
};



// funcion que cierra la conecxion de la base de dato
const closeConnection = (pool,res) =>{
    pool.end(err => {
        if (err) {
            console.error('Error al cerrar la conexión:', err);
            return res.json({ 
                status:500,
                error:true,
                errorDes: 'Error al cerrar la conexion', 
                erroMesagge: err 
            });
        } else {
            console.log('Conexión cerrada correctamente');
            return null;
        }
    });
}


// la exportamos
module.exports = {
    validarToken,
    closeConnection
}

