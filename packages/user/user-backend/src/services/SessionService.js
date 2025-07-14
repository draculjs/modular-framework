import {DefaultLogger as winston} from '@dracul/logger-backend';
import dayjs from "dayjs";
import getMatchIpv4 from "./utils/getMatchIpv4.js";
import Session from "../models/SessionModel.js";
import DeviceDetector from 'node-device-detector';

const detector = new DeviceDetector();

export const createSession = async function (user, req) {
    try {
        let userAgent = 'NoAgent';
        let result = {os: {}, client: {}, device: {}};
        let ip = '127.0.0.1';
        let geo = {};

        if (req?.headers?.['user-agent']) {
            userAgent = req.headers['user-agent'];
            result = detector.detect(userAgent);
        }

        if (req?.headers?.['x-forwarded-for'] || req?.connection?.remoteAddress) {
            const ipSource = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            ip = getMatchIpv4(ipSource);
            geo = {country: 'AR', region: 'Local', city: 'Local', timezone: ''};
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
        });

        newSession.id = newSession._id;
        await newSession.save();
        return newSession;
    } catch (err) {
        winston.error('SessionService.createSession ', err);
        throw err;
    }
}

export const updateSession = async function (user) {
    if (!user?.idSession) return;
    
    try {
        const session = await Session.findById(user.idSession);
        if (!session) return;

        const now = dayjs();
        session.until = now;
        session.duration = now.diff(session.since, 'seconds');
        session.request++;
        await session.save();
    } catch (err) {
        winston.error('SessionService.updateSession ', err);
    }
}

function getFromDate(time, unit) {
    return dayjs().subtract(time, unit).toDate();
}

// Función auxiliar para ejecutar agregaciones
async function executeAggregation(pipeline) {
    try {
        return await Session.aggregate(pipeline);
    } catch (e) {
        winston.error(e);
        throw e;
    }
}

export const sessionsByUser = async function (time, unit = 'days') {
    const pipeline = [
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
    ];
    return executeAggregation(pipeline);
}

export const sessionsByCountry = async function (time, unit = 'days') {
    const pipeline = [
        {$match: {since: {$gte: getFromDate(time, unit)}}},
        {
            $group: {
                _id: "$geo.country",
                country: {$last: "$geo.country"},
                sum: {$sum: 1},
            }
        }
    ];
    return executeAggregation(pipeline);
}

export const sessionsByOs = async function (time, unit = 'days') {
    const pipeline = [
        {$match: {since: {$gte: getFromDate(time, unit)}}},
        {
            $group: {
                _id: "$os.name",
                osname: {$last: "$os.name"},
                sum: {$sum: 1},
            }
        }
    ];
    return executeAggregation(pipeline);
}

export const sessionsByDeviceType = async function (time, unit = 'days') {
    const pipeline = [
        {$match: {since: {$gte: getFromDate(time, unit)}}},
        {
            $group: {
                _id: "$device.type",
                devicetype: {$last: "$device.type"},
                sum: {$sum: 1},
            }
        }
    ];
    return executeAggregation(pipeline);
}

export const sessionsByCity = async function (time, unit = 'days') {
    const pipeline = [
        {$match: {since: {$gte: getFromDate(time, unit)}}},
        {
            $group: {
                _id: "$geo.city",
                city: {$last: "$geo.city"},
                sum: {$sum: 1},
            }
        }
    ];
    return executeAggregation(pipeline);
}

export const sessionsByClient = async function (time, unit = 'days') {
    const pipeline = [
        {$match: {since: {$gte: getFromDate(time, unit)}}},
        {
            $group: {
                _id: "$client.name",
                clientname: {$last: "$client.name"},
                sum: {$sum: 1},
            }
        }
    ];
    return executeAggregation(pipeline);
}