import winston from "winston";
import ConsoleTransport from "../transports/ConsoleTransport";
import FileCombinedTransport from "../transports/FileCombinedTransport";
import DefaultTextFormatter from "../formatters/DefaultTextFormatter";
import FileGqlErrorTransport from "../transports/FileGqlErrorTransport";
import FileErrorTransport from "../transports/FileErrorTransport";

function GqlErrorLogger() {

    let transports = []

    if (!process.env.LOG_TRANSPORT_CONSOLE || process.env.LOG_TRANSPORT_CONSOLE === 'ON') {
        transports.push(ConsoleTransport())
    }

    if (process.env.LOG_TRANSPORT_COMBINED === 'ON') {
        transports.push(FileCombinedTransport())
    }

    if (process.env.LOG_TRANSPORT_GQL_ERROR === 'ON') {
        transports.push(FileGqlErrorTransport())
    }

    return winston.createLogger({
        format: DefaultTextFormatter(false),
        transports: transports
    })

}

export default GqlErrorLogger()