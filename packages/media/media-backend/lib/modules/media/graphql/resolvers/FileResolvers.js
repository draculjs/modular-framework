"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _FileService = require("../../services/FileService");

var _apolloServerExpress = require("apollo-server-express");

var _File = require("../../permissions/File");

var _default = {
  Query: {
    fileFind: (_, {
      id
    }, {
      user,
      rbac
    }) => {
      if (!user) throw new _apolloServerExpress.AuthenticationError("Unauthenticated");
      if (!rbac.isAllowed(user.id, _File.FILE_SHOW_ALL) && !rbac.isAllowed(user.id, _File.FILE_SHOW_OWN)) throw new _apolloServerExpress.ForbiddenError("Not Authorized");
      let permissionType = rbac.isAllowed(user.id, _File.FILE_SHOW_ALL) ? _File.FILE_SHOW_ALL : rbac.isAllowed(user.id, _File.FILE_SHOW_OWN) ? _File.FILE_SHOW_OWN : null;
      return (0, _FileService.findFile)(id, permissionType, user.id);
    },
    filePaginate: (_, {
      input
    }, {
      user,
      rbac
    }) => {
      console.log("INPUT resolver", input);
      if (!user) throw new _apolloServerExpress.AuthenticationError("Unauthenticated");
      if (!rbac.isAllowed(user.id, _File.FILE_SHOW_ALL) && !rbac.isAllowed(user.id, _File.FILE_SHOW_OWN)) throw new _apolloServerExpress.ForbiddenError("Not Authorized");
      let permissionType = rbac.isAllowed(user.id, _File.FILE_SHOW_ALL) ? _File.FILE_SHOW_ALL : rbac.isAllowed(user.id, _File.FILE_SHOW_OWN) ? _File.FILE_SHOW_OWN : null;
      return (0, _FileService.paginateFiles)(input, permissionType, user.id);
    }
  },
  Mutation: {
    fileUpdate: (_, {
      id,
      input
    }, {
      user,
      rbac
    }) => {
      if (!user) throw new _apolloServerExpress.AuthenticationError("Unauthenticated");
      if (!rbac.isAllowed(user.id, _File.FILE_UPDATE_ALL) && !rbac.isAllowed(user.id, _File.FILE_UPDATE_OWN)) throw new _apolloServerExpress.ForbiddenError("Not Authorized");
      let permissionType = rbac.isAllowed(user.id, _File.FILE_UPDATE_ALL) ? _File.FILE_UPDATE_ALL : rbac.isAllowed(user.id, _File.FILE_UPDATE_OWN) ? _File.FILE_UPDATE_OWN : null;
      return (0, _FileService.updateFile)(user, id, input, permissionType, user.id);
    },
    fileDelete: (_, {
      id
    }, {
      user,
      rbac
    }) => {
      if (!user) throw new _apolloServerExpress.AuthenticationError("Unauthenticated");
      if (!rbac.isAllowed(user.id, _File.FILE_DELETE_ALL) && !rbac.isAllowed(user.id, _File.FILE_DELETE_OWN)) throw new _apolloServerExpress.ForbiddenError("Not Authorized");
      let permissionType = rbac.isAllowed(user.id, _File.FILE_DELETE_ALL) ? _File.FILE_DELETE_ALL : rbac.isAllowed(user.id, _File.FILE_DELETE_OWN) ? _File.FILE_DELETE_OWN : null;
      return (0, _FileService.deleteFile)(id, permissionType, user.id);
    }
  }
};
exports.default = _default;