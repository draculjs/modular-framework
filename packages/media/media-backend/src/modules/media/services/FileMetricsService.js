import File from './../models/FileModel'


export const fileGlobalMetrics = async function () {
    return new Promise((resolve, reject) => {
        const aggregate = File.aggregate([
            {
                $group:
                {
                    _id: "global",
                    count: { $sum: 1 },
                    weight: { $sum: "$size" }
                }
            }
        ]);

        aggregate.exec().then(docs => {
            resolve(docs[0])
        }).catch(err => reject(err))

    })
}

const getMonths = function () {
    return ["julio", "agosto", "septiembre", "octubre", "noviembre"]
}

const aggregateCantidadDeArchivosPorFecha = async function () {
    return new Promise((resolve, reject) => {
        const aggregate = File.aggregate([
            {
                $group:
                {
                    _id: {
                        //user: "$createdBy.user" ,
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" }
                    },
                    //user: {$first: "$createdBy.username"},
                    count: { $sum: 1 },
                    weight: { $sum: "$size" },
                }
            }, {
                $sort: {
                    "_id.year": -1,
                    "_id.month": -1
                }
            }
        ]);

        aggregate.exec().then(docs => {
            resolve(docs)
        }).catch(err => reject(err))
    })
}

const aggregateAlmacenamientoPorUsuario = async function () {
    return new Promise((resolve, reject) => {
        const aggregate = File.aggregate([
            {
                $group:
                {
                    _id: {
                        user: "$createdBy.user",
                        // month: { $month: "$createdAt" },
                        // year: { $year: "$createdAt" }
                    },
                    user: { $first: "$createdBy.username" },
                    count: { $sum: 1 },
                    weight: { $sum: "$size" },
                }
            }
        ]);

        aggregate.exec().then(docs => {
            resolve(docs)
        }).catch(err => reject(err))
    })
}

export const fileUserMetrics = async function () {
    let docs = await aggregateCantidadDeArchivosPorFecha()

    let date = new Date(Date.now())
    let month = date.getMonth() + 1
    let year = date.getFullYear()

    let labels = getMonths()
    let dataset = []
    // {
    //     label: '',
    //     data: [65, 59, 80, 81, 56, 55, 40],
    // }
    let label = "prueba"
    let data = []
    let dataWeigth = []
    for (let i = 0; i < 5; i++) {
        let monthToPush = month - i
        let yearToPush = 0
        if (monthToPush < 1) {
            yearToPush = year - 1
            monthToPush = 12 + monthToPush
        } else {
            yearToPush = year
        }
        console.log("month y year2", monthToPush, yearToPush)

        let docToPush = docs.filter(x => x._id.month == monthToPush && x._id.year == yearToPush)
        console.log("doctopush", docToPush)
        if (docToPush[0]) {
            data.unshift(docToPush[0].count)
            dataWeigth.unshift(docToPush[0].weight)
        } else {
            data.unshift(0)
            dataWeigth.unshift(0)
        }
    }
    dataset.push({ label: label, data: data })
    dataset.push({ label: "weight", data: dataWeigth })
    console.log("dataset", dataset)
    console.log("data", data)
    console.log("labels", labels)

    return { labels: labels, dataset: dataset }

}

export const almacenamientoPorUsuario = async function () {
    let docs = await aggregateAlmacenamientoPorUsuario()

    let labels = docs.map((item) => item.user);
    let weights = docs.map((item) => item.weight);
    let dataset = [{ label: 'Weight', data: weights }]

    return { labels: labels, dataset: dataset }

}

export const cantidadArchivosPorUsuario = async function () {
    let docs = await aggregateAlmacenamientoPorUsuario()

    let labels = docs.map((item) => item.user);
    let fileCount = docs.map((item) => item.count);
    let dataset = [{ label: 'Count', data: fileCount }]

    return { labels: labels, dataset: dataset }

}