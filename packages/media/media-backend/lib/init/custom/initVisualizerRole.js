"use strict";

var _File = require("../../modules/media/permissions/File");

module.exports = {
  name: "visualizer",
  permissions: [_File.FILE_SHOW_PUBLIC],
  readonly: true
};