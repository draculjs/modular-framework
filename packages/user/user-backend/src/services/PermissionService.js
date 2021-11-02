import PermissionModel from '../models/PermissionModel'
import {UserInputError} from 'apollo-server-express'
import {DefaultLogger as winston} from "@dracul/logger-backend";

export const fetchPermissions = function () {
    return new Promise((resolve, reject) => {
        PermissionModel.find({}).exec((err, res) => {

            if(err){
                winston.error("PermissionService.fetchPermissions ", err)
                reject(err)
            }
            resolve(res)

        });
    })
}

export const fetchPermissionsInName = function (permissions) {
    return new Promise((resolve, reject) => {
        PermissionModel.find({name: {$in: permissions }}).exec((err, res) => {

            if(err){
                winston.error("PermissionService.fetchPermissionsInName ", err)
                reject(err)
            }
            resolve(res)

        });
    })
}

export const findPermission = function (id) {
    return new Promise((resolve, reject) => {
        PermissionModel.findOne({ _id: id }).exec((err, res) => {

            if(err){
                winston.error("PermissionService.findPermission ", err)
                reject(err)
            }
            resolve(res)

        });
    })
}

export const findPermissionByName = function (name) {
    return new Promise((resolve, reject) => {
        PermissionModel.findOne({ name: name }).exec((err, res) => {

            if(err){
                winston.error("PermissionService.findPermission ", err)
                reject(err)
            }
            resolve(res)

        });
    })
}

export const createPermission = function (name) {
    const newPermission = new PermissionModel({
        name
    })
    newPermission.id = newPermission._id;
    return new Promise((resolve, reject) => {
        newPermission.save(
            (err) => {

                if(err){
                    winston.error("PermissionService.createPermission ", err)
                    reject(err)
                }
                resolve(newPermission)

            }
        )
    })
}



export const updatePermission = async function (id, name) {
    return new Promise((resolve, reject) => {
        PermissionModel.findOneAndUpdate({ _id: id },
            { name, permissions },
            { new: true, runValidators: true, context: 'query' },
            (error, doc) => {
                if (error) {
                    if (error.name == "ValidationError") {
                        winston.warn("PermissionService.updatePermission.ValidationError ", err)
                        rejects(new UserInputError(error.message, { inputErrors: error.errors }));
                    }
                    winston.error("PermissionService.updatePermission ", err)
                    reject(error)
                }
                resolve(doc)
            })
    })
}

export const deletePermission = function (id) {
    return new Promise((resolve, reject) => {
        findPermission(id).then((doc) => {
            doc.softdelete(
                function (err) {

                    if(err){
                        winston.error("PermissionService.deletePermission ", err)
                        reject(err)
                    }

                    resolve({ id: id, success: true })

                }

            )
        })
    })
}
