"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.types = exports.resolvers = void 0;

var _path = _interopRequireDefault(require("path"));

var _merge = require("@graphql-tools/merge");

var _loadFiles = require("@graphql-tools/load-files");

//TYPES
var typesArray = (0, _loadFiles.loadFilesSync)(_path["default"].join(__dirname, './types'));
var types = (0, _merge.mergeTypeDefs)(typesArray, {
  all: true
}); //RESOLVERS

exports.types = types;
var resolversArray = (0, _loadFiles.loadFilesSync)(_path["default"].join(__dirname, './resolvers'));
var resolvers = (0, _merge.mergeResolvers)(resolversArray);
exports.resolvers = resolvers;