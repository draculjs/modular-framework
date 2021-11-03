"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.fileUpload = void 0;

var _loggerBackend = require("@dracul/logger-backend");

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _FileModel = _interopRequireDefault(require("../models/FileModel"));

var _storeFile = _interopRequireDefault(require("./helpers/storeFile"));

var _randomString = _interopRequireDefault(require("./helpers/randomString"));

var _baseUrl = _interopRequireDefault(require("./helpers/baseUrl"));

var _convertGigabytesToBytes = _interopRequireDefault(require("./helpers/convertGigabytesToBytes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const fileUpload = function (user, inputFile, fileSize = null) {
  const validateMaxFileSize = function (fileSize) {
    const maxFileSize = process.env.MAX_SIZE_PER_FILE_IN_MEGABYTES ? process.env.MAX_SIZE_PER_FILE_IN_MEGABYTES : 4;
    return (0, _convertGigabytesToBytes.default)(maxFileSize) > fileSize;
  };

  return new Promise(async (resolve, rejects) => {
    try {
      if (!user) {
        return rejects(new Error("user is required"));
      }

      if (fileSize && !validateMaxFileSize(fileSize)) {
        return rejects(new Error("error.maxSizeExceeded"));
      }

      const {
        filename,
        mimetype,
        encoding,
        createReadStream
      } = await inputFile;
      let type = mimetype.split("/")[0];

      const parseFileName = _path.default.parse(filename);

      const extension = parseFileName.ext;
      const name = parseFileName.name;
      const hash = '-' + (0, _randomString.default)(6);
      const finalFileName = name + hash + extension;
      const year = new Date().getFullYear().toString();
      const month = (new Date().getMonth() + 1).toString();

      const relativePath = _path.default.join("media", "files", user.username, year, month, finalFileName);

      const absolutePath = _path.default.resolve(relativePath); //Store


      let storeResult = await (0, _storeFile.default)(createReadStream(), relativePath);

      _loggerBackend.DefaultLogger.info("fileUploadAnonymous store result: " + storeResult);

      let url = (0, _baseUrl.default)() + relativePath;

      if (storeResult && storeResult.finish) {
        let doc = new _FileModel.default({
          filename: finalFileName,
          mimetype: mimetype,
          encoding: encoding,
          type: type,
          extension: extension,
          relativePath: relativePath,
          absolutePath: absolutePath,
          size: storeResult.bytesWritten,
          url: url,
          createdBy: {
            user: user.id,
            username: user.username
          }
        });

        _loggerBackend.DefaultLogger.info("fileUploadAnonymous saving file");

        await doc.save();

        _loggerBackend.DefaultLogger.info("fileUploadAnonymous file saved: " + doc._id);

        doc.populate('createdBy.user').execPopulate(() => resolve(doc));
      } else {
        _loggerBackend.DefaultLogger.error("Upload Fail");

        rejects(new Error("Upload Fail"));
      }
    } catch (err) {
      _loggerBackend.DefaultLogger.error('UploadService: ', err);

      rejects(new Error(err));
    }
  });
};

exports.fileUpload = fileUpload;
var _default = fileUpload;
exports.default = _default;