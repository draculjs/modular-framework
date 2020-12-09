"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _winston = _interopRequireDefault(require("winston"));

var _DefaultFormatter = _interopRequireDefault(require("../formatters/DefaultFormatter"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

function ConsoleTransport(level, formatter) {
  if (!formatter) {
    formatter = (0, _DefaultFormatter.default)();
  }

  if (!level) {
    level = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'debug';
  }

  return new _winston.default.transports.Console({
    format: formatter,
    level: level
  });
}

var _default = ConsoleTransport;
exports.default = _default;