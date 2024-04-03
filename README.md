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

### Inicio de Sesión
Para **mostrar los productos**, utiliza la ruta `/api/producto` con un método `GET`.

Ejemplo para la solicitud de los productos:
- Endpoint: `https://apinodeexpressfirst-production.up.railway.app/api/producto`
