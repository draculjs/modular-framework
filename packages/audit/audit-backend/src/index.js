import { types, resolvers } from "../graphql/"
import * as permissions from "../permissions/AuditPermissions"
import AuditModel from "../models/AuditModel"
import { createAudit, updateAudit, fetchAudit, deleteAudit } from "../services/AuditService.js"

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
