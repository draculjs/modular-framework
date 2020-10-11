"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.fileUpload = void 0;

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _FileModel = _interopRequireDefault(require("../models/FileModel"));

var _storeFile = _interopRequireDefault(require("./helpers/storeFile"));

var _randomString = _interopRequireDefault(require("./helpers/randomString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const baseUrl = function () {
  let url = process.env.APP_API_URL;

  if (!/^http:\/\//.test(url)) {
    url = "http://" + baseUrl;
  }

  if (!/\/$/.test(url)) {
    url += "/";
  }

  return url;
};

const fileUpload = function (user, inputFile) {
  return new Promise(async (resolve, rejects) => {
    console.log("inputFile", inputFile);
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
    let url = baseUrl() + relativePath;

    if (storeResult && storeResult.finish) {
      _FileModel.default.create({
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
      }, function (err, doc) {
        if (err) return rejects(err); // saved!

        doc.populate('createdBy.user').execPopulate(() => resolve(doc));
      });
    } else {
      rejects(new Error("Upload Fail"));
    }
  });
};

exports.fileUpload = fileUpload;
var _default = fileUpload;
exports.default = _default;