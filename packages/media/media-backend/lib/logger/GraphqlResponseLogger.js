"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.graphqlResponseLogger = void 0;

var _winston = _interopRequireDefault(require("winston"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const graphqlResponseTransport = [new _winston.default.transports.File({
  filename: 'logs/graphql-response.log',
  level: 'info'
}), new _winston.default.transports.File({
  filename: 'logs/combined.log',
  level: 'info'
}), new _winston.default.transports.Console({
  handleExceptions: true
})];

const unwrap = s => s.replace(/\n/g, '');

function createGraphqResponselLogger(transports) {
  const graphqlResponseLogger = _winston.default.createLogger({
    format: getGraphqlResponseLogFormatter(),
    transports: transports
  });

  return function logResponse(requestContext) {
    if (process.env.LOG_GRAPHQL_RESPONSE == "ON") {
      let info = {};
      info.user = requestContext.context.user ? requestContext.context.user.username ? requestContext.context.user.username : "anonymous" : "anonymous";
      info.type = requestContext.operation ? requestContext.operation.operation ? requestContext.operation.operation.toUpperCase() : "" : "";
      info.operation = requestContext.operationName || "";
      info.query = unwrap(requestContext.request.query) || "";
      info.variables = JSON.stringify(requestContext.request.variables) || "";
      info.resp = JSON.stringify(requestContext.response.data) || "";
      graphqlResponseLogger.info(info);
    }
  };
}

function getGraphqlResponseLogFormatter() {
  const {
    combine,
    timestamp,
    printf
  } = _winston.default.format;
  return combine(timestamp(), printf(info => {
    const {
      user,
      type,
      operation,
      query,
      variables,
      resp
    } = info.message;
    return `${info.timestamp} ${info.level} GQLRESP ${type} OP:${operation} USER:${user} QRY: ${query} VAR: ${variables} RESP: ${resp} \n`;
  }));
}

const graphqlResponseLogger = createGraphqResponselLogger(graphqlResponseTransport);
exports.graphqlResponseLogger = graphqlResponseLogger;