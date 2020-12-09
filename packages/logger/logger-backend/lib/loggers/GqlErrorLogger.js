"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _winston = _interopRequireDefault(require("winston"));

var _ConsoleTransport = _interopRequireDefault(require("../transports/ConsoleTransport"));

var _FileCombinedTransport = _interopRequireDefault(require("../transports/FileCombinedTransport"));

var _DefaultTextFormatter = _interopRequireDefault(require("../formatters/DefaultTextFormatter"));

var _FileGqlErrorTransport = _interopRequireDefault(require("../transports/FileGqlErrorTransport"));

var _FileErrorTransport = _interopRequireDefault(require("../transports/FileErrorTransport"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function GqlErrorLogger() {
  let transports = [];

  if (!process.env.LOG_TRANSPORT_CONSOLE || process.env.LOG_TRANSPORT_CONSOLE === 'ON') {
    transports.push((0, _ConsoleTransport.default)());
  }

  if (process.env.LOG_TRANSPORT_COMBINED === 'ON') {
    transports.push((0, _FileCombinedTransport.default)());
  }

  if (process.env.LOG_TRANSPORT_GQL_ERROR === 'ON') {
    transports.push((0, _FileGqlErrorTransport.default)());
  }

  return _winston.default.createLogger({
    format: (0, _DefaultTextFormatter.default)(false),
    transports: transports
  });
}

var _default = GqlErrorLogger();

exports.default = _default;