"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.router = void 0;

var _apolloServerExpress = require("apollo-server-express");

var _express = _interopRequireDefault(require("express"));

var _FileService = require("../../services/FileService");

var _UploadService = require("../../services/UploadService");

var _convertGigabytesToBytes = _interopRequireDefault(require("../../services/helpers/convertGigabytesToBytes"));

var _File = require("../../permissions/File");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express.default.Router();

exports.router = router;

const multer = require('multer');

const upload = multer();

const streamifier = require('streamifier');

router.get('/file/:id', function (req, res) {
  if (!req.user) res.status(401).json({
    message: "Not Authorized"
  });
  if (!req.rbac.isAllowed(req.user.id, _File.FILE_SHOW_ALL) && !req.rbac.isAllowed(req.user.id, _File.FILE_SHOW_OWN)) res.status(403).json({
    message: "Not Authorized"
  });
  let permissionType = req.rbac.isAllowed(req.user.id, _File.FILE_SHOW_ALL) ? _File.FILE_SHOW_ALL : req.rbac.isAllowed(req.user.id, _File.FILE_SHOW_OWN) ? _File.FILE_SHOW_OWN : null;
  const {
    id
  } = req.params;
  (0, _FileService.findFile)(id, permissionType, req.user.id).then(file => {
    if (file) {
      res.status(200).json(file);
    } else {
      res.status(404).json({
        message: 'File not found'
      });
    }
  }).catch(err => {
    res.status(500).json({
      message: err.message
    });
  });
});
router.get('/file', function (req, res) {
  if (!req.user) res.status(401).json({
    message: "Not Authorized"
  });
  if (!req.rbac.isAllowed(req.user.id, _File.FILE_SHOW_ALL) && !req.rbac.isAllowed(req.user.id, _File.FILE_SHOW_OWN)) res.status(403).json({
    message: "Not Authorized"
  });
  let permissionType = req.rbac.isAllowed(req.user.id, _File.FILE_SHOW_ALL) ? _File.FILE_SHOW_ALL : req.rbac.isAllowed(req.user.id, _File.FILE_SHOW_OWN) ? _File.FILE_SHOW_OWN : null;
  const {
    pageNumber,
    itemsPerPage,
    search,
    orderBy,
    orderDesc
  } = req.query;
  (0, _FileService.paginateFiles)(pageNumber, itemsPerPage, search, orderBy, orderDesc, permissionType, req.user.id).then(result => {
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({
        message: 'File not found'
      });
    }
  }).catch(err => {
    res.status(500).json({
      message: err.message
    });
  });
});
router.post('/file', upload.single('file'), function (req, res) {
  if (!req.user) res.status(401).json({
    message: "Not Authorized"
  });
  if (!req.rbac.isAllowed(req.user.id, _File.FILE_CREATE)) res.status(403).json({
    message: "Not Authorized"
  });
  const maxFileSize = process.env.MAX_SIZE_PER_FILE_IN_GIGABYTES ? process.env.MAX_SIZE_PER_FILE_IN_GIGABYTES : 4;
  if (req.file.size > (0, _convertGigabytesToBytes.default)(maxFileSize)) res.status(500).json({
    message: "Maximum file size exceeded"
  });
  let file = {
    filename: req.file.originalname,
    mimetype: req.file.mimetype,
    createReadStream: () => streamifier.createReadStream(req.file.buffer),
    encoding: req.file.encoding
  };
  (0, _UploadService.fileUpload)(req.user, file).then(result => {
    res.status(201).json(result);
  }).catch(err => {
    res.status(500).json({
      message: err.message
    });
  });
});
var _default = router;
exports.default = _default;