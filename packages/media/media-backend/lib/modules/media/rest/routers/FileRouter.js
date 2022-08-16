"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.router = exports.default = void 0;

var _apolloServerExpress = require("apollo-server-express");

var _FileModel = _interopRequireDefault(require("../../models/FileModel"));

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
  if (!req.rbac.isAllowed(req.user.id, _File.FILE_SHOW_ALL) && !req.rbac.isAllowed(req.user.id, _File.FILE_SHOW_OWN)) res.status(403).json({
    message: "Not Authorized"
  });
  let allFilesAllowed = rbac.isAllowed(user.id, _File.FILE_SHOW_ALL);
  let ownFilesAllowed = rbac.isAllowed(user.id, _File.FILE_SHOW_OWN);
  let publicAllowed = rbac.isAllowed(user.id, _File.FILE_SHOW_PUBLIC);
  const {
    id
  } = req.params;
  (0, _FileService.findFile)(id, req.user.id, allFilesAllowed, ownFilesAllowed, publicAllowed).then(file => {
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
  let allFilesAllowed = rbac.isAllowed(user.id, _File.FILE_SHOW_ALL);
  let ownFilesAllowed = rbac.isAllowed(user.id, _File.FILE_SHOW_OWN);
  let publicAllowed = rbac.isAllowed(user.id, _File.FILE_SHOW_PUBLIC);
  const {
    pageNumber,
    itemsPerPage,
    search,
    orderBy,
    orderDesc
  } = req.query;
  (0, _FileService.paginateFiles)({
    pageNumber,
    itemsPerPage,
    search,
    orderBy,
    orderDesc
  }, req.user.id, allFilesAllowed, ownFilesAllowed, publicAllowed).then(result => {
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
router.post('/file', upload.single('file'), async function (req, res) {
  if (!req.user) res.status(401).json({
    message: "Not Authorized"
  });
  if (!req.rbac.isAllowed(req.user.id, _File.FILE_CREATE)) res.status(403).json({
    message: "Not Authorized"
  });
  const {
    expirationTime,
    isPublic
  } = req.body;
  let file = {
    filename: req.file.originalname,
    mimetype: req.file.mimetype,
    createReadStream: () => streamifier.createReadStream(req.file.buffer),
    encoding: req.file.encoding
  };
  (0, _UploadService.fileUpload)(req.user, file, expirationTime, isPublic).then(result => {
    res.status(201).json(result);
  }).catch(err => {
    res.status(409).json({
      message: err.message
    });
  });
});
router.patch('/file/:id', async function (req, res) {
  if (!req.user) res.status(401).json({
    message: "Not Authorized"
  });
  if (!req.rbac.isAllowed(req.user.id, _File.FILE_SHOW_ALL) && !req.rbac.isAllowed(req.user.id, _File.FILE_SHOW_OWN)) res.status(403).json({
    message: "Not Authorized"
  });
  let permissionType = req.rbac.isAllowed(req.user.id, _File.FILE_SHOW_ALL) ? _File.FILE_SHOW_ALL : req.rbac.isAllowed(req.user.id, _File.FILE_SHOW_OWN) ? _File.FILE_SHOW_OWN : null; // VER

  (0, _FileService.updateFileRest)(req.params.id, req.user, permissionType, req.body).then(result => {
    res.status(200).json(result);
  }).catch(err => {
    res.status(err.status).json({
      message: err.message
    });
  });
});
var _default = router;
exports.default = _default;