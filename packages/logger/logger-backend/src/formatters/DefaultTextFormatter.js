require('dotenv').config()
import  winston from "winston";

function DefaultTextFormatter(color) {

    const {combine, timestamp, printf, errors, colorize, uncolorize} = winston.format;

    if(color === undefined){
        color = process.env.LOG_COLORIZE === 'ON' ? true : false
    }

    return combine(
        errors({stack: true}),
        timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        (color ? colorize() : uncolorize()),
        printf(({level, message, timestamp, stack}) => {
            if (stack) {
                return `${timestamp} ${level}: ${message} - Stacktrace: ${stack}`;
            }
            return `${timestamp} ${level}: ${message}`;
        })
    );
}

export default DefaultTextFormatter