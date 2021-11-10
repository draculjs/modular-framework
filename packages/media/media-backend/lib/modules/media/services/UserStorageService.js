"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkUserStorage = exports.updateUserStorage = exports.updateUserUsedStorage = exports.createUserStorage = exports.fetchUserStorage = void 0;

var _UserStorageModel = _interopRequireDefault(require("../models/UserStorageModel"));

var _userBackend = require("@dracul/user-backend");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const fetchUserStorage = async function () {
  return new Promise(async (resolve, reject) => {
    try {
      let existingUserStorages = await _UserStorageModel.default.find({}).populate('user').exec();
      console.log(existingUserStorages);
      let users = await _userBackend.UserService.findUsers();
      await checkAndCreate(existingUserStorages, users);
      let updatedUserStorages = await _UserStorageModel.default.find({}).populate('user').exec();
      console.log(updatedUserStorages);
      resolve(updatedUserStorages);
    } catch (err) {
      reject(err);
    }
  });
};

exports.fetchUserStorage = fetchUserStorage;

const checkAndCreate = async function (existingUserStorages, users) {
  for (let index = 0; index < users.length; index++) {
    if (existingUserStorages.every(x => x.user._id != users[index].id)) {
      let user = users[index].id;
      let capacity = 0;
      await createUserStorage(user, capacity);
    }
  }

  return true;
};

const createUserStorage = async function (user, capacity) {
  const doc = new _UserStorageModel.default({
    user,
    capacity
  });
  doc.usedSpace = "0";
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

const updateUserUsedStorage = async function (user, size) {
  return new Promise((resolve, rejects) => {
    apiGoogleAccount.findOneAndUpdate({
      user: user
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
  usedSpace
}) {
  const oldStorage = await _UserStorageModel.default.findOne({
    _id: id
  });
  const oldCapacity = oldStorage.capacity;
  return new Promise((resolve, rejects) => {
    _UserStorageModel.default.findOneAndUpdate({
      _id: id
    }, {
      capacity
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

const checkUserStorage = async function (id, newFileSize) {
  return new Promise((resolve, reject) => {
    _UserStorageModel.default.find({
      id: id
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