# "Espacios de trabajo" Backend.

## Instalación

Debe de descargar el sistema y dentro de la carpeta de este ejecutar el comando npm install.

```bash
  npm install
```

Luego debe modificar el archivo .env para configurar el puerto y la base de datos MongoDB si va atrabajar con una base de datos distinta o diferente puerto

```javascript
PORT = 3000
MONGO_DB = direccion_de_la_bd_en_MONGO_DB
```

Para arrancar el sistema se debe ejecutar en la consola el comando:
```bash
  npm start
```

## Endpoints
### POST - /api/auth/singin
Devuelve los datos del usuario que se esta registrando
### POST - /api/auth/login
Devuele el token del usuario que esta iniciado sesion

### GET - /api/usuarios
Devuelve la lista de usuarios almacenados en la BD
### GET - /api/usuarios/verificar/usuario
Devuelve los datos del usuario que esta con la sesion activa
### GET - /api/usuarios/:id
Devuelve un usuario en especifico a traves de la ID
### POST - /api/usuarios/
Endpoint que se utiliza para agregar un usuario al servidor
### PUT - /api/usuarios/:id
Se utiliza para editar los datos de un usuario en especifico a traves de la ID, la id se envia a traves de la url
### DELETE - /api/usuarios/:id
Se utiliza para eliminar un usuario en especifico a traves de la ID, la id se envia a traves de la url.

### GET - /api/espacios
Devuelve la lista de espacios de trabajo almacenadas en la BD
### GET - /api/espacios/:id
Devuelve un espacio de trabajo en especifico a traves de la ID
### GET - /api/espacios/buscar/reservados
Devuelve una lista con las reservaciones que se han hecho
### POST - /api/espacios/
Endpoint que se utiliza para agregar un espacio de trabajo al servidor
### PUT - /api/espacios/:id
Se utiliza para editar los datos de un espacio de trabajo en especifico a traves de la ID, la id se envia a traves de la url
### PUT - /api/espacios/reservar/:id
Se utiliza para editar los datos de un espacio de trabajo en especifico a traves de la ID, la id se envia a traves de la url
### DELETE - /api/espacios/:id
Se utiliza para eliminar un espacios de trabajo en especifico a traves de la ID, la id se envia a traves de la url.




