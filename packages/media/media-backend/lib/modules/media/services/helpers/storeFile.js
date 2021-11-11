"use strict";

var _fs = _interopRequireDefault(require("fs"));

var _stream = require("stream");

var _loggerBackend = require("@dracul/logger-backend");

var _UserStorageService = require("../UserStorageService");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const CacheBase = require('cache-base');

const app = new CacheBase();

const createDirIfNotExist = require('./createDirIfNotExist');

class StreamSizeValidator extends _stream.Transform {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "maxFileSize", process.env.MAX_SIZE_PER_FILE_IN_MEGABYTES ? process.env.MAX_SIZE_PER_FILE_IN_MEGABYTES : 1000);

    _defineProperty(this, "totalLength", 0);

    _defineProperty(this, "error", '');

    _defineProperty(this, "storageLeft", app.get("storageLeft"));
  }

  _transform(chunk, encoding, callback) {
    this.totalLength += chunk.length / (1024 * 1024);

    if (this.totalLength > this.maxFileSize) {
      this.error = 'MAX_FILE_SIZE_EXCEEDED';

      _loggerBackend.DefaultLogger.error("storeFile.StreamSizeValidator: _transform error: ", this.error);

      this.destroy(new Error(this.error));
      return;
    }

    if (this.totalLength > this.storageLeft) {
      this.error = 'STORAGE_CAPACITY_EXCEEDED';

      _loggerBackend.DefaultLogger.error("storeFile.StreamSizeValidator: _transform error: ", this.error);

      this.destroy(new Error(this.error));
      return;
    }

    this.push(chunk);
    callback();
  }

}

const storeFile = function (fileStream, dst, userId) {
  if (!fileStream.readable) {
    throw new Error("A redeable stream is required");
  }

  if (typeof fileStream.pipe != 'function') {
    throw new Error("Stream needs the pipe method");
  }

  return new Promise(async (resolve, reject) => {
    let storageLeft = await (0, _UserStorageService.checkUserStorageLeft)(userId);
    app.set("storageLeft", storageLeft);
    const sizeValidator = new StreamSizeValidator();
    createDirIfNotExist(dst);

    const fileWriteStream = _fs.default.createWriteStream(dst);

    fileStream.on('error', error => {
      if (fileStream.truncated) {
        _fs.default.unlinkSync(dst);
      } //sizeValidator.destroy(error)


      _loggerBackend.DefaultLogger.error("storeFile.storeFile: fileStream error: ", error);

      reject(error);
    });
    sizeValidator.on("error", error => {
      _loggerBackend.DefaultLogger.error("storeFile.storeFile: sizeValidator error: ", error); //fileStream.destroy(error)


      reject(error);
    });
    fileStream.pipe(sizeValidator).pipe(fileWriteStream).on('error', error => reject(error)).on('finish', () => {
      resolve({
        finish: true,
        bytesWritten: fileWriteStream.bytesWritten
      });
    });
  });
};

module.exports.storeFile = storeFile;
module.exports = storeFile;