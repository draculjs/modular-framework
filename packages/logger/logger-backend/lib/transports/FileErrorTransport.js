"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _winston = _interopRequireDefault(require("winston"));

var _DefaultFormatter = _interopRequireDefault(require("../formatters/DefaultFormatter"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

function FileErrorTransport(level, formatter) {
  if (!formatter) {
    formatter = (0, _DefaultFormatter.default)(false);
  }

  if (!level) {
    level = 'error';
  }

  return new _winston.default.transports.File({
    filename: 'logs/error.log',
    format: formatter,
    level: level,
    maxsize: process.env.LOG_FILE_MAX_SIZE ? process.env.LOG_FILE_MAX_SIZE : 50000000,
    maxFiles: process.env.LOG_FILE_MAX_FILES ? process.env.LOG_FILE_MAX_FILES : 3
  });
}

var _default = FileErrorTransport;
exports.default = _default;