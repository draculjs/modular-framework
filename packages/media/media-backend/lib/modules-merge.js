"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.typeDefs = exports.resolvers = void 0;

var _mergeGraphqlSchemas = require("merge-graphql-schemas");

var _userBackend = require("@dracul/user-backend");

var _commonBackend = require("@dracul/common-backend");

var _customizeBackend = require("@dracul/customize-backend");

var _graphql = require("./modules/base/graphql");

var _graphql2 = require("./modules/media/graphql");

//BASE RESOLVERS
//BASE TYPEDEFS
const resolvers = (0, _mergeGraphqlSchemas.mergeResolvers)([_graphql.resolvers, _userBackend.securityResolvers, _customizeBackend.resolvers, _graphql2.resolvers]);
exports.resolvers = resolvers;
const typeDefs = (0, _mergeGraphqlSchemas.mergeTypes)([_commonBackend.commonTypes, _graphql.types, _userBackend.securityTypes, _customizeBackend.types, _graphql2.types]);
exports.typeDefs = typeDefs;