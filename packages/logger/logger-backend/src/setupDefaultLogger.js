require('dotenv').config()
const winston = require("winston")

function transportsFactory() {
    let transports = [new winston.transports.Console({
        level: process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info',
        format: formatter(process.env.LOG_COLORIZE === 'ON' ? true : false)
    })]

    if (process.env.LOG_FILE === 'ON') {

        transports.push(
            new winston.transports.File({
                filename: 'logs/combined.log',
                level: process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'debug',
                format: formatter(false),
                maxsize: process.env.LOG_FILE_MAX_SIZE ? process.env.LOG_FILE_MAX_SIZE : 50000000,
                maxFiles: process.env.LOG_FILE_MAX_FILES ? process.env.LOG_FILE_MAX_FILES : 3,
            })
        )

        transports.push(
            new winston.transports.File({
                filename: 'logs/errors.log',
                level: 'error',
                handleExceptions: true,
                format: formatter(false),
                maxsize: process.env.LOG_FILE_MAX_SIZE ? process.env.LOG_FILE_MAX_SIZE : 50000000,
                maxFiles: process.env.LOG_FILE_MAX_FILES ? process.env.LOG_FILE_MAX_FILES : 3,
            })
        )

    }

    return transports
}

function formatter(color = false) {

    const {combine, timestamp, printf, errors, colorize, uncolorize, json} = winston.format;

    if (process.env.LOG_JSON === 'ON') {
        return combine(
            timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
            printf((info) => {
                return JSON.stringify({
                        timestamp: info.timestamp,
                        level: info.level,
                        message: info.message,
                        stack: info.stack
                    }
                )
            })
        )
    }


    return combine(
        errors({stack: true}),
        timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        (color ? colorize() : uncolorize()),
        printf(({level, message, timestamp, stack}) => {
            if (stack) {
                return `${timestamp} ${level}: ${message} - ${stack}`;
            }
            return `${timestamp} ${level}: ${message}`;
        })
    );
}


function setupDefaultLogger() {

    winston.configure({
        transports: transportsFactory()
    });

}


module.exports = setupDefaultLogger


