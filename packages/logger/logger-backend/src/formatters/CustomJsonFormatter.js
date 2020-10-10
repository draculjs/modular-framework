require('dotenv').config()
import winston from "winston";

function CustomJsonFormatter() {
    const {combine, timestamp, printf, errors} = winston.format;

    return combine(
        errors({stack: true}),
        timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        printf(({timestamp, level, message, stack}) => {
            return JSON.stringify({
                    timestamp: timestamp,
                    level: level,
                    message: message,
                    stack: stack
                }
            )
        })
    )
}

export default CustomJsonFormatter