#Dracul module: media-frontend

The dracul media module provides a file storage service.


## Backend

This module provides a Graphql API and services to manage file storage.

## Models

### File Model
```js
const FileSchema = new Schema ({

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

## Services

### fileUpload
It receives a file and the authenticated user, stores it in a folder on the server and saves the metadata in the Database.

#### Parameters:
- user: Authenticated user ID
- file: File to store

#### Returns:
a Mongo Document of the File model
 
---
### paginateFiles
Gets the list of files stored in a paginated way

#### Parameters:
- pageNumber: (Number) Current page number
- itemsPerPage = (Number) Number of items per page
- search: (String) search files by the entered text
- orderBy: (string) column by which to order
- orderDesc: (Boolean) Defines whether to order in descending order

#### Returns:
A list of Mongo Documents of the File model

---

### findFile
Get a file by its ID

#### Parameters:
- id: document ID

#### Returns:
A Mongo Document of the File model

## Graphql
The types, inputs, queries and mutations that are exposed via Graphql are detailed below
### Types

```graphql
#File entity type
type File {
    Yo hice!
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

#Type used to obtain the paginated files
type FilePaginated {
    totalItems: Int!
    page: Int!
    items: [File!]
}
```


### Inputs

```graphql
#Type used to edit description and tags of Files
input FileUpdateInput {
    description: String
    tags: [String]
}
```

### Queries

```graphql
type Query {
    #Search for a file by ID
    fileFind (id: ID!): File
    #Get the files with paging
    filePaginate (pageNumber: Int, itemsPerPage: Int, search: String, orderBy: String, orderDesc: Boolean): FilePaginated
}
```

### Mutations

```graphql
type Mutation {
        #Update info of a file (description and labels)
        fileUpdate (id: ID !, input: FileUpdateInput): File
        #Delete a file
        fileDelete (id: ID!): FileDelete!
        #Upload a file
        fileUpload (file: Upload!): File!
}
```
