require('dotenv').config();
import winston from "winston";
import ConsoleTransport from "../transports/ConsoleTransport";
import FileCombinedTransport from "../transports/FileCombinedTransport";
import FileErrorTransport from "../transports/FileErrorTransport";


function DefaultLogger() {

    let transports = []

    if (!process.env.LOG_TRANSPORT_CONSOLE || process.env.LOG_TRANSPORT_CONSOLE === 'ON') {
        transports.push(ConsoleTransport())
    }

    if (process.env.LOG_TRANSPORT_COMBINED === 'ON') {
        transports.push(FileCombinedTransport())
    }

    if (process.env.LOG_TRANSPORT_ERROR === 'ON') {
        transports.push(FileErrorTransport())
    }

    winston.configure({
        transports: transports
    });

    return winston
}

export default DefaultLogger()