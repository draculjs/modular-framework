const QueueStatsModel = require('../models/QueueStatsModel');

const fetchQueueStats = function () {

    return new Promise((resolve, reject) => {
        QueueStatsModel.find({}).exec((err, res) => {

            if (err) {
                winston.error("QueueStatsService.fetchQueueStats ", err)
                reject(err)
            }
            winston.debug("QueueStatsService.fetchQueueStats successful")
            resolve(res)

        });
    })

}

const incrementAddStat = function (topic) {

    return new Promise((resolve, reject) => {
        QueueStatsModel.findOneAndUpdate(
            {topic: topic},
            {
                $inc: {
                    added: 1
                }
            },
            {
                new: true,
                upsert: true // Make this update into an upsert
            }
        ).exec((err, doc) => {

            if (err) {
                reject(err)
                return
            }

            resolve(doc)
        })
    })

}

const incrementGetStat = function (topic) {

    return new Promise((resolve, reject) => {
        QueueStatsModel.findOneAndUpdate(
            {topic: topic},
            {
                $inc: {
                    getted: 1
                }
            },
            {
                new: true,
                upsert: true // Make this update into an upsert
            }
        ).exec((err, doc) => {

            if (err) {
                reject(err)
                return
            }

            resolve(doc)
        })
    })

}

const incrementDoneStat = function (topic) {

    return new Promise((resolve, reject) => {
        QueueStatsModel.findOneAndUpdate(
            {topic: topic},
            {
                $inc: {
                    done: 1
                }
            },
            {
                new: true,
                upsert: true // Make this update into an upsert
            }
        ).exec((err, doc) => {

            if (err) {
                reject(err)
                return
            }

            resolve(doc)
        })
    })

}

const incrementErrorStat = function (topic) {

    return new Promise((resolve, reject) => {
        QueueStatsModel.findOneAndUpdate(
            {topic: topic},
            {
                $inc: {
                    failed: 1
                }
            },
            {
                new: true,
                upsert: true // Make this update into an upsert
            }
        ).exec((err, doc) => {

            if (err) {
                reject(err)
                return
            }

            resolve(doc)
        })
    })

}

const createTopic = function (topic) {
    return new Promise((resolve, reject) => {
        new QueueStatsModel({
            topic: topic,
        }).exec(function(err,doc){
            if (err) {
                reject(err)
                return
            }
            resolve(doc)
        })
    })

}

module.exports = {
    incrementAddStat,
    incrementGetStat,
    incrementErrorStat,
    incrementDoneStat,
    createTopic,
    fetchQueueStats
}
