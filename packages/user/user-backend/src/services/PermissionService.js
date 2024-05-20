import PermissionModel from '../models/PermissionModel'
import {UserInputError} from 'apollo-server-errors'
import {DefaultLogger as winston} from "@dracul/logger-backend";

export const fetchPermissions = async function () {

    try {
        return await PermissionModel.find({}).exec()
    } catch (e) {
        winston.error("PermissionService.fetchPermissions ", e)
        reject(e)
    }
}

export const fetchPermissionsInName = async function (permissions) {
    try {
        return await PermissionModel.find({name: {$in: permissions}}).exec()
    } catch (e) {
        winston.error("PermissionService.fetchPermissionsInName ", e)
        reject(e)
    }

}

export const findPermission = async function (id) {

    try {
        return await PermissionModel.findOne({_id: id}).exec()
    } catch (e) {
        winston.error("PermissionService.findPermission ", e)
        reject(e)
    }
}

export const findPermissionByName = async function (name) {

    try {
        return await PermissionModel.findOne({name: name}).exec()
    } catch (e) {
        winston.error("PermissionService.findPermission ", e)
        reject(e)
    }
}

export const createPermission = async function (name) {
    const newPermission = new PermissionModel({name})
    newPermission.id = newPermission._id;

    try {
        await newPermission.save()
        return newPermission
    } catch (e) {
        winston.error("PermissionService.createPermission ", e)
        reject(e)
    }
}


export const updatePermission = async function (id, name) {

    try {
        const r = PermissionModel.findOneAndUpdate(
            {_id: id},
            {name, permissions},
            {new: true, runValidators: true, context: 'query'})
            .exec()
        return r
    } catch (error) {
        if (error.name == "ValidationError") {
            winston.warn("PermissionService.updatePermission.ValidationError ", err)
            rejects(new UserInputError(error.message, {inputErrors: error.errors}));
        }
        winston.error("PermissionService.updatePermission ", err)
        reject(error)
    }

}

export const deletePermission = function (id) {

    return new Promise((resolve, reject) => {
        findPermission(id).then((doc) => {
            doc.softdelete(
                function (err) {

                    if (err) {
                        winston.error("PermissionService.deletePermission ", err)
                        reject(err)
                    }

                    resolve({id: id, success: true})

                }
            )
        })
    })
}
