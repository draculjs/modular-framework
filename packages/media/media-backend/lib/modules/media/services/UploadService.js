"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fileUpload = exports.default = void 0;

var _loggerBackend = require("@dracul/logger-backend");

var _path = _interopRequireDefault(require("path"));

var _FileModel = _interopRequireDefault(require("../models/FileModel"));

var _storeFile = _interopRequireDefault(require("./helpers/storeFile"));

var _randomString = _interopRequireDefault(require("./helpers/randomString"));

var _baseUrl = _interopRequireDefault(require("./helpers/baseUrl"));

var _UserStorageService = require("./UserStorageService");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const fileUpload = function (user, inputFile, expirationDate, isPublic = false, description, tags, groups, users) {
  return new Promise(async (resolve, rejects) => {
    try {
      if (!user) {
        return rejects(new Error("user is required"));
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
      const name = parseFileName.name.replace(/#/g, "");
      const hash = '-' + (0, _randomString.default)(6);
      const finalFileName = name + hash + extension;
      const year = new Date().getFullYear().toString();
      const month = (new Date().getMonth() + 1).toString();

      const relativePath = _path.default.join("media", "files", user.username, year, month, finalFileName);

      const absolutePath = _path.default.resolve(relativePath); //Store


      let storeResult = await (0, _storeFile.default)(createReadStream(), relativePath, user);

      _loggerBackend.DefaultLogger.info("fileUploadAnonymous store result: " + storeResult);

      if (expirationDate) {
        let timeDiffExpirationDate = validateExpirationDate(expirationDate);

        if (!timeDiffExpirationDate) {
          _loggerBackend.DefaultLogger.error("Expiration date must be older than current date");

          return rejects(new Error("Expiration date must be older than current date"));
        }

        let userStorage = await (0, _UserStorageService.findUserStorageByUser)(user);

        if (timeDiffExpirationDate > userStorage.fileExpirationTime) {
          _loggerBackend.DefaultLogger.error(`File expiration can not be longer than max user expiration time per file (${userStorage.fileExpirationTime} days)`);

          return rejects(new Error(`File expiration can not be longer than max user expiration time per file (${userStorage.fileExpirationTime} days)`));
        }
      }

      let url = (0, _baseUrl.default)() + relativePath;

      if (storeResult && storeResult.finish) {
        let fileSizeMB = storeResult.bytesWritten / (1024 * 1024);
        (0, _UserStorageService.updateUserUsedStorage)(user.id, fileSizeMB);
        let doc = new _FileModel.default({
          filename: finalFileName,
          mimetype: mimetype,
          encoding: encoding,
          type: type,
          extension: extension,
          relativePath: relativePath,
          absolutePath: absolutePath,
          size: fileSizeMB,
          url: url,
          createdBy: {
            user: user.id,
            username: user.username
          },
          expirationDate: expirationDate,
          isPublic: isPublic,
          description: description,
          tags: tags,
          groups: groups,
          users: users
        });

        _loggerBackend.DefaultLogger.info("fileUploadAnonymous saving file");

        await doc.save();

        _loggerBackend.DefaultLogger.info("fileUploadAnonymous file saved: " + doc._id);

        doc.populate('createdBy.user').execPopulate(() => resolve(doc));
      } else {
        _loggerBackend.DefaultLogger.error("Upload Fail");

        return rejects(new Error("Upload Fail"));
      }
    } catch (err) {
      _loggerBackend.DefaultLogger.error('UploadService error' + err);

      return rejects(err);
    }
  });
};

exports.fileUpload = fileUpload;

function validateExpirationDate(expirationTime) {
  const today = new Date();
  const expirationDate = new Date(expirationTime);

  if (expirationDate > today) {
    return ((expirationDate - today) / (1000 * 3600 * 24)).toFixed(2);
  }

  return null;
}

var _default = fileUpload;
exports.default = _default;