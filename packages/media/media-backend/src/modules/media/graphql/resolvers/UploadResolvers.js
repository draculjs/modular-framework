
import {fileUpload } from '../../services/UploadService'

import {AuthenticationError, ForbiddenError} from "apollo-server-express";

import {
    FILE_CREATE,
} from "../../permissions/File";

export default {

    Mutation: {
        fileUpload: (_, {file}, {user,rbac}) => {
            console.log("resolver file:",file)
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, FILE_CREATE)) throw new ForbiddenError("Not Authorized")
            return fileUpload(user,file)
        },
    }

}

