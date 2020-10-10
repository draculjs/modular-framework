import  winston from "winston";

function DefaultTextFormatter() {

    const {combine, timestamp, printf, errors, colorize, uncolorize} = winston.format;

    const color = process.env.LOG_COLORIZE === 'ON' ? true : false

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

export default DefaultTextFormatter()