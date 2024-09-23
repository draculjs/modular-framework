const QueueModel = require('../models/QueueModel');
import { UserInputError } from 'apollo-server-errors';
import mongoose from 'mongoose';

export const findQueue = async function (id) {
    try {
        return await QueueModel.findOne({ _id: id });
    } catch (err) {
        throw err;
    }
};

export const findQueueByTopicAndState = async function (topic, state) {
    try {
        return await QueueModel.findOne({ topic, state });
    } catch (err) {
        throw err;
    }
};

export const qs = function (search) {
    let qs = {};
    if (search) {
        if (mongoose.isValidObjectId(search)) {
            qs = {
                _id: { $eq: mongoose.Types.ObjectId(search) },
            };
        } else {
            qs = {
                $or: [
                    { topic: { $regex: search, $options: 'i' } },
                    { state: { $regex: search, $options: 'i' } },
                    { info: { $regex: search, $options: 'i' } },
                    { workerId: { $regex: search, $options: 'i' } },
                ],
            };
        }
    }
    return qs;
};

export const paginateQueues = async function (pageNumber = 1, itemsPerPage = 5, search = null, orderBy = null, orderDesc = false) {
    const getSort = (orderBy, orderDesc) => {
        return orderBy ? (orderDesc ? '-' : '') + orderBy : '-_id';
    };

    let query = qs(search);
    let populate = null;
    let sort = getSort(orderBy, orderDesc);
    let params = { page: pageNumber, limit: itemsPerPage, populate, sort };

    try {
        const result = await QueueModel.paginate(query, params);
        return { items: result.docs, totalItems: result.totalDocs, page: result.page };
    } catch (err) {
        throw err;
    }
};

export const createQueue = async function (authUser, { blockedUntil, workerId, maxRetries, retries, progress, info, output, state, topic, payload, done, error }) {
    const doc = new QueueModel({
        blockedUntil, workerId, maxRetries, retries, progress, info, output, state, topic, payload, done, error
    });
    doc.id = doc._id;

    try {
        return await doc.save();
    } catch (error) {
        if (error.name === "ValidationError") {
            throw new UserInputError(error.message, { inputErrors: error.errors });
        }
        throw error;
    }
};

export const updateQueue = async function (authUser, id, { blockedUntil, workerId, maxRetries, retries, progress, info, output, state, topic, payload, done, error }) {
    try {
        return await QueueModel.findOneAndUpdate(
            { _id: id },
            { blockedUntil, workerId, maxRetries, retries, progress, info, output, state, topic, payload, done, error },
            { new: true, runValidators: true, context: 'query' }
        );
    } catch (error) {
        if (error.name === "ValidationError") {
            throw new UserInputError(error.message, { inputErrors: error.errors });
        }
        throw error;
    }
};

export const deleteQueue = async function (id) {
    try {
        const doc = await findQueue(id);
        await doc.delete();
        return { id: id, success: true };
    } catch (err) {
        throw err;
    }
};
