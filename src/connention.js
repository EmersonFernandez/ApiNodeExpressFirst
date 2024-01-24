const { Pool } = require('pg');
require('dotenv').config();

function getPool() {
    try {
        const pool = new Pool({
            user: process.env.USER,
            // user: dataUser.user,
            host: process.env.PGHOST || 'viaduct.proxy.rlwy.net',
            database: process.env.PGDATABASE || 'railway',
            password: process.env.PASS,
            // password: dataUser.pass,
            port: process.env.PGPORT || 22927,
        });
        console.log(process.env.USER);
        // // Realizar una operación de prueba (por ejemplo, una simple consulta)
        // pool.query('SELECT 1', (err, result) => {
        //     if (err) {
        //         console.error('Error al conectar a la base de datos:', err);
        //     } else {
        //         console.log('Conexión exitosa a la base de datos');
                
        //     }
        // });

        return pool;
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        return null;
    }
}

// getPool();
module.exports = getPool;
