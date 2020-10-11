"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.initMediaPermissions = void 0;

var _File = require("../permissions/File");

var _api = require("@ci-user-module/api");

const initMediaPermissions = async function () {
  let permissions = [_File.FILE_SHOW, _File.FILE_CREATE, _File.FILE_UPDATE, _File.FILE_DELETE];
  await _api.InitService.initPermissions(permissions);
  console.log("Load custom permissions done.");
};

exports.initMediaPermissions = initMediaPermissions;
var _default = initMediaPermissions;
exports.default = _default;