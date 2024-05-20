import {DefaultLogger as winston} from '@dracul/logger-backend';
import Session from "../models/SessionModel";
import dayjs from "dayjs";
import DeviceDetector from 'node-device-detector'
import geoLookup from "./utils/geoLookup";
import getMatchIpv4 from "./utils/getMatchIpv4";

const detector = new DeviceDetector;


export const createSession = async function (user, req) {
    return new Promise(((resolve, reject) => {

        //Init values
        let userAgent = 'NoAgent'
        let result = {os: {}, client: {}, device: {}}
        let ip = '127.0.0.1'
        let geo = {}

        if (req && req.headers && req.headers['user-agent']) {
            userAgent = req.headers['user-agent']
            result = detector.detect(userAgent);
        }

        if (req && req.headers && (req.headers['x-forwarded-for'] || req.connection.remoteAddress)) {
            ip = getMatchIpv4((req.headers['x-forwarded-for'] || req.connection.remoteAddress))
            geo = geoLookup(ip);
        }


        const newSession = new Session({
            user: user._id,
            username: user.username,
            agent: userAgent,
            ip: ip,
            os: result.os,
            client: result.client,
            device: result.device,
            geo: geo
        })

        newSession.id = newSession._id

        newSession.save().then(() => {
            resolve(newSession)
        }).catch(err => {
            winston.error('SessionService.createSession ', err)
            reject(err)
        })

    }))

}

//TODO improve: Think in performance and high demand
export const updateSession = async function (user) {
    if (user != undefined && user.idSession != undefined) {
        Session.findOne({_id: user.idSession}).then(doc => {
            if (doc) {
                let now = dayjs()
                doc.until = now
                doc.duration = now.diff(doc.since, 'seconds')
                doc.request++
                doc.save()
            }
        }).catch(err => {
            winston.error('SessionService.updateSession ', err)
        })
    }

}

function getFromDate(time, unit) {
    let now = dayjs()
    let from = now.subtract(time, unit)
    return from.toDate();
}


export const sessionsByUser = async function (time, unit = 'days') {

    try {
        const r = await Session.aggregate(
            [
                {$match: {since: {$gte: getFromDate(time, unit)}}},
                {
                    $group: {
                        _id: "$username",
                        username: {$last: "$username"},
                        sessionCount: {$sum: 1},
                        durationMin: {$min: "$duration"},
                        durationMax: {$max: "$duration"},
                        durationAvg: {$avg: "$duration"},
                        durationSum: {$sum: "$duration"},
                        durationLast: {$last: "$duration"},
                        requestSum: {$sum: "$request"},
                        requestAvg: {$avg: "$request"},
                    }
                }
            ]).exec()

        return r
    } catch (e) {
        winston.error('SessionService.sessionsByUser ', e)
        throw e
    }

}


export const sessionsByCountry = async function (time, unit = 'days') {

    try {
        const r = await Session.aggregate(
            [
                {$match: {since: {$gte: getFromDate(time, unit)}}},
                {
                    $group: {
                        _id: "$geo.country",
                        country: {$last: "$geo.country"},
                        sum: {$sum: 1},
                    }
                }
            ]).exec()

        return r
    } catch (e) {
        winston.error('SessionService.sessionsByCountry ', e)
        throw e
    }

}

export const sessionsByOs = async function (time, unit = 'days') {

    try {
        const r = await Session.aggregate(
            [
                {$match: {since: {$gte: getFromDate(time, unit)}}},
                {
                    $group: {
                        _id: "$os.name",
                        osname: {$last: "$os.name"},
                        sum: {$sum: 1},
                    }
                }
            ]).exec()

        return r
    } catch (e) {
        winston.error('SessionService.sessionsByOs ', e)
        throw e
    }


}

export const sessionsByDeviceType = async function (time, unit = 'days') {

    try {
        const r = await Session.aggregate(
            [
                {$match: {since: {$gte: getFromDate(time, unit)}}},
                {
                    $group: {
                        _id: "$device.type",
                        devicetype: {$last: "$device.type"},
                        sum: {$sum: 1},
                    }
                }
            ]).exec()

        return r
    } catch (e) {
        winston.error('SessionService.sessionsByDeviceType ', e)
        throw e
    }

}


export const sessionsByCity = async function (time, unit = 'days') {

    try {
        const r = await Session.aggregate(
            [
                {$match: {since: {$gte: getFromDate(time, unit)}}},
                {
                    $group: {
                        _id: "$geo.city",
                        city: {$last: "$geo.city"},
                        sum: {$sum: 1},
                    }
                }
            ]).exec()

        return r
    } catch (e) {
        winston.error('SessionService.sessionsByCity ', e)
        throw e
    }



}


export const sessionsByClient = async function (time, unit = 'days') {

    try {
        const r = await Session.aggregate(
            [
                {$match: {since: {$gte: getFromDate(time, unit)}}},
                {
                    $group: {
                        _id: "$client.name",
                        clientname: {$last: "$client.name"},
                        sum: {$sum: 1},
                    }
                }
            ]).exec()

        return r
    } catch (e) {
        winston.error('SessionService.sessionsByClient ', e)
        throw e
    }

}
