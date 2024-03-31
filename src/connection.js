// conexion con la base de dato de en la nube "postgres"
const { Pool } = require('pg');
require('dotenv').config();


async function getPool() {
    try {
        const pool = new Pool({
            user: process.env.USER || 'postgres',
            host: process.env.PGHOST || 'viaduct.proxy.rlwy.net',
            database: process.env.PGDATABASE || 'railway',
            password: process.env.PASS || '1234',
            port: process.env.PGPORT || 22927,
        });
        // Realizar una prueba de conexión
        const client = await pool.connect();
        await client.query('SELECT 1');
        client.release();

        console.log('Conexión a la base de datos exitosa');
        return pool;
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        return null;
    }
}

//getPool();
module.exports = getPool;
