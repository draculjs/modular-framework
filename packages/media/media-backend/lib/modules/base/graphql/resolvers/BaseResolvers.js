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
        maxFileSize: process.env.MEDIA_MAX_SIZE_PER_FILE_IN_MEGABYTES || 1024,
        fileExpirationTime: process.env.MEDIA_FILE_EXPIRATION_TIME_IN_DAYS || 365
      });
    }
  }
};
exports.default = _default;