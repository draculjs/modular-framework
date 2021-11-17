"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _FileMetricsService = require("../../services/FileMetricsService");

var _apolloServerExpress = require("apollo-server-express");

var _File = require("../../permissions/File");

var _default = {
  Query: {
    fileUserMetrics: (_, {}, {
      user,
      rbac
    }) => {
      if (!user) throw new _apolloServerExpress.AuthenticationError("Unauthenticated");
      if (!rbac.isAllowed(user.id, _File.FILE_SHOW_ALL)) throw new _apolloServerExpress.ForbiddenError("Not Authorized");
      return (0, _FileMetricsService.fileUserMetrics)();
    },
    almacenamientoPorUsuario: (_, {}, {
      user,
      rbac
    }) => {
      if (!user) throw new _apolloServerExpress.AuthenticationError("Unauthenticated");
      if (!rbac.isAllowed(user.id, _File.FILE_SHOW_ALL)) throw new _apolloServerExpress.ForbiddenError("Not Authorized");
      return (0, _FileMetricsService.almacenamientoPorUsuario)();
    },
    cantidadArchivosPorUsuario: (_, {}, {
      user,
      rbac
    }) => {
      if (!user) throw new _apolloServerExpress.AuthenticationError("Unauthenticated");
      if (!rbac.isAllowed(user.id, _File.FILE_SHOW_ALL)) throw new _apolloServerExpress.ForbiddenError("Not Authorized");
      return (0, _FileMetricsService.cantidadArchivosPorUsuario)();
    },
    fileGlobalMetrics: (_, {}, {
      user,
      rbac
    }) => {
      if (!user) throw new _apolloServerExpress.AuthenticationError("Unauthenticated");
      if (!rbac.isAllowed(user.id, _File.FILE_SHOW_ALL)) throw new _apolloServerExpress.ForbiddenError("Not Authorized");
      return (0, _FileMetricsService.fileGlobalMetrics)();
    }
  }
};
exports.default = _default;