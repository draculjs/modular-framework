
import { createFile, updateFile, deleteFile,  findFile, fetchFiles, paginateFiles} from '../../services/FileService'

import {AuthenticationError, ForbiddenError} from "apollo-server-express";

import {

    FILE_SHOW,
    FILE_UPDATE,
    FILE_CREATE,
    FILE_DELETE
} from "../../permissions/File";

export default {
    Query: {
        fileFind: (_, {id}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, FILE_SHOW)) throw new ForbiddenError("Not Authorized")
            return findFile(id)
        },
        fileFetch: (_, {}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, FILE_SHOW)) throw new ForbiddenError("Not Authorized")
            return fetchFiles()
        },
        filePaginate: (_, {pageNumber, itemsPerPage, search, orderBy, orderDesc}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, FILE_SHOW)) throw new ForbiddenError("Not Authorized")
            return paginateFiles(pageNumber, itemsPerPage, search, orderBy, orderDesc)
        },
        
    },
    Mutation: {
        fileUpdate: (_, {id, input}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, FILE_UPDATE)) throw new ForbiddenError("Not Authorized")
            return updateFile(user, id, input)
        },
        fileDelete: (_, {id}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, FILE_DELETE)) throw new ForbiddenError("Not Authorized")
            return deleteFile(id)
        },
    }

}

