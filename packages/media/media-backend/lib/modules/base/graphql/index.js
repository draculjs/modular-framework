"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolvers = exports.types = void 0;

var _path = _interopRequireDefault(require("path"));

var _mergeGraphqlSchemas = require("merge-graphql-schemas");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//TYPES
const typesArray = (0, _mergeGraphqlSchemas.fileLoader)(_path.default.join(__dirname, './types'));
const types = (0, _mergeGraphqlSchemas.mergeTypes)(typesArray, {
  all: true
}); //RESOLVERS

exports.types = types;
const resolversArray = (0, _mergeGraphqlSchemas.fileLoader)(_path.default.join(__dirname, './resolvers'));
const resolvers = (0, _mergeGraphqlSchemas.mergeResolvers)(resolversArray);
exports.resolvers = resolvers;