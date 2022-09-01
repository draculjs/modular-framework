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
      let allFilesAllowed = rbac.isAllowed(user.id, _File.FILE_SHOW_ALL);
      let ownFilesAllowed = rbac.isAllowed(user.id, _File.FILE_SHOW_OWN);
      let publicAllowed = rbac.isAllowed(user.id, _File.FILE_SHOW_PUBLIC);
      return (0, _FileService.findFile)(id, user.id, allFilesAllowed, ownFilesAllowed, publicAllowed);
    },
    filePaginate: (_, {
      input
    }, {
      user,
      rbac
    }) => {
      if (!user) throw new _apolloServerExpress.AuthenticationError("Unauthenticated");
      if (!rbac.isAllowed(user.id, _File.FILE_SHOW_ALL) && !rbac.isAllowed(user.id, _File.FILE_SHOW_OWN) && !rbac.isAllowed(user.id, _File.FILE_SHOW_PUBLIC)) throw new _apolloServerExpress.ForbiddenError("Not Authorized");
      let allFilesAllowed = rbac.isAllowed(user.id, _File.FILE_SHOW_ALL);
      let ownFilesAllowed = rbac.isAllowed(user.id, _File.FILE_SHOW_OWN);
      let publicAllowed = rbac.isAllowed(user.id, _File.FILE_SHOW_PUBLIC);
      return (0, _FileService.paginateFiles)(input, user.id, allFilesAllowed, ownFilesAllowed, publicAllowed);
    }
  },
  Mutation: {
    fileUpdate: (_, {
      input
    }, {
      user,
      rbac
    }) => {
      if (!user) throw new _apolloServerExpress.AuthenticationError("Unauthenticated");
      if (!rbac.isAllowed(user.id, _File.FILE_UPDATE_ALL) && !rbac.isAllowed(user.id, _File.FILE_UPDATE_OWN)) throw new _apolloServerExpress.ForbiddenError("Not Authorized");
      let allFilesAllowed = rbac.isAllowed(user.id, _File.FILE_SHOW_ALL);
      let ownFilesAllowed = rbac.isAllowed(user.id, _File.FILE_SHOW_OWN);
      let publicAllowed = rbac.isAllowed(user.id, _File.FILE_SHOW_PUBLIC);
      return (0, _FileService.updateFile)(user, input, user.id, allFilesAllowed, ownFilesAllowed, publicAllowed);
    },
    fileDelete: (_, {
      id
    }, {
      user,
      rbac
    }) => {
      if (!user) throw new _apolloServerExpress.AuthenticationError("Unauthenticated");
      if (!rbac.isAllowed(user.id, _File.FILE_DELETE_ALL) && !rbac.isAllowed(user.id, _File.FILE_DELETE_OWN)) throw new _apolloServerExpress.ForbiddenError("Not Authorized");
      let allFilesAllowed = rbac.isAllowed(user.id, _File.FILE_SHOW_ALL);
      let ownFilesAllowed = rbac.isAllowed(user.id, _File.FILE_SHOW_OWN);
      let publicAllowed = rbac.isAllowed(user.id, _File.FILE_SHOW_PUBLIC);
      return (0, _FileService.deleteFile)(id, user.id, allFilesAllowed, ownFilesAllowed, publicAllowed);
    }
  }
};
exports.default = _default;