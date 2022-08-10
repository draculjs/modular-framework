"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initService = exports.default = void 0;

var _dotenv = _interopRequireDefault(require("dotenv"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _userBackend = require("@dracul/user-backend");

var _customizeBackend = require("@dracul/customize-backend");

var _initCustomization = require("./custom/initCustomization");

var _initUploaderRole = _interopRequireDefault(require("./custom/initUploaderRole"));

var _initVisualizerRole = _interopRequireDefault(require("./custom/initVisualizerRole"));

var _InitMediaPermissions = _interopRequireDefault(require("../modules/media/services/InitMediaPermissions"));

var _UserStorageService = require("../modules/media/services/UserStorageService");

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
  await (0, _customizeBackend.initPermissionsCustomization)();
  await (0, _InitMediaPermissions.default)(); // await userStorageCheckAndCreate()

  await _userBackend.InitService.initAdminRole();
  await _userBackend.InitService.initRoles([_initUploaderRole.default, _initVisualizerRole.default]);
  await _userBackend.InitService.initRootUser();
  await (0, _initCustomization.initCustomization)();
};

exports.initService = initService;
var _default = initService;
exports.default = _default;