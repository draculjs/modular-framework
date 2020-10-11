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
      if (!rbac.isAllowed(user.id, _File.FILE_SHOW)) throw new _apolloServerExpress.ForbiddenError("Not Authorized");
      return (0, _FileService.findFile)(id);
    },
    fileFetch: (_, {}, {
      user,
      rbac
    }) => {
      if (!user) throw new _apolloServerExpress.AuthenticationError("Unauthenticated");
      if (!rbac.isAllowed(user.id, _File.FILE_SHOW)) throw new _apolloServerExpress.ForbiddenError("Not Authorized");
      return (0, _FileService.fetchFiles)();
    },
    filePaginate: (_, {
      pageNumber,
      itemsPerPage,
      search,
      orderBy,
      orderDesc
    }, {
      user,
      rbac
    }) => {
      if (!user) throw new _apolloServerExpress.AuthenticationError("Unauthenticated");
      if (!rbac.isAllowed(user.id, _File.FILE_SHOW)) throw new _apolloServerExpress.ForbiddenError("Not Authorized");
      return (0, _FileService.paginateFiles)(pageNumber, itemsPerPage, search, orderBy, orderDesc);
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
      if (!rbac.isAllowed(user.id, _File.FILE_UPDATE)) throw new _apolloServerExpress.ForbiddenError("Not Authorized");
      return (0, _FileService.updateFile)(user, id, input);
    },
    fileDelete: (_, {
      id
    }, {
      user,
      rbac
    }) => {
      if (!user) throw new _apolloServerExpress.AuthenticationError("Unauthenticated");
      if (!rbac.isAllowed(user.id, _File.FILE_DELETE)) throw new _apolloServerExpress.ForbiddenError("Not Authorized");
      return (0, _FileService.deleteFile)(id);
    }
  }
};
exports.default = _default;