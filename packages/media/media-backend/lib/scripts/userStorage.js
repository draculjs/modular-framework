"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initUserStorage = void 0;

var _UserStorageService = require("../modules/media/services/UserStorageService");

var _userBackend = require("@dracul/user-backend");

const initUserStorage = async () => {
  let existingUserStorages = await (0, _UserStorageService.fetchUserStorage)();
  let users = await _userBackend.UserService.findUsers();
  return checkAndCreate(existingUserStorages, users);
};

exports.initUserStorage = initUserStorage;

const checkAndCreate = async function (existingUserStorages, users) {
  for (let index = 0; index < users.length; index++) {
    if (existingUserStorages.every(x => x.User.id != users[index].id)) {
      let user = users[index].id;
      let capacity = 0;
      await (0, _UserStorageService.createUserStorage)(user, capacity);
    }
  }

  return true;
};