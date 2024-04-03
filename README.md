### *** Nombre del Proyecto ***: SecureCommerceAPI

>SecureCommerceAPI es una API diseñada para proporcionar una plataforma segura y robusta para la gestión de usuarios, roles, productos .Esta API ofrece una variedad de funcionalidades clave que incluyen autenticación, autorización, gestión de productos y gestión de usuarios, todo ello con un enfoque en la seguridad y la escalabilidad. 


#### Tecnologías Utilizadas
- Express
- Node.js
- JavaScript
- JWT (JSON Web Tokens) para autenticación
- Git para control de versiones
- Multer para el manejo de archivos (por ejemplo, imágenes)
- CORS para habilitar el intercambio de recursos entre diferentes dominios
- PostgreSQL como base de datos relacional
- Algoritmos de hashing para proteger las contraseñas de los usuarios (por ejemplo, bcrypt)

## Uso
Esta API está desplegada en Railway, permitiendo un acceso fácil y rápido. Para empezar a utilizarla, sigue estos pasos:

### Inicio de Sesión
1. **Inicio sesión** utilizando la ruta `/api/login` con un método `POST`. Deberás enviar un JSON con la información de las credeciales , como usuarios y contraseña, el cual va ha generar un token para el accesso de rutas y gestiones de acciones HTTP.


   Ejemplo de solicitud para registro:
   - Endpoid `https://apinodeexpressfirst-production.up.railway.app/api/log`
   
   
  
	 // ejemplo Data
	 
	 // usuaio rol Administrador y privelegios "todos los permisos"
	 	{
	 		"user":"emerson",
			"pass":"1234"
		 }
		 
	 // usuaio privielgios "solo lectura"
	 	{
	 		"user":"carlos",
			"pass":"1234"
		 }
		 
	 // usuaio privielgios "solo eliminar"
	 	{
	 		"user":"pedro",
			"pass":"1234"
		 }
		 
	 // usuaio privielgios "escritura y actualización"
	 	{
	 		"user":"maria",
			"pass":"1234"
		 }
   

### Gestión de productos
1. ** Consultar productos ** utiliza esta ruta `/api/producto` con un metodo `GET`. Esto mostrará un respuesta de tipo JSON con la data de los productos.

- Endpoin `https://apinodeexpressfirst-production.up.railway.app/api/producto`

