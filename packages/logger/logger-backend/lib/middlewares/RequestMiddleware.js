"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _RequestLogger = _interopRequireDefault(require("../loggers/RequestLogger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sanatizeIp(ip) {
  return ip.replace("::ffff:", "");
}

function RequestMiddleware(req, res, next) {
  if (process.env.LOG_REQUEST === "ON") {
    let info = {};
    info.ip = sanatizeIp(req.headers['x-forwarded-for'] || req.connection.remoteAddress);
    info.method = req.method;
    info.user = req.user ? req.user.username ? req.user.username : 'anonymous' : 'anonymous';
    info.dst = req.hostname + (req.port || '') + (req.originalUrl || '');
    info.operation = req.body ? req.body.operationName ? req.body.operationName : "" : "";
    let message = `${info.method} ${info.dst} ${info.ip} ${info.user} ${info.operation}`;

    _RequestLogger.default.info(message);
  }

  next();
}

var _default = RequestMiddleware;
exports.default = _default;