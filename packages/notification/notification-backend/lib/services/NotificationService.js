"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.notificationsPaginateFilterService = exports.markAsReadOrNotReadService = exports.markAllReadOrNotReadService = exports.fetchNotificationsService = exports.fetchNotificationMethodService = exports.deleteNotificationsService = exports.createNotificationService = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _NotificationModel = _interopRequireDefault(require("../models/NotificationModel"));

var _loggerBackend = require("@dracul/logger-backend");

var _dayjs = _interopRequireDefault(require("dayjs"));

var _PubSub = require("../PubSub");

var _mongoose = _interopRequireDefault(require("mongoose"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

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
var createNotificationService = function createNotificationService(userId, title, content, type, icon) {
  return new Promise(function (resolve, reject) {
    if (!userId) throw new Error("userId must be provider");
    if (!_mongoose["default"].isValidObjectId(userId)) throw new Error("userId must be a valid objectId");
    if (!title) throw new Error("title must be provider");
    if (!content) throw new Error("content must be provider");
    var newNotification = new _NotificationModel["default"]({
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
    saveNotification(newNotification).then(function (documentNotification) {
      _loggerBackend.DefaultLogger.info("Notificacion creada con exito: " + documentNotification.id);

      _PubSub.pubsub.publish('notification', documentNotification);

      resolve(documentNotification);
    })["catch"](function (err) {
      _loggerBackend.DefaultLogger.error("Error al crear la notificacion. Error: ", err);

      reject(err);
    });
  });
};
/**
 * Save a notification document in the MongoDB collection
 *
 * @param {Object} documentNotification
 * @return {Promise}
 */


exports.createNotificationService = createNotificationService;

var saveNotification = function saveNotification(documentNotification) {
  return new Promise(function (resolve, reject) {
    documentNotification.save(function (error, docNotification) {
      if (error) {
        _loggerBackend.DefaultLogger.error("Error al guardar la notificacion. Error: ", error);

        reject(error);
      }

      resolve(docNotification);
    });
  });
};
/**
 * Get notifications from a certain user
 *
 * @param {ObjectId} userId
 * @param {Integer} limit
 * @param {Boolean} isRead
 * @param {String} type
 * @return {Promise}
 */


var fetchNotificationsService = function fetchNotificationsService(userId) {
  var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var isRead = arguments.length > 2 ? arguments[2] : undefined;
  var type = arguments.length > 3 ? arguments[3] : undefined;
  return new Promise(function (resolve, reject) {
    var query = getFilters(userId, isRead, type);

    _NotificationModel["default"].find(query).sort({
      creationDate: -1
    }).limit(limit).populate("user").exec(function (err, documents) {
      if (err) {
        _loggerBackend.DefaultLogger.error("No se pudo obtener las notificaciones del usuario: " + userId + " error: ", error);

        rejects(err);
      }

      _loggerBackend.DefaultLogger.info("Notificaciones obtenidas con exito del usuario: " + userId);

      resolve(documents);
    });
  });
};
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


exports.fetchNotificationsService = fetchNotificationsService;

var notificationsPaginateFilterService = function notificationsPaginateFilterService(userId) {
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


exports.notificationsPaginateFilterService = notificationsPaginateFilterService;

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


var markAsReadOrNotReadService = function markAsReadOrNotReadService(idNotification, readValue) {
  return new Promise(function (resolve, reject) {
    //Si readValue es true, necesitamos guardar la fecha de leido
    var query = getReadDate(readValue);

    _NotificationModel["default"].findOneAndUpdate({
      _id: idNotification
    }, query, {
      "new": true
    }).then(function (documentNotification) {
      resolve(documentNotification);
    })["catch"](function (err) {
      _loggerBackend.DefaultLogger.error("Error al marcar la notificacion, error: ", err);

      reject(err);
    });
  });
};
/**
 * Allows marking all user notifications as read or not read
 *
 * @param {ObjectId} idUserAuth
 * @param {Boolean} readValue
 * @return {Promise}
 */


exports.markAsReadOrNotReadService = markAsReadOrNotReadService;

var markAllReadOrNotReadService = function markAllReadOrNotReadService(idUserAuth, readValue) {
  //Si readValue es true, necesitamos guardar la fecha de leidos
  var query = getReadDate(readValue);
  return new Promise(function (resolve, reject) {
    _NotificationModel["default"].updateMany({
      user: idUserAuth,
      read: readValue
    }, query).exec(function (err, documentsNotification) {
      if (err) {
        _loggerBackend.DefaultLogger.error("Error al marcar las notificaciones, error: ", err);

        reject(err);
      }

      resolve({
        success: documentsNotification.ok
      });
    });
  });
};
/**
 * Returns an object query, which will be used to save the read notification date in the DB.
 * In the case that the notification is marked as unread, the value where the date is stored will have the value null
 *
 * @param {Boolean} readValue
 * @return {Object}
 */


exports.markAllReadOrNotReadService = markAllReadOrNotReadService;

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


var deleteNotificationsService = function deleteNotificationsService(userId) {
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


exports.deleteNotificationsService = deleteNotificationsService;

var fetchNotificationMethodService = function fetchNotificationMethodService() {
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

exports.fetchNotificationMethodService = fetchNotificationMethodService;