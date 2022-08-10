"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FileService = void 0;
Object.defineProperty(exports, "InitMediaPermissions", {
  enumerable: true,
  get: function () {
    return _InitMediaPermissions.default;
  }
});
exports.UserStorageService = void 0;
Object.defineProperty(exports, "deleteFile", {
  enumerable: true,
  get: function () {
    return FileService.deleteFile;
  }
});
Object.defineProperty(exports, "fetchFiles", {
  enumerable: true,
  get: function () {
    return FileService.fetchFiles;
  }
});
exports.filePermissions = void 0;
Object.defineProperty(exports, "fileUpload", {
  enumerable: true,
  get: function () {
    return _UploadService.default;
  }
});
Object.defineProperty(exports, "fileUploadAnonymous", {
  enumerable: true,
  get: function () {
    return _UploadAnonymousService.default;
  }
});
Object.defineProperty(exports, "findFile", {
  enumerable: true,
  get: function () {
    return FileService.findFile;
  }
});
Object.defineProperty(exports, "paginateFiles", {
  enumerable: true,
  get: function () {
    return FileService.paginateFiles;
  }
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
Object.defineProperty(exports, "updateFile", {
  enumerable: true,
  get: function () {
    return FileService.updateFile;
  }
});
Object.defineProperty(exports, "updateFileMiddleware", {
  enumerable: true,
  get: function () {
    return _middleware.updateFileMiddleware;
  }
});
Object.defineProperty(exports, "userCreateListener", {
  enumerable: true,
  get: function () {
    return _UserCreateListener.userCreateListener;
  }
});
Object.defineProperty(exports, "userStorageCheckAndCreate", {
  enumerable: true,
  get: function () {
    return UserStorageService.userStorageCheckAndCreate;
  }
});
exports.userStoragePermissions = void 0;

var _graphql = require("./modules/media/graphql");

var FileService = _interopRequireWildcard(require("./modules/media/services/FileService"));

exports.FileService = FileService;

var UserStorageService = _interopRequireWildcard(require("./modules/media/services/UserStorageService"));

exports.UserStorageService = UserStorageService;

var _UploadService = _interopRequireDefault(require("./modules/media/services/UploadService"));

var _UploadAnonymousService = _interopRequireDefault(require("./modules/media/services/UploadAnonymousService"));

var _InitMediaPermissions = _interopRequireDefault(require("./modules/media/services/InitMediaPermissions"));

var filePermissions = _interopRequireWildcard(require("./modules/media/permissions/File"));

exports.filePermissions = filePermissions;

var userStoragePermissions = _interopRequireWildcard(require("./modules/media/permissions/UserStorage"));

exports.userStoragePermissions = userStoragePermissions;

var _UserCreateListener = require("./modules/media/listeners/UserCreateListener");

var _middleware = require("./modules/media/middleware");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }