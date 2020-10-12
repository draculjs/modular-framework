import {DefaultLogger as winston} from '@dracul/logger-backend';
import UserAudit from './../models/UserAuditModel'
import {UserInputError} from 'apollo-server-express'
import moment from "moment";

function getFromDate(time, unit) {
    let now = moment()
    let from = now.subtract(time, unit)
    return from.toDate();
}


export const fetchUserAuditsFrom = async function (time = 7, unit = 'days') {
    return new Promise((resolve, reject) => {
        UserAudit.find({date: {$gte: getFromDate(time, unit)}}).sort({date: -1}).populate('actionBy').populate('actionFor').exec((err, res) => {

            if (err) {
                winston.error("UserAuditService.fetchUserAuditsFrom ", err)
                reject(err)
            }
            resolve(res)

        });
    })
}

export const fetchUserAuditsLimit = async function (limit = 10) {
    return new Promise((resolve, reject) => {
        UserAudit.find({}).sort({date: -1}).limit(limit).populate('actionBy').populate('actionFor').exec((err, res) => {

            if (err) {
                winston.error("UserAuditService.fetchUserAuditsLimit ", err)
                reject(err)
            }
            resolve(res)

        });
    })
}


export const findUserAudit = async function (id) {
    return new Promise((resolve, reject) => {
        UserAudit.findOne({_id: id}).exec((err, res) => {

            if (err) {
                winston.error("UserAuditService.findUserAudit ", err)
                reject(err)
            }
            resolve(res)

        });
    })
}


export const createUserAudit = async function (actionBy, actionFor, action) {

    const doc = new UserAudit({
        actionBy, actionFor, action
    })
    doc.id = doc._id;
    return new Promise((resolve, rejects) => {
        doc.save(async error => {

            if (error) {

                if (error.name == "ValidationError") {
                    winston.warn("UserAuditService.createUserAudit.ValidationError ", error)
                    rejects(new UserInputError(error.message, {inputErrors: error.errors}));
                }
                winston.error("UserAuditService.createUserAudit ", error)
                rejects(error)
            }

            resolve(doc)
        })
    })
}


export const deleteUserAudit = function (id) {
    return new Promise((resolve, rejects) => {
        findUserAudit(id).then((doc) => {
            doc.softdelete(function (err) {
                    if (err) {
                        winston.error("UserAuditService.deleteUserAudit ", err)
                        reject(err)
                    }
                    resolve({id: id, deleteSuccess: true})
                })
        })
    })
}

