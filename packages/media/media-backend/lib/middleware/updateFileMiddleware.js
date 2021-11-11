"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _FileService = require("../modules/media/services/FileService");

function _default(req, res, next) {
  try {
    // Elimino la primera barra para poder comparar contra el campo 'relativePath' del modelo
    let uri_dec = decodeURIComponent(req.originalUrl).replace('/', '');
    (0, _FileService.updateByRelativePath)(uri_dec);
    next();
  } catch (error) {
    console.error("updateFileMiddleware error:", error);
    next(error);
  }
}