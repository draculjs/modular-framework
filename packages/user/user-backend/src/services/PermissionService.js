import PermissionModel from '../models/PermissionModel.js'
import {UserInputError} from 'apollo-server-errors'
import {DefaultLogger as winston} from "@dracul/logger-backend";

// Función auxiliar para verificar si un nombre de permiso ya existe
async function permissionNameExists(name, excludeId = null) {
    try {
        const query = { name };
        if (excludeId) {
            query._id = { $ne: excludeId };
        }
        const count = await PermissionModel.countDocuments(query);
        return count > 0;
    } catch (error) {
        winston(`An error happened at permissionNameExists: ${error}`)
        throw error;
    }
}

export const fetchPermissions = async function () {
    try {
        return await PermissionModel.find({}).exec()
    } catch (e) {
        winston.error("PermissionService.fetchPermissions ", e)
        throw(e)
    }
}

export const fetchPermissionsInName = async function (permissions) {
    try {
        return await PermissionModel.find({name: {$in: permissions}}).exec()
    } catch (e) {
        winston.error("PermissionService.fetchPermissionsInName ", e)
        throw(e)
    }
}

export const findPermission = async function (id) {
    try {
        return await PermissionModel.findOne({_id: id}).exec()
    } catch (e) {
        winston.error("PermissionService.findPermission ", e)
        throw(e)
    }
}

export const findPermissionByName = async function (name) {
    try {
        return await PermissionModel.findOne({name: name}).exec()
    } catch (e) {
        winston.error("PermissionService.findPermission ", e)
        throw(e)
    }
}

export const createPermission = async function (name) {
    try {
        // Verificar si el nombre ya existe
        const nameExists = await permissionNameExists(name);
        if (nameExists) {
            throw new UserInputError('Permission name must be unique', {
                inputErrors: { name: 'Permission name must be unique' }
            });
        }

        const newPermission = new PermissionModel({name})
        newPermission.id = newPermission._id;

        await newPermission.save()
        return newPermission
    } catch (e) {
        if (e.code === 11000) {
            throw new UserInputError('Permission name must be unique', {
                inputErrors: { name: 'Permission name must be unique' }
            });
        }
        winston.error("PermissionService.createPermission ", e)
        throw(e)
    }
}

export const updatePermission = async function (id, name) {
    try {
        // Verificar si el nuevo nombre ya existe
        const nameExists = await permissionNameExists(name, id);
        if (nameExists) {
            throw new UserInputError('Permission name must be unique', {
                inputErrors: { name: 'Permission name must be unique' }
            });
        }

        const updatedPermission = await PermissionModel.findOneAndUpdate(
            {_id: id},
            {name},
            {new: true, runValidators: true, context: 'query'}
        ).exec()
        
        return updatedPermission
    } catch (error) {
        if (error.code === 11000) {
            throw new UserInputError('Permission name must be unique', {
                inputErrors: { name: 'Permission name must be unique' }
            });
        }
        if (error.name == "ValidationError") {
            winston.warn("PermissionService.updatePermission.ValidationError ", error)
            throw(new UserInputError(error.message, {inputErrors: error.errors}));
        }
        winston.error("PermissionService.updatePermission ", error)
        throw(error)
    }
}

export const deletePermission = async function (id) {
    try {
        const doc = await findPermission(id);
        await doc.softdelete();
        return {id: id, success: true};
    } catch (err) {
        winston.error("PermissionService.deletePermission ", err);
        throw err;
    }
}