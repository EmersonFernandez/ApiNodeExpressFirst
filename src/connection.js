// conexion con la base de dato de en la nube "postgres"
const { Pool } = require('pg');
require('dotenv').config();

function getPool() {
    try {
        const pool = new Pool({
            user: process.env.USER,
            host: process.env.PGHOST || 'viaduct.proxy.rlwy.net',
            database: process.env.PGDATABASE || 'railway',
            password: process.env.PASS,
            port: process.env.PGPORT || 22927,
        });
        return pool;
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        return null;
    }
}
module.exports = getPool;
