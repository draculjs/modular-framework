"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _apolloServerExpress = require("apollo-server-express");

var _UserStorageService = require("../../services/UserStorageService");

var _default = {
  Query: {
    userStorageFetch: (_, {}, {
      user,
      rbac
    }) => {
      if (!user) throw new _apolloServerExpress.AuthenticationError("Unauthenticated"); // if (!rbac.isAllowed(user.id, APIGOOGLEACCOUNT_SHOW)) throw new ForbiddenError("Not Authorized");

      return (0, _UserStorageService.fetchUserStorage)();
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
      if (!user) throw new _apolloServerExpress.AuthenticationError("Unauthenticated"); // if (!rbac.isAllowed(user.id, APIGOOGLEACCOUNT_UPDATE)) throw new ForbiddenError("Not Authorized");

      return (0, _UserStorageService.updateUserStorage)(user, id, input);
    }
  }
};
exports.default = _default;