
import { createFile, updateFile, deleteFile, findFile, fetchFiles, paginateFiles } from '../../services/FileService'

import { AuthenticationError, ForbiddenError } from "apollo-server-express";

import {
    FILE_SHOW_ALL,
    FILE_SHOW_OWN,
    FILE_UPDATE_ALL,
    FILE_UPDATE_OWN,
    FILE_DELETE_ALL,
    FILE_DELETE_OWN
} from "../../permissions/File";

export default {
    Query: {
        fileFind: (_, { id }, { user, rbac }) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, FILE_SHOW_ALL) && !rbac.isAllowed(user.id, FILE_SHOW_OWN)) throw new ForbiddenError("Not Authorized")
            let permissionType = (rbac.isAllowed(user.id, FILE_SHOW_ALL)) ? FILE_SHOW_ALL : (rbac.isAllowed(user.id, FILE_SHOW_OWN)) ? FILE_SHOW_OWN : null;
            return findFile(id, permissionType, user.id)
        },
        filePaginate: (_, { input }, { user, rbac }) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, FILE_SHOW_ALL) && !rbac.isAllowed(user.id, FILE_SHOW_OWN)) throw new ForbiddenError("Not Authorized")
            let permissionType = (rbac.isAllowed(user.id, FILE_SHOW_ALL)) ? FILE_SHOW_ALL : (rbac.isAllowed(user.id, FILE_SHOW_OWN)) ? FILE_SHOW_OWN : null;
            return paginateFiles(input, permissionType, user.id)
        },
    },
    Mutation: {
        fileUpdate: (_, { input }, { user, rbac }) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, FILE_UPDATE_ALL) && !rbac.isAllowed(user.id, FILE_UPDATE_OWN)) throw new ForbiddenError("Not Authorized")
            let permissionType = (rbac.isAllowed(user.id, FILE_UPDATE_ALL)) ? FILE_UPDATE_ALL : (rbac.isAllowed(user.id, FILE_UPDATE_OWN)) ? FILE_UPDATE_OWN : null;
            return updateFile(user, input, permissionType, user.id)
        },
        fileDelete: (_, { id }, { user, rbac }) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, FILE_DELETE_ALL) && !rbac.isAllowed(user.id, FILE_DELETE_OWN)) throw new ForbiddenError("Not Authorized")
            let permissionType = (rbac.isAllowed(user.id, FILE_DELETE_ALL)) ? FILE_DELETE_ALL : (rbac.isAllowed(user.id, FILE_DELETE_OWN)) ? FILE_DELETE_OWN : null;
            return deleteFile(id, permissionType, user.id)
        },
    }

}

