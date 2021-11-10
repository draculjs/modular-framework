"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.convertGigabytesToBytes = void 0;

const convertGigabytesToBytes = function (fileSizeInGigabyte) {
  return fileSizeInGigabyte * 1024 * 1024 * 1024;
};

exports.convertGigabytesToBytes = convertGigabytesToBytes;
var _default = convertGigabytesToBytes;
exports.default = _default;