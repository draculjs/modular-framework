"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.initMediaPermissions = void 0;

var _File = require("../permissions/File");

var _userBackend = require("@dracul/user-backend");

const initMediaPermissions = async function () {
  let permissions = [_File.FILE_SHOW_ALL, _File.FILE_SHOW_OWN, _File.FILE_CREATE, _File.FILE_UPDATE_ALL, _File.FILE_UPDATE_OWN, _File.FILE_DELETE_ALL, _File.FILE_DELETE_OWN];
  await _userBackend.InitService.initPermissions(permissions);
  console.log("Load custom permissions done.");
};

exports.initMediaPermissions = initMediaPermissions;
var _default = initMediaPermissions;
exports.default = _default;