"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _winston = _interopRequireDefault(require("winston"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

function DefaultJsonFormatter() {
  const {
    combine,
    timestamp,
    errors,
    json,
    prettyPrint
  } = _winston.default.format;
  return combine(errors({
    stack: true
  }), timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }), json(), prettyPrint());
}

var _default = DefaultJsonFormatter;
exports.default = _default;