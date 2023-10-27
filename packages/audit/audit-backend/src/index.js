import { types, resolvers } from "./graphql/index.js"
import * as permissions from "./permissions/AuditPermissions.js"
import AuditModel from "./models/AuditModel.js"
import { createAudit, fetchAudit, paginateAudit} from "./services/AuditService.js"

export {
    //Services
    createAudit,
    fetchAudit,
    paginateAudit,
    //Types and resolvers
    types,
    resolvers,
    //Permissions
    permissions,
    //Model
    AuditModel,
}
