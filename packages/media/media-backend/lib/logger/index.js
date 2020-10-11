"use strict";

var _GeneralLogger = require("./GeneralLogger");

var _ExpressRequestLogger = require("./ExpressRequestLogger");

var _GraphqlErrorLogger = require("./GraphqlErrorLogger");

var _GraphqlResponseLogger = require("./GraphqlResponseLogger");

module.exports = {
  generalLogger: _GeneralLogger.generalLogger,
  expressRequestLogger: _ExpressRequestLogger.expressRequestLogger,
  graphqlErrorLogger: _GraphqlErrorLogger.graphqlErrorLogger,
  graphqlResponseLogger: _GraphqlResponseLogger.graphqlResponseLogger
};