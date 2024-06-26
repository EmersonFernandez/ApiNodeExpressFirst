# **Nombre del Proyecto**: SecureCommerceAPI

Esta API cuenta con una conexión a una base de datos y una plataforma segura con funcionalidades de autenticación y autorización para diversos usuarios con roles y privilegios totalmente diferenciados. También incluye un apartado para la gestión de usuarios que tienen acceso a la API, así como una gestión de productos que permite listar, agregar, actualizar y eliminar utilizando los respectivos métodos HTTP.
<br/>
## Tecnologías Utilizadas
- **Express**
- **Node.js**
- **JavaScript**
- **JWT (JSON Web Tokens)** para autenticación
- **Git** para control de versiones
- **Multer** para el manejo de archivos (por ejemplo, imágenes)
- **CORS** para habilitar el intercambio de recursos entre diferentes dominios
- **PostgreSQL** como base de datos relacional
- **Algoritmos de hashing** para proteger las contraseñas de los usuarios (por ejemplo, bcrypt)

## Uso
Esta API está desplegada en Railway, permitiendo un acceso fácil y rápido. Para empezar a utilizarla, sigue estos pasos:

### Inicio de Sesión
Para **iniciar sesión**, utiliza la ruta `/api/login` con un método `POST`. Deberás enviar un JSON con la información de las credenciales, como usuario y contraseña, el cual generará un token para el acceso de rutas y gestiones de acciones HTTP.

Ejemplo de solicitud del login:
- Endpoint: `https://apinodeexpressfirst-production.up.railway.app/api/login`

Ejemplos de Data:

```json
// Usuario con rol de Administrador y todos los permisos
{
  "user": "emerson",
  "pass": "1234"
}

// Usuario con privilegios de solo lectura
{
  "user": "carlos",
  "pass": "1234"
}

// Usuario con privilegios de solo eliminar
{
  "user": "pedro",
  "pass": "1234"
}

// Usuario con privilegios de escritura y actualización
{
  "user": "maria",
  "pass": "1234"
}
```
> *Nota*
> 
> Se debe autenticar primero en la ***api*** para hacer todas las acciones a continuación.

<br/>
<br/>

### Gestión de productos
**1**. Para ***mostrar los productos***, utiliza la ruta `/api/producto` con un método `GET`.

Ejemplo para la solicitud de los productos:
- Endpoint: `https://apinodeexpressfirst-production.up.railway.app/api/producto`

**2**. Para ***añadir un producto***, utiliza la ruta `api/producto` con un método `POST`. Deberías enviar un JSON al body con la data para el registro de los ***productos***.

Ejemplo para la solicitud de un nuevo producto:
- Endpoint `https://apinodeexpressfirst-production.up.railway.app/api/producto`

```json
//Data ejemplo nuevo producto
{
  "nombre":"Aceite",
  "codProducto":"A12b23",
  "descripcion":"Aceite",
  "precio":4000
}
```
**3**. Para ***actualizar producto*** utiliza la ruta `api/producto` con un método `PUT`. Debería enviar un JSON al body con la data para actualizar el ***producto***

Ejemplo para la solicitud para actualizar producto:
- Endpoint `https://apinodeexpressfirst-production.up.railway.app/api/producto`

```json
//Data ejemplo actualizar producto
{
  "nombre":"Aceite",
  "codProducto":"A12b23",
  "descripcion":"Aceite de Oliva",
  "precio":40400,
  "codigo":1
}
```
**4**. Para ***eliminar un producto*** utiliza la ruta  `api/producto/id` con un método `DELETE`. Deberia enviar un parametro `<id>` por la url.

> *Nota*
>
>El `<id>` es un código único que represta el registro que se va eliminar.

Ejemplo para la solicitud para eliminar un producto:
- Endpoint `https://apinodeexpressfirst-production.up.railway.app/api/producto/1`

<br/>
<br/>

### Gestión de usuarios
**1**. Para ***mostrar los usuarios*** utiliza la ruta `api/usuarios` con un método
`GET`.

Ejemplo para la solicitud de los usuarios:
- Endpoint: `https://apinodeexpressfirst-production.up.railway.app/api/usuarios`

**2**. Para ***mostrar los usuarios*** utiliza la ruta `api/usuarios/unique` con un método`GET`.

Ejemplo para la solicitud de los usuarios:
- Endpoint: `https://apinodeexpressfirst-production.up.railway.app/api/usuarios/unique`

>*Nota*
>
>Para obtener el usuario conectado.

**3**. Para ***añadir usuarios*** utiliza la ruta `api/usuarios` con un método `POST`. Debería enviar un JSON por el body con la data del ***usuario***.

> *Nota*
>
>Esta acción solo será accesible para aquellos usuarios que tenga el rol de Administrador.

> *Nota*
> - El campos del body ***privilegio*** del json solo resive estos datos
> ruta `https://apinodeexpressfirst-production.up.railway.app/api/privilegios/privg`.
> 
    		  1 -> Todos los permisos
     		  2 -> Solo lectura
    		  3 -> Escritura y Actualización
    		  4 -> Solo eliminar
> *Nota*
> - El campo del body ***rol*** del json solo resive estos datos
> ruta `https://apinodeexpressfirst-production.up.railway.app/api/privilegios/rol`
>
    		 1 -> Administrador
    		 2 -> Cliente
    		 3 -> Supervisor
    		 4 -> Vendedor


Ejemplo para la solicitud de un nuevo usuario:
- Endpoint: `https://apinodeexpressfirst-production.up.railway.app/api/usuarios`

```json
// Data ejemplo nuevo usuario
{
  "nombres":"examplo",
  "apellidos":"examplo",
  "telefono":"30023823744",
  "documento":"12039203",
  "rol":2,
  "privilegio":2,
  "usuario":"examplo",
  "pass":"1234",
}
```
**4**. Para ***actualizar usuario*** utiliza la ruta `api/usuario` con un método `PUT`. Debería enviar un JSON al body con la data para actualizar el ***usuario***.

> *Nota*
>
>Esta acción solo será accesible para aquellos usuarios que tenga el rol de Administrador.

jemplo para la solicitud para actualizar un usuario:
- Endpoint `https://apinodeexpressfirst-production.up.railway.app/api/usuarios`

```json
// Data ejemplo actulizar usuario
{
  "nombres":"examplo actualizado",
  "apellidos":"examplo actualizado",
  "telefono":"3004572738",
  "documento":"12039203",
  "rol":2,
  "privilegio":2,
  "usuario":"examplo1",
  "pass":"1234",
  "codigo":2
}
```
> *Nota*
>
>El campo ***codigo*** del JSON data es el identificador del regsitro que se va realizar la actualización.

**4**. Para ***eliminar un usuario*** utiliza la ruta  `api/usuarios/id` con un método `DELETE`. Deberia enviar un parametro `<id>` por la url.

> *Nota*
>
>El `<id>` es un código único que represta el registro que se va eliminar.

Ejemplo para la solicitud para eliminar un usuario:
- Endpoint `https://apinodeexpressfirst-production.up.railway.app/api/usuarios/1`
  
<br/>
<br/>

### Gestión de imagenes
**1**. Para ***cargar una imagen*** utiliza la ruta `api/imgproductos/upload` con un método `POST`. Debería enviar el JSON la data del producto y por form-data la imagen.

Ejemplo para la solicitud para cargar un imagen del producto:
- Endpoint `https://apinodeexpressfirst-production.up.railway.app/api/imgproductos/upload`

- Form-data en el **Key** colocamos ***image***  de tipo ***File*** y el **Value** seleccionamos la imagen.

- JSON mandamos el `<id>` del producto que queremos representar o relacionar con la imagen.
```json
//Data ejemplo del producto de la imagen
{
 "codigo":3
}
```
**2**. Para ***mostrar la imagen del producto***  utiliza la ruta `api/imgproductos/image/id`con un método `GET`. Debería enviar un parametro `<id>` por la url.

>*Nota*
>
>El `id` es`el código único del producto de la imagen.

Ejemplo para la solicitud de mostrar la imagen del producto:
- Endpoint `https://apinodeexpressfirst-production.up.railway.app/api/imgproductos/image/1`
  
<br/>
<br/>

### Restablecer Clave
Para ***restablecer la clave*** utiliza esta ruta `api/login` con un metodo `PUT`. Deberás mandar JSON al body con la data del usuario a restablercer la clave.

jemplo para la solicitud de restablecer clave:
- Endpoint `https://apinodeexpressfirst-production.up.railway.app/api/login`

```json
// Data ejemplo restablecer clave
{
 "user":"maria",  // el usuairo 
 "pass":"00122" //la nueva clave
}
```


### Otras rutas
- Ruta para obtener los roles `https://apinodeexpressfirst-production.up.railway.app/api/privilegios/rol`.

- Ruta para obtener los privilegios `https://apinodeexpressfirst-production.up.railway.app/api/privilegios/privg`.


