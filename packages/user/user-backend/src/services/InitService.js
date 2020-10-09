import winston from "winston";
import {setupDefaultLogger} from "@dracul/logger-backend";
setupDefaultLogger()

import {createRole, findRoleByName, fetchRolesInName, updateRole} from './RoleService'
import {changePasswordAdmin, createUser, findUserByUsername} from './UserService'
import {createPermission, fetchPermissionsInName} from './PermissionService'

import adminRoleTemplate from '../roles/admin'
import supervisorRoleTemplate from '../roles/supervisor'
import operatorRoleTemplate from '../roles/operator'

import {rootUser} from '../data/root-user'
import {supervisorUser} from '../data/supervisor-user'
import {operatorUser} from "../data/operator-user"

import {
    SECURITY_DASHBOARD_SHOW,
    SECURITY_ADMIN_MENU,
    SECURITY_GROUP_CREATE,
    SECURITY_GROUP_DELETE,
    SECURITY_GROUP_EDIT,
    SECURITY_GROUP_SHOW,
    SECURITY_ROLE_CREATE,
    SECURITY_ROLE_EDIT,
    SECURITY_ROLE_SHOW,
    SECURITY_ROLE_DELETE,
    SECURITY_USER_CREATE,
    SECURITY_USER_DELETE,
    SECURITY_USER_EDIT,
    SECURITY_USER_SHOW,
} from "../permissions";

const initPermissions = async (permissions) => {
    if (!permissions) {
        permissions = [SECURITY_USER_CREATE, SECURITY_USER_EDIT, SECURITY_USER_DELETE, SECURITY_USER_SHOW,
            SECURITY_GROUP_CREATE, SECURITY_GROUP_EDIT, SECURITY_GROUP_DELETE, SECURITY_GROUP_SHOW,
            SECURITY_ROLE_CREATE, SECURITY_ROLE_SHOW, SECURITY_ROLE_EDIT, SECURITY_ROLE_DELETE,
            SECURITY_DASHBOARD_SHOW, SECURITY_ADMIN_MENU]
    }
    //Fetch permissions already created
    let permissionsFound = await fetchPermissionsInName(permissions)
    //Filter permissions created (avoid duplicate)
    let permissionToCreate
    if (permissionsFound) {
        permissionToCreate = permissions.filter(p => !permissionsFound.some(f => f.name == p))
    } else {
        permissionToCreate = permissions
    }

    //permissions Found
    winston.debug("Permissions found: " + permissionsFound.map(p => p.name).toString())

    // Exec All Create Promises
    let permissionsCreated = await Promise.all(permissionToCreate.map(name => createPermission(name)))

    winston.info("Permissions created: " + permissionsCreated.map(p => p.name).toString())

}

function loggingEvent(event, entity, name, id) {

    let message = entity + " " + event + ": {name: " + name + ", id: " + id + "}"

    switch (event) {
        case "created":
            winston.info(message)
            break
        case "updated":
        case "found":
            winston.debug(message)
            break
        default:
            winston.debug(message)
    }
}

const initAdminRole = async () => {
    let adminRoleT = await adminRoleTemplate()
    let adminRole = await findRoleByName(adminRoleT.name)
    if (adminRole) {

        let adminRoleUpdated = await updateRole(adminRole.id, {
            name: adminRoleT.name,
            permissions: adminRoleT.permissions
        })
        loggingEvent("updated", "role", adminRoleUpdated.name, adminRoleUpdated.id)
    } else {
        adminRole = await createRole(adminRoleT)
        loggingEvent("created", "role", adminRole.name, adminRole.id)
    }
}

const initSupervisorRole = async () => {
    let supervisorRoleT = await supervisorRoleTemplate()
    let supervisorRole = await findRoleByName(supervisorRoleT.name)
    if (supervisorRole) {

        let supervisorRoleUpdated = await updateRole(
            supervisorRole.id,
            {
                name: supervisorRoleT.name,
                childRoles: supervisorRoleT.childRoles,
                permissions: supervisorRoleT.permissions
            })
        loggingEvent("updated", "role", supervisorRoleUpdated.name, supervisorRoleUpdated.id)
    } else {
        supervisorRole = await createRole(supervisorRoleT)
        loggingEvent("created", "role", supervisorRole.name, supervisorRole.id)
    }
}


const initOperatorRole = async () => {
    let operatorRoleT = await operatorRoleTemplate()
    let operatorRole = await findRoleByName(operatorRoleT.name)
    if (operatorRole) {

        let operatorRoleUpdated = await updateRole(operatorRole.id,
            {
                name: operatorRoleT.name,
                permissions: operatorRoleT.permissions
            })

        loggingEvent("updated", "role", operatorRoleUpdated.name, operatorRoleUpdated.id)
    } else {
        operatorRole = await createRole(operatorRoleT)
        loggingEvent("created", "role", operatorRole.name, operatorRole.id)
    }
}

const initRoles = async (roles) => {
    if (!roles) {
        roles = [operatorRoleTemplate()]
    }

    let rolesName = roles.map(r => r.name)

    //Fetch roles already created
    let rolesFound = await fetchRolesInName(rolesName)

    //Filter roles created (avoid duplicate)
    let rolesToCreate
    if (rolesFound) {
        rolesToCreate = roles.filter(r => !rolesFound.some(f => f.name == r.name))
    } else {
        rolesToCreate = roles
    }

    // Exec All Create Promises
    let rolesCreated = await Promise.all(rolesToCreate.map(role => createRole(role)))
    rolesCreated.forEach(r => {
        loggingEvent("created", "role", r.name, r.id)
    })

    //Update Roles
    let rolesUpdated = await Promise.all(rolesFound.map(roleToUpdate => {
        let p = roles.find(r => r.name === roleToUpdate.name).permissions
        return updateRole(roleToUpdate.id, {name: roleToUpdate.name, permissions: p})
    }))
    rolesUpdated.forEach(r => {
        loggingEvent("updated", "role", r.name, r.id)
    })

    return {rolesCreated: rolesCreated, rolesUpdated: rolesUpdated}
}

const initRootUser = async (user) => {
    if (!user) {
        user = rootUser
    }

    let roleAdmin = await findRoleByName("admin")

    if (!roleAdmin) {
        throw Error('Root user cant be created. Role "admin" not found. ')
    }

    let u = await findUserByUsername(user.username)

    if (!u) {
        u = await createUser({...user, role: roleAdmin.id})
        loggingEvent("created", "user",u.username, u.id)
    } else {
        loggingEvent("found", "user",u.username, u.id)
    }

}

const initSupervisorUser = async (user) => {
    if (!user) {
        user = supervisorUser
    }

    let roleSupervisor = await findRoleByName("supervisor")

    if (!roleSupervisor) {
        throw Error('Supervisor user cant be created. Role "supervisor" not found. ')
    }

    let u = await findUserByUsername(user.username)

    if (!u) {
        u = await createUser({...user, role: roleSupervisor.id})
        loggingEvent("created", "user",u.username, u.id)
    } else {
        loggingEvent("found", "user",u.username, u.id)
    }

}

const initOperatorUser = async (user) => {
    if (!user) {
        user = operatorUser
    }

    let roleOperator = await findRoleByName("operator")

    if (!roleOperator) {
        throw Error('Operator user cant be created. Role "supervisor" not found. ')
    }

    let u = await findUserByUsername(user.username)

    if (!u) {
        u = await createUser({...user, role: roleOperator.id})
        loggingEvent("created", "user",u.username, u.id)
    } else {
        winston.debug("User Operator found: ", u.id)
        loggingEvent("found", "user",u.username, u.id)
    }

}

const rootRecover = async (password = "root.123") => {
    findUserByUsername("root").then(rootUser => {
        changePasswordAdmin(rootUser.id, {
            password: password,
            passwordVerify: password
        }, rootUser.id).then(result => {
            winston.info(result)
        }).catch(e => winston.error("rootRecover ",e))
    })
}


export {
    initPermissions,
    initAdminRole,
    initOperatorRole,
    initSupervisorRole,
    initRoles,
    initRootUser,
    initSupervisorUser,
    initOperatorUser,
    rootRecover
}