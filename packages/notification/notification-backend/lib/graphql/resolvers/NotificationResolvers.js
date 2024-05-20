"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _objectDestructuringEmpty2 = _interopRequireDefault(require("@babel/runtime/helpers/objectDestructuringEmpty"));
var _NotificationService = require("../../services/NotificationService");
var _apolloServerErrors = require("apollo-server-errors");
var _permissions = require("../../permissions");
var _PubSub = require("../../PubSub");
var _require = require('graphql-subscriptions'),
  withFilter = _require.withFilter;
var _default = exports["default"] = {
  Query: {
    fetchNotifications: function fetchNotifications(_, _ref, _ref2) {
      var limit = _ref.limit,
        isRead = _ref.isRead,
        type = _ref.type;
      var user = _ref2.user,
        rbac = _ref2.rbac;
      if (!user) throw new _apolloServerErrors.AuthenticationError("Unauthenticated");
      if (!rbac.isAllowed(user.id, _permissions.NOTIFICATION_SHOW)) throw new _apolloServerErrors.ForbiddenError("Not Authorized");
      return (0, _NotificationService.fetchNotificationsService)(user.id, limit, isRead, type);
    },
    notificationsPaginateFilter: function notificationsPaginateFilter(_, _ref3, _ref4) {
      var limit = _ref3.limit,
        pageNumber = _ref3.pageNumber,
        isRead = _ref3.isRead,
        type = _ref3.type;
      var user = _ref4.user,
        rbac = _ref4.rbac;
      if (!user) throw new _apolloServerErrors.AuthenticationError("Unauthenticated");
      if (!rbac.isAllowed(user.id, _permissions.NOTIFICATION_SHOW)) throw new _apolloServerErrors.ForbiddenError("Not Authorized");
      return (0, _NotificationService.notificationsPaginateFilterService)(user.id, limit, pageNumber, isRead, type);
    },
    fetchNotificationMethod: function fetchNotificationMethod(_, _ref5, _ref6) {
      (0, _objectDestructuringEmpty2["default"])(_ref5);
      var user = _ref6.user,
        rbac = _ref6.rbac;
      if (!user) throw new _apolloServerErrors.AuthenticationError("Unauthenticated");
      if (!rbac.isAllowed(user.id, _permissions.NOTIFICATION_SHOW)) throw new _apolloServerErrors.ForbiddenError("Not Authorized");
      return (0, _NotificationService.fetchNotificationMethodService)();
    }
  },
  Mutation: {
    markAsReadOrNotRead: function markAsReadOrNotRead(_, _ref7, _ref8) {
      var id = _ref7.id,
        isRead = _ref7.isRead;
      var user = _ref8.user,
        rbac = _ref8.rbac;
      if (!user) throw new _apolloServerErrors.AuthenticationError("Unauthenticated");
      if (!rbac.isAllowed(user.id, _permissions.NOTIFICATION_UPDATE)) throw new _apolloServerErrors.ForbiddenError("Not Authorized");
      return (0, _NotificationService.markAsReadOrNotReadService)(id, isRead);
    },
    markAllReadOrNotRead: function markAllReadOrNotRead(_, _ref9, _ref10) {
      var isRead = _ref9.isRead;
      var user = _ref10.user,
        rbac = _ref10.rbac;
      if (!user) throw new _apolloServerErrors.AuthenticationError("Unauthenticated");
      if (!rbac.isAllowed(user.id, _permissions.NOTIFICATION_UPDATE)) throw new _apolloServerErrors.ForbiddenError("Not Authorized");
      return (0, _NotificationService.markAllReadOrNotReadService)(user.id, isRead);
    },
    createNotification: function createNotification(_, _ref11, _ref12) {
      var title = _ref11.title,
        content = _ref11.content,
        type = _ref11.type,
        icon = _ref11.icon;
      var user = _ref12.user,
        rbac = _ref12.rbac;
      if (!user) throw new _apolloServerErrors.AuthenticationError("Unauthenticated");
      if (!rbac.isAllowed(user.id, _permissions.NOTIFICATION_CREATE)) throw new _apolloServerErrors.ForbiddenError("Not Authorized");
      return (0, _NotificationService.createNotificationService)(user.id, title, content, type, icon);
    },
    createNotificationTest: function createNotificationTest(_, _ref13) {
      var user = _ref13.user,
        title = _ref13.title,
        content = _ref13.content,
        type = _ref13.type,
        icon = _ref13.icon;
      return (0, _NotificationService.createNotificationService)(user, title, content, type, icon);
    }
  },
  Subscription: {
    notification: {
      resolve: function resolve(payload) {
        return payload; //Manipulate at you wish
      },
      subscribe: withFilter(function () {
        return _PubSub.pubsub.asyncIterator('notification');
      }, function (payload, variables) {
        console.log("payload", payload);
        console.log("variables", variables);
        console.log("compare", payload.user.toString() === variables.user);
        return payload.user.toString() === variables.user;
      })
    }
  }
};