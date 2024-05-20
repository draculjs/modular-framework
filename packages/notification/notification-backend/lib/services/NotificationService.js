"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.notificationsPaginateFilterService = exports.markAsReadOrNotReadService = exports.markAllReadOrNotReadService = exports.fetchNotificationsService = exports.fetchNotificationMethodService = exports.deleteNotificationsService = exports.createNotificationService = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _NotificationModel = _interopRequireDefault(require("../models/NotificationModel"));
var _loggerBackend = require("@dracul/logger-backend");
var _dayjs = _interopRequireDefault(require("dayjs"));
var _PubSub = require("../PubSub");
var _mongoose = _interopRequireDefault(require("mongoose"));
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
/**
 * Create an user notification
 *
 * @param {ObjectId} userId
 * @param {string} title
 * @param {string} content
 * @param {string} type
 * @param {string} icon
 * @return {Promise}
 */
var createNotificationService = exports.createNotificationService = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(userId, title, content, type, icon) {
    var newNotification;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          if (userId) {
            _context.next = 3;
            break;
          }
          throw new Error("userId must be provider");
        case 3:
          if (_mongoose["default"].isValidObjectId(userId)) {
            _context.next = 5;
            break;
          }
          throw new Error("userId must be a valid objectId");
        case 5:
          if (title) {
            _context.next = 7;
            break;
          }
          throw new Error("title must be provider");
        case 7:
          if (content) {
            _context.next = 9;
            break;
          }
          throw new Error("content must be provider");
        case 9:
          newNotification = new _NotificationModel["default"]({
            user: userId,
            title: title,
            content: content,
            type: type,
            icon: icon,
            creationDate: Date.now(),
            readDate: null,
            read: false
          });
          newNotification.id = newNotification._id;
          _context.next = 13;
          return newNotification.save();
        case 13:
          _loggerBackend.DefaultLogger.info("Notificacion creada con exito: " + newNotification.id);
          _PubSub.pubsub.publish('notification', newNotification);
          return _context.abrupt("return", newNotification);
        case 18:
          _context.prev = 18;
          _context.t0 = _context["catch"](0);
          _loggerBackend.DefaultLogger.error("Error al crear la notificacion. Error: ", _context.t0);
          throw _context.t0;
        case 22:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 18]]);
  }));
  return function createNotificationService(_x, _x2, _x3, _x4, _x5) {
    return _ref.apply(this, arguments);
  };
}();

/**
 * Get notifications from a certain user
 *
 * @param {ObjectId} userId
 * @param {Integer} limit
 * @param {Boolean} isRead
 * @param {String} type
 * @return {Promise}
 */
var fetchNotificationsService = exports.fetchNotificationsService = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(userId) {
    var limit,
      isRead,
      type,
      _query,
      notifications,
      _args2 = arguments;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          limit = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : 0;
          isRead = _args2.length > 2 ? _args2[2] : undefined;
          type = _args2.length > 3 ? _args2[3] : undefined;
          _context2.prev = 3;
          _query = getFilters(userId, isRead, type);
          _context2.next = 7;
          return _NotificationModel["default"].find(_query).sort({
            creationDate: -1
          }).limit(limit).populate("user").exec();
        case 7:
          notifications = _context2.sent;
          return _context2.abrupt("return", notifications);
        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](3);
          _loggerBackend.DefaultLogger.error("No se pudo obtener las notificaciones del usuario: " + userId + " error: ", _context2.t0);
          throw _context2.t0;
        case 15:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[3, 11]]);
  }));
  return function fetchNotificationsService(_x6) {
    return _ref2.apply(this, arguments);
  };
}();

/**
 * Get notifications filters paginate from a certain user
 *
 * @param {ObjectId} userId
 * @param {Integer} limit
 * @param {Integer} pageNumber
 * @param {Boolean} isRead
 * @param {String} type
 * @return {Promise}
 */
var notificationsPaginateFilterService = exports.notificationsPaginateFilterService = function notificationsPaginateFilterService(userId) {
  var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;
  var pageNumber = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  var isRead = arguments.length > 3 ? arguments[3] : undefined;
  var type = arguments.length > 4 ? arguments[4] : undefined;
  var query = getFilters(userId, isRead, type);
  var params = {
    page: pageNumber,
    limit: limit,
    sort: {
      creationDate: -1
    }
  };
  return new Promise(function (resolve, reject) {
    _NotificationModel["default"].paginate(query, params).then(function (result) {
      resolve({
        totalItems: result.totalDocs,
        page: result.page,
        items: result.docs
      });
    })["catch"](function (err) {
      _loggerBackend.DefaultLogger.error("Error al filtrar y paginas las notificaciones, error: ", err);
      reject(err);
    });
  });
};

/**
 * Get an object query with the filters requested by the user
 *
 * @param {ObjectId} userId
 * @param {Boolean} isRead
 * @param {String} type
 * @return {Object}
 */
var getFilters = function getFilters(userId, isRead, type) {
  var query = {
    user: userId
  };
  if (isRead == null) {
    query = _objectSpread(_objectSpread({}, query), {}, {
      $or: [{
        read: true
      }, {
        read: false
      }]
    });
  } else {
    query = _objectSpread(_objectSpread({}, query), {}, {
      read: isRead
    });
  }
  if (type) {
    query = _objectSpread(_objectSpread({}, query), {}, {
      type: type
    });
  }
  return query;
};

/**
 * Allows marking a notification as read or not read
 *
 * @param {ObjectId} userNotification
 * @param {Boolean} readValue
 * @return {Promise}
 */
var markAsReadOrNotReadService = exports.markAsReadOrNotReadService = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(idNotification, readValue) {
    var notification;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return _NotificationModel["default"].findOneAndUpdate({
            _id: idNotification
          }, query, {
            "new": true
          }).exec();
        case 3:
          notification = _context3.sent;
          return _context3.abrupt("return", notification);
        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          _loggerBackend.DefaultLogger.error("Error al marcar la notificacion, error: ", _context3.t0);
          throw _context3.t0;
        case 11:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 7]]);
  }));
  return function markAsReadOrNotReadService(_x7, _x8) {
    return _ref3.apply(this, arguments);
  };
}();

/**
 * Allows marking all user notifications as read or not read
 *
 * @param {ObjectId} idUserAuth
 * @param {Boolean} readValue
 * @return {Promise}
 */
var markAllReadOrNotReadService = exports.markAllReadOrNotReadService = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(idUserAuth, readValue) {
    var _query2, notifications;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _query2 = getReadDate(readValue);
          _context4.next = 4;
          return _NotificationModel["default"].updateMany({
            user: idUserAuth,
            read: readValue
          }, _query2).exec();
        case 4:
          notifications = _context4.sent;
          return _context4.abrupt("return", {
            success: documentsNotification.ok
          });
        case 8:
          _context4.prev = 8;
          _context4.t0 = _context4["catch"](0);
          _loggerBackend.DefaultLogger.error("Error al marcar las notificaciones, error: ", _context4.t0);
          throw _context4.t0;
        case 12:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 8]]);
  }));
  return function markAllReadOrNotReadService(_x9, _x10) {
    return _ref4.apply(this, arguments);
  };
}();

/**
 * Returns an object query, which will be used to save the read notification date in the DB.
 * In the case that the notification is marked as unread, the value where the date is stored will have the value null
 *
 * @param {Boolean} readValue
 * @return {Object}
 */
var getReadDate = function getReadDate(readValue) {
  //Lo invertimos para pasar la notificacion al estado contrario
  var nextValue = !readValue;
  var query = {
    read: nextValue
  };
  if (nextValue) {
    query = _objectSpread(_objectSpread({}, query), {}, {
      readDate: Date.now()
    });
  } else {
    query = _objectSpread(_objectSpread({}, query), {}, {
      readDate: null
    });
  }
  return query;
};

/**
 * Delete stored notifications for a certain user
 *
 * @param {ObjectId} userId
 * @param {Integer} numberOfDays
 * @return {Promise}
 */
var deleteNotificationsService = exports.deleteNotificationsService = function deleteNotificationsService(userId) {
  var numberOfDays = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 30;
  var today = (0, _dayjs["default"])();
  var until = (0, _dayjs["default"])().add(numberOfDays, "day");
  return new Promise(function (resolve, reject) {
    var query = {
      user: userId,
      creationDate: {
        $ne: [{
          $gte: today,
          $lte: until
        }]
      }
    };
    _NotificationModel["default"].deleteMany(query).then(function (res) {
      _loggerBackend.DefaultLogger.info("Notificaciones antiguas borradas con exito");
      resolve(res);
    })["catch"](function (err) {
      _loggerBackend.DefaultLogger.error("No se pudo eliminar las notificaciones antiguas");
      reject(err);
    });
  });
};

/**
 * Get the way to fetch notifications
 * @return {Promise}
 */
var fetchNotificationMethodService = exports.fetchNotificationMethodService = function fetchNotificationMethodService() {
  return new Promise(function (resolve, reject) {
    var WEB_SOCKET_STATE = ["enable", "disable"];
    if (!process.env.NOTIFICATION_TIME_POLLING && !/^[0-9]+$/.test(process.env.NOTIFICATION_TIME_POLLING)) return reject(new Error("ENV VAR NOTIFICATION_TIME_POLLING must be a number!"));
    if (!WEB_SOCKET_STATE.includes(process.env.NOTIFICATION_ACTIVATE_WEB_SOCKET)) return reject(new Error("ENV VAR NOTIFICATION_ACTIVATE_WEB_SOCKET must be 'enable' or 'disable'!"));
    var enableWs = process.env.NOTIFICATION_ACTIVATE_WEB_SOCKET == "enable" ? true : false;
    var timePolling = !process.env.NOTIFICATION_TIME_POLLING ? parseInt(process.env.NOTIFICATION_TIME_POLLING) : 30000;
    resolve({
      enableWs: enableWs,
      timePolling: timePolling
    });
  });
};