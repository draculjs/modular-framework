import {DefaultLogger as winston} from '@dracul/logger-backend';
import LoginFail from "../models/LoginFailModel";
import moment from "moment";
import DeviceDetector from 'node-device-detector'
import geoLookup from "./utils/geoLookup";
import getMatchIpv4 from "./utils/getMatchIpv4";

const detector = new DeviceDetector;


export const createLoginFail = async function (username, req) {
    return new Promise(((resolve, reject) => {

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

        const doc = new LoginFail({
            username: username,
            agent: userAgent,
            ip: ip,
            os: result.os,
            client: result.client,
            device: result.device,
            geo: geo
        })

        doc.save().then(() => {
            resolve(doc)
        }).catch(err => {
            winston.error("LoginFailService.createLoginFail ", err)
            reject(err)
        })

    }))

}


export const loginFailByUsername = async function (time = 72, unit = 'hours') {
    return new Promise((resolve, reject) => {
        let now = moment()
        let from = now.subtract(time, unit)
        LoginFail.aggregate(
            [
                {$match: {date: {$gte: from.toDate()}}},
                {$group: {_id: "$username", username: {$last: "$username"}, attempts: {$sum: 1}}}
            ], function (err, result) {

                if(err){
                    winston.error("LoginFailService.loginFailByUsername ", err)
                    reject(err)
                }

                resolve(result)
            })

    })

}
