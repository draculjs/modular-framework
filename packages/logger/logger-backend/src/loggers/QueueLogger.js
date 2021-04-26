import winston from "winston";
import ConsoleTransport from "../transports/ConsoleTransport";
import FileCombinedTransport from "../transports/FileCombinedTransport";
import FileQueueTransport from "../transports/FileQueueTransport";
import DefaultTextFormatter from "../formatters/DefaultTextFormatter";
import FileErrorTransport from "../transports/FileErrorTransport";

function QueueLogger() {

    let transports = []

    if (!process.env.LOG_TRANSPORT_CONSOLE || process.env.LOG_TRANSPORT_CONSOLE === 'ON') {
        transports.push(ConsoleTransport())
    }

    if (process.env.LOG_TRANSPORT_COMBINED === 'ON') {
        transports.push(FileCombinedTransport())
    }

    transports.push(FileErrorTransport())
    
    transports.push(FileQueueTransport())

    return winston.createLogger({
        format: DefaultTextFormatter(false),
        transports: transports
    })

}

export default QueueLogger()