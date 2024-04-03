# **Nombre del Proyecto**: SecureCommerceAPI

SecureCommerceAPI es una API diseñada para proporcionar una plataforma segura y robusta para la gestión de usuarios, roles, y productos. Esta API ofrece una variedad de funcionalidades clave que incluyen autenticación, autorización, gestión de productos y gestión de usuarios, todo ello con un enfoque en la seguridad y la escalabilidad.

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

### Gestón de productos
**1**. Para ***mostrar los productos***, utiliza la ruta `/api/producto` con un método `GET`.

Ejemplo para la solicitud de los productos:
- Endpoint: `https://apinodeexpressfirst-production.up.railway.app/api/producto`

**2**. Para ***añadir un producto***, utiliza la ruta `api/producto` con un método `POST`. Deberías enviar un JSON al body con la data para el regsitro de los ***productos***.

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
**3**. Para ***actulizar producto*** utiliza la ruta `api/producto` con un método `PUT`. Debería enviar un JSON al body con la data para actualizar el ***producto***

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
 El `<id>` es un codigo unico que represta el registro que se va eliminar.

Ejemplo para la solicitud para eliminar un producto:
- Endpoint `https://apinodeexpressfirst-production.up.railway.app/api/producto/1`

### Gestión de usuarios
**1**. Para ***mostrar los usuarios*** utiliza la ruta `api/usuarios` con un método
`GET`.

Ejemplo para la solicitud de los usuarios:
- Endpoint: `https://apinodeexpressfirst-production.up.railway.app/api/usuarios`

**2**. Para ***añadir usuarios*** utiliza la ruta `api/usuarios` con un método `POST`. Debería enviar un JSON por el body con la data del ***usuario***.

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
**3**. Para ***actualizar usuario*** utiliza la ruta `api/usuario` con un método `PUT`. Debería enviar un JSON al body con la data para actualizar el ***usuario***.

> *Nota*
>
>Esta acción solo será accesible para aquellos usuarios que tenga el rol de Administrador.

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

