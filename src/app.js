const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors')
require('dotenv').config();

const cargarRutas = require('./routers/index');
let port = 3000 || process.env.PORT;
const corsOptions = {
    origin: 'http://localhost:5173',  // Reemplaza con el puerto correcto si es diferente
    credentials: true,
};


app.use(cors(corsOptions));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cookieParser());

app.get('/', async (req,res) => {
    res.status(200).json(
        {
            status:200,
            message:'Api pruebas',
            created:'Emerson David Fernandez',
            version:'V1',
            date:'22/01/2024',
            rutas: [
                {   
                    id:1,
                    description : 'login para entrar a la api',
                    urlApi : 'http://localhost:3000/api/'
                },
                {
                    id:2,
                    description : 'rutas de los productos',
                    urlApi : 'http://localhost:3000/api/producto'
                },
                {
                    id:3,
                    description : 'rutas de los clientes',
                    urlApi : 'http://localhost:3000/api/cliente'
                },
                {
                    id:4,
                    description : 'rutas de los usuarios',
                    urlApi : 'http://localhost:3000/api/usuarios'
                }
            ]
        }
    );
});
app.get('/api', async (req,res) => {
    res.send(
        `<form action="/api/login" method="post">
        <label for="">Usuario</label><input type="text" name="user"><br>
        <label for="">Contraseña</label><input type="password" name="pass"><br>
        <button type="submit">Enviar</button>
    </form>`
    );
});
cargarRutas(app);

app.listen(port, () => {
    console.log(` http://localhost:${port}/`);
});
