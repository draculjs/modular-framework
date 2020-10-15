"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _DefaultTextFormatter = _interopRequireDefault(require("./DefaultTextFormatter"));

var _DefaultJsonFormatter = _interopRequireDefault(require("./DefaultJsonFormatter"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

function DefaultFormatter(color) {
  switch (process.env.LOG_MODE) {
    case "JSON":
      return (0, _DefaultJsonFormatter.default)();

    case "TEXT":
      return (0, _DefaultTextFormatter.default)(color);

    default:
      return (0, _DefaultTextFormatter.default)(color);
  }
}

var _default = DefaultFormatter;
exports.default = _default;