"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.initService = void 0;

var _dotenv = _interopRequireDefault(require("dotenv"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _userBackend = require("@dracul/user-backend");

var _customizeBackend = require("@dracul/customize-backend");

var _initCustomization = require("./custom/initCustomization");

var _initOperatorRole = _interopRequireDefault(require("./custom/initOperatorRole"));

<<<<<<< HEAD
var _File = require("../modules/media/permissions/File");
=======
var _InitMediaPermissions = _interopRequireDefault(require("../modules/media/services/InitMediaPermissions"));
>>>>>>> e4e184c5803b685637730bf3aa1a9712fae7eefe

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv.default.config();

_mongoose.default.Promise = global.Promise;

_mongoose.default.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

_mongoose.default.set('useCreateIndex', true);

const initService = async () => {
  await _userBackend.InitService.initPermissions();
  await _userBackend.InitService.initPermissions([_File.FILE_SHOW, _File.FILE_UPDATE, _File.FILE_CREATE, _File.FILE_DELETE]);
  await (0, _customizeBackend.initPermissionsCustomization)();
  await (0, _InitMediaPermissions.default)();
  await _userBackend.InitService.initAdminRole();
  await _userBackend.InitService.initOperatorRole();
  await _userBackend.InitService.initSupervisorRole();
  await _userBackend.InitService.initRoles([_initOperatorRole.default]);
  await _userBackend.InitService.initRootUser();
  await _userBackend.InitService.initSupervisorUser();
  await _userBackend.InitService.initOperatorUser();
  await (0, _initCustomization.initCustomization)();
};

exports.initService = initService;
var _default = initService;
exports.default = _default;