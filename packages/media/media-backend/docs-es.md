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

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[stars-shield]: https://img.shields.io/github/stars/draculjs/modular-framework.svg?style=flat-square

[stars-url]: https://github.com/draculjs/modular-framework/stargazers

[contributors-shield]: https://img.shields.io/github/contributors/draculjs/modular-framework.svg?style=flat-square

[contributors-url]: https://github.com/draculjs/modular-framework/graphs/contributors

