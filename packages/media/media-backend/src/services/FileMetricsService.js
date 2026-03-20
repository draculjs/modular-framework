import File from '../models/FileModel'
import generateColors from '../util/generateColors'
import { DefaultLogger as winston } from '@dracul/logger-backend'

export const fileGlobalMetrics = async function () {
    try {
        winston.debug(`FileMetricsService.fileGlobalMetrics: aggregating global file metrics`);
        
        const docs = await File.aggregate([
            {
                $group: {
                    _id: "global",
                    count: { $sum: 1 },
                    weight: { $sum: "$size" }
                }
            }
        ]);
        
        const result = docs[0] || { _id: "global", count: 0, weight: 0 };
        
        winston.info(`FileMetricsService.fileGlobalMetrics: found ${result.count} files, total weight: ${result.weight} bytes`);
        
        return result;
    } catch (err) {
        winston.error(`FileMetricsService.fileGlobalMetrics error: ${err.message}`, { error: err.stack });
        throw err;
    }
}

const aggregateCantidadDeArchivosPorFecha = async function () {
    try {
        winston.debug(`FileMetricsService.aggregateCantidadDeArchivosPorFecha: aggregating files by date`);
        
        const docs = await File.aggregate([
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" }
                    },
                    count: { $sum: 1 },
                    weight: { $sum: "$size" }
                }
            },
            {
                $sort: {
                    "_id.year": -1,
                    "_id.month": -1
                }
            }
        ]);
        
        winston.debug(`FileMetricsService.aggregateCantidadDeArchivosPorFecha: found ${docs.length} month/year combinations`);
        
        return docs;
    } catch (err) {
        winston.error(`FileMetricsService.aggregateCantidadDeArchivosPorFecha error: ${err.message}`, { error: err.stack });
        throw err;
    }
}

const aggregateAlmacenamientoPorUsuario = async function () {
    try {
        winston.debug(`FileMetricsService.aggregateAlmacenamientoPorUsuario: aggregating files by user`);
        
        const docs = await File.aggregate([
            {
                $group: {
                    _id: {
                        user: "$createdBy.user"
                    },
                    user: { $first: "$createdBy.username" },
                    count: { $sum: 1 },
                    weight: { $sum: "$size" }
                }
            },
            {
                $sort: {
                    "user": -1
                }
            }
        ]);
        
        winston.debug(`FileMetricsService.aggregateAlmacenamientoPorUsuario: found ${docs.length} users with files`);
        
        return docs;
    } catch (err) {
        winston.error(`FileMetricsService.aggregateAlmacenamientoPorUsuario error: ${err.message}`, { error: err.stack });
        throw err;
    }
}

export const fileUserMetrics = async function () {
    try {
        winston.debug(`FileMetricsService.fileUserMetrics: generating user file metrics for last 5 months`);
        
        let docs = await aggregateCantidadDeArchivosPorFecha();

        let date = new Date(Date.now());
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        let labels = [];
        let dataset = [];
        let dataCount = [];
        let dataWeigth = [];

        for (let i = 0; i < 5; i++) {
            let monthToPush = month - i;
            let yearToPush = 0;
            if (monthToPush < 1) {
                yearToPush = year - 1;
                monthToPush = 12 + monthToPush;
            } else {
                yearToPush = year;
            }
            labels.unshift(monthToPush + '/' + yearToPush.toString().substring(2, 4));

            let docToPush = docs.filter(x => x._id.month == monthToPush && x._id.year == yearToPush);

            if (docToPush[0]) {
                dataCount.unshift(docToPush[0].count);
                dataWeigth.unshift(docToPush[0].weight);
            } else {
                dataCount.unshift(0);
                dataWeigth.unshift(0);
            }
        }

        dataset.push({ label: "countLabel", data: dataCount });
        dataset.push({ label: "sizeLabel", data: dataWeigth });

        winston.debug(`FileMetricsService.fileUserMetrics: generated metrics for labels: ${labels.join(', ')}`);
        
        return { labels: labels, dataset: dataset };
    } catch (err) {
        winston.error(`FileMetricsService.fileUserMetrics error: ${err.message}`, { error: err.stack });
        throw err;
    }
}

export const almacenamientoPorUsuario = async function () {
    try {
        winston.debug(`FileMetricsService.almacenamientoPorUsuario: generating storage metrics by user`);
        
        let docs = await aggregateAlmacenamientoPorUsuario();

        let labels = docs.map((item) => item.user);
        let weights = docs.map((item) => item.weight);
        let colors = docs.map((item, index) => generateColors(index));
        let dataset = [{ label: 'Weight', data: weights, backgroundColor: colors }];

        winston.debug(`FileMetricsService.almacenamientoPorUsuario: found ${docs.length} users`);
        
        return { labels: labels, dataset: dataset };
    } catch (err) {
        winston.error(`FileMetricsService.almacenamientoPorUsuario error: ${err.message}`, { error: err.stack });
        throw err;
    }
}

export const cantidadArchivosPorUsuario = async function () {
    try {
        winston.debug(`FileMetricsService.cantidadArchivosPorUsuario: generating file count metrics by user`);
        
        let docs = await aggregateAlmacenamientoPorUsuario();

        let labels = docs.map((item) => item.user);
        let fileCount = docs.map((item) => item.count);
        let colors = docs.map((item, index) => generateColors(index));
        let dataset = [{ label: 'Count', data: fileCount, backgroundColor: colors }];

        winston.debug(`FileMetricsService.cantidadArchivosPorUsuario: found ${docs.length} users`);
        
        return { labels: labels, dataset: dataset };
    } catch (err) {
        winston.error(`FileMetricsService.cantidadArchivosPorUsuario error: ${err.message}`, { error: err.stack });
        throw err;
    }
}

const generateRandomNumber = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

const generateRandomColor = function () {
    return `rgba(${generateRandomNumber(0, 255)}, ${generateRandomNumber(0, 255)}, ${generateRandomNumber(0, 255)})`;
}
