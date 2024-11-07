import {DefaultLogger as winston} from '@dracul/logger-backend';
import RoleModel from '../models/RoleModel'
import {UserInputError} from 'apollo-server-errors'
import { CustomApolloError } from '@dracul/common-backend';


export const fetchRolesInName = async function (roleNames) {
    try {
        const role = await RoleModel.find({
            name: { $in: roleNames.map(name => new RegExp(`^${name}$`, 'i')) }
        }).exec()
        return role
    } catch (e) {
        winston.error("RoleService.fetchRolesInName ", e);
        throw e
    }
}



export const findRoles = async function (roles = []) {

    try {
        let qs = {}

        if (roles && roles.length) {
            qs._id = {$in: roles}
        }

        const rolesDoc = await RoleModel.find(qs).isDeleted(false).exec()
        return rolesDoc
    } catch (e) {
        winston.error("RoleService.findRoles ", e)
        throw e
    }


}

export const findRole = async function (id) {
    try {
        const role = await RoleModel.findOne({_id: id}).exec()
        return role
    } catch (e) {
        winston.error("RoleService.findRole ", e)
        throw e
    }
}

export const findRoleByName = async function (roleName) {

    try {
        const role = await RoleModel.findOne({name: roleName}).exec()
        return role
    } catch (e) {
        winston.error("RoleService.findRoleByName ", e)
        throw e
    }
}

export const findRoleByNames = async function (roleNames) {
    try {
        const roles = await RoleModel.find({name: {$in: roleNames}}).exec()
        return roles
    } catch (e) {
        winston.error("RoleService.findRoleByName ", e)
        throw e
    }
}


export const deleteRole = async function (id) {
    try{
        const role = await findRole(id)
        await role.softdelete()
        return {id: id, success: true}
    }catch (e) {
        winston.error("RoleService.deleteRole ", e)
        throw e
    }
}

export const roleAlreadyExists = async function (roleName) {
    try {
        return await RoleModel.exists({ name: { '$regex': roleName, $options: 'i' } })
    } catch (e) {
        winston.error("RoleService.findRoleByName ", e)
        throw e
    }
}

export const createRole = async function ({name, childRoles, permissions, readonly}) {
    try {
        winston.info(`roleAlreadyExists name: "${name}"`)
        const roleAlreadyExistsWithThatName = await roleAlreadyExists(name)
        winston.info(`roleAlreadyExists: "${roleAlreadyExistsWithThatName}"`)
        if(roleAlreadyExistsWithThatName){
            throw new CustomApolloError('roleNameAlreadyTaken')
        }

        const newRole = new RoleModel({
            name,
            childRoles,
            permissions,
            readonly
        })
        newRole.id = newRole._id;
        await newRole.save()
        return newRole
    } catch (error) {
        if (error.name == "ValidationError") {
            winston.warn("RoleService.createRole.ValidationError ", error)
            throw new UserInputError(error.message, {inputErrors: error.errors});
        }
        winston.error("RoleService.createRole ", error)
        throw error
    }

}


export const updateRole = async function (id, {name, childRoles, permissions = [], readonly}) {
    try {
        const role = await  RoleModel.findOneAndUpdate(
            {
                _id: id
            },
            {   
                name, childRoles, permissions, readonly
            },
            {   
                new: true, runValidators: true, context: 'query'
            }
        ).exec()

        return role
    } catch (error) {
        if (error.name == "ValidationError") {
            winston.warn("RoleService.updateRole.ValidationError ", error)
            throw new UserInputError(error.message, {inputErrors: error.errors})
        }
        
        winston.error("RoleService.updateRole ", error)
        throw error
    }
}