"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.baseUrl = void 0;

const baseUrl = function () {
  let url = process.env.APP_API_URL;

  if (!/^http:\/\//.test(url)) {
    url = "http://" + baseUrl;
  }

  if (!/\/$/.test(url)) {
    url += "/";
  }

  return url;
};

exports.baseUrl = baseUrl;
var _default = baseUrl;
exports.default = _default;