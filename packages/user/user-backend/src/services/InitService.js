import {createRole, findRoleByName, fetchRolesInName, updateRole} from './RoleService'
import {changeRecoveryPassword, createUser, findUserByUsername} from './UserService'
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
    permissionsFound.forEach(p => {
        console.log("Permission Found: " + p.name + " " + p.id)
    })

    // Exec All Create Promises
    let permissionsCreated = await Promise.all(permissionToCreate.map(name => createPermission(name)))
    permissionsCreated.forEach(p => {
        console.log("Permissions Created: " + p.name + " " + p.id)
    })
}

const initAdminRole = async () => {
    let adminRoleT = await adminRoleTemplate()
    let adminRole = await findRoleByName(adminRoleT.name)
    if (adminRole) {

        let adminRoleUpdated = await updateRole(adminRole.id, {
            name: adminRoleT.name,
            permissions: adminRoleT.permissions
        })

        console.log("Admin Role Updated: " + adminRoleUpdated.name + " " + adminRoleUpdated.id)
    } else {
        adminRole = await createRole(adminRoleT)
        console.log("Admin Role Created: " + adminRole.name + " " + adminRole.id)
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

        console.log("Supervisor Role Updated: " + supervisorRoleUpdated.name + " " + supervisorRoleUpdated.id)
    } else {
        supervisorRole = await createRole(supervisorRoleT)
        console.log("Supervisor Role Created: " + supervisorRole.name + " " + supervisorRole.id)
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

        console.log("Operator Role Updated: " + operatorRoleUpdated.name + " " + operatorRoleUpdated.id)
    } else {
        operatorRole = await createRole(operatorRoleT)
        console.log("Operator Role Created: " + operatorRole.name + " " + operatorRole.id)
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
        console.log("Role Created: " + r.name + " " + r.id)
    })

    //Update Roles
    let rolesUpdated = await Promise.all(rolesFound.map(roleToUpdate => {
        let p = roles.find(r => r.name === roleToUpdate.name).permissions
        return updateRole(roleToUpdate.id, {name: roleToUpdate.name, permissions: p})
    }))
    rolesUpdated.forEach(r => {
        console.log("Role Updated: " + r.name + " " + r.id)
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
        console.log("User root created: ", u.id)
    } else {
        console.log("User root found: ", u.id)
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
        console.log("User supervisor created: ", u.id)
    } else {
        console.log("User supervisor found: ", u.id)
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
        console.log("User Operator created: ", u.id)
    } else {
        console.log("User Operator found: ", u.id)
    }

}

const rootRecover = async (password = "root.123") => {
    findUserByUsername("root").then(rootUser => {
        changeRecoveryPassword(rootUser.id, {
            newPassword: password,
        }, rootUser).then(result => {
            console.log(result)
        })
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