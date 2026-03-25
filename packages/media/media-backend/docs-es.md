[![Contributors][contributors-shield]][contributors-url]
[![Stargazers][stars-shield]][stars-url]

#Dracul modulo: media-backend

El modulo media de dracul brinda un servicio de almacenamiento y gestión de archivos.

## Instalación:

```
npm i @dracul/media-backend
```

## Tabla de contenidos

<div class="toc">
  <ul>
    <li><a href="#queries-and-mutations">GraphQL: queries y mutations</a></li>
      <ul>
        <li><a href="#types">Types</a>
            <ul>
                <li> <a href="#File">File</a></li>
                <li> <a href="#CreatedBy">CreatedBy</a></li>
                <li> <a href="#FilePaginated">FilePaginated</a></li>
            </ul>
        </li>
        <li><a href="#queries">Queries</a>
            <ul>
                <li> <a href="#fileFind">fileFind</a></li>
                <li> <a href="#filePaginate">filePaginate</a></li>
            </ul>
        </li>
        <li><a href="#mutations">Mutations</a>
            <ul>
                <li> <a href="#fileUpdate">fileUpdate</a></li>
                <li> <a href="#fileUpload">fileUpload</a></li>
                <li> <a href="#fileDelete">fileDelete</a></li>
            </ul>
        </li>
      </ul>
     <li><a href="#services">Servicios</a></li>
        <ul>
            <li><a href="#fileUpload">fileUpload</a></li>
            <li><a href="#paginateFiles">paginateFiles</a></li>
            <li><a href="#findFile">findFile</a></li>
        </ul>
     <li><a href="#rest">REST</a></li>
        <ul>
            <li><a href="#fileUploadRest">Subir un archivo</a></li>
            <li><a href="#paginateFilesRest">Obtener todos los archivos paginados</a></li>
            <li><a href="#findFileRest">Buscar un archivo por ID</a></li>
        </ul>
  </ul>
</div>

---

<h1 id="queries-and-mutations">Queries y mutations</h1>

<h2 id="types">Types</h2>

<h3 id="File">File</h3>

```graphql
#Tipo de la entidad File
type File{
    id: ID!
    filename: String!
    description: String
    tags: [String]
    mimetype: String!
    type: String!
    extension: String!
    relativePath: String!
    absolutePath: String!
    size: Int!
    url: String!
    createdAt: String!
    createdBy: CreatedBy
}
``` 

<h3 id="CreatedBy">CreatedBy</h3>

```graphql
type CreatedBy{
  user: User
  username: String
}

``` 

<h3 id="FilePaginated">FilePaginated</h3>

```graphql
type FilePaginated{
    totalItems: Int!
    page: Int!
    items: [File!]
}
``` 
### Inputs

```graphql
input FileUpdateInput{
    description: String
    tags: [String]
}
```

<h2 id="queries">Queries</h2>

<h3 id="fileFind">fileFind</h3>

**Definición y uso**

_Busca un archivo por ID._

```graphql endpoint
query: {
    fileFind(id:ID!): File
}
```

<h3 id="filePaginate">filePaginate</h3>

***Definición y uso***

_Obtiene los archivos con paginado._

```graphql endpoint
query: {
    filePaginate( 
    pageNumber: Int,
    itemsPerPage: Int,
    search: String,
    orderBy: String,
    orderDesc: Boolean): FilePaginated
}
```

<h2 id="mutations">Mutations</h2>

<h3 id="fileUpdate">fileUpdate</h3>

***Definición y uso***

_Actualiza info de un file (descripcion y etiquetas)._

```graphql
type Mutation {
        fileUpdate(
            id: ID!, 
            input: FileUpdateInput): File
}

```

<h3 id="fileUpload">fileUpload</h3>

***Definición y uso***

_Sube un archivo al gestor._

```graphql
type Mutation {
        fileUpload(file: Upload!): File!
}

```

<h3 id="fileDelete">fileDelete</h3>

***Definición y uso***

_Elimina un archivo por su ID._

```graphql
type Mutation {
        fileDelete(id: ID!): FileDelete!
}

```

---

<h2 id="services">Servicios</h2>

<h3 id="fileUpload">fileUpload</h3>

**Definición y uso**

_Recibe un archivo y el usuario autenticado, lo almacena en una carpeta del servidor y guarda la metadata en Base de datos._

#### Parametros:
- user: ID Usuario autenticado
- file: Archivo a almacentar

#### Retorna:
un Mongo Document del modelo File

<h3 id="paginateFiles">paginateFiles</h3>

**Definición y uso**

_Obtiene el listado de archivos almacenados de forma paginada._

#### Parametros:
- pageNumber: (Number) Numero de pagina actual
- itemsPerPage =  (Number) Cantidad de elementos por pagina
- search: (String) busca archivos por el texto ingresado
- orderBy: (string) columna por la que se ordena
- orderDesc: (Boolean) Define si se ordena de forma descendente

#### Retorna:
Una lista de Mongo Documents del modelo File


<h3 id="findFile">findFile</h3>

**Definición y uso**

_Obtiene un archivo por su ID._

#### Parametros:
- id: ID del documento

#### Retorna:
Un Mongo Document del modelo File

---

<h2 id="rest">REST</h2>

<h3 id="fileUploadRest">Subir un archivo</h3>

- Endpoint: /api/file
- Metodo: POST
- Parametros: 
  - file 
    - Requerido. 
    - Type: file.
    - Un archivo a subir.
- Header:
  - Authorization: Bearer + token  
  

<h3 id="paginateFilesRest">Obtener todos los archivos paginados</h3>

- Endpoint: /api/file
- Metodo: GET
- Parametros: 
  - pageNumber 
    - No requerido. 
    - Type: Number.
    - Default: 1. 
    - Numero de pagina que desea obtener.
  - itemsPerPage 
    - No requerido. 
    - Type: Number.
    - Default: 5. 
    - Cantidad de items por página.
  - search 
    - No requerido. 
    - Type: String.
    - Default: null.
    - Permite filtrar por nombre de archivo.
  - orderBy 
    - No requerido. 
    - Type: String.
    - Default: null.
    - Permite ordenar por algún criterio (Por ejemplo por nombre de archivo).
  - orderDesc 
    - No requerido. 
    - Type: Boolean.
    - Default: false.
    - Si esta en true, devuelve los datos ordenados de forma descendente.
- Header:
    - Authorization: Bearer + token


<h3 id="findFileRest">Buscar un archivo por ID</h3>

- Endpoint: /api/file/:id
- Metodo: GET
- Parametros: 
  - id 
    - Requerido. 
    - Type: String.
    - El ID del archivo a buscar.
- Header:
    - Authorization: Bearer + token

---

## Variables de Entorno

| Variable | Default | Descripción |
|----------|---------|-------------|
| `MONGO_URL` | - | URL de conexión a MongoDB (requerido) |
| `MEDIA_DEFAULT_CAPACITY` | 1024 | Capacidad de almacenamiento por defecto en MB |
| `MEDIA_MAX_SIZE_PER_FILE_IN_MEGABYTES` | 100 | Tamaño máximo por archivo en MB |
| `MEDIA_FILE_EXPIRATION_TIME_IN_DAYS` | 30 | Tiempo de expiración por defecto para archivos |
| `MEDIA_FILE_CLEANUP_ENABLED` | true | Habilitar/deshabilitar el job de cleanup |
| `MEDIA_CLEANUP_CONCURRENCY` | 5 | Concurrencia del cleanup |
| `MEDIA_UPLOAD_ANONYMOUS` | disable | Habilitar uploads anónimos ('enable' o 'true') |
| `JWT_SECRET` | - | Secret para JWT |
| `LDAP_AUTH` | false | Usar autenticación LDAP |

---

## Sistema de Permisos

El módulo media-backend utiliza un sistema de permisos basado en RBAC:

### Permisos de Archivos

| Permiso | Descripción |
|---------|-------------|
| `FILE_SHOW_ALL` | Ver todos los archivos (admin) |
| `FILE_SHOW_OWN` | Ver archivos propios |
| `FILE_SHOW_PUBLIC` | Ver archivos públicos |
| `FILE_UPDATE_ALL` | Actualizar cualquier archivo (admin) |
| `FILE_UPDATE_OWN` | Actualizar archivos propios |
| `FILE_DELETE_ALL` | Eliminar cualquier archivo (admin) |
| `FILE_DELETE_OWN` | Eliminar archivos propios |
| `FILE_CREATE` | Crear nuevos archivos |
| `FILE_DOWNLOAD` | Descargar archivos |

### Permisos de Almacenamiento

| Permiso | Descripción |
|---------|-------------|
| `USER_STORAGE_SHOW_ALL` | Ver todos los storages (admin) |
| `USER_STORAGE_SHOW_OWN` | Ver storage propio |
| `USER_STORAGE_UPDATE` | Actualizar storage |
| `USER_STORAGE_CREATE` | Crear storage |
| `USER_STORAGE_DELETE` | Eliminar storage |

---

## Cleanup de Archivos Expirados

El sistema incluye un job scheduler que limpia automáticamente archivos expirados:

### Comportamiento

1. **Expiración explícita**: Archivos con `expirationDate` en el pasado
2. **Política por usuario**: Según configuración en `UserStorage` (`deleteByLastAccess` o `deleteByCreatedAt`)

### DistributedLock

El cleanup usa un lock distribuido para prevenir ejecuciones concurrentes entre múltiples instancias:

- **Timeout del lock**: 5 minutos
- **Auto-recovery**: Locks expirados se limpian automáticamente
- **Colección MongoDB**: `cleanup_locks`

### Logs del Cleanup

```
CleanupJob: Starting file expiration cleanup...
CleanupJob: Cleanup finished. Deleted: X, Errors: Y
CleanupJob: Lock held by <instance-id>, skipping this execution
CleanupJob: Next cleanup scheduled in X minutes
```

---

## Logging y Debugging

El módulo usa `winston` para logs estructurados con los siguientes niveles:

### Niveles de Log

| Nivel | Uso |
|-------|-----|
| `error` | Errores que requieren atención |
| `warn` | Situaciones inesperadas pero manejables |
| `info` | Eventos significativos del flujo |
| `debug` | Detalles para debugging |

### Ejemplo de Logs

```bash
# Solicitud GraphQL
info: POST localhost/graphql/ ::1 anonymous filePaginate
info: POST localhost/graphql/ ::1 anonymous filePaginate response: 200 34ms

# Cleanup de archivos
info: CleanupJob: Starting file expiration cleanup...
info: CleanupJob: Cleanup finished. Deleted: 5, Errors: 0

# DistributedLock
info: DistributedLock.acquireLock: successfully acquired lock 'cleanup' for instance 'instance-123'
info: DistributedLock.releaseLock: released lock 'cleanup'

# Errores de permisos
warn: FileResolvers.fileFind: forbidden access - userId='xxx', fileId='yyy'
```

### Configuración de Logs

Los logs se configuran a nivel de la aplicación principal. Ver `@dracul/logger-backend` para configuración.

---

## Tests

El módulo incluye tests de integración con Jest:

```bash
# Ejecutar todos los tests
npm test

# Ejecutar un test específico
npm test -- --testPathPattern="FileCleanupJob.test"

# Tests de DistributedLock
npm test -- --testPathPattern="DistributedLock.test"
```

### Archivos de Test

- `__tests__/rest/` - Tests de endpoints REST
- `__tests__/services/` - Tests de servicios
- `__tests__/services/helpers/` - Tests de utilidades (DistributedLock)

---

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[stars-shield]: https://img.shields.io/github/stars/draculjs/modular-framework.svg?style=flat-square

[stars-url]: https://github.com/draculjs/modular-framework/stargazers

[contributors-shield]: https://img.shields.io/github/contributors/draculjs/modular-framework.svg?style=flat-square

[contributors-url]: https://github.com/draculjs/modular-framework/graphs/contributors

