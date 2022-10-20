import { types, resolvers } from "./graphql/index.js"
import * as permissions from "./permissions/AuditPermissions.js"
import AuditModel from "./models/AuditModel.js"
import { createAudit, updateAudit, fetchAudit, deleteAudit } from "./services/AuditService.js"

export {
    //Services
    createAudit,
    updateAudit,
    fetchAudit,
    deleteAudit,
    //Types and resolvers
    types,
    resolvers,
    //Permissions
    permissions,
    //Model
    AuditModel,
}
