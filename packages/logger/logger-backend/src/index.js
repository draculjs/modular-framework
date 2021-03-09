import CustomJsonFormatter from "./formatters/CustomJsonFormatter";
import DefaultFormatter from "./formatters/DefaultFormatter";
import DefaultJsonFormatter from "./formatters/DefaultJsonFormatter";
import DefaultTextFormatter from "./formatters/DefaultTextFormatter";
import GqlErrorLog from "./helpers/GqlErrorLog";
import GqlResponseLog from "./helpers/GqlResponseLog";
import DefaultLogger from "./loggers/DefaultLogger";
import GqlErrorLogger from "./loggers/GqlErrorLogger";
import GqlResponseLogger from "./loggers/GqlResponseLogger";
import RequestLogger from "./loggers/RequestLogger";
import RequestMiddleware from "./middlewares/RequestMiddleware";
import ConsoleTransport from "./transports/ConsoleTransport";
import FileAccessTransport from "./transports/FileAccessTransport";
import FileCombinedTransport from "./transports/FileCombinedTransport";
import FileErrorTransport from "./transports/FileErrorTransport";
import FileGqlErrorTransport from "./transports/FileGqlErrorTransport";
import FileGqlResponseTransport from "./transports/FileGqlResponseTransport";
import ResponseTimeMiddleware from "./middlewares/ResponseTimeMiddleware";
import QueueLogger from "./loggers/QueueLogger";
import FileQueueTransport from "./transports/FileQueueTransport";


module.exports = {

    //Formatters
    CustomJsonFormatter,
    DefaultFormatter,
    DefaultJsonFormatter,
    DefaultTextFormatter,

    //Helpers
    GqlErrorLog,
    GqlResponseLog,

    //Loggers
    DefaultLogger,
    GqlErrorLogger,
    GqlResponseLogger,
    RequestLogger,
    QueueLogger,

    //Middlewares
    ResponseTimeMiddleware,
    RequestMiddleware,

    //Transports
    ConsoleTransport,
    FileAccessTransport,
    FileCombinedTransport,
    FileErrorTransport,
    FileGqlErrorTransport,
    FileGqlResponseTransport,
    FileQueueTransport

}