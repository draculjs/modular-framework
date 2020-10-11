"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "resolvers", {
  enumerable: true,
  get: function () {
    return _graphql.resolvers;
  }
});
Object.defineProperty(exports, "types", {
  enumerable: true,
  get: function () {
    return _graphql.types;
  }
});
Object.defineProperty(exports, "fileUpload", {
  enumerable: true,
  get: function () {
    return _UploadService.default;
  }
});
Object.defineProperty(exports, "InitMediaPermissions", {
  enumerable: true,
  get: function () {
    return _InitMediaPermissions.default;
  }
});
exports.filePermissions = exports.FileService = void 0;

var _graphql = require("./modules/media/graphql");

var FileService = _interopRequireWildcard(require("./modules/media/services/FileService"));

exports.FileService = FileService;

var _UploadService = _interopRequireDefault(require("./modules/media/services/UploadService"));

var _InitMediaPermissions = _interopRequireDefault(require("./modules/media/services/InitMediaPermissions"));

var filePermissions = _interopRequireWildcard(require("./modules/media/permissions/File"));

exports.filePermissions = filePermissions;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }