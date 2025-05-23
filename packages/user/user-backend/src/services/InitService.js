import { DefaultLogger } from "@dracul/logger-backend";

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
    SECURITY_ROLE_SHOW_CHILD,
    SECURITY_ROLE_DELETE,
    SECURITY_USER_CREATE,
    SECURITY_USER_DELETE,
    SECURITY_USER_EDIT,
    SECURITY_USER_SHOW,
} from "../permissions";

import {LDAP_SETTINGS} from "../data/ldap-settings";

import {initializeSettings} from "@dracul/settings-backend";

export const nonPrivilegedRolesReadOnly = false

const initPermissions = async (permissions) => {
    if (!permissions) {
        permissions = [SECURITY_USER_CREATE, SECURITY_USER_EDIT, SECURITY_USER_DELETE, SECURITY_USER_SHOW,
            SECURITY_GROUP_CREATE, SECURITY_GROUP_EDIT, SECURITY_GROUP_DELETE, SECURITY_GROUP_SHOW,
            SECURITY_ROLE_CREATE, SECURITY_ROLE_SHOW, SECURITY_ROLE_SHOW_CHILD, SECURITY_ROLE_EDIT, SECURITY_ROLE_DELETE,
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
    if (permissionsFound.length > 0) {
        DefaultLogger.debug("Permissions found: " + permissionsFound.map(p => p.name).toString())
    }

    // Exec All Create Promises
    let permissionsCreated = await Promise.all(permissionToCreate.map(name => createPermission(name)))

    if (permissionsCreated.length > 0) {
        DefaultLogger.info("Permissions created: " + permissionsCreated.map(p => p.name).toString())
    }

}

function loggingEvent(event, entity, name, id) {

    let message = entity + " " + event + ": < name=" + name + " id=" + id + " >"

    switch (event) {
        case "created":
            DefaultLogger.info(message)
            break
        case "updated":
        case "found":
            DefaultLogger.debug(message)
            break
        default:
            DefaultLogger.debug(message)
    }
}

const initAdminRole = async () => {
    let adminRoleT = await adminRoleTemplate()
    let adminRole = await findRoleByName(adminRoleT.name)
    if (adminRole) {

        let adminRoleUpdated = await updateRole(adminRole.id, {
            name: adminRoleT.name,
            permissions: adminRoleT.permissions,
            readonly: true
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

    if(!supervisorRole){
        supervisorRole = await createRole(supervisorRoleT)
        loggingEvent("created", "role", supervisorRole.name, supervisorRole.id)
    }

    if (supervisorRole && supervisorRole.readonly) {
        let supervisorRoleUpdated = await updateRole(
            supervisorRole.id,
            {
                name: supervisorRoleT.name,
                childRoles: supervisorRoleT.childRoles,
                permissions: supervisorRoleT.permissions,

                readonly: nonPrivilegedRolesReadOnly

            })

        loggingEvent("updated", "role", supervisorRoleUpdated.name, supervisorRoleUpdated.id)
    }
}



const initOperatorRole = async () => {
    const operatorRoleT = operatorRoleTemplate()
    let operatorRole = await findRoleByName(operatorRoleT.name)

    if (!operatorRole) {
        operatorRole = await createRole(operatorRoleT)
        loggingEvent("created", "role", operatorRole.name, operatorRole.id)
    }

    if (operatorRole && operatorRole.readonly) {

        let operatorRoleUpdated = await updateRole(operatorRole.id,
            {
                name: operatorRoleT.name,
                permissions: operatorRoleT.permissions,

                readonly: nonPrivilegedRolesReadOnly

            })

        loggingEvent("updated", "role", operatorRoleUpdated.name, operatorRoleUpdated.id)
    }
}

const initRoles = async (roles) => {
    if (!roles) {
        roles = [operatorRoleTemplate()]
    }

    let rolesName = roles.map(r => r.name)

    //Fetch roles already created
    let rolesAlreadyPersistedFound = await fetchRolesInName(rolesName)

    //Filter roles created (avoid duplicate)
    let rolesToCreate
    if (rolesAlreadyPersistedFound) {
        rolesToCreate = roles.filter(
            (newRole) => {
                const existingRoleNames = rolesAlreadyPersistedFound.map(existingRole => existingRole.name.toLowerCase())
                const roleIsNotDuplicated = !existingRoleNames.includes(newRole.name.toLowerCase())

                return roleIsNotDuplicated
            }
        )

        DefaultLogger.info(`rolesToCreate: '${JSON.stringify(rolesToCreate, null, 2)}'`)
    } else {
        rolesToCreate = roles
    }


    const rolesCreated = await rolesToCreate.reduce(async (memo, role) => {
        const results = await memo;
        console.log(`Creating ${role.name}`)
        let childRoles = []
        if (role.childRoles && role.childRoles.length > 0) {
            for (const childRoleName of role.childRoles) {
                let cr = await findRoleByName(childRoleName)
                if (cr) {
                    childRoles.push(cr.id)
                }
            }
            role.childRoles = childRoles
        }
        role = await createRole(role)
        console.log(`Created ${role.name}`)
        return [...results, role];
    }, []);


    rolesCreated.forEach(r => {
        loggingEvent("created", "role", r.name, r.id)
    })

    //Update Roles
    const updatedRoles = []

    for (let index = 0; index < rolesAlreadyPersistedFound.length; index++) {
        const roleAlreadyPersisted = rolesAlreadyPersistedFound[index]
        if (!roleAlreadyPersisted.readonly) continue

        const roleAlreadyPersistedNewConfiguration = roles.find((newRoleConfiguration) => newRoleConfiguration.name.toLowerCase() === roleAlreadyPersisted.name.toLowerCase())

        function getRolePermissions(){
            if (roleAlreadyPersistedNewConfiguration.readonly) {
                return roleAlreadyPersistedNewConfiguration.permissions
            }else{
                return roleAlreadyPersistedNewConfiguration.permissions.concat(roleAlreadyPersisted.permissions)
            }
        }

        const rolePermissions = getRolePermissions()
        const roleChildRoles = roleAlreadyPersistedNewConfiguration.childRoles

        const childRoles = []

        if (roleChildRoles && roleChildRoles.length > 0) {
            for (const childRoleName of roleChildRoles) {
                const cr = await findRoleByName(childRoleName)

                if (cr) childRoles.push(cr.id)
            }
        }

        await updateRole(roleAlreadyPersisted.id, {
            name: roleAlreadyPersisted.name,
            permissions: rolePermissions,
            childRoles: childRoles,
            readonly: roleAlreadyPersistedNewConfiguration.readonly,
        })


        updatedRoles.push(roleAlreadyPersisted)
        DefaultLogger.info(`Updated ${roleAlreadyPersisted.name}`)
    }


    if(updatedRoles && updatedRoles.length){
        updatedRoles.forEach(r => {
            loggingEvent("updated", "role", r.name, r.id)
        })
    }

    return {rolesCreated: rolesCreated, rolesUpdated: updatedRoles}
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
        loggingEvent("created", "user", u.username, u.id)
    } else {
        loggingEvent("found", "user", u.username, u.id)
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
        loggingEvent("created", "user", u.username, u.id)
    } else {
        loggingEvent("found", "user", u.username, u.id)
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
        loggingEvent("created", "user", u.username, u.id)
    } else {
        loggingEvent("found", "user", u.username, u.id)
    }

}

const rootRecover = async (password = "root.123") => {
    findUserByUsername("root").then(rootUser => {
        changePasswordAdmin(rootUser.id, {
            password: password,
            passwordVerify: password
        }, rootUser.id).then(result => {
            DefaultLogger.info(result)
        }).catch(e => DefaultLogger.error("rootRecover ", e))
    })
}


const initLdapSettings = async () => {

    const settings = await initializeSettings(LDAP_SETTINGS)
    return settings
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
    rootRecover,
    initLdapSettings
}
