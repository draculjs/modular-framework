"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _winston = _interopRequireDefault(require("winston"));

var _ConsoleTransport = _interopRequireDefault(require("../transports/ConsoleTransport"));

var _FileCombinedTransport = _interopRequireDefault(require("../transports/FileCombinedTransport"));

var _FileErrorTransport = _interopRequireDefault(require("../transports/FileErrorTransport"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

function DefaultLogger() {
  let transports = [];

  if (!process.env.LOG_TRANSPORT_CONSOLE || process.env.LOG_TRANSPORT_CONSOLE === 'ON') {
    transports.push((0, _ConsoleTransport.default)());
  }

  if (process.env.LOG_TRANSPORT_COMBINED === 'ON') {
    transports.push((0, _FileCombinedTransport.default)());
  }

  if (process.env.LOG_TRANSPORT_ERROR === 'ON') {
    transports.push((0, _FileErrorTransport.default)());
  }

  _winston.default.configure({
    transports: transports
  });

  return _winston.default;
}

var _default = DefaultLogger();

exports.default = _default;