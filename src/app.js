const express = require('express');
const app = express();
require('dotenv').config();

const cargarRutas = require('./routers/index');
let port = 3000 || process.env.PORT;

app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.get('/', async (req,res) => {
    res.status(200).json(
        {
            status:200,
            message:'Api pruebas',
            created:'Emerson David Fernandez',
            version:'V1',
            date:'22/01/2024'
        }
    );
});
cargarRutas(app);

app.listen(port, () => {
    console.log(` http://localhost:${port}/`);
});
