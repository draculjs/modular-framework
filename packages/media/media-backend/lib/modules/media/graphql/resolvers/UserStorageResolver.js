"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _apolloServerExpress = require("apollo-server-express");

var _UserStorageService = require("../../services/UserStorageService");

var _UserStorage = require("../../permissions/UserStorage");

var _default = {
  Query: {
    userStorageFetch: (_, {}, {
      user,
      rbac
    }) => {
      if (!user) throw new _apolloServerExpress.AuthenticationError("Unauthenticated");
      if (!rbac.isAllowed(user.id, _UserStorage.USER_STORAGE_SHOW_ALL)) throw new _apolloServerExpress.ForbiddenError("Not Authorized");
      return (0, _UserStorageService.fetchUserStorage)();
    },
    userStorageFindByUser: (_, {}, {
      user,
      rbac
    }) => {
      if (!user) throw new _apolloServerExpress.AuthenticationError("Unauthenticated");
      if (!rbac.isAllowed(user.id, _UserStorage.USER_STORAGE_SHOW_OWN)) throw new _apolloServerExpress.ForbiddenError("Not Authorized");
      return (0, _UserStorageService.findUserStorageByUser)(user);
    }
  },
  Mutation: {
    userStorageUpdate: (_, {
      id,
      input
    }, {
      user,
      rbac
    }) => {
      if (!user) throw new _apolloServerExpress.AuthenticationError("Unauthenticated");
      if (!rbac.isAllowed(user.id, _UserStorage.USER_STORAGE_UPDATE)) throw new _apolloServerExpress.ForbiddenError("Not Authorized");
      return (0, _UserStorageService.updateUserStorage)(user, id, input);
    }
  }
};
exports.default = _default;