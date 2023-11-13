"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.types = exports.resolvers = void 0;
var _path = _interopRequireDefault(require("path"));
var _require = require('@graphql-tools/load-files'),
  loadFilesSync = _require.loadFilesSync;
var _require2 = require('@graphql-tools/merge'),
  mergeTypeDefs = _require2.mergeTypeDefs,
  mergeResolvers = _require2.mergeResolvers;

//TYPES
var typesArray = loadFilesSync(_path["default"].join(__dirname, './types'), {
  extensions: ['graphql']
});
var types = exports.types = mergeTypeDefs(typesArray);

//RESOLVERS
var resolversArray = loadFilesSync(_path["default"].join(__dirname, './resolvers'));
var resolvers = exports.resolvers = mergeResolvers(resolversArray);