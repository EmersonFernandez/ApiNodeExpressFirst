const express = require('express');
const router = express.Router();
let conc;
let message;
router.get('/', async (req, res) => {
    
    try {
        conc = () => {
            data = {
                user:'postgres',
                pass:'1234'
            }
            const getPool = require('../connention'); 
            const pool = getPool(data);
            pool.then(data => {
                if(data.message){
                    message = data.message;
                    return data.message;
                }else{
                    message = 'Credeciales Correctas';
                }
            });

            return pool;
        };
        await conc();
        //const result =  pool.query('SELECT * FROM tx_productos');
       // res.json(result.rows);
        res.json({
            inf:message
        });

    } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});




module.exports = { router, conc };
