"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _FileService = require("../services/FileService");

function _default(req, res, next) {
  try {
    // Elimino la primera barra para poder comparar contra el campo 'relativePath' del modelo
    let uri_dec = decodeURIComponent(req.originalUrl).replace('/', '');

    if (!req.headers.toString().includes("Content-Range")) {
      (0, _FileService.updateByRelativePath)(uri_dec);
    }

    next();
  } catch (error) {
    console.error("updateFileMiddleware error:", error);
    next(error);
  }
}