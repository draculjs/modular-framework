import {DefaultLogger as winston} from '@dracul/logger-backend';
import UserAudit from './../models/UserAuditModel'
import {UserInputError} from 'apollo-server-errors'
import dayjs from "dayjs";

function getFromDate(time, unit) {
    let now = dayjs()
    let from = now.subtract(time, unit)
    return from.toDate();
}


export const fetchUserAuditsFrom = async function (time = 7, unit = 'days') {
    try {
        const r = UserAudit.find({date: {$gte: getFromDate(time, unit)}}).sort({date: -1}).populate('actionBy').populate('actionFor').exec()
        return r
    } catch (error) {
        winston.error("UserAuditService.fetchUserAuditsFrom ", error)
        reject(error)
    }

}

export const fetchUserAuditsLimit = async function (limit = 10) {

    try {
        const r = UserAudit.find({}).sort({date: -1}).limit(limit).populate('actionBy').populate('actionFor').exec()
        return r
    } catch (error) {
        winston.error("UserAuditService.fetchUserAuditsLimit ", error)
        reject(error)
    }

}


export const findUserAudit = async function (id) {
    try {
        const r = UserAudit.findOne({_id: id}).exec()
        return r
    } catch (error) {
        winston.error("UserAuditService.findUserAudit", error)
        reject(error)
    }
}


export const createUserAudit = async function (actionBy, actionFor, action) {

    const doc = new UserAudit({
        actionBy, actionFor, action
    })
    doc.id = doc._id;

    try {
        await doc.save()
        return doc
    } catch (error) {
        if (error.name == "ValidationError") {
            winston.warn("UserAuditService.createUserAudit.ValidationError ", error)
            rejects(new UserInputError(error.message, {inputErrors: error.errors}));
        }
        winston.error("UserAuditService.createUserAudit ", error)
        rejects(error)
    }

}


export const deleteUserAudit = function (id) {
    return new Promise((resolve, rejects) => {
        findUserAudit(id).then((doc) => {
            doc.softdelete( (err)=>  {
                if (err) {
                    winston.error("UserAuditService.deleteUserAudit ", err)
                    rejects(err)
                }
                resolve({id: id, deleteSuccess: true})
            })
        })
    })
}

