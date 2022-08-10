"use strict";

var _File = require("../../modules/media/permissions/File");

var _UserStorage = require("../../modules/media/permissions/UserStorage");

var _userBackend = require("@dracul/user-backend");

module.exports = {
  name: "uploader",
  permissions: [_File.FILE_CREATE, _File.FILE_SHOW_OWN, _File.FILE_SHOW_PUBLIC, _File.FILE_UPDATE_OWN, _File.FILE_DELETE_OWN, _UserStorage.USER_STORAGE_SHOW_OWN, _File.FILE_DOWNLOAD, _userBackend.permissions.SECURITY_USER_SHOW, _userBackend.permissions.SECURITY_GROUP_SHOW]
};