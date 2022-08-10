"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "NotificationModel", {
  enumerable: true,
  get: function get() {
    return _NotificationModel["default"];
  }
});
Object.defineProperty(exports, "createNotificationService", {
  enumerable: true,
  get: function get() {
    return _NotificationService.createNotificationService;
  }
});
Object.defineProperty(exports, "deleteNotificationsService", {
  enumerable: true,
  get: function get() {
    return _NotificationService.deleteNotificationsService;
  }
});
Object.defineProperty(exports, "fetchNotificationsService", {
  enumerable: true,
  get: function get() {
    return _NotificationService.fetchNotificationsService;
  }
});
Object.defineProperty(exports, "markAllReadOrNotReadService", {
  enumerable: true,
  get: function get() {
    return _NotificationService.markAllReadOrNotReadService;
  }
});
Object.defineProperty(exports, "markAsReadOrNotReadService", {
  enumerable: true,
  get: function get() {
    return _NotificationService.markAsReadOrNotReadService;
  }
});
Object.defineProperty(exports, "notificationsPaginateFilterService", {
  enumerable: true,
  get: function get() {
    return _NotificationService.notificationsPaginateFilterService;
  }
});
exports.permissions = void 0;
Object.defineProperty(exports, "resolvers", {
  enumerable: true,
  get: function get() {
    return _graphql.resolvers;
  }
});
Object.defineProperty(exports, "types", {
  enumerable: true,
  get: function get() {
    return _graphql.types;
  }
});

var _NotificationService = require("./services/NotificationService");

var _graphql = require("./graphql");

var permissions = _interopRequireWildcard(require("./permissions"));

exports.permissions = permissions;

var _NotificationModel = _interopRequireDefault(require("./models/NotificationModel"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }