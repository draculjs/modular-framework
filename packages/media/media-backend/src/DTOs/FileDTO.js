import mongoose from 'mongoose'
export default class FileDTO {
    constructor(file) {
        this.id = new mongoose.Types.ObjectId(file.id)
        this.filename = file.filename
        this.description = file.description

        this.tags = file.tags
        this.mimetype = file.mimetype
        this.encoding = file.encoding
        this.extension = file.extension

        this.type = file.type

        this.relativePath = file.relativePath
        this.absolutePath = file.absolutePath

        this.size = file.size
        this.url = file.url

        this.lastAccess = file.lastAccess
        this.createdAt = file.createdAt
        this.createdBy = file.createdBy.username
        this.expirationDate = file.expirationDate
        
        this.isPublic = file.isPublic
        this.hits = file.hits
        
        this.groups = file.groups
        this.users = file.users
        this.fileReplaces = file.fileReplaces
    }
}