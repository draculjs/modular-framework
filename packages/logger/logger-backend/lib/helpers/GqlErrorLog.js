"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _GqlErrorLogger = _interopRequireDefault(require("../loggers/GqlErrorLogger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function GqlErrorLog(requestContext) {
  try {
    if (process.env.LOG_GQL_ERRORS == "ON") {
      let user = requestContext.context.user ? requestContext.context.user.username ? requestContext.context.user.username : "anonymous" : "anonymous";
      let operation = requestContext.operation ? requestContext.operation.operation : "";
      requestContext.errors.forEach(error => {
        let path = error.path && Array.isArray(error.path) && error.path[0] ? error.path[0] : "";
        let message = `${operation}:${path} by:${user}`;

        _GqlErrorLogger.default.error(message, error);
      });
    }
  } catch (e) {
    console.error(e);
  }
}

var _default = GqlErrorLog;
exports.default = _default;