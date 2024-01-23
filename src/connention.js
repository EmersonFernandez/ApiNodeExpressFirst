// const { Pool } = require('pg');
// require('dotenv').config();

// async function getPool(dataUser) {
//     try {
//         const pool = await new Pool({
//             user: dataUser.user,
//             host: process.env.PGHOST || 'viaduct.proxy.rlwy.net',
//             database: process.env.PGDATABASE || 'railway',
//             password: dataUser.pass,
//             port: process.env.PGPORT || 22927,
//         });
//         console.log('Conexión exitosa a la base de datos');
//         return await pool;
//     } catch (error) {
//         console.error('Error al conectar a la base de datos:', error);
//         return null;
//     }
// }

// module.exports = getPool;
