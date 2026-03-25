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

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `MONGO_URL` | - | MongoDB connection URL (required) |
| `MEDIA_DEFAULT_CAPACITY` | 1024 | Default storage capacity in MB |
| `MEDIA_MAX_SIZE_PER_FILE_IN_MEGABYTES` | 100 | Maximum file size in MB |
| `MEDIA_FILE_EXPIRATION_TIME_IN_DAYS` | 30 | Default file expiration time |
| `MEDIA_FILE_CLEANUP_ENABLED` | true | Enable/disable cleanup job |
| `MEDIA_CLEANUP_CONCURRENCY` | 5 | Cleanup concurrency |
| `MEDIA_UPLOAD_ANONYMOUS` | disable | Enable anonymous uploads ('enable' or 'true') |
| `JWT_SECRET` | - | JWT secret |
| `LDAP_AUTH` | false | Use LDAP authentication |

---

## Permission System

The media-backend module uses an RBAC-based permission system:

### File Permissions

| Permission | Description |
|------------|-------------|
| `FILE_SHOW_ALL` | View all files (admin) |
| `FILE_SHOW_OWN` | View own files |
| `FILE_SHOW_PUBLIC` | View public files |
| `FILE_UPDATE_ALL` | Update any file (admin) |
| `FILE_UPDATE_OWN` | Update own files |
| `FILE_DELETE_ALL` | Delete any file (admin) |
| `FILE_DELETE_OWN` | Delete own files |
| `FILE_CREATE` | Create new files |
| `FILE_DOWNLOAD` | Download files |

### Storage Permissions

| Permission | Description |
|------------|-------------|
| `USER_STORAGE_SHOW_ALL` | View all storages (admin) |
| `USER_STORAGE_SHOW_OWN` | View own storage |
| `USER_STORAGE_UPDATE` | Update storage |
| `USER_STORAGE_CREATE` | Create storage |
| `USER_STORAGE_DELETE` | Delete storage |

---

## File Expiration Cleanup

The system includes a scheduler job that automatically cleans expired files:

### Behavior

1. **Explicit expiration**: Files with `expirationDate` in the past
2. **User policy**: Based on `UserStorage` configuration (`deleteByLastAccess` or `deleteByCreatedAt`)

### DistributedLock

Cleanup uses a distributed lock to prevent concurrent executions across multiple instances:

- **Lock timeout**: 5 minutes
- **Auto-recovery**: Expired locks are automatically cleaned
- **MongoDB collection**: `cleanup_locks`

### Cleanup Logs

```
CleanupJob: Starting file expiration cleanup...
CleanupJob: Cleanup finished. Deleted: X, Errors: Y
CleanupJob: Lock held by <instance-id>, skipping this execution
CleanupJob: Next cleanup scheduled in X minutes
```

---

## Logging and Debugging

The module uses `winston` for structured logging with the following levels:

### Log Levels

| Level | Usage |
|-------|-------|
| `error` | Errors requiring attention |
| `warn` | Unexpected but manageable situations |
| `info` | Significant flow events |
| `debug` | Debugging details |

### Log Examples

```bash
# GraphQL Request
info: POST localhost/graphql/ ::1 anonymous filePaginate
info: POST localhost/graphql/ ::1 anonymous filePaginate response: 200 34ms

# File Cleanup
info: CleanupJob: Starting file expiration cleanup...
info: CleanupJob: Cleanup finished. Deleted: 5, Errors: 0

# DistributedLock
info: DistributedLock.acquireLock: successfully acquired lock 'cleanup' for instance 'instance-123'
info: DistributedLock.releaseLock: released lock 'cleanup'

# Permission Errors
warn: FileResolvers.fileFind: forbidden access - userId='xxx', fileId='yyy'
```

### Log Configuration

Logs are configured at the application level. See `@dracul/logger-backend` for configuration.

---

## Tests

The module includes Jest integration tests:

```bash
# Run all tests
npm test

# Run specific test
npm test -- --testPathPattern="FileCleanupJob.test"

# DistributedLock tests
npm test -- --testPathPattern="DistributedLock.test"
```

### Test Files

- `__tests__/rest/` - REST endpoint tests
- `__tests__/services/` - Service tests
- `__tests__/services/helpers/` - Utility tests (DistributedLock)
