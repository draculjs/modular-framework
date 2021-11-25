"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkUserStorageLeft = exports.checkUserStorage = exports.updateUserStorage = exports.updateUserUsedStorage = exports.createUserStorage = exports.findUserStorageByUser = exports.fetchUserStorage = void 0;

var _UserStorageModel = _interopRequireDefault(require("../models/UserStorageModel"));

var _userBackend = require("@dracul/user-backend");

var _mongodb = _interopRequireDefault(require("mongodb"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const fetchUserStorage = async function () {
  return new Promise(async (resolve, reject) => {
    try {
      let existingUserStorages = await _UserStorageModel.default.find({}).populate('user').exec();
      let users = await _userBackend.UserService.findUsers();
      await checkAndCreate(existingUserStorages, users);
      let updatedUserStorages = await _UserStorageModel.default.find({}).populate('user').exec();
      resolve(updatedUserStorages);
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

const checkAndCreate = async function (existingUserStorages, users) {
  for (let index = 0; index < users.length; index++) {
    if (existingUserStorages.every(x => x.user._id != users[index].id)) {
      let user = users[index].id;
      let capacity = 0;
      let usedSpace = 0;
      let maxFileSize = process.env.MEDIA_MAX_SIZE_PER_FILE_IN_MEGABYTES || 1024;
      let fileExpirationTime = process.env.MEDIA_FILE_EXPIRATION_TIME_IN_DAYS || 365;
      await createUserStorage(user, capacity, usedSpace, maxFileSize, fileExpirationTime);
    }
  }

  return true;
};

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
          rejects(new UserInputError(error.message, {
            inputErrors: error.errors
          }));
        }

        rejects(error);
      }

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
          rejects(new UserInputError(error.message, {
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
          rejects(new UserInputError(error.message, {
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
