require('dotenv').config()
import winston from "winston";
import DefaultFormatter from "../formatters/DefaultFormatter";


function ConsoleTransport(level, formatter) {

    if (!formatter) {
        formatter = DefaultFormatter()
    }

    if(!level){
        level= process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'debug'
    }

    return new winston.transports.Console({
        format: formatter,
        level:level
    })
}


export default ConsoleTransport