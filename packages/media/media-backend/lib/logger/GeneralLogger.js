"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generalLogger = void 0;

var _winston = _interopRequireDefault(require("winston"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const generalTransports = [new _winston.default.transports.File({
  filename: 'logs/combined.log',
  level: 'info'
}), new _winston.default.transports.File({
  filename: 'logs/errors.log',
  level: 'error',
  handleExceptions: true
}), new _winston.default.transports.Console({
  handleExceptions: true
})];

function createGeneralLogger(transports) {
  const generalLogger = _winston.default.createLogger({
    format: getGeneralLogFormatter(),
    transports: transports
  });

  return generalLogger;
}

function getGeneralLogFormatter() {
  const {
    combine,
    timestamp,
    printf
  } = _winston.default.format;
  return combine(timestamp(), printf(info => `${info.timestamp} ${info.level} ${info.message} `));
}

const generalLogger = createGeneralLogger(generalTransports);
exports.generalLogger = generalLogger;