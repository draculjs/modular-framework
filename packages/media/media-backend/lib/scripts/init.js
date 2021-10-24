"use strict";

var _dotenv = _interopRequireDefault(require("dotenv"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _userBackend = require("@dracul/user-backend");

var _customizeBackend = require("@dracul/customize-backend");

var _InitMediaPermissions = require("../modules/media/services/InitMediaPermissions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv.default.config();

_mongoose.default.Promise = global.Promise;

_mongoose.default.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

_mongoose.default.set('useCreateIndex', true);

const init = async () => {
  await _userBackend.InitService.initPermissions();
  await (0, _customizeBackend.initPermissionsCustomization)();
  await (0, _InitMediaPermissions.initMediaPermissions)();
  await _userBackend.InitService.initAdminRole();
  await updateAdminRole();
  await _userBackend.InitService.initRoles();
  await _userBackend.InitService.initRootUser();
  await (0, _customizeBackend.initCustomization)();
  console.log("Done");
  process.exit();
};

init();