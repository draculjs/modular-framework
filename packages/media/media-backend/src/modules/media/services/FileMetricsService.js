import File from './../models/FileModel'


export const fileGlobalMetrics = async function () {
    return new Promise((resolve, reject) => {
        const aggregate = File.aggregate([
            {
                $group:
                    {
                        _id:  "global"  ,
                        count: { $sum: 1 },
                        weight: {$sum: "$size"}
                    }
            }
        ]);

        aggregate.exec().then(docs => {
            resolve(docs[0])
        }).catch(err => reject(err))

    })
}

export const fileUserMetrics = async function () {
    return new Promise((resolve, reject) => {
        const aggregate = File.aggregate([
            {
                $group:
                    {
                        _id: { user: "$createdBy.username"  },
                        user: {$first: "$createdBy.username"},
                        count: { $sum: 1 },
                        weight: {$sum: "$size"}
                    }
            }
        ]);

        aggregate.exec().then(docs => {
            resolve(docs)
        }).catch(err => reject(err))

    })
}