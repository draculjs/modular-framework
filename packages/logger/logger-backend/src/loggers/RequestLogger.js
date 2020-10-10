import winston from "winston";
import ConsoleTransport from "../transports/ConsoleTransport";
import FileCombinedTransport from "../transports/FileCombinedTransport";
import FileAccessTransport from "../transports/FileAccessTransport";
import DefaultTextFormatter from "../formatters/DefaultTextFormatter";
import FileGqlResponseTransport from "../transports/FileGqlResponseTransport";


function RequestLogger() {

    let transports = []

    if (!process.env.LOG_TRANSPORT_CONSOLE || process.env.LOG_TRANSPORT_CONSOLE === 'ON') {
        transports.push(ConsoleTransport())
    }


    if (process.env.LOG_TRANSPORT_COMBINED === 'ON') {
        transports.push(FileCombinedTransport())
    }

    if (process.env.LOG_TRANSPORT_ACCESS === 'ON') {
        transports.push(FileAccessTransport())
    }


    return winston.createLogger({
        format: DefaultTextFormatter(false),
        transports: transports
    })

}

export default RequestLogger();