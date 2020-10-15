"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _winston = _interopRequireDefault(require("winston"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

function CustomJsonFormatter() {
  const {
    combine,
    timestamp,
    printf,
    errors
  } = _winston.default.format;
  return combine(errors({
    stack: true
  }), timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }), printf(({
    timestamp,
    level,
    message,
    stack
  }) => {
    return JSON.stringify({
      timestamp: timestamp,
      level: level,
      message: message,
      stack: stack
    });
  }));
}

var _default = CustomJsonFormatter;
exports.default = _default;