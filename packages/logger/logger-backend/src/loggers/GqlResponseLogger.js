import winston from "winston";
import ConsoleTransport from "../transports/ConsoleTransport";
import FileCombinedTransport from "../transports/FileCombinedTransport";
import DefaultTextFormatter from "../formatters/DefaultTextFormatter";
import FileGqlResponseTransport from "../transports/FileGqlResponseTransport";
import FileGqlErrorTransport from "../transports/FileGqlErrorTransport";

function GqlErrorLogger() {

    let transports = []

    if (!process.env.LOG_TRANSPORT_CONSOLE || process.env.LOG_TRANSPORT_CONSOLE === 'ON') {
        transports.push(ConsoleTransport())
    }

    if (process.env.LOG_TRANSPORT_COMBINED === 'ON') {
        transports.push(FileCombinedTransport())
    }

    if (process.env.LOG_TRANSPORT_GQL_RESPONSE === 'ON') {
        transports.push(FileGqlResponseTransport())
    }

    return winston.createLogger({
        format: DefaultTextFormatter(false),
        transports: transports
    })

}

export default GqlErrorLogger()