"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _winston = _interopRequireDefault(require("winston"));

var _ConsoleTransport = _interopRequireDefault(require("../transports/ConsoleTransport"));

var _FileCombinedTransport = _interopRequireDefault(require("../transports/FileCombinedTransport"));

var _FileAccessTransport = _interopRequireDefault(require("../transports/FileAccessTransport"));

var _DefaultTextFormatter = _interopRequireDefault(require("../formatters/DefaultTextFormatter"));

var _FileGqlResponseTransport = _interopRequireDefault(require("../transports/FileGqlResponseTransport"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function RequestLogger() {
  let transports = [];

  if (!process.env.LOG_TRANSPORT_CONSOLE || process.env.LOG_TRANSPORT_CONSOLE === 'ON') {
    transports.push((0, _ConsoleTransport.default)());
  }

  if (process.env.LOG_TRANSPORT_COMBINED === 'ON') {
    transports.push((0, _FileCombinedTransport.default)());
  }

  if (process.env.LOG_TRANSPORT_ACCESS === 'ON') {
    transports.push((0, _FileAccessTransport.default)());
  }

  return _winston.default.createLogger({
    format: (0, _DefaultTextFormatter.default)(false),
    transports: transports
  });
}

var _default = RequestLogger();

exports.default = _default;