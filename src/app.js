// app
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors')
require('dotenv').config();
const cargarRutas = require('./routers/index');

// puerto
let port = 3000 || process.env.PORT;

// cors opciones
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};


// Middleware Configuration
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// ruta principal de api
app.get('/', async (req, res) => {
    res.status(200).json(
        {
            status: 200,
            created: 'Emerson David Fernandez regino',
            version: 'V1',
            descriptions: {
                descriptionOne: 'Esta es una api que esta conectada a una base de dato en la nube de "Postgres"',
                descriptionTwo: 'Tiene una autenticación con la biblioteca de seguridad JSON Web Token. \n Con esto validamos al usuario que se conecta y permitimos la sesión en varias rutas, además de no permitir el acceso sin iniciar sesión.'

            },
            what_can_be_done: {
                one: 'Se puede visualizar los productos registrados, crear, actulizar e eliminar',
                two: 'Se puede visualizar los usuario, crear , actuliazar , eliminar y dar permisos o privilegios a los usuario creados'

            }
        }
    );
});

// formulario de regsitro de usuarios
app.get('/formusuario', (req, res) => {
    res.send(
        `
        <p>Registro de Usuarios</p>
<form action="./api/usuarios" method="post">
    <div>
        <label for="">Nombres</label>
        <input type="text" name="nombres">
    </div>
    <div>
        <label for="">Apellidos</label>
        <input type="text" name="apellidos">
    </div>
    <div>
        <label for="">Teléfono</label>
        <input type="number" name="telefono">
    </div>
    <div>
        <label for="">Número Documento</label>
        <input type="number" name="documento">
    </div>
    <div>
        <label for="">Usuario</label>
        <input type="text" name="usuario">
    </div>
    <div>
        <label for="">Contraseña</label>
        <input type="pas" name="pass">
    </div>
    <div>
        <select name="privilegio">
            <option disabled ><<< --- seleccione un rol --- >>> </option>
            <option value="1">Administrador</option>
            <option value="2">Cliente</option>
            <option value="3">Vendedor</option>
            <option value="4">Supervisor</option>
        </select>
    </div>
    <div>
        <select name="rol">
            <option disabled ><<< --- seleccione un rol --- >>> </option>
            <option value="1">Modo Administrador</option>
            <option value="2">Modo Lectura</option>
            <option value="3">Crear y Editar</option>
            <option value="4">Solo Eliminar</option>
        </select>
    </div>
    <button type="submit">  <<< --- Crear --- >>></button>
</form>
        `
    );
});

// formulario de logueo
app.get('/api', async (req, res) => {
    res.send(
        `
        <div>
            <p>Usuarios de pruebas<p>
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
        <button type="submit"> <<< --- Enviar --- >>></button>
    </form>`
    );
});


// llamamos la fucion para cargar todas las rutas creada en la carpeta routers
cargarRutas(app);



app.listen(port, () => {
    console.log(` http://localhost:${port}/`);
});
