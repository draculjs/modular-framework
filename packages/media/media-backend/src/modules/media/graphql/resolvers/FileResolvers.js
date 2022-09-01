
import { createFile, updateFile, deleteFile, findFile, fetchFiles, paginateFiles } from '../../services/FileService'

import { AuthenticationError, ForbiddenError } from "apollo-server-express";

import {
    FILE_SHOW_ALL,
    FILE_SHOW_OWN,
    FILE_UPDATE_ALL,
    FILE_UPDATE_OWN,
    FILE_DELETE_ALL,
    FILE_DELETE_OWN,
    FILE_SHOW_PUBLIC
} from "../../permissions/File";

export default {
    Query: {
        fileFind: (_, { id }, { user, rbac }) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, FILE_SHOW_ALL) && !rbac.isAllowed(user.id, FILE_SHOW_OWN)) throw new ForbiddenError("Not Authorized")

            let allFilesAllowed = rbac.isAllowed(user.id, FILE_SHOW_ALL)
            let ownFilesAllowed = rbac.isAllowed(user.id, FILE_SHOW_OWN)
            let publicAllowed = rbac.isAllowed(user.id, FILE_SHOW_PUBLIC)

            return findFile(id, user.id, allFilesAllowed, ownFilesAllowed, publicAllowed)
        },
        filePaginate: (_, { input }, { user, rbac }) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, FILE_SHOW_ALL) && !rbac.isAllowed(user.id, FILE_SHOW_OWN) && !rbac.isAllowed(user.id, FILE_SHOW_PUBLIC)) throw new ForbiddenError("Not Authorized")

            let allFilesAllowed = rbac.isAllowed(user.id, FILE_SHOW_ALL)
            let ownFilesAllowed = rbac.isAllowed(user.id, FILE_SHOW_OWN)
            let publicAllowed = rbac.isAllowed(user.id, FILE_SHOW_PUBLIC)
            return paginateFiles(input,  user.id, allFilesAllowed, ownFilesAllowed, publicAllowed)
        },
    },
    Mutation: {
        fileUpdate: (_, { input }, { user, rbac }) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, FILE_UPDATE_ALL) && !rbac.isAllowed(user.id, FILE_UPDATE_OWN)) throw new ForbiddenError("Not Authorized")

            let allFilesAllowed = rbac.isAllowed(user.id, FILE_SHOW_ALL)
            let ownFilesAllowed = rbac.isAllowed(user.id, FILE_SHOW_OWN)
            let publicAllowed = rbac.isAllowed(user.id, FILE_SHOW_PUBLIC)

            return updateFile(user, input, user.id, allFilesAllowed, ownFilesAllowed, publicAllowed)
        },
        fileDelete: (_, { id }, { user, rbac }) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, FILE_DELETE_ALL) && !rbac.isAllowed(user.id, FILE_DELETE_OWN)) throw new ForbiddenError("Not Authorized")

            let allFilesAllowed = rbac.isAllowed(user.id, FILE_SHOW_ALL)
            let ownFilesAllowed = rbac.isAllowed(user.id, FILE_SHOW_OWN)
            let publicAllowed = rbac.isAllowed(user.id, FILE_SHOW_PUBLIC)

            return deleteFile(id, user.id, allFilesAllowed, ownFilesAllowed, publicAllowed)
        },
    }

}

