"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.types = exports.resolvers = void 0;

var _path = _interopRequireDefault(require("path"));

var _mergeGraphqlSchemas = require("merge-graphql-schemas");

//TYPES
var typesArray = (0, _mergeGraphqlSchemas.fileLoader)(_path["default"].join(__dirname, './types'));
var types = (0, _mergeGraphqlSchemas.mergeTypes)(typesArray, {
  all: true
}); //RESOLVERS

exports.types = types;
var resolversArray = (0, _mergeGraphqlSchemas.fileLoader)(_path["default"].join(__dirname, './resolvers'));
var resolvers = (0, _mergeGraphqlSchemas.mergeResolvers)(resolversArray);
exports.resolvers = resolvers;