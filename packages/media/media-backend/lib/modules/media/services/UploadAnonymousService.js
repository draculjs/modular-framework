"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fileUploadAnonymous = exports.default = void 0;

var _loggerBackend = require("@dracul/logger-backend");

var _path = _interopRequireDefault(require("path"));

var _FileModel = _interopRequireDefault(require("../models/FileModel"));

var _storeFile = _interopRequireDefault(require("./helpers/storeFile"));

var _randomString = _interopRequireDefault(require("./helpers/randomString"));

var _baseUrl = _interopRequireDefault(require("./helpers/baseUrl"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const fileUploadAnonymous = function (inputFile) {
  return new Promise(async (resolve, rejects) => {
    try {
      const USERNAME = 'system';
      const {
        filename,
        mimetype,
        encoding,
        createReadStream
      } = await inputFile;
      let type = mimetype.split("/")[0];

      const parseFileName = _path.default.parse(filename);

      const extension = parseFileName.ext;
      const name = parseFileName.name.replace(/#/g, "");
      const hash = '-' + (0, _randomString.default)(6);
      const finalFileName = name + hash + extension;
      const year = new Date().getFullYear().toString();
      const month = (new Date().getMonth() + 1).toString();

      const relativePath = _path.default.join("media", "files", USERNAME, year, month, finalFileName);

      const absolutePath = _path.default.resolve(relativePath); //Store


      let storeResult = await (0, _storeFile.default)(createReadStream(), relativePath);

      _loggerBackend.DefaultLogger.info("fileUploadAnonymous store result: " + storeResult);

      if (storeResult && storeResult.finish) {
        let url = (0, _baseUrl.default)() + relativePath;
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
            user: null,
            username: USERNAME
          }
        });

        _loggerBackend.DefaultLogger.info("fileUploadAnonymous saving file");

        await doc.save();

        _loggerBackend.DefaultLogger.info("fileUploadAnonymous file saved: " + doc._id);

        return resolve(doc);
      } else {
        _loggerBackend.DefaultLogger.error("fileUploadAnonymous store fail");

        rejects(new Error("Upload Fail"));
      }
    } catch (err) {
      _loggerBackend.DefaultLogger.error('fileUploadAnonymous', err);

      rejects(new Error("Upload Fail"));
    }
  });
};

exports.fileUploadAnonymous = fileUploadAnonymous;
var _default = fileUploadAnonymous;
exports.default = _default;