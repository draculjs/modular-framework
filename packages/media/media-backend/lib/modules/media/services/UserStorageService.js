"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkUserStorageLeft = exports.checkUserStorage = exports.updateUserStorage = exports.updateUserUsedStorage = exports.createUserStorage = exports.userStorageCheckAndCreate = exports.findUserStorageByUser = exports.fetchUserStorage = void 0;

var _UserStorageModel = _interopRequireDefault(require("../models/UserStorageModel"));

var _userBackend = require("@dracul/user-backend");

var _apolloServerErrors = require("apollo-server-errors");

var _loggerBackend = require("@dracul/logger-backend");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const fetchUserStorage = async function () {
  return new Promise(async (resolve, reject) => {
    try {
      await userStorageCheckAndCreate();
      let userStorages = await _UserStorageModel.default.find({}).populate('user').exec();
      resolve(userStorages);
    } catch (err) {
      reject(err);
    }
  });
};

exports.fetchUserStorage = fetchUserStorage;

const findUserStorageByUser = async function (user) {
  return new Promise(async (resolve, reject) => {
    try {
      let doc = await _UserStorageModel.default.findOne({
        user: user.id
      }).populate('user').exec();
      resolve(doc);
    } catch (err) {
      reject(err);
    }
  });
};

exports.findUserStorageByUser = findUserStorageByUser;

const userStorageCheckAndCreate = async function () {
  _loggerBackend.DefaultLogger.info("Media UserStorage running userStorageCheckAndCreate...");

  let userStorages = await _UserStorageModel.default.find({}).populate('user').exec();
  let userStoragesIds = userStorages.map(us => us.user.id);
  let users = await _userBackend.UserService.findUsers();
  let usersWithoutStorage = users.filter(u => !userStoragesIds.includes(u.id));

  for (let user of usersWithoutStorage) {
    let capacity = process.env.MEDIA_DEFAULT_CAPACITY ? process.env.MEDIA_DEFAULT_CAPACITY : 0;
    let usedSpace = 0;
    let maxFileSize = process.env.MEDIA_MAX_SIZE_PER_FILE_IN_MEGABYTES || 1024;
    let fileExpirationTime = process.env.MEDIA_FILE_EXPIRATION_TIME_IN_DAYS || 365;
    await createUserStorage(user, capacity, usedSpace, maxFileSize, fileExpirationTime);
  }

  return true;
};

exports.userStorageCheckAndCreate = userStorageCheckAndCreate;

const createUserStorage = async function (user, capacity, usedSpace, maxFileSize, fileExpirationTime) {
  const doc = new _UserStorageModel.default({
    user,
    capacity,
    usedSpace,
    maxFileSize,
    fileExpirationTime
  });
  return new Promise((resolve, rejects) => {
    doc.save(error => {
      if (error) {
        if (error.name == "ValidationError") {
          rejects(new _apolloServerErrors.UserInputError(error.message, {
            inputErrors: error.errors
          }));
        }

        rejects(error);
      }

      _loggerBackend.DefaultLogger.info("Media UserStorage createUserStorage for: " + user.username);

      resolve(doc);
    });
  });
};

exports.createUserStorage = createUserStorage;

const updateUserUsedStorage = async function (userId, size) {
  return new Promise((resolve, rejects) => {
    _UserStorageModel.default.findOneAndUpdate({
      user: userId
    }, {
      $inc: {
        usedSpace: size
      }
    }, {
      runValidators: true,
      context: "query"
    }, (error, doc) => {
      if (error) {
        if (error.name == "ValidationError") {
          rejects(new _apolloServerErrors.UserInputError(error.message, {
            inputErrors: error.errors
          }));
        }

        rejects(error);
      }

      resolve(doc);
    });
  });
};

exports.updateUserUsedStorage = updateUserUsedStorage;

const updateUserStorage = async function (authUser, id, {
  name,
  capacity,
  usedSpace,
  maxFileSize,
  fileExpirationTime
}) {
  return new Promise((resolve, rejects) => {
    _UserStorageModel.default.findOneAndUpdate({
      _id: id
    }, {
      capacity,
      maxFileSize,
      fileExpirationTime
    }, {
      runValidators: true,
      context: "query"
    }, (error, doc) => {
      if (error) {
        if (error.name == "ValidationError") {
          rejects(new _apolloServerErrors.UserInputError(error.message, {
            inputErrors: error.errors
          }));
        }

        rejects(error);
      }

      resolve(doc);
    });
  });
};

exports.updateUserStorage = updateUserStorage;

const checkUserStorage = async function (userId, newFileSize) {
  return new Promise((resolve, reject) => {
    _UserStorageModel.default.findOne({
      user: userId
    }).exec((err, res) => {
      if (err) {
        reject(err);
      }

      let spaceLeft = res.capacity - res.usedSpace;

      if (spaceLeft >= newFileSize) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};

exports.checkUserStorage = checkUserStorage;

const checkUserStorageLeft = async function (userId) {
  return new Promise((resolve, reject) => {
    _UserStorageModel.default.findOne({
      user: userId
    }).exec((err, res) => {
      if (err) {
        reject(err);
      }

      let storageLeft = res.capacity - res.usedSpace;
      resolve(storageLeft);
    });
  });
};

exports.checkUserStorageLeft = checkUserStorageLeft;