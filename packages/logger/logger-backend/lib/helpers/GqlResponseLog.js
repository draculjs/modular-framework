"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _GqlResponseLogger = _interopRequireDefault(require("../loggers/GqlResponseLogger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const unwrap = s => s.replace(/\n/g, '');

function GqlResponseLog(requestContext) {
  try {
    if (process.env.LOG_GRAPHQL_RESPONSE == "ON") {
      let info = {};
      info.user = requestContext.context.user ? requestContext.context.user.username ? requestContext.context.user.username : "anonymous" : "anonymous";
      info.type = requestContext.operation ? requestContext.operation.operation ? requestContext.operation.operation.toUpperCase() : "" : "";
      info.operation = requestContext.operationName || "";
      info.query = unwrap(requestContext.request.query) || "";
      info.variables = JSON.stringify(requestContext.request.variables) || "";
      info.resp = JSON.stringify(requestContext.response.data) || "";
      let message = `GqlResp ${info.type} op:${info.operation} user:${info.user} qry: ${info.query} vars: ${info.variables} resp: ${info.resp} \n`;

      _GqlResponseLogger.default.info(message);
    }
  } catch (e) {
    console.error(e);
  }
}

var _default = GqlResponseLog;
exports.default = _default;