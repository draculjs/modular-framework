"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _winston = _interopRequireDefault(require("winston"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

function DefaultTextFormatter(color) {
  const {
    combine,
    timestamp,
    printf,
    errors,
    colorize,
    uncolorize
  } = _winston.default.format;

  if (color === undefined) {
    color = process.env.LOG_COLORIZE === 'ON' ? true : false;
  }

  return combine(errors({
    stack: true
  }), timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }), color ? colorize() : uncolorize(), printf(({
    level,
    message,
    timestamp,
    stack
  }) => {
    if (stack) {
      return `${timestamp} ${level}: ${message} - Stacktrace: ${stack}`;
    }

    return `${timestamp} ${level}: ${message}`;
  }));
}

var _default = DefaultTextFormatter;
exports.default = _default;