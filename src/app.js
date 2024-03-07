// este es el archivo principal 
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors')
require('dotenv').config();
const cargarRutas = require('./routers/index');

// este es el puerto
let port = 3000 || process.env.PORT;

// hacemos uso del cors
const corsOptions = {
    origin: 'http://localhost:5173', 
    credentials: true,
};


// hacemos uso de use 
app.use(cors(corsOptions));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cookieParser());

// ruta de la información de la api
app.get('/', async (req,res) => {
    res.status(200).json(
        {
            status:200,
            created:'Emerson David Fernandez',
            version:'V1',
            descriptions: {
                descriptionOne: 'Esta es una api que esta conectada a una base de dato en la nube de "Postgres"',
                descriptionTwo: 'Tiene una autenticación con la biblioteca de seguridad JSON Web Token. Con esto validamos al usuario que se conecta y permitimos la sesión en varias rutas, además de no permitir el acceso sin iniciar sesión.'

            },
            what_can_be_done: {
                one: 'Se puede visualizar los productos registrados, crear, actulizar e eliminar',
                two: 'Se puede visualizar los usuario, crear , actuliazar , eliminar y dar permisos o privilegios a los usuario creados'
                
            }
            ,
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


// forulario de logueo
app.get('/api', async (req,res) => {
    res.send(
        
        `
        <div>
            <p>Usuario de pruebas<p>
            <table border="1px">
            <thead>
                <tr>
                    <th>User</th>
                    <th>Pass</th>
                    <th>Description the user</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>admin123</td>
                    <td>1234</td>
                    <td>Puede crear usuarios y asignarle privilegios</td>
                </tr>
                <tr>
                    <td>emerson</td>
                    <td>1234</td>
                    <td>Puede visualizar, crear , actualizar y eliminar un producto</td>
                </tr>
                <tr>
                    <td>juan</td>
                    <td>1234</td>
                    <td>Puede visualizar, crear y actualizar</td>
                </tr>
                <tr>
                    <td>maria</td>
                    <td>1234</td>
                    <td>Es un usuario modo lectura</td>
                </tr>
                <tr>
                    <td>manuel</td>
                    <td>1234</td>
                    <td>Puede visualizar e iliminar</td>
                </tr>
            </tbody>
        </table>
        </div>
        <form action="/api/login" method="post">
        <label for="">Usuario</label><input type="text" name="user"><br>
        <label for="">Contraseña</label><input type="password" name="pass"><br>
        <button type="submit">Enviar --- >>></button>
    </form>`
    );
});


// llamamos la fucion para cargar todas las rutas creada en la carpeta routers
cargarRutas(app);



app.listen(port, () => {
    console.log(` http://localhost:${port}/`);
});
