"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.graphqlErrorLogger = void 0;

var _winston = _interopRequireDefault(require("winston"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

const graphqlErrorTransports = [new _winston.default.transports.File({
  filename: 'logs/graphql-error.log',
  level: 'error',
  handleExceptions: true
}), new _winston.default.transports.File({
  filename: 'logs/combined.log',
  level: 'error'
}), new _winston.default.transports.Console({
  handleExceptions: true
})];

function createGraphqlErrorLogger(transports) {
  const graphqlErrorLogger = _winston.default.createLogger({
    level: 'error',
    format: getGraphqlErrorLogFormatter(),
    transports: transports
  });

  return function logError(requestContext) {
    if (process.env.LOG_GRAPHQL_ERRORS == "ON") {
      let info = {};
      info.user = requestContext.context.user ? requestContext.context.user.username ? requestContext.context.user.username : "anonymous" : "anonymous";
      info.operation = requestContext.operationName || "";
      requestContext.errors.forEach(error => {
        console.log(error);
        info.msg = error.message || "";
        info.code = error.extensions ? error.extensions.code ? error.extensions.code : "" : "";
        graphqlErrorLogger.error(info);
      });
    }
  };
}

function getGraphqlErrorLogFormatter() {
  const {
    combine,
    timestamp,
    printf
  } = _winston.default.format;
  return combine(timestamp(), printf(info => {
    const {
      user,
      operation,
      code,
      msg
    } = info.message;
    return `${info.timestamp} ${info.level} GQLERROR USER:${user} OP:${operation} CODE: ${code}  MSG: ${msg} `;
  }));
}

const graphqlErrorLogger = createGraphqlErrorLogger(graphqlErrorTransports);
exports.graphqlErrorLogger = graphqlErrorLogger;