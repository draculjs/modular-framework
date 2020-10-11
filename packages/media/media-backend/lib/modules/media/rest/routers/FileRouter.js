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

var router = _express.default.Router();

exports.router = router;

const multer = require('multer');

const upload = multer();

const streamifier = require('streamifier');

router.get('/file/:id', function (req, res) {
  if (!req.user) res.status(403).send("Not Authorized");
  if (!req.rbac.isAllowed(req.user.id, _File.FILE_SHOW)) res.status(403).send("Not Authorized");
  let id = req.params.id;
  (0, _FileService.findFile)(id).then(file => {
    res.json(file);
  }).catch(err => {
    res.status(500).send(err.message);
  });
});
router.get('/file', function (req, res) {
  if (!req.user) res.status(403).send("Not Authorized");
  if (!req.rbac.isAllowed(req.user.id, _File.FILE_SHOW)) res.status(403).send("Not Authorized");
  let pageNumber = req.query.pageNumber;
  let itemsPerPage = req.query.itemsPerPage;
  let search = req.query.search;
  let orderBy = req.query.orderBy;
  let orderDesc = req.query.orderDesc;
  (0, _FileService.paginateFiles)(pageNumber, itemsPerPage, search, orderBy, orderDesc).then(result => {
    res.json(result);
  }).catch(err => {
    res.status(500).send(err.message);
  });
});
router.post('/file', upload.single('file'), function (req, res) {
  if (!req.user) res.status(403).send("Not Authorized");
  if (!req.rbac.isAllowed(req.user.id, _File.FILE_CREATE)) res.status(403).send("Not Authorized");
  let file = {
    filename: req.file.originalname,
    mimetype: req.file.mimetype,
    createReadStream: () => streamifier.createReadStream(req.file.buffer),
    encoding: req.file.encoding
  };
  (0, _UploadService.fileUpload)(req.user, file).then(result => {
    res.json(result);
  }).catch(err => {
    res.status(500).send(err.message);
  });
});
var _default = router;
exports.default = _default;