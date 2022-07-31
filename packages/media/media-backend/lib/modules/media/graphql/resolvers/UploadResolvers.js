"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _UploadService = require("../../services/UploadService");

var _UploadAnonymousService = _interopRequireDefault(require("../../services/UploadAnonymousService"));

var _apolloServerExpress = require("apollo-server-express");

var _File = require("../../permissions/File");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  Mutation: {
    fileUpload: (_, {
      file,
      expirationDate,
      isPublic,
      description,
      tags,
      groups,
      users
    }, {
      user,
      rbac
    }) => {
      if (!user) throw new _apolloServerExpress.AuthenticationError("Unauthenticated");
      if (!rbac.isAllowed(user.id, _File.FILE_CREATE)) throw new _apolloServerExpress.ForbiddenError("Not Authorized");
      return (0, _UploadService.fileUpload)(user, file, expirationDate, isPublic, description, tags, groups, users);
    },
    fileUploadAnonymous: (_, {
      file
    }) => {
      if (process.env.MEDIA_UPLOAD_ANONYMOUS === 'enable' || process.env.MEDIA_UPLOAD_ANONYMOUS === 'true') {
        return (0, _UploadAnonymousService.default)(file);
      }

      return Promise.reject("Anonymous upload disable");
    }
  }
};
exports.default = _default;