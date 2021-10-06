"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.router = void 0;

var _apolloServerExpress = require("apollo-server-express");

var _express = _interopRequireDefault(require("express"));

var _FileService = require("../../services/FileService");

var _UploadService = require("../../services/UploadService");

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
  if (!req.rbac.isAllowed(req.user.id, _File.FILE_SHOW)) res.status(403).json({
    message: "Not Authorized"
  });
  const {
    id
  } = req.params;
  (0, _FileService.findFile)(id).then(file => {
    res.status(200).json(file);
  }).catch(err => {
    res.status(500).json({
      message: err.message
    });
  });
});
router.get('/file', function (req, res) {
  if (!req.user) return res.status(401).json({
    message: "Not Authorized"
  });
  if (!req.rbac.isAllowed(req.user.id, _File.FILE_SHOW)) return res.status(403).json({
    message: "Not Authorized"
  });
  const {
    pageNumber,
    itemsPerPage,
    search,
    orderBy,
    orderDesc
  } = req.query;
  (0, _FileService.paginateFiles)(pageNumber, itemsPerPage, search, orderBy, orderDesc).then(result => {
    return res.status(200).json(result);
  }).catch(err => {
    return res.status(500).json({
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