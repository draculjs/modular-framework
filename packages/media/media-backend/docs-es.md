#Dracul modulo: media-frontend

El modulo media de dracul brinda un servicio de almacenamiento de archivos.


## Backend

Este modulo provee las una API Graphql y servicios para gestionar el almacenamiento de archivos.

## Modelos

### File Model
```js
const FileSchema = new Schema({

    filename: {type: String, required: true},
    description: {type: String, required: false},
    tags: [{type: String, required: false}],
    mimetype: {type: String, required: true},
    encoding: {type: String, required: true},
    extension: {type: String, required: true},
    type: {type: String, required: true},
    relativePath: {type: String, required: true},
    absolutePath: {type: String, required: true},
    size: {type: Number, required: true},
    url: {type: String, required: true},
    createdAt: {type: Date, required: true, default: Date.now},
    createdBy: {
        user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: false},
        username: {type: String, required: true}
    }


});
```

## Servicios

### fileUpload
Recibe un archivo y el usuario autenticado, lo almacena en una carpeta del servidor y guarda la metadata en Base de datos.

#### Parametros: 
- user: ID Usuario autenticado
- file: Archivo a almacentar

#### Retorna:  
un Mongo Document del modelo File
 
---
### paginateFiles
Obtiene el listado de archivos almacenados de forma paginada

#### Parametros: 
- pageNumber: (Number) Numero de pagina actual
- itemsPerPage =  (Number) Cantidad de elementos por pagina
- search: (String) busca archivos por el texto ingresado
- orderBy: (string) columna por la que se ordena
- orderDesc: (Boolean) Define si se ordena de forma descendente 

#### Retorna:
Una lista de Mongo Documents del modelo File

---

### findFile
Obtiene un archivo por su ID

#### Parametros: 
- id: ID del documento

#### Retorna:
Un Mongo Document del modelo File

## Graphql
A continuación se detallan los types, inputs, queries y mutations que se exponen vía Graphql
### Types

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

#Tipo utilizado para obtener los File paginados
type FilePaginated{
    totalItems: Int!
    page: Int!
    items: [File!]
}
``` 


### Inputs

```graphql
#Tipo usado para editar descripcion y etiquetas de Files
input FileUpdateInput{
    description: String
    tags: [String]
}
```

### Queries

```graphql
type Query {
    #Busca un archivo por ID
    fileFind(id:ID!): File
    #Obtiene los archivos con paginado
    filePaginate( pageNumber: Int, itemsPerPage: Int, search: String, orderBy: String, orderDesc: Boolean): FilePaginated
}

```

### Mutations

```graphql
type Mutation {
        #Actualiza info de un file (descripcion y etiquetas)
        fileUpdate(id: ID!, input: FileUpdateInput): File
        #Elimina un archivo
        fileDelete(id: ID!): FileDelete!
        #Sube un archivo
        fileUpload(file: Upload!): File!
}

```
