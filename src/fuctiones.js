const jwt = require('jsonwebtoken');
require('dotenv').config();
function validarToken(req,res,next){
    req.headers['authorization'] = req.cookies.token;
    const accessToken = req.headers['authorization'] || req.query.accessToken || req.cookies.token;
    // process.env.TOKEN;
   // console.log('token -- >> header --- >>> ', accessToken);
    if (!accessToken) {
        return res.status(401).json({
            message: "Acceso denegado"
        });
    }

    jwt.verify(accessToken, process.env.SECRET_SENTENCE, (error, results) => {
        if (error) {
            return res.status(401).json({
                message: 'Acceso Denegado o Token expirado o Incorrecto',
                error : error
            });
        }

        console.log(results);
        req.results = results;
        req.token = accessToken;
        next();
    });
};






module.exports = {
    validarToken
}

