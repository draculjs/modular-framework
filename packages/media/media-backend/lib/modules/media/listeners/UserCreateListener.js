"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userCreateListener = exports.default = void 0;

var _userBackend = require("@dracul/user-backend");

var _UserStorageService = require("../services/UserStorageService");

const userCreateListener = function () {
  _userBackend.UserService.UserEventEmitter.on('created', async user => {
    let capacity = process.env.MEDIA_DEFAULT_CAPACITY ? process.env.MEDIA_DEFAULT_CAPACITY : 0;
    let usedSpace = 0;
    let maxFileSize = process.env.MEDIA_MAX_SIZE_PER_FILE_IN_MEGABYTES || 1024;
    let fileExpirationTime = process.env.MEDIA_FILE_EXPIRATION_TIME_IN_DAYS || 365;
    let deleteByLastAccess = true;
    let deleteByCreatedAt = false;
    await (0, _UserStorageService.createUserStorage)(user, capacity, usedSpace, maxFileSize, fileExpirationTime, deleteByLastAccess, deleteByCreatedAt);
  });
};

exports.userCreateListener = userCreateListener;
var _default = {
  userCreateListener
};
exports.default = _default;