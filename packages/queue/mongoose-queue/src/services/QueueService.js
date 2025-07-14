import {DefaultLogger} from '@dracul/logger-backend';

import QueueModel from '../models/QueueModel';
import isPlainObject from '../utils/isPlainObject';
import {incrementDoneStat, incrementAddedStat, incrementFailedStat, incrementGottenStat} from './QueueStatsService';

const fetchQueues = async function () {
    try {
        const res = await QueueModel.find({});
        DefaultLogger.debug("QueueService.fetchQueues successful");
        return res;
    } catch (err) {
        DefaultLogger.error("QueueService.fetchQueues ", err);
        throw err;
    }
}

const addJob = async function (topic, payload, delay, maxRetries) {
    if (!topic) throw new Error('Topic missing.');
    if (!(typeof topic === 'string')) throw new Error('Topic is not a String.');
    
    if (!payload) throw new Error('Payload missing.');
    if (!isPlainObject(payload)) throw new Error('Payload is not a plain object.');

    if (delay === null || delay === undefined) throw new Error('delay missing.');
    if (!(typeof delay === 'number')) throw new Error('delay is not a number.');

    const job = new QueueModel({
        topic: topic,
        payload: payload,
        blockedUntil: new Date(Date.now() + delay),
        maxRetries: maxRetries,
        state: 'PENDING'
    });
    
    try {
        const savedJob = await job.save();
        incrementAddedStat(topic);
        return savedJob;
    } catch (err) {
        throw err;
    }
}

const getJob = async function (topic, workerId, maxRetries, blockDuration) {
    if (!topic) throw new Error('Topic missing.');
    if (!(typeof topic === 'string')) throw new Error('Topic is not a String.');

    if (!workerId) throw new Error('workerId missing.');
    if (!(typeof workerId === 'string')) throw new Error('workerId is not a String.');

    try {
        const job = await QueueModel.findOneAndUpdate({
            topic: topic,
            blockedUntil: {$lt: Date.now()},
            ...(!process.env.MONGO_OLD && {$expr: {$lt: ["$retries", "$maxRetries"]}}),
            ...(process.env.MONGO_OLD && {"$where":"this.retries < this.maxRetries"}),
            done: false
        }, {
            $set: {
                blockedUntil: new Date(Date.now() + blockDuration),
                workerId: workerId,
                state: 'WORKING',
                ...(maxRetries && {maxRetries})
            },
            $inc: {
                retries: 1
            },
        }, {
            new: true,
            sort: {createdAt: 1}
        });

        if (!job) return null;
        incrementGottenStat(topic);
        return job;
    } catch (err) {
        throw err;
    }
}

const ackJob = async function (jobId, output) {
    if (!jobId) throw new Error('jobId missing.');
    if (!(typeof jobId === 'string')) throw new Error('jobId is not a String.');

    try {
        const job = await QueueModel.findOneAndUpdate({
            _id: jobId
        }, {
            $set: {
                done: true,
                state: 'DONE',
                ...(output && {output})
            }
        }, {
            new: true
        });

        if (!job) throw new Error('Job id invalid, job not found.');
        incrementDoneStat(job.topic);
        return job;
    } catch (err) {
        throw err;
    }
}

const errorJob = async function (jobId, errorMessage, done = false) {
    if (!jobId) throw new Error('jobId missing.');
    if (!(typeof jobId === 'string')) throw new Error('jobId is not a String.');

    if (!errorMessage) throw new Error('errorMessage missing.');
    if (!(typeof errorMessage === 'string')) throw new Error('errorMessage is not a String.');

    try {
        const job = await QueueModel.findOneAndUpdate({
            _id: jobId
        }, {
            $set: {
                done: done,
                error: errorMessage,
                state: 'ERROR',
            }
        }, {
            new: true
        });

        if (!job) throw new Error('Job id invalid, job not found.');
        incrementFailedStat(job.topic);
        return job;
    } catch (err) {
        throw err;
    }
}

const resetQueue = async function () {
    try {
        await QueueModel.deleteMany({});
        return true;
    } catch (err) {
        throw err;
    }
}

const cleanQueue = async function () {
    try {
        await QueueModel.deleteMany({
            $or: [
                {done: true},
                {retries: {$gt: this.options.maxRetries}}
            ]
        });
        return true;
    } catch (err) {
        throw err;
    }
}

module.exports = {
    addJob,
    getJob,
    ackJob,
    errorJob,
    cleanQueue,
    resetQueue,
    fetchQueues
}