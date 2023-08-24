[![Contributors][contributors-shield]][contributors-url]
[![Stargazers][stars-shield]][stars-url]
 
# Dracul media storage

## Caracteristicas

Gestor y almacenamiento de archivos.
Incluye servicios de creación y autenticación de usuarios.

## Stack tecnologico

Full stack Javascript

- Backend:
    - NodeJs
    - Express
    - Apollo Server (GraphQL)

- Frontend
  - VueJs
  - Vuetify
  - Apollo client (GraphQL)
  - DraculJs user module
  
- Data base
  - MongoDB (NoSQL)


## Clonando el proyecto en tu local

``` 
      git clone
``` 

## Levantar el proyecto 

### - media-backend

- Acceder a la carpeta del proyecto

``` 
    cd media-backend
``` 

- Instalar las dependencias

``` 
    npm install
``` 

- Configuración de variables de entorno

    - Renombrar el archivo .env.example.dev a .env
    - Modificar los valores de ejemplo por los de su ambiente local.
    - Listado de variables de entorno:

Nombre  | Descripcion| Config de ejemplo |
------- | -------------| --------------|
NODE_ENV  | Entorno en NodeJS | development|
MONGO_URI  | Usada para la conexion a MongoDB | mongodb://127.0.0.1:27017/media |
JWT_SECRET | Palabra secreta para generar el JWT   |qweerytuytuytutu |
JWT_LOGIN_EXPIRED_IN  | Tiempo de expiracion de JWT | 1d|
JWT_REGISTER_EXPIRED_IN  | Tiempo de expiracion de JWT para el registro en la web | 30d |
APP_NAME  | Nombre de la APP | MEDIA |
APP_PORT  | Puerto de la API  | 7000 |
APP_API_URL |  Host donde está alojada la API |http://localhost:7000 |
APP_WEB_URL |  Host donde está alojada la web |http://localhost:8080 |


- Correr el proyecto

``` 
    npm start
```


- Correr los test

``` 
    npm run test
``` 

- Documentacion endpoints Rest con Swagger:

``` 
    http://yourhost:yourport/api-docs
``` 

### - media-frontend

- Acceder a la carpeta del proyecto

``` 
    cd media-frontend
``` 

- Instalar las dependencias

``` 
    npm install
``` 

- Configuración de variables de entorno

    - Renombrar el archivo .env.development a .env
    - Modificar los valores de ejemplo por los de su ambiente local.
    - Listado de variables de entorno:

Nombre  | Descripcion| Config de ejemplo |
------- | -------------| --------------|
NODE_ENV  | Entorno en NodeJS | development|
VUE_APP_APIHOST  | Host donde esta alojada la web  | http://localhost:8080 |
VUE_APP_KEY |  - |draculmedia |
VUE_APP_REGISTER |  - |enable |

- Correr el proyecto

``` 
    npm run serve
```

---

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[stars-shield]: https://img.shields.io/github/stars/draculjs/modular-framework.svg?style=flat-square

[stars-url]: https://github.com/draculjs/modular-framework/stargazers

[contributors-shield]: https://img.shields.io/github/contributors/draculjs/modular-framework.svg?style=flat-square

[contributors-url]: https://github.com/draculjs/modular-framework/graphs/contributors
