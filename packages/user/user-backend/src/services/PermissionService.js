import PermissionModel from '../models/PermissionModel'
import {UserInputError} from 'apollo-server-express'

export const fetchPermissions = function () {
    return new Promise((resolve, reject) => {
        PermissionModel.find({}).exec((err, res) => (
            err ? reject(err) : resolve(res)
        ));
    })
}

export const fetchPermissionsInName = function (permissions) {
    return new Promise((resolve, reject) => {
        PermissionModel.find({name: {$in: permissions }}).exec((err, res) => (
            err ? reject(err) : resolve(res)
        ));
    })
}

export const findPermission = function (id) {
    return new Promise((resolve, reject) => {
        PermissionModel.findOne({ _id: id }).exec((err, res) => (
            err ? reject(err) : resolve(res)
        ));
    })
}

export const findPermissionByName = function (name) {
    return new Promise((resolve, reject) => {
        PermissionModel.findOne({ name: name }).exec((err, res) => (
            err ? reject(err) : resolve(res)
        ));
    })
}

export const createPermission = function (name) {
    const newPermission = new PermissionModel({
        name
    })
    newPermission.id = newPermission._id;
    return new Promise((resolve, rejects) => {
        newPermission.save((error => {
            error ? rejects(error) : resolve(newPermission)
        }))
    })
}



export const updatePermission = async function (id, name) {
    return new Promise((resolve, rejects) => {
        PermissionModel.findOneAndUpdate({ _id: id },
            { name, permissions },
            { new: true, runValidators: true, context: 'query' },
            (error, doc) => {
                if (error) {
                    if (error.name == "ValidationError") {
                        rejects(new UserInputError(error.message, { inputErrors: error.errors }));
                    }
                    rejects(error)
                }
                resolve(doc)
            })
    })
}

export const deletePermission = function (id) {
    return new Promise((resolve, rejects) => {
        findPermission(id).then((doc) => {
            doc.softdelete(function (err) {
                err ? rejects(err) : resolve({ id: id, success: true })
            });
        })
    })
}