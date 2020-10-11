"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _UploadService = require("../../services/UploadService");

var _apolloServerExpress = require("apollo-server-express");

var _File = require("../../permissions/File");

var _default = {
  Mutation: {
    fileUpload: (_, {
      file
    }, {
      user,
      rbac
    }) => {
      console.log("resolver file:", file);
      if (!user) throw new _apolloServerExpress.AuthenticationError("Unauthenticated");
      if (!rbac.isAllowed(user.id, _File.FILE_CREATE)) throw new _apolloServerExpress.ForbiddenError("Not Authorized");
      return (0, _UploadService.fileUpload)(user, file);
    }
  }
};
exports.default = _default;