"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  Query: {
    ping: (_, {
      id
    }) => {
      return Promise.resolve({
        status: true
      });
    },
    fetchEnvironmentVariables: (_, {}) => {
      return Promise.resolve({
        maxFileSize: process.env.MAX_SIZE_PER_FILE_IN_MEGABYTES,
        fileExpirationTime: process.env.FILE_EXPIRATION_TIME_IN_DAYS
      });
    }
  }
};
exports.default = _default;